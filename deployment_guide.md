# Confidence Builder SaaS Application - Deployment Guide

This document provides instructions for deploying the Child Confidence Builder SaaS application to a production environment.

## Prerequisites

- Node.js (v16.x or later)
- MongoDB database (Atlas or self-hosted)
- Git
- Render.com account (or alternative hosting provider)

## Local Deployment

1. Clone the repository:
```bash
git clone https://github.com/your-username/confidence-builder-app.git
cd confidence-builder-app
```

2. Install dependencies:
```bash
npm install
cd client
npm install
cd ..
```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=24h
   ```

4. Seed the database with initial data:
```bash
npm run seed
```

5. Run the application in development mode:
```bash
npm run dev
```

## Production Deployment to Render.com

1. Create a new Web Service on Render.com:
   - Connect your GitHub repository
   - Select the "confidence-builder-app" repository
   - Name: "confidence-builder-app"
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

2. Configure environment variables in Render.com:
   - Add all the environment variables from your `.env` file
   - Make sure to set `NODE_ENV=production`

3. Create a MongoDB database:
   - You can use Render's MongoDB service or MongoDB Atlas
   - Add the connection string to your environment variables as `MONGO_URI`

4. Deploy the application:
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

5. Access your application:
   - Once deployment is complete, your application will be available at the URL provided by Render

## Alternative Deployment Options

### Heroku

1. Install the Heroku CLI and log in:
```bash
npm install -g heroku
heroku login
```

2. Create a new Heroku app:
```bash
heroku create confidence-builder-app
```

3. Add a MongoDB add-on:
```bash
heroku addons:create mongodb:sandbox
```

4. Configure environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set JWT_EXPIRE=24h
```

5. Deploy the application:
```bash
git push heroku main
```

### AWS Elastic Beanstalk

1. Install the AWS CLI and EB CLI:
```bash
pip install awscli
pip install awsebcli
```

2. Configure AWS credentials:
```bash
aws configure
```

3. Initialize Elastic Beanstalk:
```bash
eb init
```

4. Create an environment:
```bash
eb create confidence-builder-env
```

5. Configure environment variables:
```bash
eb setenv NODE_ENV=production MONGO_URI=your_mongodb_connection_string JWT_SECRET=your_jwt_secret JWT_EXPIRE=24h
```

6. Deploy the application:
```bash
eb deploy
```

## Maintenance and Updates

1. To update the application:
   - Make changes to your code
   - Test locally
   - Commit and push to your repository
   - The hosting provider will automatically rebuild and deploy

2. To monitor the application:
   - Use the hosting provider's monitoring tools
   - Check the application logs
   - Set up alerts for errors or performance issues

3. To scale the application:
   - Increase the number of instances
   - Upgrade the database plan
   - Implement caching with Redis

## Troubleshooting

- If the application fails to build, check the build logs for errors
- If the application fails to start, check the application logs
- If the database connection fails, verify the connection string
- If authentication fails, check the JWT secret and expiration time
