# Deployment Guide for GraphQL Profile Project

This guide will walk you through deploying your GraphQL Profile project to various hosting platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Building for Production](#building-for-production)
3. [GitHub Pages Deployment](#github-pages-deployment)
4. [Netlify Deployment](#netlify-deployment)
5. [Vercel Deployment](#vercel-deployment)
6. [Environment Variables Setup](#environment-variables-setup)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, make sure you have:

- Completed your project development
- A GitHub account (for GitHub Pages or connecting to other services)
- Node.js and npm installed locally
- Updated all API endpoints to point to the correct URLs

## Building for Production

To create an optimized production build:

```bash
# Navigate to your project directory
cd graphql-profile

# Install dependencies (if not already done)
npm install

# Create a production build
npm run build
```

This will create a `build` directory with optimized files ready for deployment.

## GitHub Pages Deployment

GitHub Pages is a free hosting service provided by GitHub:

1. **Install the gh-pages package**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update your package.json**:
   Add homepage field and deployment scripts:
   ```json
   {
     "homepage": "https://yourusername.github.io/graphql-profile",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build",
       ...
     }
   }
   ```

3. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

4. **Configure GitHub Repository**:
   - Go to your repository settings
   - In the GitHub Pages section, ensure the source is set to the gh-pages branch

Note: GitHub Pages serves static content only. Since you're using client-side routing with React, you may need to use HashRouter instead of BrowserRouter for proper navigation.

## Netlify Deployment

Netlify offers continuous deployment and other advanced features:

1. **Create a netlify.toml file** in your project root:
   ```toml
   [build]
     command = "npm run build"
     publish = "build"
     
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy using Netlify CLI**:
   
   a. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
   
   b. Login to Netlify:
   ```bash
   netlify login
   ```
   
   c. Initialize and deploy:
   ```bash
   netlify init
   netlify deploy --prod
   ```

3. **Alternative: Connect GitHub Repository**:
   - Create an account on Netlify
   - Click "New site from Git"
   - Connect to your GitHub repository
   - Configure build settings (Build command: `npm run build`, Publish directory: `build`)

Netlify will automatically redeploy on every push to your GitHub repository.

## Vercel Deployment

Vercel is optimized for frontend frameworks:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy using Vercel CLI**:
   ```bash
   vercel login
   vercel
   ```

3. **Alternative: Connect GitHub Repository**:
   - Create an account on Vercel
   - Import your project from GitHub
   - Configure your project settings

## Environment Variables Setup

For security, configure environment variables on your hosting platform:

1. **Local Development**:
   Create a `.env` file in the project root:
   ```
   REACT_APP_API_URL=https://yourdomain.com/api
   REACT_APP_GRAPHQL_ENDPOINT=https://yourdomain.com/api/graphql-engine/v1/graphql
   ```

2. **Netlify**:
   - Go to Site settings > Build & deploy > Environment
   - Add your variables

3. **Vercel**:
   - Go to Project Settings > Environment Variables
   - Add your variables

4. **Update Code for Environment Variables**:
   Replace hardcoded URLs in your code:
   ```javascript
   // Before
   const API_URL = 'https://yourdomain.com/api';
   
   // After
   const API_URL = process.env.REACT_APP_API_URL;
   ```

## Troubleshooting

### CORS Issues
If you encounter CORS errors:
- Ensure your backend allows requests from your frontend domain
- Use a proxy in development

### Authentication Problems
- Check if your JWT token is being properly stored and sent
- Verify that your authentication endpoints are correct

### Routing Issues
For SPA routing:
- GitHub Pages: Use HashRouter instead of BrowserRouter
- Other platforms: Ensure proper redirect rules are in place (like the Netlify redirect rule above)

### Build Failures
- Check the build logs provided by your hosting platform
- Verify that all dependencies are properly installed
- Ensure your Node.js version is compatible with your project

For more specific issues, consult your hosting platform's documentation or community forums.