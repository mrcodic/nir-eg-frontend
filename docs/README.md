# NIR Frontend - Project Documentation

> **Quick Start for AI Agents**: This documentation provides a comprehensive overview of the NIR educational platform frontend. Start with this README, then explore specific documentation files for detailed information about each aspect of the project.

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Quick Reference](#quick-reference)
4. [Documentation Structure](#documentation-structure)
5. [Getting Started](#getting-started)

## 🎯 Project Overview

**NIR Frontend** is a multi-tenant educational platform built with Next.js 15, designed to provide a comprehensive learning management system (LMS) for students, instructors, and parents.

### Key Features

- **Multi-tenant Architecture**: Supports multiple educational institutions with subdomain-based routing
- **Student Portal**: Course management, exams, assignments, grades, and progress tracking
- **Parent Portal**: Monitor student progress and activities
- **E-commerce**: Course bundles, books store, and payment integration
- **Real-time Features**: Notifications, live sessions, and interactive content
- **Multimedia Support**: Video lessons, audio recordings, file uploads, and PDF rendering
- **Gamification**: Points system, leaderboards, and achievements

### Project Type

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript/JavaScript (mixed)
- **Styling**: Tailwind CSS 4.x
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Target Audience**: Educational institutions, students, and parents
- **Deployment**: Production-ready with multi-tenant support

## 🛠 Technology Stack

### Core Framework

- **Next.js 15.5.9** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5.7.3** - Type safety (with some JavaScript files)

### Styling & UI

- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI
- **Radix UI** - Unstyled, accessible component primitives
- **Framer Motion 12.x** - Animation library
- **Lucide React** - Icon library

### State Management & Data Fetching

- **TanStack Query (React Query) 5.x** - Server state management
- **Zustand 5.x** - Client state management
- **React Hook Form 7.x** - Form state management
- **Zod 3.x** - Schema validation

### Media & Files

- **Lottie React** - Animation rendering
- **React PDF** - PDF rendering
- **Wavesurfer.js** - Audio visualization
- **React Image Crop** - Image cropping
- **FilePond** - File uploads

### Utilities

- **Axios 1.7.x** - HTTP client
- **Luxon 3.x** - Date/time manipulation
- **js-cookie** - Cookie management
- **lodash 4.x** - Utility functions
- **nuqs** - URL state management

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing

## 🚀 Quick Reference

### Project Structure

```
nier-front/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication routes (login, register)
│   │   ├── (landing)/         # Public landing page
│   │   ├── (student)/         # Student portal routes
│   │   ├── (portal)/          # Parent portal & short links
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── forms/            # Form components
│   │   ├── modals/           # Modal dialogs
│   │   ├── tables/           # Data tables
│   │   └── ...               # Feature components
│   ├── modules/              # Feature modules (exam, payment, etc.)
│   ├── context/              # React Context providers
│   ├── hooks/                # Custom React hooks
│   ├── helpers/              # Utility functions
│   ├── services/             # API service layer
│   ├── types/                # TypeScript type definitions
│   ├── lib/                  # Library configurations
│   └── middleware.ts         # Next.js middleware
├── public/                   # Static assets
└── docs/                     # Project documentation
```

### Key Conventions

- **Route Groups**: Use parentheses for layout grouping without affecting URL structure
- **File Naming**:
  - Components: PascalCase (e.g., `CourseCard.tsx`)
  - Utilities: camelCase (e.g., `client-fetch.ts`)
  - Pages: lowercase (e.g., `page.tsx`)
- **Import Alias**: `@/` maps to `src/`
- **API Pattern**: Separate client and server fetch utilities
- **Multi-tenant**: Subdomain-based tenant identification

### Common Patterns

```typescript
// Server-side data fetching
import { getServerData } from "@/helpers/fetchers/server-fetch";

const data = await getServerData({
  queryKey: ["/api/endpoint"],
  cache: "no-store",
});

// Client-side data fetching with React Query
import { useQuery } from "@tanstack/react-query";
import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";

const { data } = useQuery({
  queryKey: ["/api/endpoint"],
  queryFn: getClientPrivateData,
});

// Form handling with React Hook Form + Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  /* ... */
});
const form = useForm({ resolver: zodResolver(schema) });
```

## 📚 Documentation Structure

This documentation is organized into focused files for easy navigation:

1. **[README.md](./README.md)** (this file) - Project overview and quick start
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design patterns
3. **[ROUTING.md](./ROUTING.md)** - Routing structure and conventions
4. **[STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md)** - State management patterns
5. **[UI-COMPONENTS.md](./UI-COMPONENTS.md)** - Component library and design system
6. **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Auth flow and middleware
7. **[API-INTEGRATION.md](./API-INTEGRATION.md)** - API patterns and data fetching
8. **[DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md)** - Development guidelines and best practices
9. **[AI-AGENT-GUIDE.md](./AI-AGENT-GUIDE.md)** - Quick reference for AI agents

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm/bun

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Setup

The application uses multi-tenant architecture with subdomain-based routing:

- **Development**: `{tenant-slug}.localhost:3000`
- **Production**: `{tenant-slug}.nir-edu.com` or custom domains

### Key Configuration Files

- [`next.config.mjs`](../next.config.mjs) - Next.js configuration
- [`tsconfig.json`](../tsconfig.json) - TypeScript configuration
- [`components.json`](../components.json) - shadcn/ui configuration
- [`tailwind.config.mjs`](../tailwind.config.mjs) - Tailwind CSS configuration
- [`src/middleware.ts`](../src/middleware.ts) - Route protection and redirects

## 🔍 For AI Agents

If you're an AI agent working with this codebase:

1. **Start here**: Read this README for project context
2. **Understand the architecture**: Review [`ARCHITECTURE.md`](./ARCHITECTURE.md)
3. **Check routing**: See [`ROUTING.md`](./ROUTING.md) for route structure
4. **Quick reference**: Use [`AI-AGENT-GUIDE.md`](./AI-AGENT-GUIDE.md) for common tasks

### Common Tasks

- **Adding a new page**: See [ROUTING.md](./ROUTING.md#adding-new-routes)
- **Creating a component**: See [UI-COMPONENTS.md](./UI-COMPONENTS.md#component-patterns)
- **API integration**: See [API-INTEGRATION.md](./API-INTEGRATION.md#patterns)
- **State management**: See [STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md#patterns)

## 📝 Notes

- The project uses a mix of TypeScript and JavaScript files
- TypeScript strict mode is disabled (`strict: false`)
- Build errors are ignored in configuration (for development flexibility)
- The application is RTL (Right-to-Left) focused for Arabic content
- Multi-tenant support is core to the architecture

## 🔗 Related Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form Documentation](https://react-hook-form.com)

---

**Last Updated**: 2026-06-04
**Next.js Version**: 15.5.9
**Maintained by**: NIR Development Team
