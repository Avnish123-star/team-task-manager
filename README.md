# Team Task Manager (Full-Stack)

A robust Task Management system built with the MERN stack, featuring Role-Based Access Control (RBAC), real-time status tracking, and automated overdue monitoring.

## Features
- **Role-Based Access:** Distinct workflows for Admins (Management) and Members (Execution).
- **Task Tracking:** Full lifecycle management (Todo -> In Progress -> Done).
- **Time Intelligence:** Tracks assignment day/date/time and monitors deadlines for overdue alerts.
- **Secure Auth:** JWT-based authentication with protected API routes.

##  Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (NoSQL)
- **Deployment:** Railway

## Setup Instructions
1. Clone the repo.
2. Run `npm install` in both `client` and `server` folders.
3. Configure `.env` with `MONGO_URI` and `JWT_SECRET`.
4. Run `node index.js` (Server) and `npm run dev` (Client).