# Natours - Tour Booking Application

A modern, full-stack tour booking application built with React, TypeScript, Node.js, Express, and MongoDB. This project demonstrates advanced web development concepts including authentication, lazy loading, code splitting, and responsive design.

## 🚀 Features

### Frontend (React + TypeScript)

- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Authentication System**: Complete signup/login with JWT tokens
- **Lazy Loading & Code Splitting**: Optimized performance with React.lazy and Suspense
- **Tour Management**: Browse tours, view details, and book experiences
- **User Profiles**: Manage account settings and view booking history
- **Interactive Maps**: Tour locations with Mapbox integration
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### Backend (Node.js + Express + TypeScript)

- **RESTful API**: Clean, well-structured endpoints
- **Authentication & Authorization**: JWT-based security with role-based access
- **Database Integration**: MongoDB with Mongoose ODM
- **Error Handling**: Comprehensive error management and validation
- **File Upload**: Support for user profile photos and tour images
- **Security**: Password hashing, input sanitization, and rate limiting

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **React Router** for navigation
- **Context API** for state management
- **CSS3** with custom animations
- **Vite** for fast development and building
- **Lazy Loading** for optimal performance

### Backend

- **Node.js** with TypeScript
- **Express.js** framework
- **MongoDB** database
- **Mongoose** ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Helmet** for security headers
- **Rate limiting** and CORS protection

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd natours-ts/backend

# Install dependencies
npm install

# Create config.env file (see .env.example)
# Add your MongoDB connection string and JWT secret

# Start the development server
npm start
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd natours-ts/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables (Backend)

Create a `config.env` file in the backend directory:

```env
NODE_ENV=development
PORT=3000
DATABASE_LOCAL=mongodb://localhost:27017/natours
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

## 🏗️ Project Structure

```
natours-ts/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   └── app.ts          # Express app setup
│   ├── config.env          # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── contexts/       # React Context providers
│   │   ├── services/       # API service layer
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
└── README.md
```

## 🎯 Key Features Explained

### Authentication System

- **JWT Tokens**: Secure authentication with JSON Web Tokens
- **Role-based Access**: Different permissions for users, guides, and admins
- **Password Security**: Bcrypt hashing with salt rounds
- **Auto-login**: Seamless experience after registration

### Performance Optimizations

- **Lazy Loading**: Components load only when needed
- **Code Splitting**: Separate bundles for different routes
- **Image Optimization**: Proper fallbacks and error handling
- **Caching**: Efficient data caching strategies

### User Experience

- **Responsive Design**: Works on all device sizes
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Navigation**: Intuitive routing and breadcrumbs

## 🔧 API Endpoints

### Authentication

- `POST /api/v1/users/signup` - User registration
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/me` - Get current user
- `PATCH /api/v1/users/updateMe` - Update user profile

### Tours

- `GET /api/v1/tours` - Get all tours
- `GET /api/v1/tours/:slug` - Get specific tour
- `POST /api/v1/tours` - Create tour (admin only)
- `PATCH /api/v1/tours/:id` - Update tour (admin only)

### Bookings

- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings/my-bookings` - Get user bookings

## 🚀 Deployment

### Backend Deployment

```bash
# Build the TypeScript code
npm run build

# Start production server
npm start
```

### Frontend Deployment

```bash
# Build for production
npm run build

# Deploy to your preferred platform (Vercel, Netlify, etc.)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Jonas Schmedtmann's Node.js course
- Built with modern web technologies
- Designed for learning and demonstration purposes

## 📞 Support

If you have any questions or need help with the project, please open an issue in the GitHub repository.

---

**Happy Coding! 🎉**
