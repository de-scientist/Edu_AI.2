# Edu_AI Dashboard Guide

This guide provides detailed instructions for accessing and using all three dashboards in the Edu_AI platform: Admin, Lecturer, and Student.

## Accessing the Dashboards

### Prerequisites

Before accessing any dashboard, ensure that:

1. The frontend server is running (`cd frontend && npm run dev`)
2. The backend server is running (`cd backend && npm run dev`)
3. You have the correct credentials for the role you want to access

### Admin Dashboard

**URL:** `http://localhost:3001/admin`

**Credentials:**
- Email: admin@example.com
- Password: admin123

**Features:**

1. **Overview**
   - User statistics
   - Course statistics
   - Engagement metrics

2. **User Management**
   - View all users
   - Add new users
   - Edit user details
   - Change user roles
   - Deactivate/reactivate users

3. **Curriculum Oversight**
   - View all courses
   - Add new courses
   - Edit course details
   - Assign lecturers to courses
   - Monitor course progress

4. **Analytics & Reporting**
   - User growth charts
   - Course engagement metrics
   - Activity distribution
   - Time distribution

5. **Content Moderation**
   - Review reported content
   - Moderate user-generated content
   - Manage flagged items
   - Set moderation rules

6. **Feedback Aggregation**
   - View user feedback
   - Categorize feedback
   - Respond to feedback
   - Generate feedback reports

7. **AI System Tuning**
   - Monitor AI performance metrics
   - Configure AI parameters
   - Train AI models
   - View model performance

8. **Platform Settings**
   - General settings
   - Security settings
   - Email settings
   - Storage settings
   - Notification settings

### Lecturer Dashboard

**URL:** `http://localhost:3001/lecturer`

**Credentials:**
- Email: lecturer@example.com
- Password: lecturer123

**Features:**

1. **Overview**
   - Course count
   - Student count
   - Session count
   - Weekly progress chart

2. **Course Management**
   - Create new courses
   - Edit existing courses
   - Upload course materials
   - Schedule live sessions
   - Track course progress

3. **Student Analytics**
   - View student performance
   - Track engagement metrics
   - Identify struggling students
   - Generate performance reports

4. **Live Interaction**
   - Host live sessions
   - Conduct polls and quizzes
   - Answer student questions
   - Share screen and resources

5. **Assessment Tools**
   - Create assessments
   - Set grading criteria
   - Grade submissions
   - Provide feedback
   - Track assessment results

6. **Feedback System**
   - Collect student feedback
   - Respond to feedback
   - Track feedback trends
   - Implement improvements

7. **Communication**
   - Message students
   - Send announcements
   - Schedule office hours
   - Create discussion forums

8. **AI Assistant**
   - Get teaching recommendations
   - Generate content ideas
   - Analyze student performance
   - Create personalized learning paths

### Student Dashboard

**URL:** `http://localhost:3001/student`

**Credentials:**
- Email: student@example.com
- Password: student123

**Features:**

1. **Study Planner**
   - Create study schedules
   - Set learning goals
   - Track study time
   - Receive study reminders

2. **Learning Path**
   - View personalized learning path
   - Track progress through courses
   - Access recommended resources
   - Complete learning milestones

3. **Progress Prediction**
   - View predicted performance
   - Identify areas for improvement
   - Track progress over time
   - Set performance goals

4. **Quiz**
   - Take interactive quizzes
   - Review past quiz results
   - Practice with sample questions
   - Track quiz performance

5. **Study Recommendations**
   - Receive personalized content recommendations
   - Access supplementary materials
   - Find related resources
   - Discover new topics

6. **Notes Summarizer**
   - Upload study notes
   - Generate summaries
   - Create flashcards
   - Organize study materials

## Troubleshooting

### Common Issues

1. **Cannot Access Dashboard**
   - Ensure you're using the correct URL
   - Verify your credentials
   - Check that both servers are running
   - Clear browser cache and cookies

2. **Missing Features**
   - Ensure you're logged in with the correct role
   - Check your permissions
   - Update your browser to the latest version
   - Try accessing in a different browser

3. **Performance Issues**
   - Check your internet connection
   - Close unnecessary browser tabs
   - Clear browser cache
   - Try accessing during off-peak hours

### Getting Help

If you encounter any issues not covered in this guide:

1. Check the README.md file for general troubleshooting
2. Contact the system administrator
3. Submit a bug report through the feedback system

## Best Practices

### For Administrators

- Regularly review user management to ensure proper access control
- Monitor AI system performance and adjust parameters as needed
- Review content moderation regularly to maintain platform quality
- Analyze feedback to identify areas for improvement

### For Lecturers

- Keep course content up-to-date and engaging
- Provide timely feedback on student submissions
- Use analytics to identify struggling students and provide support
- Leverage the AI assistant for content creation and teaching strategies

### For Students

- Set realistic learning goals in the study planner
- Regularly check your learning path for updates
- Complete assessments on time
- Provide feedback to help improve the platform 