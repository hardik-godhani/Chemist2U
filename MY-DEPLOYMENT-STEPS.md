# My Deployment Steps - Droplet: 170.64.166.2

**⚠️ SECURITY NOTE:** Your password is not stored in this file. Keep it secure!

---

## Quick Start Checklist

### ☐ Step 1: Generate SSH Key (On Your Local Machine)

Open your terminal and run:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "chemist2u-deployment"

# Press Enter for default location (~/.ssh/id_ed25519)
# Press Enter twice for no passphrase (or set one if you prefer)

# Display your public key
cat ~/.ssh/id_ed25519.pub
```

**Copy the entire output** (starts with `ssh-ed25519...`)

---

### ☐ Step 2: First Login to Droplet

```bash
ssh root@170.64.166.2
```

- Enter your password: `H@rdik55RS`
- Type `yes` if asked about fingerprint

---

### ☐ Step 3: Add Your SSH Key (While Logged in as Root)

```bash
# Create root first
useradd -m -s /bin/bash root
usermod -aG sudo root

# Create SSH directory for root
mkdir -p /home/root/.ssh
chmod 700 /home/root/.ssh

# Add your SSH public key (paste the key you copied in Step 1)
nano /home/root/.ssh/authorized_keys
# Paste your public key, save (Ctrl+O, Enter), exit (Ctrl+X)

# Set correct permissions
chmod 600 /home/root/.ssh/authorized_keys
chown -R root:root /home/root/.ssh

# Also add to root for now (so server-setup.sh won't lock you out)
mkdir -p /root/.ssh
cp /home/root/.ssh/authorized_keys /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
```

---

### ☐ Step 4: Test SSH Key Access (IMPORTANT!)

**Open a NEW terminal** (don't close the root session yet!):

```bash
ssh root@170.64.166.2
```

✅ **If it connects without asking for password, you're good!**
❌ **If it asks for password, go back to Step 3 and check permissions**

Type `exit` to close the test connection.

---

### ☐ Step 5: Download and Run Server Setup

**Back in your root session:**

```bash
cd ~

# Download setup script
curl -o server-setup.sh https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/Chemist2U/main/server-setup.sh

# If curl doesn't work, create the file manually:
nano server-setup.sh
# Copy content from your local server-setup.sh file, paste, save

# Make executable
chmod +x server-setup.sh

# Run setup (takes 5-10 minutes)
./server-setup.sh
```

**The script will:**
- ✅ Update system packages
- ✅ Install Node.js 20.x, PM2, Nginx, Git
- ✅ Set up 2GB swap space
- ✅ Configure firewall
- ✅ Create application directory

**⚠️ After this step, password login will be disabled!**

---

### ☐ Step 6: Switch to root and Clone Repository

```bash
# Switch user
su - root

# Navigate to app directory
cd /home/root/apps/chemist2u

# Clone your repository (update with your GitHub username)
git clone https://github.com/YOUR_GITHUB_USERNAME/Chemist2U.git .

# Verify files
ls -la
```

---

### ☐ Step 7: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit environment file
nano .env
```

**Update these values:**

```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# IMPORTANT: Your droplet IP
CORS_ORIGIN=http://170.64.166.2

RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_EVALUATE=30
RATE_LIMIT_RULES_WRITE=10
RATE_LIMIT_RULES_READ=60
```

Save: `Ctrl+O`, `Enter`, Exit: `Ctrl+X`

---

### ☐ Step 8: Update Nginx Configuration

```bash
# Edit nginx config
nano nginx.conf
```

**Find and update:**

Change:
```nginx
server_name your-domain.com;
```

To:
```nginx
server_name 170.64.166.2;
```

**Also comment out the www redirect** (around lines 19-23):
```nginx
# Comment out this entire block since we're using IP
# server {
#     listen 80;
#     listen [::]:80;
#     server_name www.your-domain.com;
#     return 301 http://your-domain.com$request_uri;
# }
```

Save and exit.

---

### ☐ Step 9: Run Initial Deployment

```bash
# This will take 5-10 minutes
./deploy.sh
```

**Watch for:**
- ✅ Dependencies installed
- ✅ Build completed
- ✅ PM2 started

**If build fails with "Killed":**
```bash
# You need more swap, run:
sudo fallocate -l 4G /swapfile2
sudo chmod 600 /swapfile2
sudo mkswap /swapfile2
sudo swapon /swapfile2

# Try again
./deploy.sh
```

---

### ☐ Step 10: Configure Nginx

```bash
# Install nginx config
sudo cp nginx.conf /etc/nginx/sites-available/chemist2u

# Enable site
sudo ln -s /etc/nginx/sites-available/chemist2u /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# If OK, restart nginx
sudo systemctl restart nginx
```

---

### ☐ Step 11: Set Up PM2 Startup

```bash
# Generate startup script
pm2 startup

# Copy and run the command it outputs (looks like):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /home/root

# Save PM2 process list
pm2 save
```

---

### ☐ Step 12: Set Up Log Rotation

```bash
# Install logrotate config
sudo cp logrotate-chemist2u.conf /etc/logrotate.d/chemist2u
sudo chown root:root /etc/logrotate.d/chemist2u
sudo chmod 644 /etc/logrotate.d/chemist2u
```

---

### ☐ Step 13: Verify Deployment

