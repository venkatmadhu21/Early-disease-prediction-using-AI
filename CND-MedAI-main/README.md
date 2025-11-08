##Early-disease-prediction-using-AI

A comprehensive medical AI platform for analyzing medical images including CT scans, MRI, X-rays, histopathology, and EEG signals.

## Features

- **User Authentication**: Secure login/registration system with JWT tokens
- **Image Upload**: Support for multiple medical image formats (JPG, PNG, DICOM)
- **AI Analysis**: Simulated AI analysis with realistic medical findings
- **Dashboard**: Real-time statistics and analysis history
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui components

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcrypt for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update `.env` with your configuration:
```env
MONGO_URI=mongodb://localhost:27017/medai-assist
DB_NAME=medai-assist
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

5. Start the backend server:
```bash
npm start
# or for development with auto-restart:
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update `.env` with your configuration:
```env
REACT_APP_API_URL=http://localhost:5000
```

5. Start the frontend development server:
```bash
npm start
```

## Usage

1. **Registration**: Create a new account with your medical credentials
2. **Login**: Access your dashboard with your credentials
3. **Upload Images**: Upload medical images for AI analysis
4. **View Results**: Check analysis results in the history section
5. **Dashboard**: Monitor your analysis statistics

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Analysis
- `POST /api/analysis/upload` - Upload image for analysis
- `GET /api/analysis/history` - Get analysis history
- `GET /api/analysis/:id` - Get specific analysis

## Project Structure

```
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Analysis.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── hooks/
│   └── package.json
└── README.md
```

## Development

### Adding New Features

1. **Backend**: Add new routes in `server.js` and models in `models/`
2. **Frontend**: Create new components in `src/components/` and pages in `src/pages/`
3. **Styling**: Use Tailwind CSS classes and shadcn/ui components

### Database Models

- **User**: Stores user information and authentication data
- **Analysis**: Stores uploaded images and analysis results

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB instance
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `build` folder to your hosting platform
3. Configure environment variables for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
