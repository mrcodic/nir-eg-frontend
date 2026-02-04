# Development Guidelines

## 🎯 Development Philosophy

This project prioritizes:

1. **User Experience**: Fast, responsive, intuitive
2. **Maintainability**: Clear code structure, consistent patterns
3. **Scalability**: Multi-tenant architecture, modular design
4. **Accessibility**: RTL support, semantic HTML, ARIA labels
5. **Performance**: Server Components, code splitting, caching

## 🛠️ Development Setup

### Prerequisites

```bash
Node.js >= 18.x
npm/yarn/pnpm/bun
```

### Installation

```bash
# Clone repository
git clone <repository-url>
cd nier-front

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# http://localhost:3000 (or tenant subdomain)
```

### Environment Variables

Create `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.nir-edu.com

# Environment
NODE_ENV=development
```

## 📋 Code Standards

### TypeScript Usage

**Prefer TypeScript** but JavaScript is acceptable:

```typescript
// ✅ Good: Type your props
interface CourseCardProps {
  course: Course;
  onEnroll: (id: string) => void;
  className?: string;
}

export function CourseCard({ course, onEnroll, className }: CourseCardProps) {
  // ...
}

// ⚠️ Acceptable: JavaScript with JSDoc
/**
 * @param {Course} course
 * @param {(id: string) => void} onEnroll
 */
export function CourseCard({ course, onEnroll }) {
  // ...
}
```

### Component Structure

```typescript
// 1. Imports (grouped)
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { getClientPrivateData } from '@/helpers/client-fetch';
import { cn } from '@/lib/utils';

import type { Course } from '@/types';

// 2. Types/Interfaces
interface ComponentProps {
  // ...
}

// 3. Component
export function Component({ prop1, prop2 }: ComponentProps) {
  // 3a. Hooks
  const [state, setState] = useState();
  const { data } = useQuery({ /* ... */ });

  // 3b. Derived state
  const computedValue = useMemo(() => {
    // ...
  }, [dependencies]);

  // 3c. Event handlers
  const handleClick = () => {
    // ...
  };

  // 3d. Effects
  useEffect(() => {
    // ...
  }, [dependencies]);

  // 3e. Early returns
  if (!data) return <Loading />;

  // 3f. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// 4. Sub-components (if small and related)
function SubComponent() {
  // ...
}
```

### Naming Conventions

```typescript
// Components: PascalCase
export function CourseCard() {}
export function UserProfile() {}

// Functions: camelCase
function calculateTotal() {}
function handleSubmit() {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_TIMEOUT = 5000;

// Types/Interfaces: PascalCase with 'I' prefix for interfaces
interface IUser {}
type CourseData = {};

// Files: kebab-case or PascalCase
// Components: CourseCard.tsx
// Utilities: client-fetch.ts
// Pages: page.tsx
```

### Import Organization

```typescript
// 1. React and external libraries
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// 2. UI components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 3. Internal components
import { CourseCard } from "@/components/CourseCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// 4. Utilities and helpers
import { getClientPrivateData } from "@/helpers/client-fetch";
import { cn } from "@/lib/utils";

// 5. Types
import type { Course, User } from "@/types";

// 6. Styles (if any)
import styles from "./Component.module.css";
```

## 🎨 Styling Guidelines

### Tailwind CSS Best Practices

```typescript
// ✅ Good: Use semantic class names
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">

// ✅ Good: Use cn() for conditional classes
<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)}>

// ✅ Good: Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ❌ Avoid: Inline styles (unless dynamic)
<div style={{ color: 'red' }}>

// ✅ Better: Use Tailwind
<div className="text-red-500">
```

### RTL Support

```typescript
// ✅ Tailwind handles RTL automatically
<div className="mr-4"> {/* Becomes ml-4 in RTL */}
<div className="text-right"> {/* Becomes text-left in RTL */}

// ✅ For explicit RTL/LTR
<div className="ltr:mr-4 rtl:ml-4">

// ✅ Use logical properties
<div className="ps-4"> {/* padding-inline-start */}
<div className="pe-4"> {/* padding-inline-end */}
```

### Component Styling Pattern

```typescript
import { cn } from '@/lib/utils';

interface Props {
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Component({ variant = 'default', size = 'md', className }: Props) {
  return (
    <div
      className={cn(
        // Base styles
        "rounded-lg transition-colors",

        // Variants
        {
          'bg-gray-100': variant === 'default',
          'bg-blue-500 text-white': variant === 'primary',
          'bg-gray-500 text-white': variant === 'secondary',
        },

        // Sizes
        {
          'p-2 text-sm': size === 'sm',
          'p-4 text-base': size === 'md',
          'p-6 text-lg': size === 'lg',
        },

        // Allow override
        className
      )}
    >
      {/* Content */}
    </div>
  );
}
```

