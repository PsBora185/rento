# RENTO - Quick Setup Guide for Local Development

## ⏱️ 5-Minute Quick Start

### Prerequisites Installed? ✅
- Java JDK 17+
- Maven 3.6+ (comes with project via mvnw)
- Node.js 16+
- MySQL 8.0+

---

## Step-by-Step Setup

### 1️⃣ Clone & Navigate
```bash
git clone <your-repo-url>
cd RENTO
```

### 2️⃣ Database Setup (MySQL)

**Step 1:** Start MySQL and create database
```bash
mysql -u root -p

# In MySQL console:
CREATE DATABASE rento_db;
EXIT;
```

**Important:** Do NOT create tables manually - Flyway migrations handle this automatically!

**Step 2:** Update database credentials in `rento-backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/rento_db
spring.datasource.username=root
spring.datasource.password=your_password
```

📚 **For detailed database setup info, see:** `rento-backend/DATABASE_SETUP.md`

### 4️⃣ Configure Frontend (Optional)

**Create file:** `rento-frontend/.env.local`
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### 5️⃣ Install Frontend Dependencies
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

### Terminal 2: Start Frontend
```bash
cd rento-frontend
npm run dev
```
✅ Frontend runs on `http://localhost:5173`

### Open Browser
👉 Navigate to: **http://localhost:5173**

---

## ❓ Common Questions

### Q: Do I need to run `npm run build`?
**A:** No. For local development:
- Use `npm run dev` (hot reload, faster development)
- Use `npm run build` only for production deployment

### Q: Backend won't start - "Port 8080 in use"?
**A:** Edit `rento-backend/src/main/resources/application.properties`:
```properties
server.port=8081  # Use different port
```

### Q: Frontend showing "Cannot GET /api/..."?
**A:** Ensure backend is running first, then check `.env.local` file configuration

### Q: MySQL connection fails?
**A:** Check:
1. MySQL server is running
2. Database `rento_db` exists
3. Username/password in `application.properties` are correct

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
- Database tables auto-created
- Tables populated in `rento_db`

Uploads:
- User images go to `rento-backend/uploads/`
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
MySQL Database (rento_db)
```

---

## ✨ You're All Set!

1. ✅ Database running
2. ✅ Backend config updated
3. ✅ Frontend dependencies installed
4. ✅ Backend running in terminal 1
5. ✅ Frontend running in terminal 2
6. ✅ Open http://localhost:5173

**Happy coding! 🚀**
