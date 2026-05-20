# Project Folder Structure

## 📁 Complete Directory Tree

```
nier-front/
│
├── 📄 Configuration Files
│   ├── .gitignore                    # Git ignore rules
│   ├── .prettierrc                   # Prettier configuration
│   ├── components.json               # shadcn/ui configuration
│   ├── eslint.config.mjs             # ESLint configuration
│   ├── jsconfig.json                 # JavaScript configuration
│   ├── next.config.mjs               # Next.js configuration
│   ├── package.json                  # Dependencies and scripts
│   ├── postcss.config.mjs            # PostCSS configuration
│   ├── README.md                     # Project README
│   └── tsconfig.json                 # TypeScript configuration
│
├── 📂 docs/                          # 📚 PROJECT DOCUMENTATION
│   ├── README.md                     # Main documentation index
│   ├── ARCHITECTURE.md               # System architecture
│   ├── ROUTING.md                    # Routing patterns
│   ├── STATE-MANAGEMENT.md           # State management guide
│   ├── AI-AGENT-GUIDE.md            # Quick reference for AI agents
│   ├── DEVELOPMENT-GUIDE.md          # Development guidelines
│   └── FOLDER-STRUCTURE.md           # This file
│
├── 📂 public/                        # Static Assets
│   ├── favicon.ico
│   ├── logo.svg
│   ├── icon.svg
│   ├── 📂 assets/                    # Images and icons
│   │   ├── *.svg                     # SVG icons
│   │   ├── *.gif                     # Animated images
│   │   ├── *.png                     # PNG images
│   │   └── 📂 bg/                    # Background images
│   ├── 📂 Animations/                # Lottie animations
│   │   └── *.lottie, *.json
│   ├── 📂 audio/                     # Audio files
│   │   └── ping.mp3
│   └── 📂 fonts/                     # Custom fonts
│       └── 📂 avenir-arabic/
│
└── 📂 src/                           # 🎯 SOURCE CODE
    │
    ├── 📄 middleware.ts              # Next.js middleware (route protection)
    │
    ├── 📂 app/                       # 🚀 NEXT.JS APP ROUTER
    │   │
    │   ├── 📄 Root Files
    │   │   ├── layout.tsx            # Root layout (wraps all pages)
    │   │   ├── loading.tsx           # Global loading state
    │   │   ├── error.tsx             # Global error boundary
    │   │   ├── global-error.tsx      # Global error fallback
    │   │   ├── not-found.tsx         # 404 page
    │   │   ├── providers.tsx         # Client providers wrapper
    │   │   ├── globals.css           # Global styles
    │   │   └── favicon files         # Favicon variants
    │   │
    │   ├── 📂 (auth)/                # 🔐 AUTHENTICATION ROUTES
    │   │   ├── layout.tsx            # Auth layout (no nav)
    │   │   ├── 📂 login/
    │   │   │   └── page.tsx          # Login page
    │   │   ├── 📂 register/
    │   │   │   └── page.tsx          # Registration page
    │   │   ├── 📂 forgetPassword/
    │   │   │   └── page.tsx          # Forgot password
    │   │   └── 📂 resetPassword/
    │   │       └── page.jsx          # Reset password
    │   │
    │   ├── 📂 (landing)/             # 🏠 PUBLIC LANDING PAGE
    │   │   ├── page.tsx              # Home page
    │   │   └── loading.tsx           # Landing loading state
    │   │
    │   ├── 📂 (student)/             # 🎓 STUDENT PORTAL
    │   │   ├── layout.tsx            # Student layout (with nav)
    │   │   │
    │   │   ├── 📂 activities/
    │   │   │   └── page.jsx          # Student activities
    │   │   │
    │   │   ├── 📂 bundles/           # 📚 COURSES
    │   │   │   ├── page.tsx          # Course list
    │   │   │   ├── 📂 bundle-details/
    │   │   │   │   └── page.tsx      # Bundle details
    │   │   │   └── 📂 [SingleCourse]/  # Dynamic course route
    │   │   │       ├── page.tsx      # Course detail
    │   │   │       │
    │   │   │       ├── 📂 (courseExam)/  # Course-level exams
    │   │   │       │   ├── layout.tsx
    │   │   │       │   └── 📂 general-exams/
    │   │   │       │       └── 📂 [examId]/
    │   │   │       │           └── page.tsx
    │   │   │       │
    │   │   │       └── 📂 [room]/    # Room (lesson) route
    │   │   │           ├── page.tsx  # Room detail
    │   │   │           └── 📂 (tasks)/  # Task routes
    │   │   │               ├── layout.tsx
    │   │   │               ├── 📂 exams/
    │   │   │               │   └── 📂 [examId]/
    │   │   │               │       └── page.tsx
    │   │   │               ├── 📂 assignments/
    │   │   │               │   └── 📂 [assignmentId]/
    │   │   │               │       └── page.tsx
    │   │   │               └── 📂 tasks/
    │   │   │                   └── 📂 [taskId]/
    │   │   │                       └── page.tsx
    │   │   │
    │   │   ├── 📂 grades/
    │   │   │   └── page.tsx          # Student grades
    │   │   │
    │   │   ├── 📂 profile/           # 👤 USER PROFILE
    │   │   │   ├── page.tsx          # Profile overview
    │   │   │   ├── 📂 account-settings/
    │   │   │   │   └── page.tsx      # Account settings
    │   │   │   └── 📂 comments/
    │   │   │       ├── page.tsx      # User comments
    │   │   │       └── CommentsFilter.tsx
    │   │   │
    │   │   ├── 📂 store/
    │   │   │   └── page.tsx          # Books store
    │   │   │
    │   │   ├── 📂 orders/
    │   │   │   ├── page.tsx          # Order history
    │   │   │   ├── BookOrderCard.tsx
    │   │   │   ├── CourseOrderCard.tsx
    │   │   │   └── CartDetailsSideSheet.tsx
    │   │   │
    │   │   ├── 📂 payment/
    │   │   │   └── page.tsx          # Payment page
    │   │   │
    │   │   ├── 📂 privacy/
    │   │   │   └── page.tsx          # Privacy policy
    │   │   │
    │   │   └── 📂 terms/
    │   │       └── page.tsx          # Terms of service
    │   │
    │   ├── 📂 (portal)/              # 👨‍👩‍👧 PORTAL ROUTES
    │   │   ├── error.tsx
    │   │   ├── 📂 parent-portal/
    │   │   │   └── page.tsx          # Parent portal
    │   │   └── 📂 short/
    │   │       └── 📂 [shortToken]/
    │   │           ├── page.tsx      # Short link handler
    │   │           └── RedirectToPortal.tsx
    │   │
    │   ├── 📂 api/                   # 🔌 API ROUTES
    │   │   └── 📂 delete-session/
    │   │       └── route.ts          # Session deletion endpoint
    │   │
    │   ├── 📂 ErrorPage/
    │   │   └── page.jsx              # Error page
    │   │
    │   └── 📂 unauthorized/
    │       └── page.tsx              # Unauthorized access page
    │
    ├── 📂 components/                # 🧩 REACT COMPONENTS
    │   │
    │   ├── 📂 ui/                    # 🎨 SHADCN/UI COMPONENTS
    │   │   ├── accordion.tsx
    │   │   ├── alert-dialog.tsx
    │   │   ├── avatar.tsx
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── carousel.tsx
    │   │   ├── chart.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── command.tsx
    │   │   ├── dialog.tsx
    │   │   ├── drawer.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── form.tsx
    │   │   ├── input.tsx
    │   │   ├── input-otp.tsx
    │   │   ├── label.tsx
    │   │   ├── popover.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── select.tsx
    │   │   ├── sheet.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   ├── toast.tsx
    │   │   ├── toaster.tsx
    │   │   ├── tooltip.tsx
    │   │   └── 📂 custom/            # Custom UI components
    │   │       ├── CountBubble.tsx
    │   │       ├── CountDownTimerUI.tsx
    │   │       ├── CustomImage.tsx
    │   │       ├── DataWithLabel.tsx
    │   │       ├── price-bubble.tsx
    │   │       ├── price-summary.tsx
    │   │       ├── ScoreBadge.tsx
    │   │       ├── ScorePercent.tsx
    │   │       ├── SimplePagination.tsx
    │   │       └── StyledText.tsx
    │   │
    │   ├── 📂 forms/                 # 📝 FORM COMPONENTS
    │   │   ├── AssignmentForm.tsx
    │   │   ├── bundleForm.jsx
    │   │   ├── CourseForm.jsx
    │   │   ├── ExamForm.tsx
    │   │   ├── NewPasswordForm.tsx
    │   │   ├── PaymentBundlesForm.jsx
    │   │   ├── PaymentCenterCode.jsx
    │   │   ├── RoomPaymentForm.tsx
    │   │   ├── TaskForm.tsx
    │   │   ├── ValidateOtp.tsx
    │   │   └── WalletPay.tsx
    │   │
    │   ├── 📂 modals/                # 🪟 MODAL DIALOGS
    │   │   ├── AssignmentModal.tsx
    │   │   ├── BookPaymentModel.tsx
    │   │   ├── CommentDetails.tsx
    │   │   ├── Congrats.tsx
    │   │   ├── FailModal.tsx
    │   │   ├── LogoutCustomModal.tsx
    │   │   ├── NewFeaturesModal.tsx
    │   │   ├── OfferModel.tsx
    │   │   ├── OtpModal.tsx
    │   │   ├── passedModal.tsx
    │   │   ├── PayFail.tsx
    │   │   ├── PaymentModel.tsx
    │   │   ├── PaySuccess.tsx
    │   │   ├── PhoneVerificationAlertModal.tsx
    │   │   ├── StudentSelectCenterModal.tsx
    │   │   ├── Sure.tsx
    │   │   └── Verify.tsx
    │   │
    │   ├── 📂 tables/                # 📊 DATA TABLES
    │   │   ├── ActivitiesTable.tsx
    │   │   ├── CourseActivitiesTable.tsx
    │   │   ├── CustomTableUI.tsx
    │   │   ├── ParentPortalTable.tsx
    │   │   └── RankTable.tsx
    │   │
    │   ├── 📂 banners/               # 📢 BANNER COMPONENTS
    │   │   ├── Announcement.tsx
    │   │   └── TopBanner.tsx
    │   │
    │   ├── 📂 includes/              # 🔧 LAYOUT COMPONENTS
    │   │   ├── AuthNavBar.tsx
    │   │   ├── Footer.tsx
    │   │   └── NavbarWrapper.tsx
    │   │
    │   ├── 📂 guest/                 # 🌐 LANDING PAGE COMPONENTS
    │   │   ├── CoursesCarousel.tsx
    │   │   ├── Followers.tsx
    │   │   ├── GradeCard.tsx
    │   │   ├── GradesSection.tsx
    │   │   ├── GradesSectionTwo.tsx
    │   │   ├── HeroSection.tsx
    │   │   ├── HeroSectionThree.tsx
    │   │   ├── HeroSectionTwo.tsx
    │   │   ├── HonorsLeaderboard.tsx
    │   │   ├── OurNumbers.tsx
    │   │   ├── SectionTitle.tsx
    │   │   ├── SocialCard.tsx
    │   │   ├── StartWithUsNow.tsx
    │   │   ├── WhyChooseUs.tsx
    │   │   └── WhyJoinUs.tsx
    │   │
    │   ├── 📂 guest-templates/       # 🎨 LANDING TEMPLATES
    │   │   ├── TemplateOne.tsx
    │   │   ├── TemplateThree.tsx
    │   │   └── TemplateTwo.tsx
    │   │
    │   ├── 📂 paymentTypes/          # 💳 PAYMENT COMPONENTS
    │   │   ├── Aman.tsx
    │   │   └── CenterCode.tsx
    │   │
    │   ├── 📂 sheets/                # 📋 SHEET COMPONENTS
    │   │   └── RoomSheet.tsx
    │   │
    │   └── 📄 Feature Components     # Individual components
    │       ├── CourseDetails.tsx
    │       ├── CourseFloatingCards.tsx
    │       ├── CourseInfoBadge.tsx
    │       ├── CoursePhoneVerifyCard.tsx
    │       ├── CourseProgressCard.tsx
    │       ├── CoursesHeader.tsx
    │       ├── Cropper.tsx
    │       ├── DownloadFileBtn.tsx
    │       ├── Empty.tsx
    │       ├── ExamCard.tsx
    │       ├── GradesTableAction.tsx
    │       ├── GroupJoinBadge.tsx
    │       ├── InfinteScroll.jsx
    │       ├── LessonRoomCard.tsx
    │       ├── LoaderLottie.jsx
    │       ├── LoadingSpinner.tsx
    │       ├── LockedToPassVideoUI.tsx
    │       ├── MappingComp.tsx
    │       ├── MappingFunc.tsx
    │       ├── MarkVideoCompleted.tsx
    │       ├── NewCoursers.tsx
    │       ├── OfferModelWrapper.tsx
    │       ├── Pagination.tsx
    │       ├── RoomAccordion.tsx
    │       ├── RoomDropDownQuiz.tsx
    │       ├── RoomFileDownloadLink.tsx
    │       ├── RoomHeader.tsx
    │       ├── RoomSideContent.tsx
    │       ├── SocialLinks.tsx
    │       ├── SubbedCourses.tsx
    │       ├── ToolTip.jsx
    │       ├── TopCourseStudentsBadges.tsx
    │       ├── UnderlineStyle.tsx
    │       ├── UploadImage.tsx
    │       ├── UserModalsWrapper.tsx
    │       ├── VoiceMessageRecorder.jsx
    │       └── WhatsappFloating.tsx
    │
    ├── 📂 modules/                   # 🎯 FEATURE MODULES
    │   ├── 📂 books-store/           # Books e-commerce
    │   ├── 📂 community/             # Community features
    │   ├── 📂 exam/                  # Exam logic
    │   │   ├── 📂 hooks/
    │   │   │   └── useTaskLogic.ts
    │   │   ├── 📂 components/
    │   │   └── 📂 utils/
    │   ├── 📂 norifications/         # Notifications (typo in original)
    │   ├── 📂 parent-portal/         # Parent portal features
    │   ├── 📂 payment/               # Payment processing
    │   ├── 📂 points-store/          # Points/rewards system
    │   ├── 📂 profile/               # Profile features
    │   └── 📂 video/                 # Video player logic
    │
    ├── 📂 context/                   # 🔄 STATE MANAGEMENT
    │   ├── auth-context.tsx          # Authentication context
    │   ├── booksCartStore.ts         # Zustand cart store
    │   ├── BooksStoreProvider.tsx    # Cart provider
    │   ├── ModalProvider.tsx         # Modal state
    │   ├── pay.js                    # Payment context
    │   ├── TaskProvider.tsx          # Task state
    │   └── TenantProvider.tsx        # Tenant settings
    │
    ├── 📂 helpers/                   # 🛠️ UTILITY FUNCTIONS
    │   ├── client-fetch.ts           # Client-side API calls
    │   ├── client-error-handler.ts   # Client error handling
    │   ├── server-fetch.ts           # Server-side API calls
    │   ├── server-error-handler.ts   # Server error handling
    │   ├── server-utils.ts           # Server utilities
    │   ├── tenant.helpers.ts         # Tenant utilities
    │   ├── post-server.ts            # POST requests
    │   └── reactCache.ts             # React cache wrapper
    │
    ├── 📂 services/                  # 🔌 API SERVICE LAYER
    │   ├── cartServices.ts           # Cart API calls
    │   └── tenantServices.ts         # Tenant API calls
    │
    ├── 📂 hooks/                     # 🪝 CUSTOM REACT HOOKS
    │   ├── use-toast.ts              # Toast notifications
    │   ├── useCoupon.ts              # Coupon logic
    │   ├── useFileDownload.ts        # File download
    │   ├── useGrades.ts              # Grades logic
    │   ├── useHandleFeaturesDisplay.tsx
    │   ├── useHandleOfferDisplay.tsx
    │   ├── useMediaQuery.ts          # Responsive breakpoints
    │   ├── useMounted.ts             # Mount detection
    │   ├── useOtp.ts                 # OTP verification
    │   ├── usePayment.ts             # Payment logic
    │   └── usePaymentsTypesFiltered.ts
    │
    ├── 📂 types/                     # 📘 TYPESCRIPT TYPES
    │   ├── index.ts                  # Main types
    │   ├── books.types.ts            # Books types
    │   ├── helpers.types.ts          # Helper types
    │   └── ...                       # Other type files
    │
    ├── 📂 lib/                       # 📚 LIBRARY CONFIGS
    │   ├── utils.ts                  # Utility functions (cn, etc.)
    │   └── customError.ts            # Custom error class
    │
    ├── 📂 layouts/                   # 🏗️ LAYOUT COMPONENTS
    │   ├── AuthHeader.tsx
    │   └── QueryProvider.tsx         # React Query provider
    │
    ├── 📂 constants/                 # 📌 CONSTANTS
    │   ├── index.ts                  # Main constants
    │   └── arabCountries.ts          # Arab countries data
    │
    └── 📂 utils/                     # 🔧 UTILITIES
        └── api.ts                    # API utilities
```

