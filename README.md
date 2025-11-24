# Audit Tracker - Frontend

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)

**The modern, responsive frontend interface for the Audit Tracker Enterprise System.**

[🌐 Live Demo](https://audit-management-chi.vercel.app/) • [📱 Frontend Repo](https://github.com/Rakibulislam-emon/Audit_tracker_frontend) • [⚙️ Backend Repo](https://github.com/Rakibulislam-emon/Audit_tracker_backend)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Dark Mode](#-dark-mode-support)
- [Contributing](#-contributing)
- [License](#-license)
- [Team](#-team)

---

## 🎯 Overview

**Audit Tracker Frontend** is the user-facing component of the enterprise-grade audit management system. It provides a seamless, interactive experience for managing the entire audit lifecycle. Built with **Next.js 15** and **React 19**, it features a sophisticated **Universal CRUD** system that dynamically generates forms and tables, ensuring consistency and rapid development.

### Key Capabilities

- **Professional UI/UX**: Modern, responsive design with full dark mode support.
- **Real-time Data**: Seamless data synchronization using React Query.
- **Dynamic Components**: Auto-generated forms and tables based on configuration.
- **Role-Based Access**: Adaptive UI based on user permissions (Admin, Auditor, etc.).
- **Interactive Dashboards**: "Mission Control" for audit sessions.

---

## ✨ Features

### 📊 Audit Management

- **Program Management**: Create and track audit programs.
- **Session Control**: Centralized dashboard for managing active audits.
- **Template System**: Customizable audit templates with various question types.

### 🔍 Observations & Findings

- **Real-time Recording**: Capture observations instantly during sessions.
- **Problem Tracking**: Log non-conformances with severity levels.
- **Evidence Management**: Upload and view proof documents/images via Cloudinary.

### 📝 Reporting & Approval

- **Report Generation**: Auto-compile comprehensive audit reports.
- **Approval Workflows**: Multi-stage approval process with requirement checklists.
- **Status Tracking**: Visual status indicators for all entities.

### 🎨 User Experience

- **Universal CRUD**: Configuration-driven UI for consistent data management.
- **Advanced Filtering**: Powerful search and filter capabilities across all lists.
- **Dark Mode**: Native dark mode support with smooth transitions.
- **Responsive**: Fully optimized for desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

This project is built using a robust modern stack:

### Core

- **[Next.js 15](https://nextjs.org/)**: The React Framework for the Web (App Router).
- **[React 19](https://react.dev/)**: The library for web and native user interfaces.

### Styling & UI

- **[Tailwind CSS v4](https://tailwindcss.com/)**: Utility-first CSS framework.
- **[Radix UI](https://www.radix-ui.com/)**: Unstyled, accessible components.
- **[ShadCN/UI](https://ui.shadcn.com/)**: Beautifully designed components.
- **[Framer Motion](https://www.framer.com/motion/)**: Production-ready animation library.
- **[Lucide React](https://lucide.dev/)**: Beautiful & consistent icons.
- **[Sonner](https://sonner.emilkowal.ski/)**: An opinionated toast component.

### State & Data Management

- **[Zustand](https://zustand-demo.pmnd.rs/)**: Lightweight state management.
- **[TanStack Query](https://tanstack.com/query/latest)**: Powerful asynchronous state management.

### Forms & Validation

- **[React Hook Form](https://react-hook-form.com/)**: Performant, flexible forms.
- **[Zod](https://zod.dev/)**: TypeScript-first schema validation.

---

## 🏗 Architecture

### Universal Component System

The frontend leverages a revolutionary **Universal CRUD** architecture to minimize boilerplate and ensure consistency.

- **Configuration Driven**: A single `dynamicConfig.js` file defines the behavior of modules.
- **Auto-Generated UI**: Forms, tables, and filters are created automatically from the config.
- **Centralized Logic**: `UniversalCRUDManager`, `UniversalForm`, and `UniversalTable` handle the heavy lifting.

```javascript
// Example Config (simplified)
newModule: {
  endpoint: "new-module",
  title: "New Module",
  fields: {
    name: { type: "text", label: "Name", required: true },
    status: { type: "select", options: ["active", "inactive"] }
  }
}
```

---

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Rakibulislam-emon/Audit_tracker_frontend.git
    cd Audit_tracker_frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

```
audit-frontend/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # ShadCN & Universal components
│   │   │   ├── dynamic/ # Universal CRUD system
│   ├── config/          # Configuration (dynamicConfig.js)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Library configurations
│   ├── providers/       # Context providers
│   ├── services/        # API service calls
│   ├── stores/          # Zustand state stores
│   └── utils/           # Utility functions
├── .env.local           # Environment variables
├── package.json         # Dependencies
└── README.md            # Documentation
```

---

## 🌙 Dark Mode Support

The application features comprehensive dark mode support with automatic theme adaptation.

- **System Detection**: Automatically respects user's system preferences.
- **Manual Toggle**: User-accessible toggle for switching themes.
- **Adaptive Colors**: Status badges and UI elements automatically adjust colors for optimal contrast.

See [DARK_MODE_GUIDE.md](./DARK_MODE_GUIDE.md) for detailed implementation guidelines.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👥 Team

**Developed by**: Ninja-dev Team
**Contact**: [rakibulislamemon@gmail.com](mailto:rakibulislamemon@gmail.com)

<div align="center">

**Built with ❤️ by the Audit Tracker Team**

⭐ Star this repo if you find it helpful!

</div>
