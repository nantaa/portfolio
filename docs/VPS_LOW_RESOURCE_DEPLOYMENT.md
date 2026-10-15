# VPS Deployment Guide for 2GB Low-Resource Server (VPS1)

This guide is tailored specifically for deploying this portfolio (Next.js 16 + Laravel 11/13 + Filament v5) to **VPS1 (2GB RAM, shared with MySQL, AdGuardHome, and existing PHP apps)** without causing Out-Of-Memory (OOM) crashes.

---

## 1. What the Three Core Concepts Mean

| Concept | What It Is | Why It Is Mandatory for VPS1 |
|---|---|---|
| **1. Enable Swap (2GB)** | Disk-backed overflow RAM (`/swapfile`). When physical RAM fills up, the Linux kernel temporarily swaps inactive memory to disk instead of killing processes. | VPS1 currently has **0B Swap**. The instant RAM hits 100%, the Linux kernel kills `mysqld` or `node`. A 2GB swap file prevents abrupt server crashes. |
| **2. Offload Build to CI / Local** | Building your frontend on a free GitHub Actions runner (16GB RAM) or your local laptop, then transferring only the finished build output to the VPS via `rsync`/SSH. | `next build` with TypeScript, React 19, and Three.js peaks at **1.2 GB - 1.8 GB RAM**. Running it on VPS1 (972MB available) is guaranteed to crash the machine. |
| **3. Avoid Permanent Node SSR Daemon** | Using Next.js Static Export (`output: 'export'`) so the frontend compiles into pure HTML, CSS, and client JS (`out/` folder). | A Next.js SSR server running under PM2 sits in RAM 24/7 consuming **120MB - 220MB RSS**. Serving static files via Nginx takes **0 MB** additional RAM. |

---

## 2. Server Resource Comparison

```
Standard Deployment (VPS_DEPLOYMENT_GUIDE.md):
Total RAM (1.9 GB)
┌──────────────────┬──────────────┬─────────────┬─────────────┬─────────────┬──────────────┐
│ mysqld (~385MB)  │ AdGuard(130) │ PHP-FPM(230)│ PM2 Node(200│ System(100) │ Free (~0MB)  │ 💥 OOM CRASH
└──────────────────┴──────────────┴─────────────┴─────────────┴─────────────┴──────────────┘
                       ▲ When `npm run build` runs: Spikes +1.5GB -> Kills mysqld!

Optimized Deployment (This Guide):
Total RAM (1.9 GB) + 2GB Swap Safety Net
┌──────────────────┬──────────────┬─────────────┬─────────────┬────────────────────────────┐
│ mysqld (~385MB)  │ AdGuard(130) │ PHP-FPM(250)│ System(100) │ Healthy Available (~1.1GB) │ ✅ STABLE
└──────────────────┴──────────────┴─────────────┴─────────────┴────────────────────────────┘
     (Frontend served directly by Nginx static file cache: 0MB Node process required)
```

---

## Step 1: Configure 2GB Swap on VPS1 (One-Time Setup)

SSH into VPS1 as root or sudoer:

```bash
# 1. Create a 2GB swap file
sudo fallocate -l 2G /swapfile

# 2. Secure permissions (read/write only by root)
sudo chmod 600 /swapfile

# 3. Format and activate swap
sudo mkswap /swapfile
sudo swapon /swapfile

# 4. Make it persistent across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 5. Tune swappiness (10 means Linux prefers RAM and uses swap only under real pressure)
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf

# 6. Verify (Swap should now show 2.0Gi)
free -h
```

---

## Step 2: Configure Next.js for Static Export (0MB Node Daemon)

Since this portfolio fetches project listings and settings, we configure Next.js to export static files and let the client fetch from Laravel `/api`.

### 2.1 Update `frontend/next.config.ts`
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
```

### 2.2 Verify `frontend/src/lib/api.ts`
Ensure the API URL points to the relative path `/api` so Nginx routes requests directly to the Laravel backend:
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';
```

When you run `npm run build` locally or in CI, Next.js generates an `out/` folder containing pure HTML, CSS, and JS. **No PM2, no Node daemon, no port 3000 required.**

---

## Step 3: Setup Backend on VPS1 (Using Existing MySQL)

Do **NOT** install PostgreSQL. Use the existing `mysqld` service already running on VPS1.

