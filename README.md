# VibeTheBob - HR Management System

A modern HR management system inspired by Bob, built as part of the Vibe Coding Challenge. This project demonstrates a full-stack implementation using modern JavaScript/TypeScript technologies.

## 🏗️ Project Structure

```
VibeTheBob/
├── client/               # Next.js frontend application
│   ├── src/             # Application source code
│   ├── public/          # Static files
│   └── package.json     
└── server/              # Nest.js backend application
    ├── src/             # Application source code
    ├── prisma/          # Database schema and migrations
    │   └── schema.prisma
    └── package.json     
```

## 🚀 Tech Stack

### Frontend (client)
- **Next.js** - React framework with server-side rendering
- **TypeScript** - For type safety and better developer experience
- **Tailwind CSS** - For styling
- **React Query** - For server state management
- **Zustand** - For client state management
- **Axios** - For HTTP requests

### Backend (server)
- **Nest.js** - Progressive Node.js framework
- **TypeScript** - For type safety and better developer experience
- **PostgreSQL** - Main database
- **Prisma** - Next-generation ORM for Node.js & TypeScript
- **REST API** - For client-server communication

## 🎯 Features

### Client-Side Features
[To be populated by the frontend team]

### Server-Side Features
[To be populated by the backend team]

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   npm install
   ```

2. Set up your environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables with your configuration
   - Set up your PostgreSQL database URL

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

## 🧪 Testing

Both frontend and backend include:
- Unit tests
- Integration tests
- E2E tests

Run tests with:
```bash
npm run test
```

## 📝 Development Guidelines

- Follow Git Flow branching strategy
- Write meaningful commit messages
- Include tests for new features
- Follow the established code style
- Document new features and APIs

## 📦 Deployment

Instructions for deployment will be added as the project progresses.

## 🤝 Contributing

This is a coding challenge project. Contributing guidelines will be established if needed.

## 📄 License

This project is created for demonstration purposes as part of a coding challenge.