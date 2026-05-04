# RENTO - Quick Setup Guide for Local Development

## ⏱️ 3-Minute Quick Start (No Database Setup! 🎉)

### Prerequisites Installed? ✅
- Java JDK 17+
- Maven 3.6+ (comes with project via mvnw)
- Node.js 16+

**✨ That's it! No MySQL installation needed! H2 in-memory database is auto-loaded.**

---

## Step-by-Step Setup

### 1️⃣ Clone & Navigate
```bash
git clone <your-repo-url>
cd RENTO
```

### 2️⃣ No Database Setup Required!
The project now uses **H2 in-memory database** for development.

✅ **Automatic features:**
- Database tables created automatically on startup
- Sample data loaded automatically (users, rooms, messages, etc.)
- All rooms have Cloudinary image URLs
- No MySQL installation needed

### 3️⃣ Configure Frontend (Already has Cloudinary credentials)

**File:** `rento-frontend/.env`

Already configured with Cloudinary (shared credentials):
```
VITE_CLOUDINARY_CLOUD_NAME=dhqldyxqx
VITE_CLOUDINARY_UPLOAD_PRESET=RentHub
VITE_API_BASE_URL=http://localhost:8080
```

**For production**, change:
```
VITE_API_BASE_URL=https://your-backend-domain.com
```

### 4️⃣ Install Frontend Dependencies
```bash
cd rento-frontend
npm install
```

---

## ▶️ Running for Development

### Terminal 1: Start Backend
```bash
cd rento-backend
./mvnw spring-boot:run
```
✅ Backend runs on `http://localhost:8080`
✅ H2 console available at: `http://localhost:8080/h2-console` (optional debugging)

### Terminal 2: Start Frontend
```bash
cd rento-frontend
npm run dev
```
✅ Frontend runs on `http://localhost:5173`

### Open Browser
👉 Navigate to: **http://localhost:5173**

---

## 🗂️ Sample Data Included

When the backend starts, you'll automatically have:

**Test Users:**
- **Owner:** owner@rento.com (password: `admin123`)
- **Renter:** renter@rento.com (password: `admin123`)

**Sample Room:**
- 2BHK Modern Apartment in Mumbai
- Images from Cloudinary
- Full booking history

**Chat Conversation:**
- Sample messages between owner and renter

---

## ❓ Common Questions

### Q: Do I need MySQL?
**A:** No! The project now uses H2 in-memory database for local development. Much simpler!

### Q: Do I need to configure anything?
**A:** No! Everything is pre-configured. Just:
1. Clone the repo
2. Run backend
3. Run frontend
4. Open http://localhost:5173

### Q: Data persists across restarts?
**A:** No, H2 in-memory is reset on restart. That's intentional for development (fresh state each time).

### Q: Backend won't start - "Port 8080 in use"?
**A:** Edit `rento-backend/src/main/resources/application.properties`:
```properties
server.port=8081  # Use different port
```

### Q: Frontend showing "Cannot GET /api/..."?
**A:** Ensure backend is running first, then check the API URL in `rento-frontend/.env`

### Q: npm install fails?
**A:** Try:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 What Gets Created

After running both apps:
```
Frontend:
- Runs from memory (dev server)
- Hot reload on file changes

Backend:
- H2 in-memory database
- Tables auto-created
- Sample data auto-loaded
```

---

## 🔗 API Communication Flow

```
Browser (http://localhost:5173)
    ↓
Frontend React App
    ↓ (HTTP/WebSocket)
Backend Spring Boot (http://localhost:8080)
    ↓
H2 In-Memory Database
```

---

## ✨ You're All Set!

1. ✅ No database setup needed
2. ✅ Frontend dependencies installed
3. ✅ Backend running in terminal 1
4. ✅ Frontend running in terminal 2
5. ✅ Open http://localhost:5173

**Happy coding! 🚀**


