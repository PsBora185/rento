# RENTO - Room Rental Platform

A full-stack web application for room rental management built with Spring Boot (backend) and React with Vite (frontend).

## Project Overview

RENTO is a room rental platform that connects room owners with renters. The platform includes:
- User authentication and role-based access control (Owner/Renter)
- Room listing and management
- Real-time chat system
- Booking management
- Image upload and gallery management

## Prerequisites

Before you begin, ensure you have the following installed:

### For Backend (Spring Boot)
- **Java JDK 17 or higher** - [Download](https://www.oracle.com/java/technologies/downloads/)
- **Maven 3.6+** - [Download](https://maven.apache.org/download.cgi) *or use Maven wrapper (mvnw)*

### For Frontend (React + Vite)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **npm 8+** (comes with Node.js)

### Database
- **None needed!** 🎉 The project uses **H2 in-memory database** for local development
  - No MySQL installation required
  - Sample data auto-loaded on startup

## Project Structure

```
RENTO/
├── rento-backend/          # Spring Boot backend application
│   ├── src/
│   ├── pom.xml            # Maven configuration
│   └── mvnw/mvnw.cmd      # Maven wrapper
│
├── rento-frontend/        # React + Vite frontend application
│   ├── src/
│   ├── package.json       # Node dependencies
│   └── vite.config.js     # Vite configuration
│
├── README.md              # This file
└── .gitignore            # Git ignore rules
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-remote-repo-url>
cd RENTO
```

### 2. Backend Setup

#### Step 1: No Database Configuration Needed! 🎉

The project uses **H2 in-memory database** which:
- ✅ Requires no installation
- ✅ Creates tables automatically
- ✅ Loads sample data automatically

Check `rento-backend/src/main/resources/application.properties` - it's already configured:
```properties
# H2 In-Memory Database (auto-configured)
spring.datasource.url=jdbc:h2:mem:rento_db
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
```

#### Step 2: Build and Run

```bash
cd rento-backend

# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

The backend will start on **http://localhost:8080**

#### Optional: Access H2 Console
- **URL:** http://localhost:8080/h2-console
- **Username:** sa
- **Password:** (leave blank)

### 3. Frontend Setup

#### Step 1: Install Dependencies

```bash
cd rento-frontend
npm install
```

#### Step 2: Environment Configuration

The `.env` file is already configured with Cloudinary credentials:
```
VITE_CLOUDINARY_CLOUD_NAME=dhqldyxqx
VITE_CLOUDINARY_UPLOAD_PRESET=RentHub
VITE_API_BASE_URL=http://localhost:8080
```

**For production**, update `VITE_API_BASE_URL` to your backend domain:
```
VITE_API_BASE_URL=https://your-backend-domain.com
```

#### Step 3: Run Development Server

```bash
npm run dev
```

The frontend will typically start on **http://localhost:5173**

---

## 📋 Quick Configuration Checklist

After cloning, you're ready to go! No additional setup needed!

### ✅ Backend Ready
- [x] H2 database auto-configured
- [x] Tables created automatically
- [x] Sample data loaded automatically

### ✅ Frontend Ready
- [ ] Run `npm install` to install dependencies
- [x] Cloudinary credentials already configured
- [x] API base URL already configured

### ✅ Sample Data Included
```
Test Users:
- Owner: owner@rento.com / password: admin123
- Renter: renter@rento.com / password: admin123

Sample Room:
- 2BHK Modern Apartment with Cloudinary images
- Complete booking and chat history
```

### ✅ Install Dependencies
```bash
# Backend - uses Maven wrapper (automatic)
# Frontend - install npm dependencies
cd rento-frontend
npm install
```

### ✅ Build for Development vs Production
**For LOCAL DEVELOPMENT:**
```bash
cd rento-frontend
npm run dev          # Runs Vite dev server with hot reload
```

**For PRODUCTION BUILD:**
```bash
cd rento-frontend
npm run build        # Creates optimized files in dist/ folder
npm run preview      # Preview the production build locally
```

---

## 🚀 Running Both Applications

### Terminal 1 - Backend
```bash
cd rento-backend
./mvnw spring-boot:run
```

### Terminal 2 - Frontend
```bash
cd rento-frontend
npm run dev
```

Once both are running:
- Open your browser and go to **http://localhost:5173**
- The frontend will communicate with the backend API at **http://localhost:8080**

## Available Scripts

### Backend
- `./mvnw clean install` - Build the project
- `./mvnw spring-boot:run` - Run the application
- `./mvnw test` - Run tests

### Frontend
- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Important Configuration Notes

### Cloudinary Integration
- Image uploads are configured via Cloudinary
- Update your Cloudinary credentials in the application configuration files
- Backend: Check `rento-backend/src/main/resources/application.properties`
- Frontend: Check `rento-frontend/src/api/cloudinary.js`

### WebSocket (Chat Feature)
- Real-time chat uses WebSocket
- Default endpoint: `ws://localhost:8080/ws`
- Ensure backend is running for chat functionality

### CORS Configuration
- Frontend communicates with backend API
- CORS is configured in the backend to allow requests from `http://localhost:5173`
- If you change the frontend URL, update CORS settings in backend

## Troubleshooting

### Backend Issues
- **Port 8080 in use**: Change `server.port` in `application.properties`
- **H2 console not accessible**: Ensure `spring.h2.console.enabled=true` in `application.properties`
- **Maven build fails**: Run `./mvnw clean` to clear cache
- **Sample data not loading**: Ensure `/src/main/resources/data.sql` exists

### Frontend Issues
- **Dependencies not installing**: Try `npm cache clean --force` then `npm install`
- **CORS errors**: Ensure backend is running on the correct port and `VITE_API_BASE_URL` is correct
- **Port 5173 in use**: Vite will automatically use the next available port
- **Cloudinary images not working**: Check `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` in `.env`

### Database Issues
- **H2 database reset on restart**: This is normal - H2 in-memory database resets when the app stops
- **For persistent database**: Use H2 in file mode by changing:
  ```properties
  spring.datasource.url=jdbc:h2:file:~/rento_db
  ```
- **H2 file location**: By default stored in user home directory

## Development Workflow

1. Keep the backend running in one terminal
2. Keep the frontend running in another terminal
3. Make changes to either application
4. Frontend hot-reloads automatically with Vite
5. Backend requires restart for Java code changes

## Testing

### Backend Tests
```bash
cd rento-backend
./mvnw test
```

### Frontend Tests (if configured)
```bash
cd rento-frontend
npm test
```

## Production Build

### Backend
```bash
cd rento-backend
./mvnw clean package
```
Creates a JAR file in `target/` directory.

### Frontend
```bash
cd rento-frontend
npm run build
```
Creates optimized files in `dist/` directory.

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test locally
4. Commit with clear messages
5. Push to remote repository

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review your configuration files
3. Ensure all prerequisites are installed
4. Check backend/frontend logs for errors

## License

[Specify your license here]

---

**Happy coding! 🚀**