## 🔄 State Management Guidelines

### When to Use What

```typescript
// ✅ Server data → React Query
const { data } = useQuery({
  queryKey: ["/courses"],
  queryFn: getClientPrivateData,
});

// ✅ Global client state → Zustand
const cartItems = useBooksStore((state) => state.items);

// ✅ Component tree state → Context
const { profile } = useAuthContext();

// ✅ Form state → React Hook Form
const form = useForm({
  /* ... */
});

// ✅ URL state → nuqs
const [page, setPage] = useQueryState("page");

// ✅ Local component state → useState
const [isOpen, setIsOpen] = useState(false);
```

### React Query Patterns

```typescript
// ✅ Good: Specific query keys
useQuery({
  queryKey: [`/courses/${courseId}`],
  queryFn: getClientPrivateData,
});

// ✅ Good: Conditional queries
useQuery({
  queryKey: [`/courses/${courseId}`],
  queryFn: getClientPrivateData,
  enabled: !!courseId, // Only run if courseId exists
});

// ✅ Good: Stale time for static data
useQuery({
  queryKey: ["/settings"],
  queryFn: getClientPrivateData,
  staleTime: Infinity, // Never refetch
});

// ✅ Good: Mutations with optimistic updates
const mutation = useMutation({
  mutationFn: updateCourse,
  onMutate: async (newData) => {
    // Optimistic update
    queryClient.setQueryData(["/courses"], (old) => ({
      ...old,
      ...newData,
    }));
  },
  onError: (err, newData, context) => {
    // Rollback
    queryClient.setQueryData(["/courses"], context.previousData);
  },
  onSettled: () => {
    // Refetch
    queryClient.invalidateQueries({ queryKey: ["/courses"] });
  },
});
```

## 🧪 Testing Guidelines

### Component Testing

```typescript
// Example test structure (if implementing tests)
import { render, screen } from '@testing-library/react';
import { CourseCard } from './CourseCard';

describe('CourseCard', () => {
  it('renders course title', () => {
    const course = { id: '1', title: 'Math 101' };
    render(<CourseCard course={course} />);
    expect(screen.getByText('Math 101')).toBeInTheDocument();
  });

  it('calls onEnroll when button clicked', () => {
    const onEnroll = jest.fn();
    const course = { id: '1', title: 'Math 101' };
    render(<CourseCard course={course} onEnroll={onEnroll} />);

    screen.getByText('Enroll').click();
    expect(onEnroll).toHaveBeenCalledWith('1');
  });
});
```

### Manual Testing Checklist

- [ ] Test on different tenants (subdomain routing)
- [ ] Test authentication flow (login/logout)
- [ ] Test protected routes (redirect to login)
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test RTL layout (Arabic content)
- [ ] Test loading states
- [ ] Test error states
- [ ] Test form validation
- [ ] Test API error handling

## 🚀 Performance Guidelines

### Server Components First

```typescript
// ✅ Good: Server Component by default
export default async function Page() {
  const data = await getServerData({ queryKey: ['/courses'] });
  return <CoursesList courses={data?.body} />;
}

// ✅ Good: Client Component only when needed
"use client";
export function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Code Splitting

```typescript
// ✅ Good: Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  loading: () => <Skeleton />,
  ssr: false, // Don't render on server
});

export function Page() {
  return <VideoPlayer src="/video.mp4" />;
}
```

### Image Optimization

```typescript
import Image from 'next/image';

// ✅ Good: Use Next.js Image component
<Image
  src={course.image}
  alt={course.title}
  width={400}
  height={300}
  loading="lazy"
  placeholder="blur"
  blurDataURL={course.blurDataURL}
/>

// ❌ Avoid: Regular img tag
<img src={course.image} alt={course.title} />
```

### Caching Strategy

```typescript
// Static data (rarely changes)
const data = await getServerData({
  queryKey: ["/settings"],
  cache: "force-cache",
  next: { revalidate: 3600 }, // Revalidate every hour
});

// Dynamic data (changes frequently)
const data = await getServerData({
  queryKey: ["/courses"],
  cache: "no-store", // Always fetch fresh
});

