# PStream Mobile App

A React Native mobile application for PStream.

## Tech Stack

- **React Native** (v0.82.1) - Bare React Native (not Expo)
- **TypeScript** (v5.8.3) - Type safety
- **React Navigation** (v7) - Navigation library
  - Bottom Tabs Navigator
  - Native Stack Navigator

## Project Structure

```
app/
├── api/           # API clients and services
├── assets/        # Images, fonts, and other static assets
├── components/    # Reusable React components
├── hooks/         # Custom React hooks
├── navigation/    # Navigation configuration
├── screens/       # Screen components
├── services/      # Business logic and services
├── store/         # State management
├── android/       # Android native code
└── ios/           # iOS native code
```

## Navigation Structure

### Bottom Tabs
- **Home** - Main feed/home screen
- **Search** - Search functionality
- **Library** - User's saved content
- **Settings** - App settings

### Stack Screens
- **Details** - Detail view for content
- **Player** - Media player screen

## Getting Started

### Prerequisites

- Node.js >= 20
- npm or yarn
- For iOS: Xcode, CocoaPods
- For Android: Android Studio, JDK

### Installation

```bash
cd app
npm install
```

### iOS Setup

```bash
cd ios
pod install
cd ..
```

### Running the App

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

### Development

#### Start Metro Bundler
```bash
npm start
```

#### Run Tests
```bash
npm test
```

#### Linting
```bash
npm run lint
```

#### Type Checking
```bash
npx tsc --noEmit
```

## Code Quality

- **ESLint** - Code linting with React Native config
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Jest** - Testing framework

## Platform Support

- ✅ Android
- ✅ iOS/iPadOS

## License

See the main repository LICENSE file.
