# Road Safety Guard

A comprehensive road safety management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Tailwind CSS. This application helps manage road accidents, provides analytics, and offers safety resources.

## Features

### 🔐 Authentication
- User registration and login
- Secure JWT-based authentication
- Profile management

### 📊 Dashboard
- Real-time accident statistics
- Recent accidents overview
- High-risk location heatmap
- Accident trends and analytics
- Interactive charts and graphs

### 🚨 Accident Management
- Comprehensive accident reporting form
- Accident categorization and severity levels
- Location tracking and mapping
- Casualty and vehicle information
- Weather condition tracking
- Emergency services notification

### 📈 Analytics & Reports
- Detailed accident analytics
- Category-wise distribution
- Severity analysis
- Time-based trends
- High-risk location identification

### 🛡️ Safety Resources
- Emergency contact information
- Safety guidelines and tips
- Accident prevention strategies
- What-to-do guides

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd road-safety-guard
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb://localhost:27017/road-safety-guard
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

### 4. Start the application

#### Development Mode (Recommended)
```bash
# From the root directory
npm run dev
```

This will start both the server (port 5000) and client (port 3000) concurrently.

#### Manual Start
```bash
# Start the server
cd server
npm run dev

# Start the client (in a new terminal)
cd client
npm start
```

### 5. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Accidents
- `POST /api/accidents` - Create accident report
- `GET /api/accidents` - Get all accidents (with filters)
- `GET /api/accidents/recent` - Get recent accidents
- `GET /api/accidents/:id` - Get single accident
- `PUT /api/accidents/:id` - Update accident
- `DELETE /api/accidents/:id` - Delete accident

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/trends` - Accident trends
- `GET /api/analytics/heatmap` - Heatmap data

## Database Schema

### User Model
```javascript
{
  username: String,
  email: String,
  password: String,
  role: String, // user, admin, officer
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    department: String
  },
  isActive: Boolean
}
```

### Accident Model
```javascript
{
  title: String,
  location: String,
  coordinates: { latitude: Number, longitude: Number },
  dateTime: Date,
  severity: String, // Low, Moderate, High, Critical
  description: String,
  category: String, // Overspeeding, Weather conditions, etc.
  casualties: { fatalities: Number, injuries: Number },
  vehicles: [{ type: String, damage: String }],
  weather: { condition: String, visibility: Number },
  reportedBy: ObjectId,
  status: String, // Reported, Under Investigation, Resolved, Closed
  emergencyServices: { police: Boolean, ambulance: Boolean, fire: Boolean }
}
```

## Features in Detail

### Dashboard
- **Statistics Cards**: Total accidents, fatalities, injuries, high-risk locations
- **Recent Accidents**: Latest accident reports with severity indicators
- **High-Risk Locations**: Visual heatmap of accident-prone areas
- **Trends Chart**: Monthly accident trends over time
- **Category Analytics**: Pie chart showing accident categories
- **Live Map**: Interactive map with accident locations

### Accident Reporting
- **Comprehensive Form**: Detailed accident information collection
- **Severity Levels**: Low, Moderate, High, Critical classification
- **Category Selection**: Overspeeding, Weather, Drunk driving, etc.
- **Casualty Tracking**: Fatalities and injuries count
- **Vehicle Information**: Multiple vehicles with damage assessment
- **Weather Conditions**: Weather and visibility tracking
- **Emergency Services**: Checkboxes for services called

### Analytics
- **Time-based Analysis**: Daily, weekly, monthly trends
- **Category Breakdown**: Detailed category-wise statistics
- **Severity Distribution**: Visual representation of severity levels
- **Location Analysis**: High-risk area identification
- **Casualty Statistics**: Fatalities and injuries tracking

### Safety Resources
- **Emergency Contacts**: Quick access to emergency numbers
- **Safety Guidelines**: Comprehensive safety tips and rules
- **Accident Response**: Step-by-step accident response guide
- **Prevention Tips**: Proactive safety measures
- **Quick Actions**: Emergency buttons and shortcuts

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@roadsafetyguard.com or create an issue in the repository.

## Roadmap

- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Advanced mapping integration
- [ ] Machine learning for accident prediction
- [ ] Integration with traffic management systems
- [ ] Multi-language support
- [ ] Advanced reporting features
- [ ] API rate limiting and security enhancements
