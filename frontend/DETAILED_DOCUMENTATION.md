# 🧭 Detailed Documentation — Full-Stack Todo Application

A complete technical deep-dive into the **Full-Stack Todo App**, showcasing clean architecture, RESTful API design, scalable React UI, and modern development practices.

---

## 🌐 Live Deployments

- **Frontend (Vercel):** [https://todo-app-weld-one-94.vercel.app/](https://todo-app-weld-one-94.vercel.app/)
- **Backend (Render):** [https://todo-app-backend-xjwl.onrender.com](https://todo-app-backend-xjwl.onrender.com)

---

## 👨‍💻 Author

**Name:** Pramith Patil  
**Role:** Full-Stack Developer (Frontend-Focused)  
**Objective:** Build scalable, maintainable, and visually polished web applications using modern web technologies.

---

## 🧱 Project Overview

This Todo application was designed to demonstrate:
- **Backend:** Flask + SQLAlchemy REST API
- **Frontend:** React-based responsive UI
- **Database:** SQLite (dev) — adaptable to PostgreSQL for production
- **Deployment:** Render (Backend) + Vercel (Frontend)

It follows **modular clean code architecture** with strong separation of concerns — controllers handle logic, routes handle HTTP, and models handle data.

---

## ✨ Highlights

✅ Full CRUD functionality  
✅ Real-time updates without page reloads  
✅ Interactive modal-based editing  
✅ Clean, minimal UI with smooth animations  
✅ Strong error handling and validation  
✅ Responsive and mobile-friendly layout  
✅ Consistent RESTful endpoints  

---

## ⚙️ Tech Stack

**Frontend:** React, Axios, CSS3  
**Backend:** Python, Flask, SQLAlchemy, Flask-CORS  
**Database:** SQLite (default)  
**Hosting:** Vercel (Frontend), Render (Backend)

---

## 🚀 Local Setup Guide

### 1️⃣ Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate     # for Windows
pip install -r requirements.txt
python app.py
Server runs at: http://localhost:5000

2️⃣ Frontend Setup
bash
Copy code
cd frontend
npm install
npm start
Frontend runs at: http://localhost:3000

🔗 API Endpoints
Method	Endpoint	Description
GET	/api/todos	Fetch all todos
GET	/api/todos/:id	Fetch single todo
POST	/api/todos	Create new todo
PUT	/api/todos/:id	Update a todo
DELETE	/api/todos/:id	Delete a todo

🧩 Environment Variables
Backend (.env):

env
Copy code
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///todos.db
CORS_ORIGINS=https://todo-app-weld-one-94.vercel.app
Frontend (.env):

env
Copy code
REACT_APP_API_URL=https://todo-app-backend-xjwl.onrender.com/api
🌈 Design & UX
Clean, minimalist UI using modern typography

Smooth animations for adding/editing/deleting todos

Responsive grid layout for mobile and desktop

Keyboard accessibility & modal control

Visual feedback for all user actions

💡 Includes subtle hover states, transitions, and polished component hierarchy.

🧠 Code Quality Principles
Clean, maintainable code (PEP8 / React conventions)

Single Responsibility per component

Descriptive variable & function names

Separation of concerns (MVC in Flask)

Structured error handling

Modular imports and reusable logic

🌍 Deployment
🧩 Backend (Render)
Push backend to GitHub.

On Render → “New Web Service” → connect repo.

Configure:

Root directory: backend

Build command: pip install -r requirements.txt

Start command: python app.py

Add env vars (especially CORS_ORIGINS)

⚛️ Frontend (Vercel)
Deploy via Vercel linked to GitHub.

Set environment variable:

ini
Copy code
REACT_APP_API_URL=https://todo-app-backend-xjwl.onrender.com/api
Build command: npm run build

✅ Result: Fully functional, cloud-hosted MERN-style app (Flask + React).

🧪 Testing
Manual testing flow:

Add → Edit → Delete → Mark Complete → Refresh page

Validate counts in header

Inspect API responses with browser dev tools

Cross-check Render backend logs for live API traffic

🧭 Future Enhancements
🔐 User authentication (JWT)

🏷 Categories, tags, and filtering

📅 Due dates and reminders

🌙 Dark/light theme toggle

📲 Progressive Web App (PWA) support

📈 Analytics dashboard

📖 Documentation Add-ons
/DETAILED_DOCUMENTATION.md → Extended guide

Inline code comments explaining complex logic

🧍‍♂️ Author Notes
This project demonstrates full-stack development proficiency using Flask and React, focusing on clean architecture, UI polish, and practical deployability.

GitHub: PramithPatil

Built with ❤️ for learning and demonstration

© 2025 Pramith Patil — All Rights Reserved
