# FairShare

FairShare is a comprehensive expense management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) to help you manage and track your expenses, split bills with friends, and maintain your financial records efficiently.

## Features

- **Expense Tracking**: Record and categorize your daily expenses
- **Bill Splitting**: Create groups and split bills among friends
- **Savings Goals**: Set and track your savings targets
- **Debt Management**: Keep track of who owes you and whom you owe
- **Charts & Analytics**: Visualize your spending patterns
- **Stock Portfolio**: Track your investments
- **Vault**: Secure storage for important documents
- **Email Notifications**: Get reminders for dues and payments
- **Multi-language Support**: Internationalization support
- **Dark/Light Theme**: Toggle between themes

## Tech Stack

### Frontend
- **React.js** - UI framework
- **Material-UI** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **React Router** - Navigation
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Socket.io** - Real-time communication
- **Passport.js** - Authentication middleware

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Gmail account (for email notifications)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd fair-share
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**

   Create a `.env` file in the `backend/` directory:
   ```env
   MONGO=your_mongodb_atlas_connection_string
   JWT=your_jwt_secret_key
   Email=your_email@gmail.com
   password=your_email_app_password
   PORT=3001
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both frontend (port 3000) and backend (port 3001) servers.

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the **Root Directory** to `frontend`
4. Set the **Build Command** to `npm run build`
5. Set the **Output Directory** to `build`
6. Add environment variables in Vercel dashboard

### Backend (Render/Railway/Heroku)
1. Deploy the backend to your preferred platform
2. Update the frontend API base URL to point to your deployed backend
3. Set environment variables in your hosting platform

## Environment Variables

### Backend (.env)
- `MONGO` - MongoDB Atlas connection string
- `JWT` - JWT secret key for authentication
- `Email` - Gmail address for sending emails
- `password` - Gmail app password
- `PORT` - Server port (default: 3001)

## Project Structure

```
fair-share/
├── frontend/          # React application
│   ├── public/        # Static files
│   ├── src/           # Source code
│   │   ├── components/ # Reusable components
│   │   ├── pages/     # Page components
│   │   └── ...
│   └── package.json
├── backend/           # Node.js/Express API
│   ├── controllers/   # Route controllers
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── middlewares/   # Custom middlewares
│   └── package.json
└── package.json       # Root package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@fairshare.com or create an issue in the repository.
