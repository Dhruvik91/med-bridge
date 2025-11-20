# MedBridge - Healthcare Job Marketplace

MedBridge is a comprehensive job marketplace platform connecting qualified doctors with healthcare opportunities. Built with modern web technologies and designed for scalability, accessibility, and performance.

## 🏥 Project Overview

MedBridge serves as a "LinkedIn for doctors" focused on job placement, credentials verification, and building trust between healthcare professionals and medical facilities.

### Key Features

- **Role-based Authentication**: Separate experiences for doctors, hospitals, and admins
- **Credential Verification**: Rigorous verification process for medical licenses and certifications
- **Smart Job Matching**: AI-powered matching based on specialties, experience, and preferences
- **Real-time Messaging**: Direct communication between doctors and hospitals
- **Application Tracking**: Complete application lifecycle management
- **PWA Support**: Installable web app with offline capabilities
- **SEO Optimized**: Server-side rendering with dynamic metadata

## 🛠 Tech Stack

### Frontend
- **Next.js 13** - App Router with src/ directory structure
- **React 18** - With TypeScript for type safety
- **Tailwind CSS** - Utility-first CSS framework with CSS variables for theming
- **shadcn/ui** - Modern, accessible UI components
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, customizable icons

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security (RLS)** - Database-level security policies
- **Supabase Auth** - Authentication with magic links and OAuth
- **Supabase Storage** - File uploads for CVs and profile images
- **Supabase Edge Functions** - Serverless functions for complex operations

### State Management & Data Fetching
- **TanStack Query (React Query)** - Server state management and caching
- **React Context** - Client-side state management for auth and theme

### Development & Deployment
- **TypeScript** - Type safety and better developer experience
- **ESLint & Prettier** - Code linting and formatting
- **Vercel** - Deployment and hosting platform
- **GitHub Actions** - CI/CD pipeline

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MedBridge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Database Setup**
   - Run the SQL schema in `supabase/schema.sql` in your Supabase SQL editor
   - This will create all necessary tables, RLS policies, and triggers

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage
│   ├── auth/              # Authentication pages
│   ├── jobs/              # Job listing and detail pages
│   └── profile/           # User profile pages
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── navigation.tsx    # Main navigation component
│   └── jobs/             # Job-related components
├── providers/            # React Context providers
│   ├── auth-provider.tsx # Authentication context
│   ├── query-provider.tsx # React Query setup
│   └── theme-provider.tsx # Theme management
├── lib/                  # Utility functions and configurations
│   └── supabase.ts      # Supabase client setup
├── types/               # TypeScript type definitions
│   └── supabase.ts     # Database type definitions
└── hooks/              # Custom React hooks
```

## 🗄 Database Schema

### Core Tables

- **users** - User accounts with role-based access (doctor/hospital/admin)
- **doctor_profiles** - Doctor-specific information, credentials, and preferences
- **hospital_profiles** - Hospital information and branding
- **jobs** - Job postings with detailed requirements and benefits
- **applications** - Job applications with status tracking
- **messages** - Real-time messaging between users
- **notifications** - System and user notifications

### Security

- Row Level Security (RLS) enabled on all tables
- Role-based access policies
- Secure file uploads with signed URLs
- API rate limiting and authentication

## 🎨 Design System

### Theme
- CSS variables for consistent theming
- Light/dark mode support
- Accessible color contrast ratios (WCAG AA)
- Responsive design with mobile-first approach

### Components
- Built with shadcn/ui for consistency
- Fully accessible with ARIA attributes
- Keyboard navigation support
- Loading states and error handling

## 🔐 Authentication Flow

1. **Sign Up**: Email/password or Google OAuth with role selection
2. **Email Verification**: Magic link verification for security
3. **Profile Creation**: Role-specific profile setup
4. **Credential Verification**: Manual verification process for doctors
5. **Access Control**: RLS policies enforce role-based permissions

## 📱 PWA Features

- **Installable**: Web app manifest for native-like installation
- **Offline Support**: Service worker for offline functionality
- **Push Notifications**: Real-time updates for messages and applications
- **Responsive**: Mobile-optimized interface

## 🔍 SEO Optimization

- **Server-Side Rendering**: Next.js App Router for optimal SEO
- **Dynamic Metadata**: Page-specific meta tags and Open Graph data
- **Structured Data**: JSON-LD for rich search results
- **Sitemap**: Automatically generated sitemap.xml
- **Performance**: Optimized Core Web Vitals

## 🧪 Testing Strategy

- **Unit Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright for user journey testing
- **Accessibility**: axe-core for automated a11y testing
- **Performance**: Lighthouse CI for performance monitoring

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add all required environment variables
3. **Build Settings**: 
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. **Deploy**: Automatic deployments on push to main branch

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📈 Performance Targets

- **Lighthouse Score**: >90 for all metrics
- **Core Web Vitals**: 
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- **Bundle Size**: Optimized with code splitting and tree shaking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the Supabase setup guide

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Basic authentication and user management
- [x] Job listing and search functionality
- [x] Core UI components and navigation
- [ ] Profile management for doctors and hospitals
- [ ] Application system

### Phase 2
- [ ] Real-time messaging system
- [ ] Advanced search and filtering
- [ ] Notification system
- [ ] Admin dashboard

### Phase 3
- [ ] AI-powered job matching
- [ ] Video interview integration
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

---

Built with ❤️ for the healthcare community
