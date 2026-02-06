# Task Manager

Simple Task Manager app using Node.js, Express, at MongoDB. May hiwalay na **Frontend** at **Backend**.

## Project Structure

```
Starting/
├── BACKEND
│   ├── server.js              # Entry point
│   ├── models/
│   │   └── Task.js            # Mongoose schema
│   ├── controllers/
│   │   └── taskController.js  # Business logic (CRUD)
│   └── routes/
│       └── tasks.js           # API routes
│
├── FRONTEND (public/)
│   ├── index.html             # Main page
│   ├── css/
│   │   └── style.css          # Styles
│   └── js/
│       ├── api.js             # API client (communicates with backend)
│       └── app.js             # UI logic
│
└── package.json
```

## API Endpoints (Backend)

| Method | Endpoint       | Description    |
|--------|----------------|----------------|
| GET    | /api/tasks     | Get all tasks  |
| GET    | /api/tasks/:id | Get one task   |
| POST   | /api/tasks     | Create task    |
| PATCH  | /api/tasks/:id | Update task    |
| DELETE | /api/tasks/:id | Delete task    |

## Paano I-run

1. `npm install`
2. Siguraduhing tumatakbo ang MongoDB
3. `npm start`
4. Buksan: `http://localhost:3000`
