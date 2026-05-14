# PromptlyAI

A full-stack AI-powered conversational application built with React, Node.js, Express, and MongoDB. PromptlyAI supports thread-based chat, real-time AI responses, and a clean minimal UI.

---

## Features

- Thread-based chat system
- Store and retrieve user & assistant messages
- CRUD operations for chat threads
- AI response integration via Groq AI Chat Completions API
- Full conversation context sent per request using stored message history
- RESTful API design
- Responsive React frontend with typing animation
- Markdown & syntax-highlighted code rendering
- Auto-scroll and thread switching

---

## Tech Stack

**Frontend**
- React.js
- React Markdown + Rehype Highlight
- Context API for state management
- CSS (custom dark theme)

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- Groq AI Chat Completions API 

---

## Project Structure

```
PromptlyAI/
│
├── Backend/
│   ├── models/
│   │   └── Thread.js
│   ├── routes/
│   │   └── chat.js
│   ├── utils/
│   │   └── openai.js
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── blacklogo.png
│   │   │   ├── promptlyai_logo.png
│   │   │   └── promptlyai-icon-v2.png
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── Chat.css
│   │   ├── Chat.jsx
│   │   ├── ChatWindow.css
│   │   ├── ChatWindow.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── MyContext.jsx
│   │   ├── Sidebar.css
│   │   └── Sidebar.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
│
└── README.md
```

---

## API Endpoints

#### Get all threads
```
GET /api/thread
```

#### Get a specific thread
```
GET /api/thread/:ThreadId
```

#### Delete a thread
```
DELETE /api/thread/:ThreadId
```

#### Send a message
```
POST /api/chat
```

Request body:
```json
{
  "ThreadId": "abc",
  "message": "Hello"
}
```

Response:
```json
{
  "reply": "AI response here",
  "threadId": "abc"
}
```

---

## Getting Started

### Backend
```bash
cd Backend
npm install
nodemon server.js
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

### Environment Variables
Create a `.env` file in the Backend directory:
```
MONGODB_URI=your_mongodb_uri
GROK_API_KEY=your_grok_api_key
```

---

## How It Works

Each chat message is stored in MongoDB under a thread. When a new message is sent, the full message history for that thread is fetched and passed to the Grok AI Chat Completions API as context. The Grok AI response is then stored alongside the user message in the database.

---

## Learning Highlights

- Designed thread-message schema in MongoDB
- Built REST APIs using Express with proper error handling
- Managed async flows across frontend and backend
- Integrated Grok AI Chat Completions API with full conversation context
- Built a React UI with typing animation, markdown rendering, and thread management
- Used React Context API for global state

---

## Future Scope

- 🔐 Authentication & user management (JWT-based)
- 🐳 Docker containerization for easier deployment
- ⚙️ CI/CD pipeline for automated build and testing

---

## Status

![Backend](https://img.shields.io/badge/Backend-Complete-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-Complete-brightgreen)
![Auth](https://img.shields.io/badge/Auth-In%20Progress-yellow)
![Deployment](https://img.shields.io/badge/Deployment-Planned-lightgrey)
