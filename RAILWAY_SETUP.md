# Railway Setup - Teddy Bot V2 Deploy Guide

## What is Railway?

Railway.app is a simple cloud platform to deploy applications. Perfect for Node.js apps!

---

## Step-by-Step Guide

### Step 1: Create Railway Account

1. Go to: https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub
4. Done! You're now logged in

---

### Step 2: Create New Project

1. In Railway Dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Click **"Configure GitHub App"** (if first time)
   - Authorize Railway on GitHub
   - Grant access to your repositories
4. Select repo: **`wen-lin210/teddy-v2`**
5. Choose branch: **`main`**
6. Click **"Deploy"**

Railway will:
- Clone your repo
- Read Procfile
- Install dependencies
- Start the server

---

### Step 3: Configure Environment Variables

**IMPORTANT**: Set these before deployment!

1. In Railway Dashboard, click your project
2. Go to **"Variables"** tab
3. Click **"New Variable"** and add these:

```
Variable Name          | Value
JWT_SECRET            | teddy-bot-secret-2024-change-this
NODE_ENV              | production
```

That's it! Railway auto-provides PORT and other variables.

---

### Step 4: Check Deployment Status

1. Go to **"Logs"** tab to see real-time build logs
2. Look for message like:
   ```
   ========================================
   ✓ Teddy Bot V2 - Web Panel Started
   Port: 3000
   ========================================
   ```
3. When you see this → Deployment is successful!

---

### Step 5: Get Your Public URL

1. Click on your service (teddy-v2)
2. Scroll down to **"Networking"**
3. Copy the **Public URL** (looks like: `https://teddy-v2-xxx.railway.app`)

**Your app is now live!**

---

## Accessing Your Deployed App

### Login Page:
```
https://teddy-v2-xxx.railway.app/auth.html
```

### Dashboard:
```
https://teddy-v2-xxx.railway.app/dashboard.html
```

### API Endpoints:
```
https://teddy-v2-xxx.railway.app/api/auth/login
https://teddy-v2-xxx.railway.app/api/auth/signup
https://teddy-v2-xxx.railway.app/api/tiers
```

---

## Default Login

**Email**: `admin@teddy-bot.com`

**Password**: Check in `web-gui/data/users.json` (bcryptjs hash)

OR create new account via signup form.

---

## Railway Environment Variables Available

These are automatically provided by Railway:

```
RAILWAY_PRIVATE_DOMAIN    = teddy-v2.railway.internal
RAILWAY_PROJECT_NAME      = cheerful-luck
RAILWAY_ENVIRONMENT_NAME  = production
RAILWAY_SERVICE_NAME      = teddy-v2
RAILWAY_PROJECT_ID        = f544075e-3ce0-41de-872c-5a72a2f10f26
RAILWAY_ENVIRONMENT_ID    = ***
RAILWAY_SERVICE_ID        = ***
```

You don't need to set these yourself - Railway handles it!

---

## Monitoring & Logs

### Check Logs:
1. Go to your Railway project
2. Click **"Logs"** tab
3. See real-time server logs

### Monitor Deployment:
1. Click **"Deployments"** to see deploy history
2. Each deployment shows status (Success/Failed)
3. Can rollback to previous version if needed

### Check Metrics:
1. Go to **"Analytics"** tab
2. See CPU, Memory, Network usage
3. Monitor uptime

---

## Common Issues & Fixes

### Issue: 502 Bad Gateway
**Cause**: Server crashed or not responding

**Fix**:
1. Check "Logs" tab for errors
2. Ensure JWT_SECRET is set
3. Verify Procfile: `cd web-gui && node server.js`
4. Click "Redeploy" button

### Issue: Can't access `/api/auth/login`
**Cause**: Routes not configured properly

**Fix**:
1. Check server.js imports
2. Verify routes are exported
3. Check logs for syntax errors

### Issue: Data not persisting
**Cause**: Railway uses ephemeral storage (lost on redeploy)

**Solution**:
1. For small apps: data.json files work fine
2. For production: Connect MongoDB or PostgreSQL
3. Use Railway's Data Storage service

### Issue: Port already in use
**Cause**: PORT hardcoded to 3000

**Fix**: Already done! We use `process.env.PORT || 3000`

---

## Redeploy Your App

To push updates:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Railway automatically redeploys when you push to main branch!

Or manually click **"Redeploy"** in Railway dashboard.

---

## Delete or Stop Deployment

**To delete project**:
1. Go to project settings
2. Click "Delete project"
3. Confirm deletion

**To pause (don't delete)**:
1. In service settings
2. Click "Pause service"
3. Later: Click "Resume"

---

## Custom Domain (Optional)

Want your own domain instead of railway.app?

1. Go to **"Networking"**
2. Click **"Custom Domain"**
3. Add your domain: `teddy-bot.com`
4. Follow DNS setup instructions
5. Done!

---

## Pro Tips

1. **Keep logs clean**: Remove console.log spam
2. **Use environment variables**: Never hardcode secrets
3. **Monitor regularly**: Check logs weekly
4. **Backup data**: Download users.json regularly if critical
5. **Set up alerts**: Railway can email on failures

---

## Next Steps

1. ✅ Code pushed to GitHub main branch
2. ✅ Created Railway account
3. ✅ Deployed app
4. ✅ Got public URL
5. Next: Share URL with users!

**Example**: "Go to `https://teddy-v2-xxx.railway.app/auth.html` to access Teddy Bot Panel"

---

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Project Repo: https://github.com/wen-lin210/teddy-v2
