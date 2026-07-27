# BlueWave - Billing Portal

A modern full-stack billing and invoice management system built with **React**, **Vite**, **Tailwind CSS** (frontend) and **.NET Core 8** (backend).

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

BlueWave is a comprehensive billing portal designed for managing buyers, products, pricing, and invoices. It provides:

- **Buyer Management** - Create and manage buyer profiles
- **Product Catalog** - Maintain product inventory with categories
- **Dynamic Pricing** - Set custom prices per buyer
- **Invoice Generation** - Create invoices with line items
- **PDF Export** - Download invoices as PDF documents

---

## ✨ Features

✅ **Buyer Management**
- Create, update, and list buyers
- Store GSTIN, contact info, and addresses
- Track buyer status

✅ **Product Catalog**
- Organize products by categories
- Manage product inventory
- Set base prices

✅ **Price Management**
- Custom pricing per buyer-product combination
- Flexible pricing model

✅ **Invoice System**
- Create invoices with multiple line items
- Track invoice status
- Generate PDF exports
- View invoice history

✅ **Responsive UI**
- Built with Tailwind CSS
- Mobile-friendly design
- Modern component architecture

✅ **Health Monitoring**
- Built-in `/health` endpoint for deployment verification

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **Axios** - HTTP client
- **React Router 7** - Client-side routing
- **html2canvas & jsPDF** - PDF generation

### Backend
- **.NET Core 8** - Framework
- **ASP.NET Core Web API** - REST API
- **Entity Framework Core 8** - ORM
- **SQL Server** - Database
- **Swagger/Swagger UI** - API documentation

### Deployment
- **Netlify** - Frontend hosting
- **Render** - Backend hosting
- **Azure SQL Database** - Cloud database

---

## 📦 Prerequisites

### Global Requirements
- **Node.js** 18+ (for frontend)
- **.NET SDK 8.0** (for backend)
- **Git** for version control

### For Backend
- SQL Server instance (local or cloud)
- Connection string to database

### For Frontend
- Netlify account (for deployment)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd BlueWave
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:
```env
VITE_API_BASE_URL=http://localhost:5002
```

### 3. Backend Setup

```bash
cd backend/BlueWave-BP/BlueWave-BP.API
dotnet restore
```

Create `.env` file in the same directory:
```env
ConnectionStrings__DefaultConnection=Server=YOUR_SERVER;Initial Catalog=YOUR_DB;User ID=YOUR_USER;Password=YOUR_PASSWORD;
ASPNETCORE_ENVIRONMENT=Development
Cors__AllowedOrigins=http://localhost:5173
```

---

## 💻 Development

### Start Backend API

```bash
cd backend/BlueWave-BP/BlueWave-BP.API
dotnet run
```

API runs on `http://localhost:5002`

#### API Endpoints Available:
- `GET /health` - Health check
- `GET /swagger` - Swagger UI
- `POST /api/buyers` - Create buyer
- `GET /api/buyers` - List buyers
- `POST /api/products` - Create product
- `GET /api/products` - List products
- `POST /api/invoices` - Create invoice
- `GET /api/invoices` - List invoices

### Start Frontend Dev Server

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

### Build Frontend for Production

```bash
cd frontend
npm run build
```

Output: `frontend/dist/` folder

---

## 🌐 Deployment

### Backend Deployment (Render)

1. **Push code to GitHub**

2. **Connect to Render:**
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect your GitHub repository

3. **Configure Service:**
   - **Build Command:** `dotnet restore && dotnet publish -c Release`
   - **Start Command:** `dotnet BlueWave-BP.API.dll`
   - **Runtime:** `dotnet:8.0`

4. **Add Environment Variables in Render Dashboard:**
   ```
   ConnectionStrings__DefaultConnection = <your-connection-string>
   ASPNETCORE_ENVIRONMENT = Production
   Cors__AllowedOrigins = https://your-netlify-url.netlify.app
   DOTNET_HOSTBUILDER__RELOADCONFIGONCHANGE = false
   ```

5. **Deploy:**
   - Push changes to GitHub
   - Render automatically deploys

### Frontend Deployment (Netlify)

