# SkillVerse Frontend

A modern React frontend for the SkillVerse EdTech platform built with JavaScript, Tailwind CSS, and React Router.

## Features

- **Authentication System**
  - User registration with email/phone verification
  - Login/logout functionality
  - OTP verification system
  - Protected routes

- **Course Management**
  - Browse all courses with filtering and search
  - Course detail pages with enrollment
  - Featured courses on homepage
  - Category-based filtering

- **Payment Integration**
  - Razorpay payment gateway integration
  - Payment history tracking
  - Order creation and verification

- **User Dashboard**
  - Personal dashboard with enrolled courses
  - Learning progress tracking
  - Course recommendations
  - Analytics and statistics

- **Profile Management**
  - User profile editing
  - Verification status display
  - Account statistics

## Tech Stack

- **Frontend**: React 18, JavaScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: Heroicons
- **Payment**: Razorpay

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on port 5000

### Installation

1. Navigate to the client directory:
   ```bash
   cd skillverse/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update environment variables in `.env`:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id_here
   ```

5. Start the development server:
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Navbar, Footer)
│   └── ui/             # Basic UI components (Button, Input, Card)
├── contexts/           # React Context providers
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   └── ...             # Other pages
├── services/           # API services
├── App.js             # Main App component
└── index.js           # Entry point
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## API Integration

The frontend communicates with the backend API through the following services:

- **Auth API**: User authentication, registration, OTP verification
- **Courses API**: Course listing, details, categories
- **Payments API**: Payment processing, order creation, verification
- **User API**: Profile management, enrolled courses, analytics

## Features Overview

### Homepage
- Hero section with call-to-action
- Featured courses showcase
- Feature highlights
- Category browsing
- Course statistics

### Course Pages
- Course listing with filters and search
- Detailed course information
- Enrollment functionality
- Course curriculum display
- Reviews and ratings

### User Dashboard
- Enrolled courses with progress
- Learning analytics
- Course recommendations
- Quick actions

### Authentication
- Registration with validation
- Email/phone verification
- Secure login system
- Password requirements

### Payment System
- Razorpay integration
- Secure payment processing
- Payment history
- Receipt generation

## Styling

The application uses Tailwind CSS for styling with a custom design system:

- **Primary Colors**: Blue theme (#2563eb)
- **Typography**: Inter font family
- **Components**: Custom component classes
- **Responsive**: Mobile-first design approach

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
