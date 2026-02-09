# GitHub Actions Workflows

This directory contains CI/CD workflows for automated deployment.

## Available Workflows

### `deploy.yml` - Main Deployment Pipeline

Automatically deploys the application to Digital Ocean when code is pushed to the `main` branch.

**Triggers:**
- Push to `main` branch
- Manual trigger via workflow_dispatch

**What it does:**
1. Builds the application (frontend + backend)
2. Creates deployment package
3. Uploads to Digital Ocean droplet via SSH
4. Restarts PM2 process
5. Performs health check
6. Reports deployment status

**Required Secrets:**

Configure these in **Settings → Secrets and variables → Actions**:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `DROPLET_HOST` | Droplet IP or domain | `123.456.78.90` |
| `DROPLET_USER` | SSH user (root) | `root` |
| `DROPLET_SSH_KEY` | Private SSH key | `-----BEGIN OPENSSH...` |
| `DROPLET_PORT` | SSH port (default: 22) | `22` |

## Setup Instructions

1. **Generate SSH key pair:**
   ```bash
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/deploy_key
   ```

2. **Add public key to droplet:**
   ```bash
   # Copy public key
   cat ~/.ssh/deploy_key.pub
   
   # On droplet, add to authorized_keys
   echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
   ```

3. **Add private key to GitHub Secrets:**
   - Copy content of `~/.ssh/deploy_key`
   - Add as `DROPLET_SSH_KEY` secret in GitHub

4. **Test deployment:**
   - Push any change to `main` branch
   - Check Actions tab for deployment status
   - Visit your droplet IP to verify

## Monitoring Deployments

- **GitHub Actions:** Check the Actions tab
- **Logs:** View workflow logs for each deployment
- **Health Check:** Automated health check runs after deployment
- **Server Logs:** `ssh root@YOUR_IP` then `pm2 logs`

## Troubleshooting

### Deployment Failed

1. **Check GitHub Actions logs** - View detailed error messages
2. **Verify SSH connection** - Test: `ssh -i ~/.ssh/deploy_key root@YOUR_IP`
3. **Check secrets** - Ensure all GitHub secrets are correct
4. **Server logs** - SSH into server and run `pm2 logs chemist2u-api`

### Health Check Failed

- Backend may take time to start (workflow waits and retries)
- Check PM2 status: `pm2 status`
- Check backend logs: `pm2 logs chemist2u-api`

## Manual Deployment

If CI/CD is unavailable, deploy manually:

```bash
ssh root@YOUR_DROPLET_IP
cd /home/root/apps/chemist2u
git pull origin main
./deploy.sh
```

## Additional Resources

- [Main Deployment Guide](../DEPLOYMENT.md)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SSH Authentication Guide](https://docs.github.com/en/authentication)
