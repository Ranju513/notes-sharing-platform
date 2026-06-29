# 📚 Notes Sharing Platform

A full-stack MERN application that allows users to upload, search, view, and download study notes securely.

---

## 🚀 Features

- 👤 User Registration
- 🔐 User Login & JWT Authentication
- 📤 Upload Notes
- 📄 View Notes
- 🔍 Search Notes
- 🗑 Delete Notes
- 👤 User Profile
- 📅 Upload Date
- 📱 Responsive User Interface

---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router
- Axios
- React Icons
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- Bcrypt

---

## 📂 Project Structure

```
notes-sharing-platform
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
│
└── README.md
```

---

## ⚙ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/notes-sharing-platform.git
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🌐 Environment Variables

Create a `.env` file inside the `server` folder.

```
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 📸 Screenshots

- Login Page
- Home Dashboard
- Upload Notes
- Profile Page

---

## 👨‍💻 Author

**Ranjan Kumar**

B.Tech CSE Student

SOA University (ITER)

---

## ⭐ Future Improvements

- Edit Notes
- Favorite Notes
- PDF Preview
- Dark Mode
- Admin Dashboard
- Deployment on Vercel & Render
