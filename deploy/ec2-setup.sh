#!/bin/bash
# EC2 Server Setup Script
# Run this script on your EC2 instance to set up the deployment environment

set -e

echo "🚀 Setting up EC2 deployment environment..."

# Configuration
DEPLOY_PATH="/var/www/email-builder"
API_USER="${USER:-ubuntu}"

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo "❌ Please run this script as a regular user (not root)"
   exit 1
fi

# Install Node.js 20
echo "📦 Installing Node.js 20..."
if ! command -v node &> /dev/null || [ "$(node --version | cut -d'v' -f2 | cut -d'.' -f1)" -lt 20 ]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✅ Node.js $(node --version) already installed"
fi

# Install PM2
echo "📦 Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
else
    echo "✅ PM2 already installed"
fi

# Install Nginx
echo "📦 Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y nginx
else
    echo "✅ Nginx already installed"
fi

# Create deployment directory
echo "📁 Creating deployment directory..."
sudo mkdir -p "$DEPLOY_PATH"
sudo chown "$API_USER:$API_USER" "$DEPLOY_PATH"
mkdir -p "$DEPLOY_PATH/current" "$DEPLOY_PATH/backup" "$DEPLOY_PATH/logs"

# Create PM2 ecosystem file
echo "📝 Creating PM2 ecosystem file..."
cat > "$DEPLOY_PATH/ecosystem.config.js" << 'EOF'
module.exports = {
  apps: [{
    name: 'email-builder-api',
    script: './current/api/index.js',
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
EOF

# Create .env template
echo "📝 Creating .env template..."
cat > "$DEPLOY_PATH/current/api/.env.example" << 'EOF'
DATABASE_URL=postgresql://user:password@localhost:5432/email_builder
PORT=3001
CORS_ORIGIN=http://localhost
NODE_ENV=production
EOF

if [ ! -f "$DEPLOY_PATH/current/api/.env" ]; then
    cp "$DEPLOY_PATH/current/api/.env.example" "$DEPLOY_PATH/current/api/.env"
    echo "⚠️  Please edit $DEPLOY_PATH/current/api/.env with your actual configuration"
fi

# Create Nginx configuration template
echo "📝 Creating Nginx configuration template..."
sudo tee /etc/nginx/sites-available/email-builder > /dev/null << 'EOF'
# Frontend (editor-sample)
server {
    listen 80;
    server_name _;  # Replace with your domain

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
EOF

# Enable Nginx site
if [ ! -L /etc/nginx/sites-enabled/email-builder ]; then
    sudo ln -s /etc/nginx/sites-available/email-builder /etc/nginx/sites-enabled/
    # Remove default site if it exists
    sudo rm -f /etc/nginx/sites-enabled/default
fi

# Test Nginx configuration
echo "🔍 Testing Nginx configuration..."
sudo nginx -t

# Setup PM2 startup script
echo "🔧 Setting up PM2 startup script..."
pm2 startup systemd -u "$API_USER" --hp "/home/$API_USER" || true

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit $DEPLOY_PATH/current/api/.env with your database and configuration"
echo "2. Edit /etc/nginx/sites-available/email-builder and replace 'server_name _;' with your domain"
echo "3. Restart Nginx: sudo systemctl restart nginx"
echo "4. Configure GitHub secrets (see EC2_DEPLOYMENT_SETUP.md)"
echo "5. Run your first deployment!"