```bash
# Check PM2 status
pm2 status
# Should show: chemist2u-api | online

# View logs
pm2 logs chemist2u-api --lines 20

# Test health endpoint
curl http://localhost:3000/api/health
# Should return JSON with "status": "healthy"

# Test from outside
curl http://170.64.166.2/api/health
```

---

### ☐ Step 14: Test in Browser

Open your browser:

- **Frontend:** http://170.64.166.2
- **API:** http://170.64.166.2/api
- **Health:** http://170.64.166.2/api/health

**You should see the Chemist2U application! 🎉**

---

## Part 2: Set Up GitHub Actions CI/CD

### ☐ Step 15: Create Deployment SSH Key (Local Machine)

```bash
# Generate dedicated key for GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-chemist2u" -f ~/.ssh/chemist2u_deploy

# Press Enter twice (no passphrase)

# Display public key
cat ~/.ssh/chemist2u_deploy.pub
# Copy the output
```

---

### ☐ Step 16: Add GitHub Actions Public Key to Droplet

```bash
# On droplet (as root):
ssh root@170.64.166.2

# Add the key
echo "PASTE_THE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys

# Verify
cat ~/.ssh/authorized_keys
# Should show both keys now
```

---

### ☐ Step 17: Test GitHub Actions SSH Key

```bash
# From local machine:
ssh -i ~/.ssh/chemist2u_deploy root@170.64.166.2

# Should connect without password
# Type exit to disconnect
```

---

### ☐ Step 18: Get Private Key for GitHub

```bash
# Display private key
cat ~/.ssh/chemist2u_deploy

# Copy EVERYTHING including:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ...all the lines...
# -----END OPENSSH PRIVATE KEY-----
```

---

### ☐ Step 19: Configure GitHub Secrets

1. Go to: https://github.com/YOUR_USERNAME/Chemist2U
2. Click: **Settings** → **Secrets and variables** → **Actions**
3. Click: **New repository secret**

Add these 4 secrets:

**Secret 1: DROPLET_HOST**
```
170.64.166.2
```

**Secret 2: DROPLET_USER**
```
root
```

**Secret 3: DROPLET_SSH_KEY**
```
Paste the entire private key from Step 18
```

**Secret 4: DROPLET_PORT**
```
22
```

---

### ☐ Step 20: Push Code and Test Deployment

```bash
# On your local machine, in Chemist2U folder:

# Stage all deployment files
git add .

# Commit
git commit -m "Add deployment configuration for 170.64.166.2"

# Push to trigger deployment
git push origin main
```

**Watch deployment:**
1. Go to: https://github.com/YOUR_USERNAME/Chemist2U/actions
2. Click on the running workflow
3. Watch it deploy automatically! 🚀

---

## Quick Reference

### Your Droplet Info
- **IP:** 170.64.166.2
- **User:** root
- **SSH:** `ssh root@170.64.166.2`

### Important URLs
- **Frontend:** http://170.64.166.2
- **API:** http://170.64.166.2/api
- **Health Check:** http://170.64.166.2/api/health

### Useful Commands
```bash
# Connect to droplet
ssh root@170.64.166.2

# Check status
pm2 status

# View logs
pm2 logs chemist2u-api

# Restart app
pm2 restart chemist2u-api

# Update app manually
cd /home/root/apps/chemist2u
git pull origin main
./deploy.sh
```

---

## Troubleshooting

### Can't SSH After Setup Script
**Problem:** SSH keeps asking for password

**Solution:**
- Your SSH key wasn't added correctly
- Connect via Digital Ocean console
- Check `/home/root/.ssh/authorized_keys` exists and has your public key
- Check permissions: `chmod 600 ~/.ssh/authorized_keys`

### Build Fails (Out of Memory)
**Problem:** npm install gets "Killed"

**Solution:**
```bash
# Add more swap
sudo fallocate -l 4G /swapfile2
sudo chmod 600 /swapfile2
sudo mkswap /swapfile2
sudo swapon /swapfile2
```

### Nginx 502 Bad Gateway
**Problem:** Site shows 502 error

**Solution:**
```bash
# Check if backend is running
pm2 status

# Check backend logs
pm2 logs chemist2u-api

# Restart if needed
pm2 restart chemist2u-api
```

### GitHub Actions Fails
**Problem:** Deployment workflow fails

**Solution:**
1. Check all 4 GitHub secrets are correct
2. Test SSH manually: `ssh -i ~/.ssh/chemist2u_deploy root@170.64.166.2`
3. Check Actions logs for specific error

---

## Security Reminders

- ✅ SSH keys set up (password auth disabled)
- ✅ Firewall configured (only ports 22, 80, 443 open)
- ✅ Rate limiting enabled
- ✅ Running as non-root user (root)

**Never commit passwords or private keys to git!**

---

## Next Steps After Deployment

### Optional: Get a Domain Name

When you're ready:

1. Buy domain (Namecheap, Google Domains, etc.)
2. Point A record to: `170.64.166.2`
3. Update nginx.conf with domain name
4. Update .env CORS_ORIGIN
5. Run: `sudo certbot --nginx -d yourdomain.com`
6. Get free SSL! 🔒

---

**Good luck with your deployment! 🚀**

For detailed help, see: [DEPLOYMENT-PASSWORD-AUTH.md](DEPLOYMENT-PASSWORD-AUTH.md)
