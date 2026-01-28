# EC2 Deployment Setup Guide

This guide walks you through setting up automated deployments from GitHub Actions to your AWS EC2 server.

## Prerequisites

- AWS EC2 instance running Ubuntu (or similar Linux distribution)
- SSH access to your EC2 instance
- Node.js 20+ installed on EC2
- PostgreSQL database accessible from EC2
- GitHub repository with Actions enabled

## Step 1: EC2 Server Setup

### 1.1 Install Node.js and npm

```bash
# SSH into your EC2 instance
ssh your-user@your-ec2-ip

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be v20.x.x
npm --version
```

### 1.2 Install PM2 (Process Manager)

PM2 is recommended for managing the Node.js API process:

```bash
sudo npm install -g pm2
```

### 1.3 Install Nginx (for serving frontend)

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

### 1.4 Set Up Deployment Directory

```bash
# Create deployment directory
sudo mkdir -p /var/www/email-builder
sudo chown $USER:$USER /var/www/email-builder
cd /var/www/email-builder
mkdir -p current backup
```

### 1.5 Set Up Environment Variables

Create a `.env` file for the API:

```bash
cd /var/www/email-builder/current/api
nano .env
```

Add your environment variables:

```env
DATABASE_URL=postgresql://user:password@your-db-host:5432/email_builder
PORT=3001
CORS_ORIGIN=https://your-domain.com
NODE_ENV=production
```

**Important:** Make sure this `.env` file persists across deployments. You may want to store it outside the deployment directory and symlink it.

### 1.6 Configure Nginx

Create an Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/email-builder
```

Add the following configuration (adjust domain names as needed):

```nginx
# Frontend (editor-sample)
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /var/www/email-builder/current/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/email-builder /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### 1.7 Set Up PM2 Ecosystem File

Create a PM2 ecosystem file:

```bash
cd /var/www/email-builder
nano ecosystem.config.js
```

Add:

```javascript
module.exports = {
  apps: [{
    name: 'email-builder-api',
    script: './current/api/dist/index.js',
    cwd: '/var/www/email-builder',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/api-error.log',
    out_file: './logs/api-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

Create logs directory:

```bash
mkdir -p /var/www/email-builder/logs
```

### 1.8 Set Up SSL (Optional but Recommended)

If you have a domain name, set up Let's Encrypt SSL:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Step 2: GitHub Secrets Configuration

You need to add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

### Required Secrets

- **`EC2_HOST`**: Your EC2 instance's public IP or domain name
  - Example: `ec2-12-34-56-78.compute-1.amazonaws.com` or `123.45.67.89`

- **`EC2_USER`**: SSH username for your EC2 instance
  - Example: `ubuntu` (for Ubuntu AMI) or `ec2-user` (for Amazon Linux)

- **`EC2_SSH_KEY`**: Your private SSH key content
  - Copy the entire contents of your private key file (usually `~/.ssh/your-key.pem`)
  - Include the `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` lines

- **`EC2_DEPLOY_PATH`**: Path on EC2 where deployments will be stored
  - Example: `/var/www/email-builder`

## Step 3: SSH Key Setup

### Option A: Use Existing SSH Key

If you already have an SSH key pair:

1. Copy your private key content to GitHub secret `EC2_SSH_KEY`
2. Make sure your public key is in `~/.ssh/authorized_keys` on the EC2 instance

### Option B: Create New SSH Key Pair

1. **On your local machine**, generate a new key pair:

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/ec2-deploy-key -N ""
```

2. **Copy the public key to EC2**:

```bash
ssh-copy-id -i ~/.ssh/ec2-deploy-key.pub your-user@your-ec2-ip
```

Or manually:

```bash
# On EC2, add to authorized_keys
cat ~/.ssh/ec2-deploy-key.pub | ssh your-user@your-ec2-ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

3. **Add private key to GitHub**:
   - Copy the contents of `~/.ssh/ec2-deploy-key` (the private key)
   - Add as GitHub secret `EC2_SSH_KEY`

## Step 4: Test Deployment

### Manual Test

1. Push a commit to the `main` branch
2. Go to your GitHub repository → **Actions** tab
3. Watch the deployment workflow run
4. Check logs if there are any errors

### Verify Deployment

After deployment completes:

```bash
# SSH into EC2
ssh your-user@your-ec2-ip

# Check if API is running
pm2 status
pm2 logs email-builder-api

# Check frontend files
ls -la /var/www/email-builder/current/frontend

# Test API endpoint
curl http://localhost:3001/api/health

# Test frontend (if nginx is configured)
curl http://localhost
```

## Step 5: Post-Deployment Checklist

- [ ] API is running and responding to health checks
- [ ] Frontend files are in place
- [ ] Nginx is serving the frontend correctly
- [ ] API endpoints are accessible through Nginx proxy
- [ ] Database connection is working
- [ ] Environment variables are set correctly
- [ ] PM2 is configured to auto-restart on server reboot

## Troubleshooting

### Deployment Fails: SSH Connection

- Verify `EC2_HOST` and `EC2_USER` are correct
- Check that your EC2 security group allows SSH (port 22) from GitHub Actions IPs
- Verify the SSH key is correct and has proper permissions

### API Not Starting

- Check PM2 logs: `pm2 logs email-builder-api`
- Verify environment variables are set: `pm2 env email-builder-api`
- Check database connection: Ensure `DATABASE_URL` is correct and database is accessible

### Frontend Not Loading

- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- Verify files exist: `ls -la /var/www/email-builder/current/frontend`
- Check Nginx configuration: `sudo nginx -t`

### Permission Issues

- Ensure deployment directory is owned by the correct user:
  ```bash
  sudo chown -R $USER:$USER /var/www/email-builder
  ```

## Alternative: Using systemd Instead of PM2

If you prefer systemd over PM2, create a service file:

```bash
sudo nano /etc/systemd/system/email-builder-api.service
```

Add:

```ini
[Unit]
Description=Email Builder API
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/var/www/email-builder/current/api
Environment=NODE_ENV=production
EnvironmentFile=/var/www/email-builder/current/api/.env
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=email-builder-api

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable email-builder-api
sudo systemctl start email-builder-api
```

Then update the deployment workflow to use `systemctl restart email-builder-api` instead of PM2 commands.

## Security Considerations

1. **Firewall**: Configure EC2 security groups to only allow necessary ports (80, 443, 22)
2. **SSH Key**: Never commit SSH keys to the repository
3. **Environment Variables**: Store sensitive data in `.env` files, not in code
4. **Database**: Use strong passwords and restrict database access
5. **SSL**: Always use HTTPS in production
6. **Updates**: Keep your EC2 instance and dependencies updated

## Next Steps

- Set up monitoring and alerting
- Configure log rotation
- Set up automated backups
- Configure CloudWatch or similar monitoring
- Set up staging environment for testing before production
