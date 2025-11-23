# Jenga Architecture UI System

🏗️ **Modern Architecture Visualization & Management Platform**

A production-ready Next.js application for visualizing and managing system architecture based on your whiteboard design, featuring real-time monitoring, user management, and data pipeline visualization.

![System Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![Node.js](https://img.shields.io/badge/node.js-22.x-green)
![Next.js](https://img.shields.io/badge/next.js-14.x-black)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)
![Docker](https://img.shields.io/badge/docker-ready-blue)

## 🎯 System Overview

Based on your whiteboard architecture diagram, this system implements:

- **👤 User Authentication & Management** - Login system with role-based access
- **⚛️ React UI Frontend** - Modern, responsive interface built with Next.js
- **🔄 API Layer Backend** - RESTful API for data processing and routing  
- **🗄️ RAS Database System** - Redis + Authentication + Storage (PostgreSQL)
- **📊 Data Pipeline Processing** - Real-time data normalization and processing
- **📈 System Monitoring** - Live metrics and performance analytics

## 🚀 Quick Start

### Prerequisites
- Node.js 22.x or higher
- Docker & Docker Compose
- Git

### 1. Development Setup

```powershell
# Clone and navigate to project
cd c:\\code\\lookman\\jenga\\UI

# Use Node.js 22.x with nvm
nvm use 22.20.0

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000 to see the application.

### 2. Production Deployment with Docker

```powershell
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🏗️ Architecture Components

### Frontend Layer
- **Framework**: Next.js 14 with App Router
- **UI Library**: ShadCN UI + Tailwind CSS
- **State Management**: React Context + Zustand
- **Animations**: Framer Motion
- **Diagram Rendering**: ReactFlow

### Backend Layer
- **API Routes**: Next.js API routes
- **Database**: PostgreSQL (primary storage)
- **Cache/Sessions**: Redis (authentication & caching)
- **Background Processing**: Node.js workers

### Infrastructure
- **Reverse Proxy**: Nginx with rate limiting
- **Monitoring**: Prometheus + Grafana
- **Container Orchestration**: Docker Compose
- **Production Ready**: Multi-stage Docker builds

## 📊 Features

### 🎛️ Interactive Architecture Dashboard
- Real-time system architecture visualization
- Interactive flow diagrams based on your whiteboard
- Component status monitoring
- Drag-and-drop interface

### 👥 User Management System
- Role-based access control (Admin, User, Developer)
- User authentication and session management  
- Activity tracking and audit logs
- Profile management

### 🔄 Data Pipeline Monitoring
- Real-time processing status
- Stage-by-stage progress tracking
- Performance metrics and throughput analysis
- Error handling and retry mechanisms

### 📈 System Metrics & Monitoring
- Live performance dashboards
- CPU, Memory, Network, and Disk monitoring
- Alert system for threshold breaches
- Historical trend analysis

## 🗂️ Project Structure

```
jenga-ui/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Global styles with Tailwind
│   │   ├── layout.tsx          # Root layout component
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── dashboard/          # Main dashboard components
│   │   │   ├── ArchitectureDashboard.tsx
│   │   │   ├── ArchitectureDiagram.tsx
│   │   │   ├── UserManagement.tsx
│   │   │   ├── DataPipeline.tsx
│   │   │   └── SystemMetrics.tsx
│   │   └── ui/                 # Reusable UI components
│   │       ├── button.tsx
│   │       └── card.tsx
│   └── lib/
│       └── utils.ts            # Utility functions
├── docker-compose.yml          # Complete production environment
├── Dockerfile                  # Next.js application container
├── nginx.conf                  # Reverse proxy configuration
├── worker.js                   # Background processing worker
└── init.sql                   # Database initialization
```

## 🐳 Docker Services

The `docker-compose.yml` includes:

- **app**: Next.js application (port 3000)
- **db**: PostgreSQL database (port 5432) 
- **redis**: Redis cache/sessions (port 6379)
- **nginx**: Reverse proxy (ports 80/443)
- **worker**: Background job processor
- **prometheus**: Metrics collection (port 9090)
- **grafana**: Metrics visualization (port 3001)

## 🎨 UI Components & Libraries

### Core Libraries
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **ShadCN UI**: High-quality component library
- **Radix UI**: Accessible primitives

### Visualization & Interaction
- **ReactFlow**: Interactive flow diagrams
- **Framer Motion**: Smooth animations
- **Lucide Icons**: Beautiful icon set
- **Class Variance Authority**: Component variant management

### Development Tools
- **ESLint**: Code linting with Next.js config
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

## 🔧 Available Scripts

```powershell
npm run dev          # Start development server with Turbopack
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🌐 Environment Configuration

Create `.env.local` for development:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/jenga_arch

# Redis  
REDIS_URL=redis://localhost:6379

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# API Configuration
API_RATE_LIMIT=100
```

## 📋 Architecture Diagram (Draw.io)

Your whiteboard has been digitized into an interactive ReactFlow diagram. To create a Draw.io version:

### Components to Include:
1. **User Interface Layer**
   - User Login component (👤)
   - Authentication Guard (🔐)
   - React UI Frontend (⚛️)

2. **Processing Layer**  
   - API Layer Backend (🔄)
   - Data Pipeline Processor (📊)

3. **Storage Layer**
   - RAS Database (🗄️)
   - Data Normalization (🔧)

### Flow Connections:
- User → Auth Guard → Frontend
- Frontend → API Layer  
- API Layer ↔ Database
- API Layer → Data Pipeline
- Pipeline → Normalization
- Database → Normalization

## 🔍 Monitoring & Observability

### Metrics Available:
- **System Health**: CPU, Memory, Disk, Network usage
- **Application Metrics**: Response times, error rates, throughput
- **User Analytics**: Active sessions, login patterns
- **Pipeline Monitoring**: Processing stages, queue sizes, completion rates

### Accessing Monitoring:
- **Application**: http://localhost:3000
- **Grafana**: http://localhost:3001 (admin/admin123)
- **Prometheus**: http://localhost:9090

## 🛡️ Security Features

- **Rate Limiting**: Nginx-based API and login protection
- **CORS Protection**: Configured cross-origin policies
- **Security Headers**: XSS, CSRF, and content security policies
- **Input Validation**: TypeScript and Zod schema validation
- **Authentication**: Session-based auth with Redis storage

## 🚀 Deployment Options

### Local Development
```powershell
npm run dev
```

### Docker Development
```powershell  
docker-compose -f docker-compose.dev.yml up
```

### Production Deployment
```powershell
docker-compose up -d
```

### Cloud Deployment
- **AWS**: ECS with ALB
- **Google Cloud**: Cloud Run with Cloud SQL
- **Azure**: Container Instances with Azure Database
- **Vercel**: Serverless deployment (frontend only)

## 🔄 Data Pipeline Processing

The system includes a sophisticated data pipeline that mirrors your whiteboard design:

1. **Data Ingestion** - Accepts incoming data from various sources
2. **Data Validation** - Ensures data quality and format compliance  
3. **Data Transformation** - Converts data to required formats
4. **Data Normalization** - Standardizes and cleans data
5. **Data Storage** - Persists processed data to database

Each stage is monitored in real-time with progress tracking and error handling.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design based on your original whiteboard architecture
- Built with modern React and Next.js best practices
- Inspired by systems like Linear, Notion, and Vercel
- Component library powered by ShadCN and Radix UI

---

**🎯 Ready to visualize and manage your system architecture with modern tools!**

For questions or support, please open an issue or contact the development team.