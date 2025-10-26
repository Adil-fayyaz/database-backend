# 🚀 Quick Start Guide - PrivateServerX

Get up and running in 5 minutes!

---

## Step 1: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install dashboard dependencies
cd dashboard
npm install
cd ..
```

## Step 2: Setup Environment

Create a `.env` file in the root directory:

```bash
cp env.template .env
```

Default `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/privateserverx
JWT_SECRET=change_this_to_a_random_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

## Step 3: Start MongoDB

**Option A: Using Docker (Easiest)**
```bash
docker-compose up -d mongodb
```

**Option B: Local MongoDB**
```bash
# If MongoDB is installed locally, just make sure it's running
mongod
```

## Step 4: Start Backend

```bash
# Terminal 1
npm start
```

Server will run on: `http://localhost:5000`

## Step 5: Start Dashboard

```bash
# Terminal 2
cd dashboard
npm run dev
```

Dashboard will run on: `http://localhost:3000`

## Step 6: Access Everything

- **Dashboard**: http://localhost:3000
- **API Docs**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

---

## 📱 Test the API

### Register a User

Open terminal and run:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123"
  }'
```

Save the returned `token` for authenticated requests.

### Login to Dashboard

1. Go to http://localhost:3000
2. Use the email and password you registered
3. You should see the dashboard!

---

## 🎉 Done!

You now have a fully functional private server running locally.

### Next Steps:
- Check the API documentation at `/api-docs`
- Upload files through the dashboard
- Test sending messages through the API
- Customize the UI in `dashboard/src/components`

---

## 🔧 Troubleshooting

**Port already in use?**
- Change the PORT in `.env` file

**MongoDB connection error?**
- Make sure MongoDB is running: `docker-compose up -d mongodb` or check local MongoDB

**Dashboard not loading?**
- Make sure you're in the dashboard directory when running `npm run dev`
- Check that port 3000 is not already in use

---

**Need help?** Check the full README.md for detailed documentation.

