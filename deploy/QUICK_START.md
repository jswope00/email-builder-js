# EC2 Deployment Quick Start

This is a condensed guide to get your EC2 deployment up and running quickly. For detailed information, see `EC2_DEPLOYMENT_SETUP.md`.

## Prerequisites Checklist

- [ ] AWS EC2 instance running Ubuntu/Linux
- [ ] SSH access to EC2 instance
- [ ] PostgreSQL database accessible from EC2
- [ ] GitHub repository with Actions enabled

## Quick Setup (5 Steps)

### Step 1: Run Setup Script on EC2

```bash
# SSH into your EC2 instance
ssh your-user@your-ec2-ip

# Download and run the setup script
curl -o ec2-setup.sh https://raw.githubusercontent.com/your-org/email-builder-js/main/deploy/ec2-setup.sh
# OR copy the file from your local machine:
# scp deploy/ec2-setup.sh your-user@your-ec2-ip:~/

# Make it executable and run
chmod +x ec2-setup.sh
./ec2-setup.sh
```

### Step 2: Configure Environment Variables

```bash
# On EC2, edit the .env file
nano /var/www/email-builder/current/api/.env
```

Update with your values:
```env
DATABASE_URL=postgresql://user:password@your-db-host:5432/email_builder
PORT=3001
CORS_ORIGIN=https://your-domain.com
NODE_ENV=production
```

### Step 3: Configure Nginx (if using a domain)

```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/email-builder

# Replace 'server_name _;' with your domain
# server_name your-domain.com www.your-domain.com;

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: Set Up GitHub Secrets

Go to: **GitHub Repo → Settings → Secrets and variables → Actions**

Add these 4 secrets (see `GITHUB_SECRETS_SETUP.md` for details):

1. **`EC2_HOST`** - Your EC2 IP or domain (e.g., `123.45.67.89`)
2. **`EC2_USER`** - SSH username (e.g., `ubuntu`)
3. **`EC2_SSH_KEY`** - Your private SSH key (entire content)
4. **`EC2_DEPLOY_PATH`** - Deployment path (e.g., `/var/www/email-builder`)

### Step 5: Deploy!

```bash
# Push to main branch
git push origin main

# Or manually trigger: GitHub Repo → Actions → Deploy to EC2 → Run workflow
```

## Verify Deployment

```bash
# SSH into EC2
ssh your-user@your-ec2-ip

# Check API status
pm2 status
pm2 logs email-builder-api

# Test API
curl http://localhost:3001/api/health

# Check frontend files
ls -la /var/www/email-builder/current/frontend
```

## Common Issues

### SSH Connection Fails
- Verify `EC2_HOST` and `EC2_USER` secrets are correct
- Check EC2 security group allows SSH (port 22)
- Ensure SSH key is properly formatted in GitHub secrets

### API Not Starting
- Check `.env` file exists and has correct values
- Check PM2 logs: `pm2 logs email-builder-api`
- Verify database connection: `DATABASE_URL` is correct

### Frontend Not Loading
- Check Nginx: `sudo nginx -t`
- Verify files exist: `ls -la /var/www/email-builder/current/frontend`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

## File Structure

```
/var/www/email-builder/
├── current/              # Current deployment
│   ├── frontend/        # Built frontend files
│   └── api/             # Built API files
│       ├── dist/        # Compiled JavaScript
│       ├── package.json
│       └── .env         # Environment variables
├── backup-YYYYMMDD-HHMMSS/  # Previous deployments
├── logs/                # PM2 logs
└── ecosystem.config.js  # PM2 configuration
```

## Next Steps

- Set up SSL with Let's Encrypt
- Configure monitoring and alerts
- Set up automated backups
- Review security best practices

For detailed information, see:
- `EC2_DEPLOYMENT_SETUP.md` - Complete setup guide
- `GITHUB_SECRETS_SETUP.md` - GitHub secrets details
- `.github/workflows/deploy-ec2.yaml` - Deployment workflow
