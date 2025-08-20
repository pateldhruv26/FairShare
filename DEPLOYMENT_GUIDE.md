# FairShare Deployment Guide

## 🚀 Quick Deployment to Vercel

### Prerequisites
- GitHub repository with your code
- MongoDB Atlas account
- Gmail account (for email notifications)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit for FairShare"
   git push origin main
   ```

2. **Ensure your repository structure looks like this:**
   ```
   fair-share/
   ├── frontend/          # React app
   ├── backend/           # Node.js API
   ├── README.md
   ├── package.json
   └── .gitignore
   ```

### Step 2: Deploy Frontend to Vercel

1. **Go to [Vercel](https://vercel.com) and sign in**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

5. **Add Environment Variables (if needed):**
   - Go to Project Settings → Environment Variables
   - Add any frontend environment variables with `REACT_APP_` prefix

6. **Deploy!**

### Step 3: Deploy Backend

Choose one of these platforms:

#### Option A: Render (Recommended)
1. **Go to [Render](https://render.com)**
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure:**
   - **Name**: `fair-share-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node 18

5. **Add Environment Variables:**
   ```
   MONGO=your_mongodb_atlas_connection_string
   JWT=your_jwt_secret_key
   Email=your_email@gmail.com
   password=your_email_app_password
   PORT=3001
   ```

#### Option B: Railway
1. **Go to [Railway](https://railway.app)**
2. **Create a new project**
3. **Deploy from GitHub**
4. **Set the source directory to `backend`**
5. **Add environment variables**

#### Option C: Heroku
1. **Go to [Heroku](https://heroku.com)**
2. **Create a new app**
3. **Connect to GitHub**
4. **Set buildpack to Node.js**
5. **Add environment variables in Settings**

### Step 4: Update Frontend API URLs

After deploying your backend, update the API base URL in your frontend code:

1. **Find all API calls in your frontend**
2. **Replace localhost URLs with your deployed backend URL**
3. **Redeploy the frontend**

### Step 5: Configure MongoDB Atlas

1. **Log into [MongoDB Atlas](https://cloud.mongodb.com)**
2. **Create a new cluster (if you haven't already)**
3. **Get your connection string**
4. **Add your deployment platform's IP to the whitelist**
5. **Create a database user with read/write permissions**

## 🔧 Environment Variables Setup

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Connection String
MONGO=mongodb+srv://username:password@cluster.mongodb.net/fairshare?retryWrites=true&w=majority

# JWT Secret (generate a secure random string)
JWT=your_super_secure_jwt_secret_key_here

# Email Configuration
Email=your_email@gmail.com
password=your_gmail_app_password

# Server Port
PORT=3001
```

### Generate JWT Secret

Run this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Gmail App Password Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Go to Google Account settings**
3. **Security → 2-Step Verification → App passwords**
4. **Generate a new app password for "Mail"**
5. **Use this password in your .env file**

## 🌐 Domain Configuration

### Custom Domain (Optional)
1. **In Vercel dashboard, go to Settings → Domains**
2. **Add your custom domain**
3. **Configure DNS records as instructed**

### CORS Configuration
Make sure your backend allows requests from your Vercel domain:

```javascript
// In backend/server.js
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

## 📊 Monitoring & Analytics

### Vercel Analytics
- Enable Vercel Analytics in your project settings
- Monitor performance and user behavior

### Error Tracking
- Consider adding Sentry for error tracking
- Monitor your backend logs in your hosting platform

## 🔒 Security Checklist

- [ ] JWT secret is strong and unique
- [ ] MongoDB connection string is secure
- [ ] Environment variables are not committed to Git
- [ ] CORS is properly configured
- [ ] API endpoints are protected where needed
- [ ] Email credentials are secure

## 🚨 Troubleshooting

### Common Issues

1. **Build fails on Vercel**
   - Check that all dependencies are in `dependencies` (not `devDependencies`)
   - Ensure Node.js version is compatible
   - Verify all import paths are correct

2. **API calls fail**
   - Check CORS configuration
   - Verify API base URL is correct
   - Ensure environment variables are set

3. **Database connection fails**
   - Check MongoDB Atlas IP whitelist
   - Verify connection string format
   - Ensure database user has correct permissions

4. **Email sending fails**
   - Check Gmail app password
   - Verify email configuration
   - Check if 2FA is properly set up

### Getting Help

- Check the deployment platform's logs
- Review the application logs
- Test locally first
- Use the browser's developer tools to debug frontend issues

## 📈 Performance Optimization

1. **Enable Vercel's Edge Functions** for better performance
2. **Use CDN for static assets**
3. **Implement proper caching strategies**
4. **Optimize images and assets**
5. **Use lazy loading for components**

## 🔄 Continuous Deployment

Set up automatic deployments:
1. **Connect your GitHub repository**
2. **Enable automatic deployments on push**
3. **Set up preview deployments for pull requests**
4. **Configure deployment notifications**

Your FairShare application should now be successfully deployed and ready to use! 🎉
