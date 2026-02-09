#!/bin/bash

# Chemist2U Deployment Script for DigitalOcean
# Run this script on your droplet as root

set -e  # Exit on error

echo "================================"
echo "Chemist2U Deployment Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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

# Check if running as root
if [ "$USER" != "root" ]; then
    print_warning "This script should be run as root, not root"
    echo "Switch to root first: su - root"
    exit 1
fi

# Check if in correct directory
REQUIRED_DIR="/home/root/apps/chemist2u"
if [ "$PWD" != "$REQUIRED_DIR" ]; then
    print_error "Please run this script from: $REQUIRED_DIR"
    echo "Current directory: $PWD"
    exit 1
fi

echo "Step 1: Checking system requirements..."

# Check if swap exists
SWAP=$(free -h | grep -i swap | awk '{print $2}')
if [ "$SWAP" == "0B" ]; then
    print_warning "No swap space detected. This may cause out-of-memory errors."
    echo "Create swap with: sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile"
else
    print_success "Swap space: $SWAP"
fi

# Check Node.js version
NODE_VERSION=$(node --version)
print_success "Node.js version: $NODE_VERSION"

echo ""
echo "Step 2: Cleaning old build..."

# Clean old builds
if [ -d "node_modules" ]; then
    rm -rf node_modules
    print_success "Removed node_modules"
fi

if [ -f "package-lock.json" ]; then
    rm -f package-lock.json
    print_success "Removed package-lock.json"
fi

npm cache clean --force
print_success "Cleared npm cache"

echo ""
echo "Step 3: Installing dependencies..."
echo "This may take several minutes..."

npm install --legacy-peer-deps || {
    print_error "npm install failed"
    print_warning "If you got 'Killed' error, you need more memory or swap space"
    exit 1
}

print_success "Dependencies installed"

echo ""
echo "Step 4: Building applications..."

# Build both apps
npm run build || {
    print_error "Build failed"
    exit 1
}

print_success "Build completed"

# Verify build output
if [ ! -f "dist/apps/frontend/browser/index.html" ]; then
    print_error "Frontend build verification failed"
    exit 1
fi

if [ ! -f "dist/apps/backend/main.js" ]; then
    print_error "Backend build verification failed"
    exit 1
fi

print_success "Build verification passed"

echo ""
echo "Step 5: Setting up PM2..."

# Create logs directory
mkdir -p logs
print_success "Created logs directory"

# Check if PM2 process exists
if pm2 list | grep -q "chemist2u-api"; then
    print_warning "PM2 process already exists, restarting..."
    pm2 restart chemist2u-api
else
    print_warning "Starting new PM2 process..."
    pm2 start ecosystem.config.js
fi

pm2 save
print_success "PM2 configured"

echo ""
echo "Step 6: Checking PM2 status..."
pm2 status

echo ""
echo "================================"
echo "Deployment Summary"
echo "================================"
echo ""
print_success "Backend deployed successfully"
print_success "PM2 process: chemist2u-api"
echo ""
echo "Next steps:"
echo "1. Configure Nginx (if not done already):"
echo "   sudo cp nginx.conf /etc/nginx/sites-available/chemist2u"
echo "   sudo ln -s /etc/nginx/sites-available/chemist2u /etc/nginx/sites-enabled/"
echo "   sudo nginx -t && sudo systemctl restart nginx"
echo ""
echo "2. Update ecosystem.config.js with your domain/IP:"
echo "   nano ecosystem.config.js"
echo "   (Change CORS_ORIGIN to your actual domain)"
echo ""
echo "3. Test the application:"
echo "   Open http://your-domain-or-ip in browser"
echo ""
echo "4. View logs:"
echo "   pm2 logs chemist2u-api"
echo ""
print_success "Deployment script completed!"
