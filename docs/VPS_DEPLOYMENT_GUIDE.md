# VPS Deployment Guide: Next.js + Laravel Monorepo

This production deployment guide covers deploying the portfolio architecture on an Ubuntu 22.04 / 24.04 LTS VPS (DigitalOcean, Hetzner, Linode, AWS EC2, or Vultr).

---

## 1. System Architecture Overview

```
                      Internet (HTTPS :443 / HTTP :80)
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Nginx Web Server  │
                         │   (Reverse Proxy    │
                         │    & SSL Gateway)   │
                         └──────────┬──────────┘
                                    │
            ┌───────────────────────┴───────────────────────┐
            │                                               │
      location /api                                    location /
            │                                               │
            ▼                                               ▼
┌───────────────────────┐                       ┌───────────────────────┐
│     Laravel 11 API    │                       │  Next.js 16 (Node.js) │
│   (PHP 8.2+ / FPM)    │                       │  PM2 Daemon on :3000  │
│  Unix Socket / FastCGI│                       │                       │
└───────────┬───────────┘                       └───────────────────────┘
            │
            ▼
┌───────────────────────┐
│ PostgreSQL / MariaDB  │
│   Database Server     │
└───────────────────────┘
```

---

## 2. Server Prerequisites & Initial Hardening

Connect to your VPS as `root`:
```bash
ssh root@YOUR_SERVER_IP
```

### 2.1. Update System & Create Deployer User
```bash
apt update && apt upgrade -y
apt install -y ufw curl git unzip htop certbot python3-certbot-nginx

# Create a dedicated non-root deployer user with sudo privileges
adduser deployer
usermod -aG sudo deployer

# Copy SSH keys to deployer
rsync --archive --chown=deployer:deployer ~/.ssh /home/deployer
```

### 2.2. Configure UFW Firewall
```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

---

## 3. Runtime Installation

### 3.1. Install Node.js 20 LTS & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2
```

### 3.2. Install PHP 8.2 & Required Extensions (for Laravel Backend)
```bash
apt install -y software-properties-common
add-apt-repository ppa:ondrej/php -y
apt update
apt install -y php8.2 php8.2-fpm php8.2-cli php8.2-curl php8.2-mbstring \
               php8.2-xml php8.2-pgsql php8.2-mysql php8.2-zip php8.2-intl \
               php8.2-bcmath

# Install Composer
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
```

### 3.3. Install Database (PostgreSQL or MariaDB)
For PostgreSQL:
```bash
apt install -y postgresql postgresql-contrib
sudo -u postgres psql -c "CREATE DATABASE portfolio_db;"
sudo -u postgres psql -c "CREATE USER portfolio_user WITH ENCRYPTED PASSWORD 'YOUR_SECURE_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;"
```

---

## 4. Application Deployment Setup

Switch to the `deployer` user:
```bash
su - deployer
mkdir -p /var/www/portfolio
cd /var/www/portfolio
git clone https://github.com/nantaa/portfolio.git .
```
*(Ensure `/var/www/portfolio` has proper permissions: `sudo chown -R deployer:www-data /var/www/portfolio`)*

### 4.1. Setup Backend (Laravel)
```bash
cd /var/www/portfolio/backend
cp .env.example .env

# Edit .env with production database credentials and app URL
nano .env

composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions for storage & bootstrap/cache
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 4.2. Setup Frontend (Next.js)
```bash
cd /var/www/portfolio/frontend

# Create production environment config
cat << 'EOF' > .env.production
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NODE_ENV=production
PORT=3000
EOF

npm ci
npm run build

# Start Next.js with PM2 daemon
pm2 start npm --name "portfolio-frontend" -- start
pm2 save
pm2 startup
# (Run the command PM2 prints to enable auto-restart on boot)
```

---

## 5. Nginx Reverse Proxy Configuration

Create Nginx site configuration:
```bash
sudo nano /etc/nginx/sites-available/portfolio.conf
```

Add the following production configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Maximum file upload size
    client_max_body_size 20M;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # Next.js Static Asset Caching
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_bypass $http_upgrade;
        expires 365d;
        access_log off;
    }

    # Laravel API Backend Route
    location ^~ /api {
        alias /var/www/portfolio/backend/public;
        try_files $uri $uri/ @laravel_api;

        location ~ \.php$ {
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME /var/www/portfolio/backend/public/index.php;
            fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
            fastcgi_index index.php;
        }
    }

    location @laravel_api {
        rewrite ^/api/(.*)$ /index.php?$1 last;
    }

    # Next.js Frontend Proxy (All other routes)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio.conf /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6. SSL / HTTPS Setup via Let's Encrypt

Obtain a free SSL certificate with automatic renewals:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Certbot will configure HTTPS redirection automatically. Test auto-renewal:
```bash
sudo certbot renew --dry-run
```

---

## 7. Zero-Downtime Deployment Script (`deploy.sh`)

Create `/var/www/portfolio/deploy.sh`:
```bash
#!/usr/bin/env bash
set -e

echo "=== Pulling latest changes from git ==="
cd /var/www/portfolio
git pull origin feat/update-workgrid

echo "=== Updating Backend ==="
cd /var/www/portfolio/backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan optimize:clear
php artisan optimize

echo "=== Updating Frontend ==="
cd /var/www/portfolio/frontend
npm ci
npm run build
pm2 reload portfolio-frontend

echo "=== Deployment Successful ==="
```
Make it executable:
```bash
chmod +x /var/www/portfolio/deploy.sh
```

---

## 8. Health Checks & Troubleshooting

| Component | Status Command | Log File Location |
|---|---|---|
| **Next.js Frontend** | `pm2 status portfolio-frontend` | `~/.pm2/logs/portfolio-frontend-error.log` |
| **Laravel Backend** | `systemctl status php8.2-fpm` | `/var/www/portfolio/backend/storage/logs/laravel.log` |
| **Nginx Web Server** | `systemctl status nginx` | `/var/log/nginx/error.log` |
| **Certbot SSL** | `certbot certificates` | `/var/log/letsencrypt/letsencrypt.log` |