// Revalidate on-demand
const data = await getServerData({
  queryKey: ["/courses"],
  next: { tags: ["courses"] }, // Tag for revalidation
});

// Then revalidate with:
// revalidateTag('courses');
```

## 🔒 Security Guidelines

### Authentication

```typescript
// ✅ Good: Check auth in middleware
// src/middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get("nir_token")?.value;
  if (!token && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// ✅ Good: Use auth context
const { profile, logout } = useAuthContext();

// ❌ Avoid: Storing sensitive data in localStorage
localStorage.setItem("token", token); // Bad!

// ✅ Good: Use HttpOnly cookies (handled by backend)
```

### Input Validation

```typescript
// ✅ Good: Validate with Zod
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
});

const form = useForm({
  resolver: zodResolver(schema),
});

// ✅ Good: Sanitize user input
import DOMPurify from "dompurify";

const sanitized = DOMPurify.sanitize(userInput);
```

### API Security

```typescript
// ✅ Good: Include credentials
fetch('/api/endpoint', {
  credentials: 'include', // Send cookies
});

// ✅ Good: Validate tenant
headers: {
  'X-Tenant-Domain': host, // Tenant isolation
}
```

## 📝 Documentation Guidelines

### Component Documentation

````typescript
/**
 * CourseCard displays a course with title, description, and enroll button.
 *
 * @param course - The course object to display
 * @param onEnroll - Callback when user clicks enroll button
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <CourseCard
 *   course={course}
 *   onEnroll={(id) => console.log('Enrolled:', id)}
 * />
 * ```
 */
export function CourseCard({ course, onEnroll, className }: CourseCardProps) {
  // ...
}
````

### Function Documentation

```typescript
/**
 * Calculates the total price of items in the cart.
 *
 * @param items - Array of cart items
 * @returns Total price in EGP
 */
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```

## 🐛 Debugging Guidelines

### Console Logging

```typescript
// ✅ Development only
if (process.env.NODE_ENV === "development") {
  console.log("Debug info:", data);
}

// ✅ Use descriptive labels
console.log("🛒 Cart items:", cartItems);
console.log("✅ API response:", response);
console.log("❌ Error:", error);

// ❌ Avoid in production
console.log(data); // Remove before commit
```

### Error Handling

```typescript
// ✅ Good: Specific error messages
try {
  await submitExam(data);
  toast({ description: 'تم إرسال الامتحان بنجاح' });
} catch (error) {
  console.error('Exam submission failed:', error);
  toast({
    description: error.message || 'فشل إرسال الامتحان',
    variant: 'destructive',
  });
}

// ✅ Good: Error boundaries
// src/app/error.tsx
"use client";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  return (
    <div>
      <h2>حدث خطأ!</h2>
      <button onClick={reset}>حاول مرة أخرى</button>
    </div>
  );
}
```

## 🔄 Git Workflow

### Commit Messages

```bash
# Format: <type>: <description>

# Types:
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code (no logic change)
refactor: Refactor code
perf: Improve performance
test: Add tests
chore: Update dependencies, config

# Examples:
git commit -m "feat: Add certificate download feature"
git commit -m "fix: Fix cart total calculation"
git commit -m "docs: Update API documentation"
git commit -m "refactor: Simplify auth logic"
```

### Branch Naming

```bash
# Format: <type>/<description>

feature/add-certificates
fix/cart-calculation
refactor/auth-flow
docs/update-readme
```

## 📦 Build and Deployment

### Build Process

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

### Pre-deployment Checklist

- [ ] All TypeScript errors resolved (or acceptable)
- [ ] No console.log statements in production code
- [ ] Environment variables configured
- [ ] API endpoints updated for production
- [ ] Images optimized
- [ ] Tested on multiple tenants
- [ ] Tested authentication flow
- [ ] Tested responsive design
- [ ] Tested RTL layout

## 🎯 Best Practices Summary

1. **Use Server Components by default**, Client Components only when needed
2. **Type your props and functions** with TypeScript
3. **Use React Query for server state**, Zustand for client state
4. **Validate forms with Zod**, handle errors gracefully
5. **Use shadcn/ui components** as base, customize with Tailwind
6. **Optimize images** with Next.js Image component
7. **Implement loading and error states** for better UX
8. **Test on multiple tenants** and devices
9. **Follow RTL best practices** for Arabic content
10. **Document complex logic** with comments

---

**Remember**: Write code that is easy to understand, maintain, and extend. Prioritize user experience and performance.
