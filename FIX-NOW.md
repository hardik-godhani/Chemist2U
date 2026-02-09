# Quick Fix for Current Deployment

## Problem
- Cloned into nested directory: `/home/root/apps/chemist2u/Chemist2U`
- CORS was blocking frontend (had wrong port `:4200`)
- Nginx pointing to wrong directory

## Solution: Run These Commands on Droplet

```bash
# 1. You're currently in the wrong directory structure
# Move everything up one level

cd /home/root/apps/chemist2u

# If Chemist2U folder exists, move contents up
if [ -d "Chemist2U" ]; then
    mv Chemist2U/* .
    mv Chemist2U/.* . 2>/dev/null || true
    rmdir Chemist2U
fi

# 2. Now you should be in /home/root/apps/chemist2u with all files

# 3. Pull latest changes (with CORS fix)
git pull origin main

# 4. Copy the production env file
cp .env.production .env

# 5. Make deploy script executable
chmod +x deploy.sh

# 6. Run deployment
./deploy.sh

# 7. After deploy completes, update Nginx
cp nginx.conf /etc/nginx/sites-available/chemist2u
ln -sf /etc/nginx/sites-available/chemist2u /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# 8. Restart PM2 with new CORS settings
pm2 restart chemist2u-api

# 9. Check status
pm2 status
pm2 logs chemist2u-api --lines 20

# 10. Test endpoints
curl http://localhost:3000/api/health
curl http://170.64.166.2/api/health
```

## Verify It Works

Open browser and visit:
- http://170.64.166.2 - Should see frontend
- http://170.64.166.2/api/health - Should see JSON response

## What Was Fixed

1. **CORS Origin**: Changed from `http://170.64.166.2:4200` to `http://170.64.166.2`
2. **Directory check**: Removed strict directory check from deploy.sh
3. **File structure**: Moved from nested `Chemist2U` folder to proper location

## If You Get Errors

### "Permission denied" on deploy.sh
```bash
chmod +x deploy.sh
```

### "npm install killed"
```bash
# Add more swap
fallocate -l 4G /swapfile2
chmod 600 /swapfile2
mkswap /swapfile2
swapon /swapfile2
```

### Nginx 502 Error
```bash
# Check PM2 is running
pm2 status

# Check logs
pm2 logs chemist2u-api

# Restart
pm2 restart chemist2u-api
```

### CORS Errors in Browser Console
```bash
# Make sure .env has correct CORS_ORIGIN
cat .env

# Should show:
# CORS_ORIGIN=http://170.64.166.2

# Restart PM2
pm2 restart chemist2u-api
```

## Check Everything Works

```bash
# Backend health
curl http://170.64.166.2/api/health

# Should return:
# {"status":"healthy", ...}

# Frontend
curl http://170.64.166.2

# Should return HTML

# PM2 status
pm2 status

# Should show chemist2u-api as "online"

# Nginx status
systemctl status nginx

# Should show "active (running)"
```

## After Everything Works

Push the updated files:

```bash
# On your local machine:
git add .
git commit -m "Fix CORS and deployment paths for root user"
git push origin main
```

Then set up GitHub Actions secrets and automated deployment will work too!
