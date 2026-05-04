# Database Setup & Flyway Migrations

## Overview

The RENTO backend uses **Flyway** for database versioning and migrations. When you start the application for the first time, Flyway automatically:

1. Creates all required tables (schema)
2. Loads sample data (rooms, users, chat tables, etc.)
3. Tracks migration history in the `flyway_schema_history` table

## How It Works

### Migration Files

Located in: `rento-backend/src/main/resources/db/migration/`

```
V001__Create_Chat_Tables.sql          # Create chat system tables
V002__Initial_Schema_And_Data.sql     # Create all other tables + load sample data
```

Flyway executes migrations in version order (V001 → V002 → ...).

## Setup Instructions

### 1️⃣ Create Empty Database

```bash
mysql -u root -p

# In MySQL console:
CREATE DATABASE rento_db;
EXIT;
```

**Note:** Do NOT create tables manually. Flyway will do it automatically.

### 2️⃣ Update Database Credentials

Edit: `rento-backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/rento_db
spring.datasource.username=root
spring.datasource.password=your_password
```

### 3️⃣ Build Backend

```bash
cd rento-backend
./mvnw clean install
```

Flyway dependencies will be downloaded automatically.

### 4️⃣ Start Backend

```bash
./mvnw spring-boot:run
```

On first run:
- ✅ Flyway creates all tables
- ✅ Sample data is inserted
- ✅ `flyway_schema_history` table tracks migrations
- ✅ Application ready to use

## What Data Gets Loaded?

The `V002__Initial_Schema_And_Data.sql` includes:

- **Users**: Sample owner and renter accounts
- **Rooms**: Example rental listings with details
- **Bookings**: Sample booking records
- **Reviews**: User reviews and ratings
- **Chat Messages**: Conversation history

**Your actual data from the database dump is included!**

## Troubleshooting

### "Migration failed"
```bash
# Rebuild and clean cache
./mvnw clean install
```

### "Table already exists"
- Delete the database: `DROP DATABASE rento_db;`
- Create new empty database: `CREATE DATABASE rento_db;`
- Restart the app

### "Flyway_schema_history table missing"
- This table is created automatically by Flyway
- If missing, database connection issue

### "Data not loaded"
- Check `application.properties` database credentials
- Ensure MySQL is running
- Check application logs for errors

## Modifying Migrations

### To Add New Migrations:

1. Create new file: `V003__Your_Feature.sql`
2. Add SQL commands
3. Restart application
4. Flyway executes automatically

**Important**: Never modify existing V001 or V002 files after running them.

### To Undo (Advanced):

Use Flyway Undo (requires paid version) or:
1. Drop and recreate database
2. Modify migration file
3. Restart application

## Environment Variables

Set in: `rento-backend/src/main/resources/application.properties`

```properties
# Flyway Configuration
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.out-of-order=false
spring.flyway.validate-on-migrate=true
```

## For Your Friend

When your friend clones the repo:

```bash
cd rento-backend

# 1. Database setup
mysql -u root -p
CREATE DATABASE rento_db;
EXIT;

# 2. Update credentials
# Edit application.properties with their MySQL password

# 3. Build and run (Flyway handles everything)
./mvnw clean install
./mvnw spring-boot:run
```

**That's it!** No manual SQL imports needed. Flyway does it all automatically.

---

**Flyway Documentation**: https://flywaydb.org/documentation/