```bash
# 1. Create database and user in existing MySQL
sudo mysql -u root -p -e "
CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'portfolio_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
"

# 2. Clone repository to server
sudo mkdir -p /var/www/portfolio
sudo chown -R $USER:www-data /var/www/portfolio
cd /var/www/portfolio
git clone --recurse-submodules https://github.com/nantaa/portfolio.git .

# 3. Setup Laravel Backend
cd /var/www/portfolio/backend
cp .env.example .env

# Configure .env with your MySQL credentials:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1  # Note: If you get "Connection refused", change to "localhost" or verify MySQL is running
# DB_PORT=3306
# DB_DATABASE=portfolio_db
# DB_USERNAME=portfolio_user
# DB_PASSWORD=STRONG_PASSWORD_HERE

# Troubleshooting "SQLSTATE[HY000] [2002] Connection refused":
# 1. Check if MySQL service is running:
#    sudo systemctl status mysql (or `sudo systemctl status mariadb`)
#    sudo systemctl start mysql
# 2. If MySQL is only listening on Unix socket (common on Ubuntu):
#    Change DB_HOST=127.0.0.1 to DB_HOST=localhost in .env
# 3. Alternatively, for 0 MB DB RAM usage, use SQLite instead:
#    DB_CONNECTION=sqlite
#    touch /var/www/portfolio/backend/database/database.sqlite

composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 4. Set storage permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

---

## Step 4: Automate CI/CD with GitHub Actions (Offloaded Build)

Create `.github/workflows/deploy.yml` in your repository root. This workflow builds the frontend on GitHub's free 16GB runner and copies only the static files to your VPS via SSH.

```yaml
name: Build and Deploy Portfolio