## 📊 Directory Statistics

### By Category

| Category       | Count    | Purpose                |
| -------------- | -------- | ---------------------- |
| **Pages**      | 30+      | Route pages            |
| **Components** | 100+     | Reusable UI components |
| **Modules**    | 9        | Feature modules        |
| **Hooks**      | 10+      | Custom React hooks     |
| **Helpers**    | 8        | Utility functions      |
| **Services**   | 2        | API service layer      |
| **Context**    | 6        | State providers        |
| **Types**      | Multiple | TypeScript definitions |

### By Type

| Type                  | Location                  | Count |
| --------------------- | ------------------------- | ----- |
| **Server Components** | `src/app/**/page.tsx`     | 20+   |
| **Client Components** | `src/components/**/*.tsx` | 80+   |
| **Layouts**           | `src/app/**/layout.tsx`   | 5     |
| **API Routes**        | `src/app/api/**`          | 1     |
| **Middleware**        | `src/middleware.ts`       | 1     |

## 🎯 Key Directories Explained

### `/src/app` - Next.js App Router

The heart of the application. Uses file-system based routing with route groups for organization.

### `/src/components` - React Components

All reusable UI components. Organized by type (ui, forms, modals, tables, etc.).

### `/src/modules` - Feature Modules

Complex features with their own hooks, components, and utilities. Encapsulated logic.

