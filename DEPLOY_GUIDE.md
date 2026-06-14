# Teddy Bot V2 - Deployment Guide

## Quick Start - Deploy to Railway (Recommended)

### Step 1: Prepare GitHub
Code is already on main branch at: `https://github.com/wen-lin210/teddy-v2`

### Step 2: Go to Railway
1. Visit: https://railway.app
2. Sign up/Login with GitHub
3. Click "Create New Project"
4. Select "Deploy from GitHub repo"
5. Authorize GitHub → Select `wen-lin210/teddy-v2`

### Step 3: Configure Project
1. Select branch: `main`
2. Railway auto-detects Procfile
3. Build Command: `npm install`
4. Start Command: `cd web-gui && node server.js`

### Step 4: Add Environment Variables
In Railway Dashboard → Variables, add:

```
JWT_SECRET = teddy-bot-super-secret-key-2024-change-this
PORT = 3000
NODE_ENV = production
```

### Step 5: Deploy
Click "Deploy" and wait. You'll get a public URL like:
```
https://teddy-bot-xxx.railway.app
```

### Step 6: Access Your App
- Login Page: `https://teddy-bot-xxx.railway.app/auth.html`
- Dashboard: `https://teddy-bot-xxx.railway.app/dashboard.html`

---

## Default Admin Account

Email: `admin@teddy-bot.com`
Password: Check bcryptjs hash in `web-gui/data/users.json`

OR create new account via signup form.

---

## Environment Variables Needed

```
JWT_SECRET          = Your secret key for JWT tokens (change in production!)
PORT               = 3000 (default, Railway handles this)
NODE_ENV           = production
```

---

## File Structure on Deployed Server

```
web-gui/
├── server.js       (Main Express app)
├── public/
│   ├── auth.html   (Login/Signup page)
│   ├── auth.css    (Login styles)
│   ├── auth.js     (Login logic)
│   ├── dashboard.html
│   ├── dashboard.css
│   ├── dashboard.js
│   └── images/
│       └── profile.jpg (Favicon)
└── data/
    ├── users.json  (User accounts)
    ├── tiers.json  (Permission levels)
    ├── keys.json   (Upgrade keys)
    └── playlist.json (Music data)
```

---

## Troubleshooting

### 502 Bad Gateway
- Check if PORT is set correctly
- Check NODE_ENV = production
- Check JWT_SECRET is set

### Can't Login
- Make sure users.json exists in data/ folder
- Check database files are readable

### Static Files Not Loading
- Verify auth.html, dashboard.html are in web-gui/public/
- Check nginx/reverse proxy settings

### Cannot Modify Data
- Ensure web-gui/data/ folder has write permissions
- On Railway, data persists in ephemeral storage (lost on redeploy)
- For persistent data, use MongoDB or PostgreSQL

---

## Security Notes for Production

1. Change `JWT_SECRET` to a strong random string
2. Use HTTPS (Railway provides this by default)
3. Consider adding rate limiting to /api/auth endpoints
4. Add CORS headers if accessing from different domain
5. Use environment variables for sensitive data
6. Regularly backup users.json and other data files

---

## Alternative Deployment Options

### Vercel (Express apps less supported)
```bash
npm install -g vercel
vercel --prod
```

### Render
1. Go to render.com
2. Create Web Service
3. Connect GitHub repo
4. Build: `npm install`
5. Start: `cd web-gui && node server.js`

### Heroku (Recommended Alternative)
```bash
heroku login
heroku create teddy-bot-v2
git push heroku main
```

---

## Monitor Your Deployment

Railway Dashboard shows:
- Real-time logs
- Memory/CPU usage
- Uptime stats
- Network activity

Check regularly for errors and performance issues!
