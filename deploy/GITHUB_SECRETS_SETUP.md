# GitHub Secrets Setup - Quick Reference

This guide helps you quickly set up the required GitHub secrets for EC2 deployment.

## Step-by-Step Instructions

### 1. Access GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### 2. Add Each Secret

Add the following secrets one by one:

#### Secret 1: `EC2_HOST`

**Description:** Your EC2 instance's public IP address or domain name

**How to find it:**
- AWS Console → EC2 → Instances → Select your instance → Check "Public IPv4 address"
- Or use your domain name if you've set up DNS

**Example values:**
```
ec2-12-34-56-78.compute-1.amazonaws.com
```
or
```
123.45.67.89
```
or
```
your-domain.com
```

---

#### Secret 2: `EC2_USER`

**Description:** SSH username for your EC2 instance

**Common values:**
- `ubuntu` (for Ubuntu AMI)
- `ec2-user` (for Amazon Linux)
- `admin` (for some Debian-based AMIs)

**How to find it:**
- Check your EC2 instance details in AWS Console
- Or check the AMI documentation

**Example value:**
```
ubuntu
```

---

#### Secret 3: `EC2_SSH_KEY`

**Description:** Your private SSH key content (the entire key file)

**How to get it:**

**Option A: If you already have a key pair:**

1. On your local machine, open your private key file:
   ```bash
   cat ~/.ssh/your-key-name.pem
   ```
   or
   ```bash
   cat ~/.ssh/id_rsa
   ```

2. Copy the **entire** output, including:
   - `-----BEGIN RSA PRIVATE KEY-----` (or `-----BEGIN OPENSSH PRIVATE KEY-----`)
   - All the key content in between
   - `-----END RSA PRIVATE KEY-----` (or `-----END OPENSSH PRIVATE KEY-----`)

3. Paste it as the secret value

**Option B: Create a new key pair for deployment:**

1. Generate a new key pair:
   ```bash
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/ec2-deploy-key -N ""
   ```

2. Copy the public key to your EC2 instance:
   ```bash
   ssh-copy-id -i ~/.ssh/ec2-deploy-key.pub your-user@your-ec2-ip
   ```
   
   Or manually:
   ```bash
   cat ~/.ssh/ec2-deploy-key.pub | ssh your-user@your-ec2-ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
   ```

3. Copy the private key content:
   ```bash
   cat ~/.ssh/ec2-deploy-key
   ```

4. Paste the entire output as the secret value

**Important:** 
- Include the BEGIN and END lines
- Don't add any extra spaces or line breaks
- The key should look like this:
  ```
  -----BEGIN RSA PRIVATE KEY-----
  MIIEpAIBAAKCAQEA...
  (many lines of encoded data)
  ...
  -----END RSA PRIVATE KEY-----
  ```

---

#### Secret 4: `EC2_DEPLOY_PATH`

**Description:** Path on EC2 where deployments will be stored

**Default value:**
```
/var/www/email-builder
```

**Custom value:** If you used a different path when running the setup script, use that path.

---

## Verification Checklist

After adding all secrets, verify:

- [ ] All 4 secrets are listed in your repository secrets
- [ ] `EC2_HOST` matches your EC2 instance's public IP or domain
- [ ] `EC2_USER` matches your EC2 instance's username
- [ ] `EC2_SSH_KEY` includes the BEGIN and END lines
- [ ] `EC2_DEPLOY_PATH` matches the path you set up on EC2

## Test Connection

You can test your SSH connection locally before deploying:

```bash
# Test SSH connection
ssh -i ~/.ssh/your-key.pem your-user@your-ec2-ip

# Or if using the new key
ssh -i ~/.ssh/ec2-deploy-key your-user@your-ec2-ip
```

If you can connect successfully, your secrets should work in GitHub Actions.

## Troubleshooting

### "Permission denied (publickey)" error

- Verify `EC2_SSH_KEY` includes the BEGIN/END lines
- Check that the public key is in `~/.ssh/authorized_keys` on EC2
- Verify `EC2_USER` is correct

### "Host key verification failed" error

- This is usually handled automatically by the workflow
- If persistent, check that `EC2_HOST` is correct

### "Connection refused" error

- Check EC2 security group allows SSH (port 22) from GitHub Actions IPs
- Verify `EC2_HOST` is correct
- Check if your EC2 instance is running

## Security Best Practices

1. **Never commit SSH keys** to your repository
2. **Use a dedicated deployment key** instead of your personal SSH key
3. **Rotate keys regularly** for better security
4. **Restrict EC2 security group** to only allow necessary IPs (or use a bastion host)
5. **Use IAM roles** when possible instead of storing credentials

## Next Steps

After setting up secrets:
1. Run the EC2 setup script: `./deploy/ec2-setup.sh`
2. Configure your `.env` file on EC2
3. Push a commit to `main` branch to trigger deployment
4. Check the Actions tab to monitor deployment
