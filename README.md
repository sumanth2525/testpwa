# Life Productivity Hub

A comprehensive Progressive Web App (PWA) that combines **Task Management**, **Note-Taking**, and **Finance Tracking** into a single, powerful productivity tool. Built with React Native Web and Expo for cross-platform compatibility.

## 🚀 Features

### 📋 Task Management
- Create, edit, delete, and complete tasks
- Add due dates, priorities, and categories
- Filter tasks by category and status
- Track overdue and upcoming tasks
- Priority-based task sorting

### 📝 Note-Taking
- Rich text notes with categories and tags
- Color-coded notes for better organization
- Pin important notes
- Search and filter functionality
- Multiple note categories (Ideas, Meetings, Journal, etc.)

### 💰 Finance Tracking
- Track income and expenses
- Categorize transactions (Food, Rent, Salary, etc.)
- Recurring transaction support
- Visual charts and analytics
- Monthly financial summaries
- CSV import/export capabilities

### 📊 Dashboard & Analytics
- Overview of tasks, notes, and financials
- Interactive charts and graphs
- Task completion rates
- Spending trends and patterns
- Quick insights and recommendations

### 🔧 PWA Features
- **Installable** on desktop and mobile devices
- **Offline-first** with data synchronization
- **Responsive design** for all screen sizes
- **Push notifications** for reminders
- **Service worker** for caching and offline functionality

## 🛠️ Tech Stack

- **Frontend**: React Native Web + Expo
- **Styling**: React Native StyleSheet (with responsive design)
- **State Management**: Zustand
- **Data Layer**: React Query (offline caching)
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **Charts**: Victory Charts
- **Testing**: Jest + React Testing Library
- **TypeScript**: Strict mode enabled

## 📱 Supported Platforms

- **Web**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS and Android (via Expo)
- **Desktop**: Windows, macOS, Linux (as PWA)

## 🏗️ Project Structure

```
life-productivity-hub/
├── app/                    # Pages & routes (Expo Router)
│   ├── index.tsx          # Dashboard/Home page
│   ├── tasks.tsx          # Task management page
│   ├── notes.tsx          # Note-taking page
│   ├── finance.tsx        # Finance tracking page
│   └── dashboard.tsx      # Analytics dashboard
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── services/             # Business logic & stores
│   └── stores.ts         # Zustand stores
├── config/               # Firebase & app configuration
│   └── firebase.ts       # Firebase setup & temp storage
├── types/                # TypeScript type definitions
│   └── index.ts          # All type definitions
├── utils/                # Utility functions
│   └── index.ts          # Helper functions
├── public/               # PWA assets
│   ├── manifest.json     # PWA manifest
│   └── sw.js            # Service worker
└── assets/              # Images and icons
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd life-productivity-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run web
   ```

4. **Open in browser**
   - Navigate to `http://localhost:8081` (or the URL shown in terminal)

### Firebase Setup (Optional)

The app currently uses temporary storage for development. To enable Firebase:

1. **Create a Firebase project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project

2. **Update configuration**
   - Edit `config/firebase.ts`
   - Replace the placeholder config with your Firebase credentials

3. **Enable services**
   - Authentication
   - Firestore Database
   - Storage
   - Functions (optional)

## 📱 Building & Deployment

### Web Build
```bash
npm run build:web
```

### Mobile Builds
```bash
# Android
npm run build:android

# iOS (requires macOS)
npm run build:ios
```

### Deployment Options

#### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build:web
firebase deploy
```

#### Vercel
```bash
npm install -g vercel
npm run build:web
vercel --prod
```

#### Netlify
```bash
npm run build:web
# Upload dist/ folder to Netlify
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check
```

## 📊 Features Overview

### Task Management
- ✅ Create tasks with title, description, priority, category, and due date
- ✅ Mark tasks as complete/incomplete
- ✅ Filter by category (Work, Personal, Health, Learning, Finance, Other)
- ✅ Priority levels (Low, Medium, High, Urgent)
- ✅ Overdue task detection
- ✅ Upcoming task notifications

### Note-Taking
- ✅ Rich text notes with categories
- ✅ Color-coded notes (8 different colors)
- ✅ Tag system for better organization
- ✅ Pin important notes
- ✅ Search functionality
- ✅ Categories: Ideas, Meetings, Journal, Reference, Todo, Other

### Finance Tracking
- ✅ Income and expense tracking
- ✅ Transaction categorization
- ✅ Monthly summaries
- ✅ Visual charts and analytics
- ✅ Recurring transaction support
- ✅ Financial insights and trends

### Dashboard & Analytics
- ✅ Task completion rates
- ✅ Financial overview
- ✅ Spending by category charts
- ✅ Monthly trend analysis
- ✅ Quick insights and recommendations

### PWA Features
- ✅ Installable on all platforms
- ✅ Offline functionality
- ✅ Service worker caching
- ✅ Push notifications
- ✅ Responsive design
- ✅ App shortcuts

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### App Configuration
Edit `app.json` to customize:
- App name and description
- Icons and splash screens
- PWA settings
- Platform-specific configurations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [React Native Web](https://necolas.github.io/react-native-web/) for web compatibility
- [Victory Charts](https://formidable.com/open-source/victory/) for beautiful charts
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [Firebase](https://firebase.google.com/) for backend services

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Built with ❤️ for productivity enthusiasts**
