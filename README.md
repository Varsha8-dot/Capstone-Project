# Capstone Project — Full Stack Blog App
## Deployment Guide (Step by Step)

---





##  Step 1 — Set Up MongoDB Atlas (Free Database)

1. Go to https://cloud.mongodb.com and create a free account
2. Create a new **Cluster** (free tier M0)
3. Click **Connect → Drivers** and copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/capstone?retryWrites=true&w=majority
   ```
4. Go to **Network Access** → Add IP → **Allow from Anywhere** (`0.0.0.0/0`)

---

## Step 2 — Set Up Cloudinary (Image Uploads)

1. Go to https://cloudinary.com and sign up free
2. From your Dashboard, copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

---

## Step 3 — Run Backend Locally

```bash
cd Backend
npm install
cp .env.example .env
```

Edit `.env` and fill in:
```
PORT=5000
DB_URL=mongodb+srv://...your Atlas URL...
SECRET_KEY=any_long_random_string_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ALLOWED_ORIGINS=http://localhost:5173
```

Then start:
```bash
npm start
```

---

## Step 4 — Run Frontend Locally

```bash
cd Frontend
npm install
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000
```

Then start:
```bash
npm run dev
```

Open http://localhost:5173

---

##  Step 5 — Deploy Backend to Render (Free)

1. Push your **Backend** folder to a GitHub repository
2. Go to https://render.com → New → **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add all `.env` variables in Render's **Environment** tab
6. Set `NODE_ENV=production`
7. Deploy → Copy your backend URL (e.g. `https://my-blog-api.onrender.com`)

---

##  Step 6 — Deploy Frontend to Vercel (Free)

1. Push your **Frontend** folder to a GitHub repository
2. Go to https://vercel.com → New Project → Import repo
3. Framework: **Vite**
4. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com` (from Step 5)
5. Deploy → Copy your frontend URL

---

##  Step 7 — Connect Frontend ↔ Backend

1. Go back to **Render** → your backend service → **Environment**
2. Update `ALLOWED_ORIGINS`:
   ```
   http://localhost:5173,https://your-frontend.vercel.app
   ```
3. Redeploy backend

---

##  Step 8 — Create First Admin User

Since admin registration is blocked from the UI (for security), create admin directly in MongoDB:

1. Go to MongoDB Atlas → Browse Collections → `users` collection
2. Insert document:


**To get the bcrypt hash of your password**, run in terminal:
```bash
node -e "const b=require('bcryptjs'); b.hash('yourpassword',10).then(console.log)"
```


