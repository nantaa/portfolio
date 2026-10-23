# Portfolio Deployment & Code Update Guide (Via GitHub Actions CI/CD)

This guide documents the exact, safe procedure to push your local updates to GitHub and trigger the automated build and deployment pipeline to your VPS.

---

## 1. Current Branch Context

- **Current Working Branch**: `feature/option-a-architectural-declutter`
- **Deployment Trigger Branch**: `master` (Configured in `.github/workflows/deploy.yml`)
- **Automated Workflow**:
  1. Offloaded build: GitHub runner builds Next.js static export (`frontend/out`) using 16 GB RAM (saving VPS memory).
  2. WireGuard VPN: Secure tunnel connects GitHub runner to your private VPS host.
  3. Frontend deployment: Rsync synchronizes `frontend/out/` directly to `/var/www/portfolio/frontend_dist/`.
  4. Backend update: Pulls `master`, runs Laravel migrations (`php artisan migrate --force`), and clears/refreshes caches.

---

## 2. Step-by-Step Deployment Instructions

### Step 1: Verify Everything is Tested Locally
Run the test suite and verify 100% passing tests before merging:
```powershell
node --test tests/*.test.mjs
```
*Expected: 63 tests passing, 0 failing.*

### Step 2: Merge Your Feature Branch into `master`
Switch to `master` and merge your verified work:
```powershell
# 1. Switch to master
git checkout master

# 2. Pull latest changes from remote (if any)
git pull origin master

# 3. Merge your completed declutter feature branch
git merge feature/option-a-architectural-declutter

# 4. Run tests one more time on master to ensure merge integrity
node --test tests/*.test.mjs
```

### Step 3: Push to GitHub to Trigger Build & Deploy
Pushing to `origin master` immediately starts the GitHub Actions workflow:
```powershell
git push origin master
```

---

## 3. Monitoring the Build & Deployment

### Via Browser (GitHub Web UI)
1. Open your repository on GitHub: `https://github.com/<your-username>/portfolio-website`
2. Click on the **Actions** tab at the top.
3. You will see the workflow run: **"Build and Deploy Portfolio"**.
4. Click on the active run to view live streaming logs for:
   - `Build Next.js Static Export`
   - `Connect to WireGuard VPN`
   - `Deploy Frontend and Update Backend via SSH`

### Via GitHub CLI (If installed)
```powershell
gh run watch
```

---

## 4. Post-Deployment Verification Checklist

Once the GitHub Actions workflow shows a green checkmark:
1. Open your live portfolio in browser (use hard reload `Ctrl + Shift + R` to bypass browser cache).
2. Check **Hero Section**:
   - Telemetry HUD renders single-token tech chips (`TS/SVG`, `Canvas`, etc.).
   - Clean 1-line summary without vertical overflow.
3. Check **Selected Work**:
   - Card 01 (K3 Compliance Engine): Gated standby state loads clean blueprint wireframe.
   - Click to activate: Verify no chunky native horizontal scrollbar, no bottom ticker, and clean SVG tab icons.
   - Light/Dark theme toggle switches seamlessly without layout shift.
4. Verify submodules / standalone 3D studies:
   - Raja Ampat (`/raja_ampat_snorkel_day.html`) and Ulun Danu (`/ulun_danu_lake_bratan_material_studies.html`) load directly.

---

## 5. Troubleshooting & Rollback

### If GitHub Actions Fails at "Connect to WireGuard VPN"
- Check that your VPS WireGuard interface is running:
  ```bash
  sudo wg show
  ```
- Verify your VPS public IP / DDNS endpoint in GitHub repository secret `WIREGUARD_CONFIG` is up to date.

### If You Need to Rollback Fast
```powershell
# Revert the last commit on master and force push or push revert commit:
git revert HEAD -m 1
git push origin master
```
GitHub Actions will automatically build the previous stable state and sync it to the VPS.
