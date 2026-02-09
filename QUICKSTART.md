# 🚀 QUICK START - Deploy to 170.64.166.2

Copy and paste these commands in order. **Read MY-DEPLOYMENT-STEPS.md for detailed explanations.**

---

## Part 1: On Your Local Machine

### 1. Generate SSH Key
```bash
ssh-keygen -t ed25519 -C "chemist2u"
cat ~/.ssh/id_ed25519.pub
```
📋 **Copy the output** (your public key)

---

## Part 2: On the Droplet (First Login with Password)

### 2. Connect
```bash
ssh root@170.64.166.2
```
Password: `H@rdik55RS`

### 3. Create User and Add SSH Key
```bash
useradd -m -s /bin/bash root
usermod -aG sudo root
mkdir -p /home/root/.ssh
chmod 700 /home/root/.ssh
nano /home/root/.ssh/authorized_keys
```
📋 **Paste your public key, save (Ctrl+O, Enter), exit (Ctrl+X)**

```bash
chmod 600 /home/root/.ssh/authorized_keys
chown -R root:root /home/root/.ssh
mkdir -p /root/.ssh
cp /home/root/.ssh/authorized_keys /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
```

### 4. Test SSH (In NEW Terminal - Don't Close Root!)
```bash
ssh root@170.64.166.2
```
✅ Should work without password! Type `exit`

### 5. Run Server Setup (Back in Root Terminal)
```bash
cd ~
nano server-setup.sh
```
📋 **Paste content from your local server-setup.sh file, save, exit**

```bash
chmod +x server-setup.sh
./server-setup.sh
```
⏳ Takes 5-10 minutes

---

## Part 3: Deploy Application

### 6. Clone and Configure
```bash
su - root
cd /home/root/apps/chemist2u
git clone https://github.com/YOUR_USERNAME/Chemist2U.git .
cp .env.production .env
```

The `.env.production` file already has your IP configured! ✅

### 7. Update Nginx (Already Configured!)
The `nginx.conf` already has your IP (170.64.166.2) configured! ✅

### 8. Deploy
```bash
./deploy.sh
```
⏳ Takes 5-10 minutes

**If "Killed" error:**
```bash
sudo fallocate -l 4G /swapfile2
sudo chmod 600 /swapfile2
sudo mkswap /swapfile2
sudo swapon /swapfile2
./deploy.sh
```

### 9. Configure Nginx
```bash
sudo cp nginx.conf /etc/nginx/sites-available/chemist2u
sudo ln -s /etc/nginx/sites-available/chemist2u /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 10. Setup PM2 & Logs
```bash
pm2 startup
```
📋 **Run the command it outputs**

```bash
pm2 save
sudo cp logrotate-chemist2u.conf /etc/logrotate.d/chemist2u
```

### 11. Test
```bash
pm2 status
curl http://170.64.166.2/api/health
```

---

## Part 4: GitHub Actions (On Local Machine)

### 12. Create Deploy Key
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/chemist2u_deploy
cat ~/.ssh/chemist2u_deploy.pub
```
📋 **Copy the public key**

### 13. Add to Droplet
```bash
ssh root@170.64.166.2
echo "PASTE_PUBLIC_KEY" >> ~/.ssh/authorized_keys
exit
```

### 14. Test Deploy Key
```bash
ssh -i ~/.ssh/chemist2u_deploy root@170.64.166.2
```
✅ Should work! Type `exit`

### 15. Get Private Key for GitHub
```bash
cat ~/.ssh/chemist2u_deploy
```
📋 **Copy EVERYTHING** (including BEGIN/END lines)

### 16. Add GitHub Secrets

Go to: **GitHub → Settings → Secrets → Actions → New secret**

| Name | Value |
|------|-------|
| `DROPLET_HOST` | `170.64.166.2` |
| `DROPLET_USER` | `root` |
| `DROPLET_SSH_KEY` | Paste private key |
| `DROPLET_PORT` | `22` |

### 17. Deploy!
```bash
git add .
git commit -m "Add deployment config"
git push origin main
```

🎉 **Watch it deploy at:** github.com/YOUR_USERNAME/Chemist2U/actions

---

## ✅ Success!

Visit: **http://170.64.166.2**

You should see Chemist2U running! 🎊

---

## 🔧 Useful Commands

```bash
# Connect
ssh root@170.64.166.2

# Check status
pm2 status
pm2 logs chemist2u-api

# Restart
pm2 restart chemist2u-api

# Manual deploy
cd /home/root/apps/chemist2u
git pull origin main
./deploy.sh
```

---

**Need detailed help?** See [MY-DEPLOYMENT-STEPS.md](MY-DEPLOYMENT-STEPS.md)
