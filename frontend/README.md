# 📝 Full-Stack Todo Application

A modern, production-ready full-stack Todo application built with Python (Flask) backend and React frontend. This project demonstrates clean code architecture, RESTful API design, modern UI/UX practices, and comprehensive documentation.

![Todo App](https://img.shields.io/badge/Status-Production%20Ready-success)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Flask](https://img.shields.io/badge/Flask-2.3-black)

## ✨ Features

- ✅ **Complete CRUD Operations** - Create, Read, Update, and Delete todos
- ✅ **Real-time UI Updates** - Instant feedback without page refreshes
- ✅ **Modern UI/UX** - Clean, intuitive interface with smooth animations
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ✅ **RESTful API** - Well-structured backend following REST principles
- ✅ **Error Handling** - Comprehensive validation and user-friendly error messages
- ✅ **Loading States** - Visual feedback during async operations
- ✅ **Modal Editing** - Smooth editing experience with keyboard support
- ✅ **Statistics Dashboard** - Track total, active, and completed todos
- ✅ **Professional Code Quality** - Clean, commented, maintainable codebase

---

## 🏗️ Architecture

### Backend (Flask + SQLAlchemy)
```
backend/
├── app.py                    # Application entry point and configuration
├── config.py                 # Configuration settings
├── models.py                 # Database models (Todo)
├── requirements.txt          # Python dependencies
├── database/
│   └── connection.py         # Database initialization
├── routes/
│   └── todo_routes.py        # API route definitions
└── controllers/
    └── todo_controller.py    # Business logic layer
```

### Frontend (React)
```
frontend/
├── package.json              # Node dependencies
├── public/
│   └── index.html           # HTML template
└── src/
    ├── index.js             # Application entry point
    ├── App.js               # Main application component
    ├── components/
    │   ├── Header.js        # Header with statistics
    │   ├── AddTodoForm.js   # Form for creating todos
    │   ├── TodoList.js      # List container component
    │   ├── TodoItem.js      # Individual todo component
    │   └── EditModal.js     # Modal for editing todos
    ├── api/
    │   └── todoAPI.js       # API service layer
    └── styles/
        └── App.css          # Application styles
```

---

## 🚀 Tech Stack

### Backend
- **Python 3.8+** - Programming language
- **Flask 2.3** - Lightweight web framework
- **Flask-SQLAlchemy 3.0** - ORM for database operations
- **Flask-CORS 4.0** - Cross-origin resource sharing
- **SQLite** - Database (easily switchable to PostgreSQL/MySQL)

### Frontend
- **React 18.2** - UI library
- **Axios 1.4** - HTTP client
- **CSS3** - Modern styling with animations
- **React Hooks** - State management (useState, useEffect)

---

## 📋 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Get All Todos
```http
GET /api/todos
```

**Response (200 OK):**
```json
{
  "todos": [
    {
      "id": 1,
      "title": "Complete assessment",
      "description": "Build full stack todo app",
      "completed": false,
      "created_at": "2025-11-01T12:00:00Z"
    }
  ],
  "count": 1
}
```

#### 2. Get Single Todo
```http
GET /api/todos/{id}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Complete assessment",
  "description": "Build full stack todo app",
  "completed": false,
  "created_at": "2025-11-01T12:00:00Z"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Todo not found",
  "message": "Todo with ID 1 does not exist"
}
```

#### 3. Create Todo
```http
POST /api/todos
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false
}
```

**Response (201 Created):**
```json
{
  "message": "Todo created successfully",
  "todo": {
    "id": 2,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2025-11-01T13:00:00Z"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Validation error",
  "message": "Title is required and cannot be empty"
}
```

#### 4. Update Todo
```http
PUT /api/todos/{id}
Content-Type: application/json

{
  "title": "Buy groceries (updated)",
  "completed": true
}
```

**Response (200 OK):**
```json
{
  "message": "Todo updated successfully",
  "todo": {
    "id": 2,
    "title": "Buy groceries (updated)",
    "description": "Milk, eggs, bread",
    "completed": true,
    "created_at": "2025-11-01T13:00:00Z"
  }
}
```

#### 5. Delete Todo
```http
DELETE /api/todos/{id}
```

**Response (200 OK):**
```json
{
  "message": "Todo deleted successfully",
  "id": 2
}
```

---

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn package manager
- Git (optional)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend server:**
   ```bash
   python app.py
   ```

   The backend will start on `http://localhost:5000`

   You should see:
   ```
   ✅ Database tables created successfully
    * Running on http://0.0.0.0:5000
   ```

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The frontend will automatically open in your browser at `http://localhost:3000`

---

## 🧪 Testing the Application

### Manual Testing via Web Interface

1. **Start both backend and frontend servers**
2. **Open browser to** `http://localhost:3000`
3. **Test the following features:**
   - Add a new todo using the form
   - Mark a todo as complete by clicking the checkbox
   - Edit a todo by clicking the edit button (✏️)
   - Delete a todo by clicking the delete button (🗑️)
   - Verify statistics update in the header

### Testing with Postman or cURL

#### Create a Todo
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","description":"Testing the API","completed":false}'
```

#### Get All Todos
```bash
curl http://localhost:5000/api/todos
```

#### Update a Todo
```bash
curl -X PUT http://localhost:5000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

#### Delete a Todo
```bash
curl -X DELETE http://localhost:5000/api/todos/1
```

---

## 🎨 Design Decisions

### Backend Architecture

1. **MVC Pattern** - Separated routes, controllers, and models for clean architecture
2. **RESTful Design** - Standard HTTP methods and status codes
3. **Modular Structure** - Easy to extend with new features
4. **Comprehensive Validation** - Input validation at controller level
5. **Error Handling** - Structured error responses with helpful messages

### Frontend Architecture

1. **Component-Based** - Reusable, focused components
2. **Hooks for State** - Modern React patterns with useState and useEffect
3. **Optimistic Updates** - UI updates immediately for better UX
4. **API Service Layer** - Centralized API calls in todoAPI.js
5. **Responsive Design** - Mobile-first CSS with flexbox and grid

### UI/UX Design

1. **Modern Aesthetic** - Clean, minimal design with purple accent
2. **Smooth Animations** - Transitions for state changes
3. **Visual Feedback** - Loading states, success/error messages
4. **Accessibility** - Proper focus states, semantic HTML
5. **Keyboard Support** - ESC to close modals, tab navigation

---

## 🌐 Deployment

### Backend Deployment (Render)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Create new Web Service on** [Render](https://render.com)
   - Connect your GitHub repository
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `python app.py`

3. **Add environment variable:**
   - `DATABASE_URL`: Your production database URL (PostgreSQL recommended)

### Frontend Deployment (Vercel)

1. **Deploy to** [Vercel](https://vercel.com)
   ```bash
   cd frontend
   npm run build
   vercel --prod
   ```

2. **Update API URL:**
   - In `src/api/todoAPI.js`, change `API_BASE_URL` to your backend URL
   - Or use environment variable: `process.env.REACT_APP_API_URL`

### Alternative: Netlify

```bash
cd frontend
npm run build
netlify deploy --prod --dir=build
```

---

## 📦 Dependencies

### Backend (requirements.txt)
```
Flask==2.3.0
Flask-CORS==4.0.0
Flask-SQLAlchemy==3.0.5
python-dotenv==1.0.0
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "axios": "^1.4.0"
  }
}
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///todos.db
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚧 Future Enhancements

- [ ] User authentication with JWT tokens
- [ ] Task categories and tags
- [ ] Search and filter functionality
- [ ] Due dates and reminders
- [ ] Dark/light theme toggle
- [ ] Drag-and-drop reordering
- [ ] Local storage persistence
- [ ] Export/import todos
- [ ] Multi-language support
- [ ] Task priority levels

---

## 📝 Code Quality Standards

This project follows industry best practices:

- ✅ **Clean Code** - Meaningful variable names, proper indentation
- ✅ **Documentation** - Comprehensive comments explaining "why" not just "what"
- ✅ **Modular Design** - Single responsibility principle
- ✅ **Error Handling** - Try-catch blocks, validation
- ✅ **Consistent Naming** - snake_case (Python), camelCase (JavaScript)
- ✅ **DRY Principle** - Reusable functions and components
- ✅ **Responsive UI** - Mobile-first approach
- ✅ **Accessibility** - Semantic HTML, ARIA labels

---

## 🐛 Troubleshooting

### Backend won't start
- Ensure virtual environment is activated
- Check if port 5000 is available: `lsof -i :5000`
- Verify all dependencies are installed: `pip list`

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check CORS configuration in `app.py`
- Inspect browser console for errors

### Database errors
- Delete `todos.db` and restart backend to recreate
- Check SQLAlchemy URI in `config.py`

### npm install fails
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Try `npm install --legacy-peer-deps`

---

## 👨‍💻 Developer

This project demonstrates:
- Full-stack development proficiency
- RESTful API design
- Modern React patterns
- Clean code architecture
- Professional documentation
- Production-ready code quality

---

## 📄 License

This project is open source and available for educational purposes.

---

## 🙏 Acknowledgments

- Flask documentation for excellent API design patterns
- React documentation for modern component patterns
- Material Design for UI/UX inspiration

---

📘 **Want a deeper look?**  
Check out the full project walkthrough here → [**DETAILED_DOCUMENTATION.md**](./DETAILED_DOCUMENTATION.md)

---

**Built with ❤️ for technical assessment demonstration**

