# ☕ Taco Town cafe — Ordering Website MVP

A **mobile-first food ordering website** for Chachu Café, located at Lowgate near LPU. Built for students to browse and order chai, sandwiches, pizza, and confectionery online.

---

## 🚀 Tech Stack

| Layer      | Technology                      |
|------------|---------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS  |
| State      | React Context + useReducer      |
| Backend    | Node.js + Express               |
| Database   | MongoDB + Mongoose               |
| Auth       | JWT (admin panel)               |

---

## 📁 Project Structure

```
chachoo website/
├── client/     ← React frontend (port 3000)
└── server/     ← Express backend (port 5000)
```

---

## ⚙️ Setup & Running

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd server

# Configure environment
# Edit .env — set your MONGO_URI

# Install (already done)
npm install

# Start dev server
npm run dev

# Seed menu data (run once)
npm run seed
```

### 2. Frontend Setup

```bash
cd client

# Install (already done)
npm install

# Start dev server (opens at localhost:3000)
npm run dev
```

---

## 🌿 MongoDB Setup Options

### Option A: MongoDB Atlas (Recommended for Production)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Copy the connection string
4. Update `server/.env`:
   ```
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/chachu_cafe
   ```

### Option B: Local MongoDB
1. Install MongoDB Community: [mongodb.com/try/download](https://www.mongodb.com/try/download/community)
2. Start: `mongod --dbpath /data/db`
3. `.env` already has `mongodb://localhost:27017/chachu_cafe`

---

## 🌐 API Endpoints

| Method | Endpoint              | Description             | Auth  |
|--------|-----------------------|-------------------------|-------|
| GET    | `/api/menu`           | All menu items          | No    |
| GET    | `/api/menu?category=` | Filter by category      | No    |
| POST   | `/api/orders`         | Place new order         | No    |
| GET    | `/api/orders`         | All orders (admin)      | JWT   |
| GET    | `/api/orders/:id`     | Single order by ID      | No    |
| PUT    | `/api/orders/:id`     | Update order status     | JWT   |
| GET    | `/api/orders/stats`   | Dashboard stats         | JWT   |
| POST   | `/api/admin/login`    | Admin login → JWT token | No    |
| GET    | `/api/health`         | Health check            | No    |

---

## 🔐 Admin Panel

- **URL**: `http://localhost:3000/admin`
- **Default credentials**:
  - Username: `chachu_admin`
  - Password: `chachu@2024`
- Change these in `server/.env` before deployment!

---

## 🍽️ Menu Categories

| Category      | Items | Price Range |
|---------------|-------|-------------|
| 🍵 Chai       | 6     | ₹10 – ₹35  |
| 🥪 Sandwiches | 5     | ₹40 – ₹75  |
| 🍕 Pizza      | 5     | ₹120 – ₹159|
| 🍰 Confectionery | 6  | ₹15 – ₹55  |

---

## 🚢 Deployment

### Frontend → Vercel
```bash
cd client
npm run build
# Deploy dist/ to Vercel or run: npx vercel
```
Set environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

### Backend → Render
1. Connect GitHub repo to Render
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `server/.env`

---

## 🗺️ Pages

| Route                         | Description               |
|-------------------------------|---------------------------|
| `/`                           | Home — categories & hero  |
| `/menu`                       | Menu with search & filter |
| `/checkout`                   | Checkout form             |
| `/order-confirmation/:id`     | Order confirmed + tracker |
| `/admin`                      | Admin login               |
| `/admin/dashboard`            | Stats dashboard           |
| `/admin/orders`               | Orders management         |

---

## 🔮 Future Roadmap
- [ ] Razorpay payment integration
- [ ] Real-time order tracking with WebSockets
- [ ] Customer login / order history
- [ ] Push notifications
- [x] Menu management from admin panel
- [x] Analytics dashboard
