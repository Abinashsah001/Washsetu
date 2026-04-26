# 🚀 Wash Setu: One-Day Deployment Guide

This guide outlines the steps to deploy the Wash Setu application (Frontend + Backend) in record time.

## 1. Prerequisites
- A GitHub account.
- Basic knowledge of Git.
- (Optional) A domain name from a provider like Namechip or GoDaddy.

---

## 2. Frontend Deployment (Fastest Method: Vercel)
Vercel is the easiest platform to deploy Vite-based React apps.

1.  **Push your code to GitHub**: Create a new repository and push the entire `washsetu` project.
2.  **Connect to Vercel**:
    - Log in to [Vercel](https://vercel.com/dashboard).
    - Click "Add New" -> "Project".
    - Import your Wash Setu repository.
3.  **Configure Build Settings**:
    - Build Command: `npm run build`
    - Output Directory: `dist`
4.  **Install & Deploy**: Click "Deploy". Vercel will give you a production-ready URL (e.g., `washsetu.vercel.app`).

---

## 3. Backend Deployment (Railway or Render)
For a Node.js/Express backend with SQLite, Railway is highly recommended for simplicity.

### Via Railway (Recommended)
1.  **Login to [Railway](https://railway.app/)**.
2.  **Create a New Project** -> "Deploy from GitHub repo".
3.  **Select Repository**.
4.  **Root Directory**: Set this to `server`.
5.  **Environment Variables**:
    - Add `PORT=5001`.
6.  **Prisma Setup**: Railway will automatically run the `start` command. Ensure your `package.json` in the `server` folder has:
    ```json
    "scripts": {
      "start": "npx prisma db push && node index.js"
    }
    ```
7.  **Public URL**: Railway will provide a backend URL (e.g., `washsetu-production.up.railway.app`).

---

## 4. Connecting Frontend to Backend
Once you have the backend URL from Railway:

1.  Open `src/App.tsx`.
2.  Update the `fetch` URL in `handleOTPVerify`:
    ```javascript
    const response = await fetch('https://your-backend-url.railway.app/api/bookings', { ... });
    ```
3.  Commit and push to GitHub. Vercel will automatically re-deploy with the new backend link.

---

## 5. Persistence (The SQLite Warning)
> [!WARNING]
> SQLite on services like Railway/Render is **ephemeral**. This means if the server restarts, your data will be lost. For a "One-Day" demo, this is usually acceptable. For long-term production, switch to **PostgreSQL** (available as a one-click add-on in Railway).

### Switching to PostgreSQL (Post-Demo)
1.  Change `provider = "sqlite"` to `provider = "postgresql"` in `server/prisma/schema.prisma`.
2.  Change `url = "file:./dev.db"` to `url = env("DATABASE_URL")`.
3.  Re-run `npx prisma db push`.

---

## 🎉 You're Live! 
Your application is now globally accessible.
- **Frontend URL**: `https://washsetu.vercel.app`
- **Backend API**: `https://washsetu.up.railway.app/api/bookings`
