# Budgetfy

A React Native mobile application for tracking travel expenses and managing trip budgets. Built with React Native, Redux Toolkit, and TypeScript.

https://teams.microsoft.com/l/meetup-join/19%3ameeting_N2E3Y2JhZTktZGM1OS00NmQzLTliYTAtNTFiZTlhOTg5YzM5%40thread.v2/0?context=%7b%22Tid%22%3a%22d420b80d-bc1a-429d-b6c6-587896c20153%22%2c%22Oid%22%3a%224cbe315a-ec98-4265-8fd4-12ec7c4f84c8%22%7d

## Features

- 📱 Track expenses by trip
- 🌍 Organize expenses by location (country and state/city)
- 📊 Categorize expenses
- 💰 Monitor spending with detailed expense cards
- 📱 Bottom tab navigation
- 🎨 Modern UI with custom components
- 🔄 Real-time data sync with Firebase

## Tech Stack

- React Native
- TypeScript
- Redux Toolkit for state management
- React Navigation (Bottom Tabs & Stack)
- Custom Components
- React Navigation
- Firebase (Authentication & Firestore)

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
│   ├── assets/        # Images and static assets
│   ├── components/    # Reusable components like BackButton
│   ├── config/        # Firebase and other configurations 
│   ├── screens/       # Screen components (WelcomeScreen, SignUpScreen, etc.)
│   └── store/         # Redux store and slices
│   └── types/         # TypeScript interfaces
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
- Delete expenses
- Multi-currency support

### User Interface
- Clean and modern design
- Responsive layout
- Custom expense cards
- Category selection with visual feedback

### Demo of App


https://github.com/user-attachments/assets/b5e18e9c-4564-4e8a-9fc6-bc16a2535aa9






https://github.com/user-attachments/assets/c703b441-04f8-467e-8f68-7770533e6476

