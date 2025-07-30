# Chat-App
Mern stack 

// instructions to setup and run project

 
  Tech Stack
Frontend: React (Vite)
Backend: Node.js + Express + Socket.IO
Database: MySQL


Create MySQL Database-----
MySQL Workbench--

Run the following SQL:

CREATE DATABASE chat_app;

USE chat_app;

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender VARCHAR(100),
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Configure Environment Variables---
Create a .env file inside server/:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Root
DB_NAME=chat_app

---setup project----
git clone https://github.com/mallikarjun1507/Chat-App.git
cd Chat-App
code .

Backend Setup (/server)
a. Install Dependencies
cd server
npm install

---Start the Backend Server----

node index.js


-----Frontend Setup (/client)----------
a. Install Dependencies
cd ../client
npm install

-----Create .env in /client with the backend URL---
VITE_BACKEND_URL=http://localhost:5000

---Start the Frontend---
npm run dev
