# Capstone Project — Full Stack Blog App
## Deployment Guide (Step by Step)

---

## 🛠 Bugs Fixed in This Version

### Backend
| File | Bug | Fix |
|------|-----|-----|
| `server.js` | Missing `dotenv` import, duplicate `scripts` in package.json | Added `import 'dotenv/config'`, cleaned package.json |
| `middleware/verifyToken.js` | Used `dotenv config()` manually, unnecessary | Removed; dotenv loaded once in server.js |
| All API files | Import path was `../middlewares/verifyToken` (wrong folder name) | Fixed to `../middleware/verifyToken.js` |
| `APIs/AuthorAPI.js` | Null check for `author` was AFTER accessing `author.email` (crash) | Moved null check first |
| `.env` | Key was `MONGO_URI` but code used `DB_URL`, `JWT_SECRET` vs `SECRET_KEY` | Standardised to `DB_URL` and `SECRET_KEY` |

### Frontend
| File | Bug | Fix |
|------|-----|-----|
| `App.jsx` | Imported `WriteArticles` but component file is named `WriterArticles` | Fixed import name |
| `config.js` | Default URL pointed to port `4000` but backend runs on `5000` | Fixed to `5000` |
| `Register.jsx` | Error display showed CSS class name instead of error message | `{apiError && <p className={errorClass}>{apiError}</p>}` |
| `ArticleById.jsx` | Used `react-toastify` but project uses `react-hot-toast` | Fixed import |
| All components | Imports used `'../src/...'` (double path) | Fixed to relative `'../'` |

---

## 🚀 Step 1 — Set Up MongoDB Atlas (Free Database)

1. Go to https://cloud.mongodb.com and create a free account
2. Create a new **Cluster** (free tier M0)
3. Click **Connect → Drivers** and copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/capstone?retryWrites=true&w=majority
   ```
4. Go to **Network Access** → Add IP → **Allow from Anywhere** (`0.0.0.0/0`)

---

## 🖼 Step 2 — Set Up Cloudinary (Image Uploads)

1. Go to https://cloudinary.com and sign up free
2. From your Dashboard, copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

---

## 🔧 Step 3 — Run Backend Locally

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

## 💻 Step 4 — Run Frontend Locally

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

## ☁️ Step 5 — Deploy Backend to Render (Free)

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

## 🌐 Step 6 — Deploy Frontend to Vercel (Free)

1. Push your **Frontend** folder to a GitHub repository
2. Go to https://vercel.com → New Project → Import repo
3. Framework: **Vite**
4. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com` (from Step 5)
5. Deploy → Copy your frontend URL

---

## 🔗 Step 7 — Connect Frontend ↔ Backend

1. Go back to **Render** → your backend service → **Environment**
2. Update `ALLOWED_ORIGINS`:
   ```
   http://localhost:5173,https://your-frontend.vercel.app
   ```
3. Redeploy backend

---

## 👤 Step 8 — Create First Admin User

Since admin registration is blocked from the UI (for security), create admin directly in MongoDB:

1. Go to MongoDB Atlas → Browse Collections → `users` collection
2. Insert document:
```json
{
  "firstName": "Admin",
  "email": "admin@yourdomain.com",
  "password": "$2a$10$...bcrypt_hash...",
  "role": "ADMIN",
  "isUserActive": true
}
```

**To get the bcrypt hash of your password**, run in terminal:
```bash
node -e "const b=require('bcryptjs'); b.hash('yourpassword',10).then(console.log)"
```

---

## 📁 Project Structure

```
Capstone Project/
├── Backend/
│   ├── APIs/
│   │   ├── AdminAPI.js       ← Admin routes
│   │   ├── AuthorAPI.js      ← Author routes
│   │   ├── CommonAPI.js      ← Auth (register/login/logout)
│   │   └── UserAPI.js        ← User routes
│   ├── config/
│   │   ├── cloudinary.js     ← Cloudinary setup
│   │   ├── cloudinaryUpload.js ← Upload helper
│   │   └── multer.js         ← File upload config
│   ├── middleware/
│   │   └── verifyToken.js    ← JWT auth middleware
│   ├── models/
│   │   ├── ArticleModel.js   ← Article schema
│   │   └── UserModel.js      ← User schema
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── Frontend/
    ├── src/
    │   ├── components/       ← All React components
    │   ├── store/
    │   │   └── authStore.js  ← Zustand auth state
    │   ├── styles/
    │   │   └── common.js     ← Shared Tailwind classes
    │   ├── App.jsx           ← Router setup
    │   ├── config.js         ← API base URL
    │   └── main.jsx
    ├── .env.example
    ├── package.json
    └── vite.config.js
```

---

## 🔑 API Routes Summary

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /auth/users | Public | Register |
| POST | /auth/login | Public | Login |
| GET | /auth/logout | Public | Logout |
| GET | /auth/check-auth | All roles | Auth check |
| GET | /user-api/articles | USER, ADMIN | All articles |
| PUT | /user-api/articles | USER, ADMIN | Add comment |
| POST | /author-api/articles | AUTHOR | Publish article |
| GET | /author-api/articles | AUTHOR | Own articles |
| PUT | /author-api/articles | AUTHOR | Edit article |
| PATCH | /author-api/articles | AUTHOR | Delete/Restore |
| GET | /admin-api/users | ADMIN | All users |
| GET | /admin-api/authors | ADMIN | All authors |
| PUT | /admin-api/users/:id/status | ADMIN | Toggle user |
| GET | /admin-api/articles | ADMIN | All articles |