on:
  push:
    branches: [ main, master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 1

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Build Next.js Static Export (Offloaded to GitHub 16GB RAM)
        working-directory: frontend
        env:
          NEXT_PUBLIC_API_URL: /api
        run: |
          npm ci
          npm run build

      - name: Deploy Frontend Static Files to VPS
        uses: easingthemes/ssh-deploy@v5.0.3
        with:
          SSH_PRIVATE_KEY: ${{ secrets.VPS_SSH_KEY }}
          REMOTE_HOST: ${{ secrets.VPS_HOST }}
          REMOTE_USER: ${{ secrets.VPS_USER }}
          SOURCE: "frontend/out/"
          TARGET: "/var/www/portfolio/frontend_dist"
          EXCLUDE: "/node_modules/"

      - name: Update Backend on VPS via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/portfolio
            git pull --recurse-submodules origin main
            cd backend
            composer install --no-dev --optimize-autoloader
            php artisan migrate --force
            php artisan optimize:clear
            php artisan optimize
```

*(Add `VPS_SSH_KEY`, `VPS_HOST`, and `VPS_USER` to your GitHub Repository Secrets).*

---

### 4.1 Deploying to a Guarded VPS (WireGuard / VPN Protected SSH)

If your VPS firewall has closed SSH (port 22) to the public internet and only permits connections through a **WireGuard VPN tunnel** (e.g., `10.8.0.x` or `192.168.x.x`), public GitHub Actions runners cannot reach the server by default.

Choose **Method A** (full CI/CD automation) or **Method B** (direct local deployment):

#### Method A: Automated GitHub Actions via WireGuard Tunnel
GitHub Actions can connect to your WireGuard network at the beginning of the job, obtain an internal VPN IP, and then deploy over SSH.

##### Step 1: Generate a WireGuard Peer for GitHub Actions on your VPS
On your VPS terminal (`delta@RiksaUjiServer`):
```bash
# 1. Generate keys for the GitHub runner peer
wg genkey | tee github_runner_private.key | wg pubkey > github_runner_public.key

# 2. Add peer to your WireGuard server config (/etc/wireguard/wg0.conf):
sudo tee -a /etc/wireguard/wg0.conf <<EOF

[Peer]
# GitHub Actions Runner
PublicKey = $(cat github_runner_public.key)
AllowedIPs = 10.8.0.50/32
EOF

# 3. Reload WireGuard without interrupting current connections
sudo wg addconf wg0 <(sed -n '/# GitHub Actions Runner/,$p' /etc/wireguard/wg0.conf)
```

##### Step 2: Create the Client Configuration
Prepare the client configuration content:
```ini
[Interface]
PrivateKey = <CONTENT_OF_github_runner_private.key>
Address = 10.8.0.50/24
DNS = 1.1.1.1

[Peer]
PublicKey = <YOUR_SERVER_PUBLIC_KEY>
Endpoint = YOUR_VPS_PUBLIC_IP:51820
AllowedIPs = 10.8.0.0/24
PersistentKeepalive = 25
```

##### Step 3: Add GitHub Secrets
In your GitHub repo (**Settings** → **Secrets and variables** → **Actions**):
- `WIREGUARD_CONFIG`: Paste the complete `.conf` content from Step 2.
- `VPS_HOST`: Set to your VPS's **internal WireGuard IP** (e.g. `10.8.0.1`), NOT the public IP.
- `VPS_SSH_KEY`: The private SSH key authorized on your VPS.
- `VPS_USER`: Your SSH username (e.g., `delta`).

##### Step 4: Add the WireGuard Step to `.github/workflows/deploy.yml`
Insert the `alessfg/wireguard-action@v1` step immediately before the deployment steps:
```yaml
      # 3. Build Next.js Static Export
      - name: Build Next.js Static Export
        working-directory: frontend
        run: |
          npm ci
          npm run build

      # Connect to WireGuard VPN before SSH
      - name: Connect to WireGuard
        uses: alessfg/wireguard-action@v1
        with:
          wireguard_conf: ${{ secrets.WIREGUARD_CONFIG }}

      # 4. Deploy Frontend Static Files (routed securely through 10.8.0.1)
      - name: Deploy Frontend Static Files to VPS
        uses: easingthemes/ssh-deploy@v5.0.3
        with:
          SSH_PRIVATE_KEY: ${{ secrets.VPS_SSH_KEY }}
          REMOTE_HOST: ${{ secrets.VPS_HOST }}
          REMOTE_USER: ${{ secrets.VPS_USER }}
          SOURCE: "frontend/out/"
          TARGET: "/var/www/portfolio/frontend_dist"
```

---

#### Method B: Direct Local Deployment over WireGuard (Zero Cloud Setup)
If your local computer is already connected to WireGuard, you can deploy in one command without storing VPN credentials on GitHub:

##### Step 1: Ensure you can SSH into VPS over WireGuard
Test from your local machine:
```bash
ssh delta@10.8.0.1
```

##### Step 2: Build locally and push static files via SCP/rsync
From your local `portfolio-website` directory:
```bash
# Build the static export locally (takes ~15 seconds on your computer)
cd frontend
npm run build

# Copy static files directly through your local WireGuard tunnel to the VPS
scp -r out/* delta@10.8.0.1:/var/www/portfolio/frontend_dist/

# Pull latest backend code and optimize
ssh delta@10.8.0.1 "cd /var/www/portfolio && git pull --recurse-submodules && cd backend && php artisan optimize:clear && php artisan optimize"
```

## Step 5: Nginx Configuration on VPS1

Create `/etc/nginx/sites-available/portfolio.conf`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/portfolio/frontend_dist;
    index index.html;

    client_max_body_size 20M;

    # Explicit MIME types for 3D GLB/GLTF and WebP
    types {
        text/html                             html htm shtml;
        text/css                              css;
        text/xml                              xml;
        image/webp                            webp;
        image/jpeg                            jpeg jpg;
        image/png                             png;
        image/svg+xml                         svg svgz;
        model/gltf-binary                     glb;
        model/gltf+json                       gltf;
        application/octet-stream              bin;
        application/javascript                js;
        application/json                      json;
    }

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript image/svg+xml model/gltf+json;

    # 1. Laravel API Backend & Filament Admin
    location ^~ /api {
        alias /var/www/portfolio/backend/public;
        try_files $uri $uri/ @laravel;

        location ~ \.php$ {
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME /var/www/portfolio/backend/public/index.php;
            # Note: verify your PHP socket version with `ls /var/run/php/php*-fpm.sock`
            fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
            fastcgi_index index.php;
        }
    }

    # Filament Admin panel routes
    location ^~ /admin {
        alias /var/www/portfolio/backend/public;
        try_files $uri $uri/ @laravel;

        location ~ \.php$ {
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME /var/www/portfolio/backend/public/index.php;
            # Note: verify your PHP socket version with `ls /var/run/php/php*-fpm.sock`
            fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
            fastcgi_index index.php;
        }
    }

    location @laravel {
        rewrite ^/(?:api|admin)(/.*)?$ /index.php?$1 last;
    }

    # 2. Next.js Static Export Scripts & Chunks Caching
    location /_next/static/ {
        alias /var/www/portfolio/frontend_dist/_next/static/;
        expires 365d;
        access_log off;
    }

    # 3. 3D GLB Models, WebP Images, and Media Caching
    location ~* \.(glb|gltf|bin|webp|png|jpg|jpeg|svg|ico)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
        access_log off;
        try_files $uri =404;
    }

    # 4. Standalone 3D Diorama HTMLs & SPA Routes
    # (Serves raja_ampat_snorkel_day.html & ulun_danu_lake_bratan_material_studies.html directly)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable and reload Nginx:
```bash
sudo ln -sf /etc/nginx/sites-available/portfolio.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Obtain SSL certificate via Certbot:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Summary of Results

| Metric | Original Plan | Optimized Plan |
|---|---|---|
| **Build Location** | VPS1 (crashes at 1.5GB peak) | GitHub Actions CI (16GB RAM) |
| **Node Daemon on VPS** | PM2 running `next start` (150–220MB) | None (0MB - pure Nginx static file serving) |
| **Swap Buffer** | 0B (Immediate OOM kill) | 2GB `/swapfile` (Zero crashes) |
| **Database** | New Postgres (+120MB) | Existing MySQL (0MB extra daemon) |
| **VPS Health Risk** | High (Threatens existing live sites) | Minimal (Rock solid) |
