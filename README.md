# Budgetfy

A React Native mobile application for tracking travel expenses and managing trip budgets. Built with React Native, Redux Toolkit, and TypeScript.

## Features

- 📱 Track expenses by trip
- 🌍 Organize expenses by location (country and state/city)
- 📊 Categorize expenses
- 💰 Monitor spending with detailed expense cards
- 📱 Bottom tab navigation
- 🎨 Modern UI with custom components

## Tech Stack

- React Native
- TypeScript
- Redux Toolkit for state management
- React Navigation (Bottom Tabs & Stack)
- Custom Components
- React Navigation
- Firebase Authentication

## Prerequisites

- Node.js >= 18
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS dependencies)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ExpenseTracker3.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install iOS dependencies:
```bash
cd ios
pod install
cd ..
```

## Running the App

1. Start Metro:
```bash
npm start
```

2. Run on iOS:
```bash
npm run ios
```

3. Run on Android:
```bash
npm run android
```

## Project Structure

Budgetfy/
├── src/
│   ├── components/     # Reusable components like BackButton
│   ├── screens/        # Screen components (WelcomeScreen, SignUpScreen, etc.)
│   ├── assets/        # Images and static assets
│   ├── config/        # Firebase and other configurations 
│   └── navigation.tsx # Navigation setup
├── ios/              # iOS native code
├── android/          # Android native code
└── package.json

## Features in Detail

### Authentication
- User signup and login with email/password
- Firebase authentication integration
- Secure user sessions

### Trip Management
- Create new trips with location details
- View all trips in a grid layout
- Navigate to trip-specific expense tracking

### Expense Tracking
- Add expenses with title, amount, and category
- View expenses per trip
- Categorize expenses with predefined categories

### User Interface
- Clean and modern design
- Responsive layout
- Custom expense cards
- Category selection with visual feedback

### Demo of App


https://github.com/user-attachments/assets/b5e18e9c-4564-4e8a-9fc6-bc16a2535aa9


