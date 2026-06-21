# 🌿 FloraNursery — Full Stack Plant Shopping App

## Tech Stack
- **Frontend:** React + Vite + Lucide Icons
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas
- **Payment:** Razorpay

---

## 🚀 Setup Instructions

### Step 1 — Backend Setup

```bash
cd nursery-backend
npm install
```

Open `nursery-backend/.env` and fill in your Razorpay keys:

```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
```

Open `nursery-frontend/.env` and set the same key:

```
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

Seed the database with sample plants:

```bash
node seed.js
```

Start the backend:

```bash
node server.js
```

---

### Step 2 — Frontend Setup

```bash
cd nursery-frontend
npm install
npm run dev
```

Open: https://flora-nursery1.onrender.com

---

### Step 3 — Make yourself Admin

1. Register an account on the website
2. Run this from `nursery-backend/`:

```bash
node makeAdmin.js your@email.com
```

3. Log out and log back in — you'll see the Admin link in the navbar

---

## 💳 Razorpay Setup (IMPORTANT)

### Why you got "Rejected":
Razorpay rejected your GitHub URL because they need a **live public website**, not a code repo.

### Fix — Use Test Mode (No approval needed):
1. Go to https://dashboard.razorpay.com
2. Click **"Switch to test mode"** (top right)
3. Go to **Settings → API Keys**
4. Click **"Generate Test Key"**
5. Copy the **Key ID** and **Key Secret**
6. Paste them into both `.env` files above

### Test Mode Credentials (use these in the payment popup):

| Method | What to enter |
|--------|--------------|
| UPI | Type `success@razorpay` as UPI ID (do NOT scan QR with real phone) |
| Card | `4111 1111 1111 1111`, Expiry: `12/30`, CVV: `123` |
| Card (failure test) | `4000 0000 0000 0002` |

---

## 📁 Project Structure

```
FloraNursery/
├── nursery-backend/
│   ├── controllers/     — Business logic
│   ├── middleware/      — Auth & admin guards
│   ├── models/          — MongoDB schemas
│   ├── routes/          — API endpoints
│   ├── uploads/         — Plant images (auto-created)
│   ├── server.js        — Entry point
│   ├── seed.js          — Sample data
│   └── makeAdmin.js     — Promote user to admin
│
└── nursery-frontend/
    └── src/
        ├── components/  — Navbar, Chatbot
        ├── pages/       — All pages
        └── services/    — Axios API client
```

---

## ✅ Features

- Product listing with search, filters, categories
- Product detail page with plant care guide
- Cart with quantity management
- Wishlist
- Address management
- Checkout with COD + Razorpay payment
- Order tracking timeline
- Reviews (only for verified buyers)
- Admin dashboard — add/edit/delete products, manage orders
- Plant care chatbot
- Seasonal recommendations
