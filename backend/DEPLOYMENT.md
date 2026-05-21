# Deployment Instructions

This guide covers deploying the Background Verification Platform to a full production environment.

## 1. Database (Neon PostgreSQL)

1. Go to [Neon.tech](https://neon.tech) and create a new project.
2. Under your new project dashboard, find the **Connection Details**.
3. Copy the Postgres connection string.
4. Note this string down for your Backend environment variable `DATABASE_URL`.

## 2. Backend (Render)

1. Push your backend code to a GitHub repository.
2. Log into [Render.com](https://render.com) and click **New Web Service**.
3. Connect your GitHub repository.
4. **Build Command**: `npm install && npm run build`
5. **Start Command**: `npm run start`
6. Under **Environment Variables**, add:
   - `DATABASE_URL`: Your Neon connection string.
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: A strong random string.
   - `FRONTEND_URL`: The URL of your Vercel deployment (you can update this after deploying frontend).
7. Deploy the service. Render will provide a URL (e.g., `https://background-v-backend.onrender.com`).

*Note for Puppeteer on Render: You may need to add a Render build environment or skip chromium download depending on Render's native puppeteer support.*

## 3. Frontend (Vercel)

1. Push your frontend code to a GitHub repository.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your frontend repository.
4. **Framework Preset**: Vite
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. Under **Environment Variables**, add:
   - `VITE_API_URL`: The Render backend URL you received in step 2 (e.g., `https://background-v-backend.onrender.com/api`).
8. Deploy the service.

## 4. Finalize

Once Vercel gives you the frontend domain (e.g., `https://background-verification.vercel.app`), go back to your **Render** backend environment variables and update `FRONTEND_URL` to match it. This ensures CORS is correctly configured.
