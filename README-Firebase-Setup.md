# 🚀 Firebase Setup & Deployment Guide for Isaac Asimov Lab Management

## Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create New Project**:
   - Click "Create a project"
   - Project name: `isaac-asimov-lab-management`
   - Enable Google Analytics (optional but recommended)
   - Choose your Google Analytics account
   - Click "Create project"

## Step 2: Enable Firebase Services

### Authentication Setup
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. **Important**: Disable "Email link (passwordless sign-in)" for now
4. Save changes

### Firestore Database Setup
1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **"Start in test mode"** (we'll add security rules later)
4. Select your preferred region (choose closest to your users)
5. Click "Done"

### Firebase Hosting Setup
1. Go to **Hosting**
2. Click "Get started"
3. Follow the setup instructions (we'll handle this via commands later)

## Step 3: Get Firebase Configuration

1. In Firebase Console, click the **Settings gear** → **Project settings**
2. Scroll down to "Your apps" section
3. Click the **Web app icon** (`</>`)
4. Register app:
   - App nickname: `isaac-asimov-lab-web`
   - ✅ Check "Also set up Firebase Hosting"
   - Click "Register app"
5. **Copy the configuration object** - you'll need this next!

## Step 4: Configure Your App

1. **Create `.env` file** in your project root with your Firebase config:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-actual-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
VITE_FIREBASE_APP_ID=your-actual-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-actual-measurement-id

# Environment
NODE_ENV=production
```

2. **Update Firebase config file** with your actual values

## Step 5: Install Firebase CLI and Deploy

Run these commands in your terminal:

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# When prompted, select:
# - Hosting: Configure files for Firebase Hosting
# - Use existing project: isaac-asimov-lab-management
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds and deploys with GitHub: No (for now)

# Build your project
npm run build

# Deploy to Firebase
firebase deploy
```

## Step 6: Set Up Firestore Security Rules

In Firebase Console → Firestore Database → Rules, replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Components - students can read, admins can write
    match /components/{componentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Requests - users can read/write their own, admins can read/write all
    match /requests/{requestId} {
      allow read, write: if request.auth != null && 
        (resource.data.studentId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null && request.auth.uid == request.resource.data.studentId;
    }
    
    // Notifications - users can read their own
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // Login sessions - admins only
    match /loginSessions/{sessionId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null;
    }
  }
}
```

## Step 7: Update App to Use Firebase

The app is already configured to use Firebase! Just make sure your `.env` file has the correct values.

## Step 8: Test Your Deployment

1. **Your live URL will be**: `https://your-project-id.web.app`
2. **Test the following**:
   - User registration and login
   - Component requests
   - Admin functionality
   - Real-time updates

## Step 9: Set Up Custom Domain (Optional)

1. In Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Firebase will provide SSL certificate automatically

## 🎉 You're Live!

Your Isaac Asimov Lab Management System is now deployed to Firebase with:
- ✅ Real-time database
- ✅ User authentication
- ✅ Secure hosting
- ✅ SSL certificate
- ✅ Global CDN
- ✅ Automatic scaling

## 📱 Next Steps

1. **Create Admin Account**: Register with `admin@issacasimov.in` and password `ralab`
2. **Add Components**: Use the admin panel to add your lab components
3. **Test Student Flow**: Create a student account and test the request process
4. **Monitor Usage**: Check Firebase Console for analytics and usage

## 🔧 Maintenance Commands

```bash
# Redeploy after changes
npm run build && firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# View deployment history
firebase hosting:channel:list

# Set up staging environment
firebase hosting:channel:deploy staging
```

## 🆘 Troubleshooting

### Common Issues:
1. **Build fails**: Check that all environment variables are set correctly
2. **Authentication not working**: Verify Firebase config in `.env`
3. **Database permission denied**: Check Firestore security rules
4. **Deployment fails**: Ensure Firebase CLI is logged in (`firebase login`)

### Getting Help:
- Firebase Console → Support
- Check browser developer console for errors
- Verify all Firebase services are enabled
- Test with Firebase emulators for development

---

**🎊 Congratulations! Your lab management system is now live and ready for students to use!**