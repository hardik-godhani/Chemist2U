#!/bin/bash

################################################################################
# Chemist2U - Digital Ocean Droplet Initial Setup Script
# 
# This script sets up a fresh Ubuntu 22.04 droplet for running the Chemist2U
# application. Run this as root on your new droplet.
#
# Usage: 
#   wget https://raw.githubusercontent.com/your-repo/Chemist2U/main/server-setup.sh
#   chmod +x server-setup.sh
#   sudo ./server-setup.sh
################################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}Please run as root (use sudo)${NC}"
   exit 1
fi

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Chemist2U Server Setup${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

################################################################################
# Step 1: System Update
################################################################################
print_info "Step 1: Updating system packages..."
apt-get update -y
apt-get upgrade -y
print_success "System updated"

################################################################################
# Step 2: Create Application User
################################################################################
print_info "Step 2: Creating application user 'root'..."
if id "root" &>/dev/null; then
    print_warning "User 'root' already exists, skipping creation"
else
    useradd -m -s /bin/bash root
    usermod -aG sudo root
    print_success "User 'root' created"
fi

################################################################################
# Step 3: Configure Swap Space (2GB)
################################################################################
print_info "Step 3: Setting up swap space..."
if [ -f /swapfile ]; then
    print_warning "Swap file already exists, skipping"
else
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    
    # Make swap permanent
    if ! grep -q '/swapfile' /etc/fstab; then
        echo '/swapfile none swap sw 0 0' >> /etc/fstab
    fi
    
    # Optimize swap settings
    sysctl vm.swappiness=10
    sysctl vm.vfs_cache_pressure=50
    echo "vm.swappiness=10" >> /etc/sysctl.conf
    echo "vm.vfs_cache_pressure=50" >> /etc/sysctl.conf
    
    print_success "Swap space configured (2GB)"
fi

################################################################################
# Step 4: Install Node.js 20.x
################################################################################
print_info "Step 4: Installing Node.js 20.x..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_warning "Node.js already installed: $NODE_VERSION"
    read -p "Reinstall Node.js 20.x? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Skipping Node.js installation"
    else
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
        print_success "Node.js 20.x installed"
    fi
else
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    print_success "Node.js 20.x installed"
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_info "Node version: $NODE_VERSION"
print_info "NPM version: $NPM_VERSION"

################################################################################
# Step 5: Install PM2
################################################################################
print_info "Step 5: Installing PM2 process manager..."
if command -v pm2 &> /dev/null; then
    print_warning "PM2 already installed"
else
    npm install -g pm2
    print_success "PM2 installed globally"
fi

PM2_VERSION=$(pm2 --version)
print_info "PM2 version: $PM2_VERSION"

################################################################################
# Step 6: Install Nginx
################################################################################
print_info "Step 6: Installing Nginx..."
if command -v nginx &> /dev/null; then
    print_warning "Nginx already installed"
else
    apt-get install -y nginx
    systemctl enable nginx
    print_success "Nginx installed and enabled"
fi

NGINX_VERSION=$(nginx -v 2>&1 | cut -d'/' -f2)
print_info "Nginx version: $NGINX_VERSION"

################################################################################
# Step 7: Install Git
################################################################################
print_info "Step 7: Installing Git..."
if command -v git &> /dev/null; then
    print_warning "Git already installed"
else
    apt-get install -y git
    print_success "Git installed"
fi

GIT_VERSION=$(git --version)
print_info "$GIT_VERSION"

################################################################################
# Step 8: Configure UFW Firewall
################################################################################
print_info "Step 8: Configuring firewall (UFW)..."
if command -v ufw &> /dev/null; then
    # Allow SSH, HTTP, HTTPS
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow 22/tcp comment 'SSH'
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'
    ufw --force enable
    print_success "Firewall configured (ports 22, 80, 443 open)"
else
    apt-get install -y ufw
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow 22/tcp comment 'SSH'
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'
    ufw --force enable
    print_success "Firewall installed and configured"
fi

################################################################################
# Step 9: Create Application Directory Structure
################################################################################
print_info "Step 9: Creating application directories..."
mkdir -p /home/root/apps/chemist2u
chown -R root:root /home/root/apps
print_success "Application directory created at /home/root/apps/chemist2u"

################################################################################
# Step 10: SSH Key Setup for root
################################################################################
print_info "Step 10: Setting up SSH for root..."
mkdir -p /home/root/.ssh
chmod 700 /home/root/.ssh

# Copy authorized_keys from root if exists
if [ -f /root/.ssh/authorized_keys ]; then
    cp /root/.ssh/authorized_keys /home/root/.ssh/authorized_keys
    chmod 600 /home/root/.ssh/authorized_keys
    chown -R root:root /home/root/.ssh
    print_success "SSH keys copied from root to root"
else
    print_warning "No authorized_keys found. You'll need to add SSH keys manually:"
    print_info "  echo 'your-ssh-public-key' >> /home/root/.ssh/authorized_keys"
fi

################################################################################
# Step 11: Install Certbot (for SSL when domain is ready)
################################################################################
print_info "Step 11: Installing Certbot for Let's Encrypt SSL..."
if command -v certbot &> /dev/null; then
    print_warning "Certbot already installed"
else
    apt-get install -y certbot python3-certbot-nginx
    print_success "Certbot installed (ready for SSL setup when domain is configured)"
fi

################################################################################
# Step 12: Security Hardening - SSH
################################################################################
print_info "Step 12: Hardening SSH configuration..."
SSH_CONFIG="/etc/ssh/sshd_config"

# Backup original config
cp $SSH_CONFIG ${SSH_CONFIG}.backup

# Disable password authentication (keep key-based only)
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/g' $SSH_CONFIG
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/g' $SSH_CONFIG

# Disable root login
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/g' $SSH_CONFIG
sed -i 's/PermitRootLogin yes/PermitRootLogin no/g' $SSH_CONFIG

# Restart SSH
systemctl restart sshd
print_success "SSH hardened (password auth disabled, root login disabled)"
print_warning "Make sure you have SSH key access before logging out!"

################################################################################
# Step 13: Install Build Tools
################################################################################
print_info "Step 13: Installing build essentials..."
apt-get install -y build-essential
print_success "Build tools installed"

################################################################################
# Summary
################################################################################
echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}Server Setup Complete!${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo -e "${GREEN}Installed Software:${NC}"
echo "  - Node.js: $NODE_VERSION"
echo "  - NPM: $NPM_VERSION"
echo "  - PM2: $PM2_VERSION"
echo "  - Nginx: $NGINX_VERSION"
echo "  - Git: Installed"
echo "  - Certbot: Installed"
echo ""
echo -e "${GREEN}Configured:${NC}"
echo "  - User 'root' created"
echo "  - 2GB swap space enabled"
echo "  - UFW firewall (ports 22, 80, 443 open)"
echo "  - SSH hardened (key-based auth only)"
echo "  - Application directory: /home/root/apps/chemist2u"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. Switch to root:"
echo "   su - root"
echo ""
echo "2. Clone your repository:"
echo "   cd /home/root/apps/chemist2u"
echo "   git clone <your-repo-url> ."
echo ""
echo "3. Set up GitHub Actions secrets in your repository:"
echo "   DROPLET_HOST: $(curl -s ifconfig.me)"
echo "   DROPLET_USER: root"
echo "   DROPLET_SSH_KEY: <your-private-key>"
echo "   DROPLET_PORT: 22"
echo ""
echo "4. Configure environment variables:"
echo "   cd /home/root/apps/chemist2u"
echo "   cp .env.example .env"
echo "   nano .env"
echo "   (Update CORS_ORIGIN with your droplet IP or domain)"
echo ""
echo "5. Run initial deployment:"
echo "   ./deploy.sh"
echo ""
echo "6. Configure Nginx:"
echo "   sudo cp nginx.conf /etc/nginx/sites-available/chemist2u"
echo "   sudo ln -s /etc/nginx/sites-available/chemist2u /etc/nginx/sites-enabled/"
echo "   sudo rm /etc/nginx/sites-enabled/default"
echo "   sudo nginx -t"
echo "   sudo systemctl restart nginx"
echo ""
echo "7. Set up PM2 startup:"
echo "   pm2 startup"
echo "   (Run the command it outputs)"
echo "   pm2 save"
echo ""
echo "8. When you have a domain, set up SSL:"
echo "   sudo certbot --nginx -d yourdomain.com"
echo ""
echo -e "${GREEN}Server IP Address: $(curl -s ifconfig.me)${NC}"
echo ""
echo -e "${YELLOW}IMPORTANT: Test SSH access as root before closing this session!${NC}"
echo ""