### `/src/context` - State Management

React Context providers and Zustand stores for global state.

### `/src/helpers` - Utilities

Helper functions for common tasks like API calls, error handling, and data transformation.

### `/src/services` - API Layer

Service layer for API calls. Abstracts API logic from components.

### `/src/hooks` - Custom Hooks

Reusable React hooks for common functionality.

### `/src/types` - TypeScript Types

Type definitions for the entire application.

### `/docs` - Documentation

Comprehensive project documentation for developers and AI agents.

## 🔍 Finding Files

### Common Patterns

```bash
# Find a page
src/app/(student)/[feature]/page.tsx

# Find a component
src/components/[ComponentName].tsx

# Find a UI component
src/components/ui/[component].tsx

# Find a form
src/components/forms/[FormName].tsx

# Find a modal
src/components/modals/[ModalName].tsx

# Find a hook
src/hooks/use[HookName].ts

# Find a helper
src/helpers/[helper-name].ts

# Find a type
src/types/[types].ts

# Find a module
src/modules/[module-name]/
```

## 📝 Naming Patterns

| Item               | Pattern               | Example                             |
| ------------------ | --------------------- | ----------------------------------- |
| **Pages**          | `page.tsx`            | `src/app/(student)/grades/page.tsx` |
| **Layouts**        | `layout.tsx`          | `src/app/(student)/layout.tsx`      |
| **Components**     | `PascalCase.tsx`      | `CourseCard.tsx`                    |
| **Utilities**      | `kebab-case.ts`       | `client-fetch.ts`                   |
| **Hooks**          | `useCamelCase.ts`     | `useAuth.ts`                        |
| **Types**          | `kebab-case.types.ts` | `books.types.ts`                    |
| **Route Groups**   | `(lowercase)`         | `(student)`, `(auth)`               |
| **Dynamic Routes** | `[param]`             | `[courseId]`, `[examId]`            |

---

**Note**: This structure follows Next.js 15 App Router conventions with a focus on modularity, reusability, and clear separation of concerns.
