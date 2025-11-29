# MedTrack 🏥

**Your Personal AI-Powered Health Companion**

MedTrack is a full-stack web application designed to simplify the understanding of medical lab reports. By leveraging advanced AI (Google Gemini), MedTrack analyzes complex medical data from PDF or image uploads and translates it into clear, actionable insights for both patients and clinicians.

## 🌟 Key Features

### 🧠 AI-Powered Analysis
-   **Instant Interpretation**: Upload any lab report (PDF/Image) and get results in seconds.
-   **Dual Perspectives**:
    -   **Patient Summary**: Simple, jargon-free explanation of health status.
    -   **Clinician Summary**: Technical insights for medical professionals.
-   **Context Awareness**: AI considers user age and sex for accurate reference range analysis.

### 📊 Smart Data Extraction
-   **Automated Digitization**: Converts static report images/PDFs into structured digital data.
-   **Flagging System**: Automatically highlights values that are **High**, **Low**, or **Critical**.
-   **Trend Tracking**: Visualizes historical data for specific biomarkers (e.g., Hemoglobin trends over 6 months).

### 🔐 Security & Privacy
-   **Secure Authentication**: Robust JWT-based signup and login system.
-   **Data Encryption**: Passwords hashed with Bcrypt; secure environment variable management.
-   **Private Records**: Users can only access their own uploaded reports.

### 💻 Modern User Experience
-   **Responsive Design**: Fully optimized for desktops, tablets, and mobile devices.
-   **Interactive Dashboard**: Clean interface with drag-and-drop file upload.
-   **Profile Management**: Easy updates for personal details and password management.

---

## 🚀 Technology Stack

### Frontend (Client)
-   **Framework**: Next.js 15 (App Router)
-   **Styling**: Tailwind CSS 4
-   **Icons**: Lucide React
-   **Visualization**: Chart.js & React-Chartjs-2
-   **HTTP Client**: Axios

### Backend (Server)
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB Atlas (Mongoose ODM)
-   **AI Model**: Google Gemini 1.5 Flash
-   **Email Service**: Nodemailer (Gmail SMTP)

---

## 🛠️ Installation & Setup Guide

Follow these steps to run MedTrack locally.

### Prerequisites
-   Node.js (v18 or higher)
-   MongoDB Atlas Account (or local MongoDB)
-   Google Cloud API Key (for Gemini)

### 1. Clone the Repository
```bash
git clone https://github.com/ayush2635/MedTrack.git
cd medtrack
```

### 2. Backend Configuration
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder with the following credentials:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?appName=medtrack
JWT_SECRET=your_super_secure_random_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

Start the backend server:
```bash
npm start
# Server will run on http://localhost:5000
```

### 3. Frontend Configuration
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Create a `.env.local` file in the `client` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
# Client will run on http://localhost:3000
```

---

## � API Documentation

### Authentication
-   **POST** `/api/auth/signup`: Register a new user.
-   **POST** `/api/auth/login`: Authenticate user and return JWT.
-   **POST** `/api/auth/forgotpassword`: Send password reset email.
-   **PUT** `/api/auth/resetpassword/:token`: Reset password using token.

### Records & Analysis
-   **POST** `/api/interpret`: Upload file for AI analysis (Multipart/Form-Data).
-   **POST** `/api/records`: Save a new analyzed record.
-   **GET** `/api/records`: Fetch all user records.
-   **GET** `/api/records/:id`: Fetch a specific record.
-   **DELETE** `/api/records/:id`: Delete a record.

### History
-   **GET** `/api/history/:testName`: Get historical trend data for a specific test.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
