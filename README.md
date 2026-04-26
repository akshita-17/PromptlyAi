# Promptly AI 
A backend service for an AI-powered conversational application built using Node.js, Express, and MongoDB.
This project manages chat threads, message storage, and AI-generated responses.

---

##  Features

* Thread-based chat system
* Store user & assistant messages
* CRUD operations for threads
* AI response integration (OpenAI API)
* Fallback/mock response support (if API unavailable)
* RESTful API design

---

## Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* OpenAI API

---

##  Project Structure

```
Backend/
│
├── models/
│   └── Thread.js
│
├── routes/
│   └── chat.js
│
├── utils/
│   └── openai.js
│
├── server.js
├── .env
├── package.json
```

---

##  API Endpoints

### 🔹 Get all threads

```
GET /api/thread
```

### 🔹 Get a specific thread

```
GET /api/thread/:ThreadId
```

### 🔹 Delete a thread

```
DELETE /api/thread/:ThreadId
```

### 🔹 Chat (send message)

```
POST /api/chat
```

#### Request Body:

```json
{
  "ThreadId": "abc",
  "message": "Hello"
}
```

#### Response:

```json
{
  "reply": "AI response here"
}
```

---

##  Notes

* OpenAI API requires billing credits
* Mock responses can be used for testing
* `.env` required:

```
MONGODB_URI=your_mongodb_uri
OPENAI_API_KEY=your_api_key
```

---

##  Future Scope

* RAG-based retrieval system for contextual responses
* Docker containerization for easier deployment
* CI/CD pipeline for automated build and testing
* AWS deployment for scalability and production hosting
* Authentication & user management
* Pagination for large chat histories
* Scalable architecture (separate message collection)

---

##  Run Locally

```
npm install
nodemon server.js
```

---

##  Learning Highlights

* Designed thread-message schema
* Built REST APIs using Express
* Managed async flows and error handling
* Integrated external AI service

---

##  Status

 Backend completed
 
 Frontend in progress