1. **Push code to GitHub**

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository

3. **Configure Build Settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

4. **Add Environment Variables:**
   - Go to **Site settings** → **Build & deploy** → **Environment**
   - Add: `VITE_API_BASE_URL=<your-render-backend-url>`

5. **Create `frontend/public/_redirects` file:**
   ```
   /* /index.html 200
   ```

6. **Deploy:**
   - Push to GitHub
   - Netlify automatically builds and deploys

---

## 📡 API Documentation

### Base URL
- **Development:** `http://localhost:5002/api`
- **Production:** `https://bluewave-billing-portal.onrender.com/api`

### Health Check
```
GET /health
Response: { "status": "healthy", "timestamp": "2026-07-27T..." }
```

### Buyer Endpoints
```
POST /buyers              - Create buyer
GET  /buyers              - List all buyers
GET  /buyers/{id}         - Get buyer details
PUT  /buyers/{id}         - Update buyer
DELETE /buyers/{id}       - Delete buyer
```

### Product Endpoints
```
POST /products            - Create product
GET  /products            - List products
GET  /products/{id}       - Get product details
PUT  /products/{id}       - Update product
```

### Invoice Endpoints
```
POST /invoices            - Create invoice
GET  /invoices            - List invoices
GET  /invoices/{id}       - Get invoice details
```

### Pricing Endpoints
```
POST /buyerproductprices  - Set custom price
GET  /buyerproductprices  - List all prices
```

---

## 🔐 Environment Variables

### Frontend (`.env.local` or Netlify)
```env
VITE_API_BASE_URL=https://your-backend-url.com
```

### Backend (`.env` or Render)
```env
ConnectionStrings__DefaultConnection=Server=...;Initial Catalog=...;
ASPNETCORE_ENVIRONMENT=Production
Cors__AllowedOrigins=https://your-frontend-url.netlify.app
DOTNET_HOSTBUILDER__RELOADCONFIGONCHANGE=false
```

---

## 📁 Project Structure

```
BlueWave/
├── frontend/                    # React + Vite application
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API service layer
│   │   │   ├── api.js          # Axios instance with base URL
│   │   │   └── *Service.js     # Service modules
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── public/                  # Static assets
│   ├── package.json            # Dependencies
│   ├── vite.config.js          # Vite configuration
│   └── .env.local              # Local environment variables
│
├── backend/
│   └── BlueWave-BP/
│       ├── BlueWave-BP.API/
│       │   ├── Controllers/     # API controllers
│       │   ├── Models/          # Database entities
│       │   ├── DTOs/            # Data transfer objects
│       │   ├── Services/        # Business logic
│       │   ├── Data/            # Database context
│       │   ├── Migrations/      # EF Core migrations
│       │   ├── Program.cs       # Application entry point
│       │   ├── Dockerfile       # Docker configuration
│       │   └── appsettings*.json # Configuration files
│       └── BlueWave-BP.sln      # Solution file
│
└── README.md                    # This file
```

---

## 🐛 Troubleshooting

### Frontend Issues

**Issue:** "Cannot connect to API"
- **Solution:** Verify `VITE_API_BASE_URL` environment variable
- Check backend is running and accessible
- Check browser console for CORS errors

**Issue:** "Routes not working on Netlify"
- **Solution:** Ensure `_redirects` file exists in `frontend/public/`
- Content should be: `/* /index.html 200`

### Backend Issues

**Issue:** "Database migration failed"
- **Solution:** Run migrations manually:
  ```bash
  dotnet ef database update
  ```

**Issue:** "inotify limit exceeded on Render"
- **Solution:** Already fixed in Program.cs
  - Configuration reload is disabled
  - File watchers are not created

**Issue:** "CORS errors"
- **Solution:** Check `Cors__AllowedOrigins` environment variable
- Must match frontend deployment URL exactly

**Issue:** "500 errors on API calls"
- **Solution:** Check `/health` endpoint first
- Review Render logs for detailed error messages
- Verify database connection string is correct

---

## 📝 License

This project is proprietary. All rights reserved.

---

## 👥 Support

For issues or questions, contact the development team.

---

**Last Updated:** July 27, 2026
