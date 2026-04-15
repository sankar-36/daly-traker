# Backend

This directory contains the Node.js/Express backend for the project.

Quick start

- Install dependencies:
  npm install
- Create a `.env` file with:
  - MONGO_URI - MongoDB connection string
  - JWT_SECRET - JWT signing secret
  - PORT - optional (default 5000)
- Start the server:
  npm start
  (or `npm run dev` if defined)

Notes:
- Do not commit `.env` to version control.
- See [package.json](package.json) for available scripts.
