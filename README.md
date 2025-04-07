# Edu_AI - Educational AI Platform

Edu_AI is a comprehensive educational platform that leverages artificial intelligence to enhance learning experiences for students, lecturers, and administrators.

## Features

- **AI-Powered Learning**: Personalized learning paths and recommendations
- **Interactive Assessments**: Smart quizzes and progress tracking
- **Content Management**: Course creation and management tools
- **Analytics**: Detailed insights into student performance and engagement
- **Communication**: Built-in messaging and collaboration tools
- **AI System Tuning**: Advanced configuration and monitoring of AI models
- **Gamification**: Points, badges, and achievements to enhance engagement
- **Study Planning**: Personalized study schedules and reminders
- **Resource Library**: Curated educational resources and materials
- **Community Forums**: Discussion boards for knowledge sharing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (for backend)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Edu_AI.git
cd Edu_AI
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
   - Create `.env.local` in the frontend directory
   - Create `.env` in the backend directory with your database connection string

4. Set up the database:
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

5. Start the development servers:
```bash
# Start the backend server
cd backend
npm run dev

# Start the frontend server (in a new terminal)
cd frontend
npm run dev
```

## Accessing the Dashboards

### Admin Dashboard

The Admin Dashboard provides comprehensive tools for managing the entire platform.

**Access:**
1. Navigate to `http://localhost:3001/admin`
2. Log in with admin credentials:
   - Email: admin@eduai.com
   - Password: admin123

**Features:**
- **User Management**: Add, edit, and manage user accounts
- **Curriculum Oversight**: Manage courses and educational content
- **Analytics & Reporting**: View platform-wide statistics and reports
- **Content Moderation**: Review and moderate user-generated content
- **Feedback Aggregation**: Collect and analyze user feedback
- **AI System Tuning**: Configure AI parameters and monitor performance
  - Model Configuration: Adjust model parameters and settings
  - Performance Monitoring: Track accuracy, response time, and error rates
  - Model Training: Start and monitor model training processes
  - Parameter Optimization: Fine-tune model parameters for better performance
- **Platform Settings**: Configure general platform settings

### Lecturer Dashboard

The Lecturer Dashboard provides tools for course management and student interaction.

**Access:**
1. Navigate to `http://localhost:3001/lecturer`
2. Log in with lecturer credentials:
   - Email: lecturer@eduai.com
   - Password: lecturer123

**Features:**
- **Course Management**: Create and manage courses
- **Student Analytics**: Track student progress and performance
- **Live Interaction**: Engage with students in real-time
- **Assessment Tools**: Create and manage assessments
- **Feedback System**: Collect and respond to student feedback
- **Communication**: Message students and colleagues
- **AI Assistant**: Get AI-powered assistance for teaching
- **Resource Creation**: Create and share educational resources
- **Performance Tracking**: Monitor student engagement and performance

### Student Dashboard

The Student Dashboard provides a personalized learning experience.

**Access:**
1. Navigate to `http://localhost:3001/student`
2. Log in with student credentials:
   - Email: student@eduai.com
   - Password: student123

**Features:**
- **Study Planner**: Plan your learning schedule
- **Learning Path**: Follow personalized learning paths
- **Progress Prediction**: See predicted performance
- **Quiz**: Take interactive assessments
- **Study Recommendations**: Get personalized content recommendations
- **Notes Summarizer**: Summarize your study notes
- **Gamification**: Earn points, badges, and achievements
- **Resource Library**: Access curated educational materials
- **Community Forums**: Participate in discussions with peers
- **Progress Tracking**: Monitor your learning progress

## AI System Tuning

The AI System Tuning component allows administrators to configure and optimize the AI models used throughout the platform.

**Key Features:**
- **Model Configuration**: Adjust model parameters such as temperature, max tokens, and system prompts
- **Performance Monitoring**: Track metrics like accuracy, response time, and error rates
- **Model Training**: Start and monitor training processes for different model types
- **Parameter Optimization**: Fine-tune model parameters for better performance
- **Metrics Visualization**: View performance trends over time

**Model Types:**
- **Recommendation Engine**: Personalizes content and course recommendations
- **Assessment Model**: Evaluates student performance and progress

## Database Schema

The platform uses Prisma with PostgreSQL for data management. Key models include:

- **User**: Student, lecturer, and admin accounts
- **Course**: Educational content and materials
- **Progress**: Student progress tracking
- **Resource**: Educational resources and materials
- **Post**: Community forum posts
- **Comment**: Comments on posts
- **Like**: User interactions with posts
- **AIMetrics**: Performance metrics for AI models
- **AISettings**: Configuration settings for AI models
- **ModelParameter**: Parameters for different model types
- **ModelTraining**: Training status and results

## Troubleshooting

If you encounter any issues:

1. **Backend Connection Issues:**
   - Ensure the backend server is running
   - Check that the API endpoints are correctly configured
   - Verify your environment variables
   - Ensure the database is properly set up with Prisma

2. **Authentication Issues:**
   - Clear your browser cookies and cache
   - Ensure you're using the correct credentials
   - Check that the authentication service is running

3. **Dashboard Access Issues:**
   - Make sure you're logged in with the correct role
   - Check that your user account has the appropriate permissions
   - Try accessing the dashboard directly via URL

4. **Database Issues:**
   - Run `npx prisma migrate reset` to reset the database
   - Check your database connection string in the `.env` file
   - Ensure PostgreSQL is running and accessible

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.