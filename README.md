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
- **Maven 3.6+** - [Download](https://maven.apache.org/download.cgi)

### For Frontend (React + Vite)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **npm 8+** (comes with Node.js)

### Database
- **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/mysql/)

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

#### Step 1: Configure Database

1. Start MySQL server
2. Create a new database:
   ```sql
   CREATE DATABASE rento_db;
   ```

3. Update database credentials in `rento-backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/rento_db
   spring.datasource.username=root
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=false
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
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

### 3. Frontend Setup

#### Step 1: Install Dependencies

```bash
cd rento-frontend
npm install
```

#### Step 2: Configure Environment (Optional)

Create a `.env.local` file in `rento-frontend/` if needed:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

#### Step 3: Run Development Server

```bash
npm run dev
```

The frontend will typically start on **http://localhost:5173**

## Running Both Applications

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
- **Database connection failed**: Verify MySQL is running and credentials are correct
- **Maven build fails**: Run `./mvnw clean` to clear cache

### Frontend Issues
- **Dependencies not installing**: Try `npm cache clean --force` then `npm install`
- **CORS errors**: Ensure backend is running on the correct port
- **Port 5173 in use**: Vite will automatically use the next available port

### Database Issues
- **Migration errors**: Check `rento-backend/src/main/resources/db/migration/` for SQL scripts
- **Tables not created**: Ensure `spring.jpa.hibernate.ddl-auto=update` is set

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
