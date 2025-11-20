# MedBridge Deployment Guide

This guide covers deploying MedBridge to production using Vercel and Supabase.

## Prerequisites

- Supabase account and project
- Vercel account
- GitHub repository
- Domain name (optional)

## 1. Supabase Setup

### Database Setup

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Run the database schema**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the SQL to create all tables, policies, and triggers

3. **Configure Authentication**
   - Go to Authentication > Settings
   - Enable Email authentication
   - Configure Google OAuth (optional):
     - Add Google as a provider
     - Set up OAuth credentials in Google Cloud Console
     - Add redirect URLs

4. **Set up Storage**
   - Go to Storage
   - Create buckets for:
     - `avatars` (for profile pictures)
     - `cvs` (for CV uploads)
     - `logos` (for hospital logos)
   - Configure appropriate policies for each bucket

### Row Level Security Policies

The schema includes comprehensive RLS policies, but verify they're active:

- Users can only see their own data
- Doctors can view verified hospital profiles
- Hospitals can view verified doctor profiles
- Job applications are visible to relevant parties only

## 2. Environment Variables

Create these environment variables in your deployment platform:

### Required Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=MedBridge

# Email Configuration (Optional - for notifications)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# File Upload Configuration
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.jpg,.jpeg,.png
```

## 3. Vercel Deployment

### Automatic Deployment

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Add Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all required environment variables
   - Make sure to mark public variables appropriately

4. **Deploy**
   - Click Deploy
   - Vercel will build and deploy automatically

### Custom Domain (Optional)

1. **Add Domain**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **SSL Certificate**
   - Vercel automatically provides SSL certificates
   - Ensure HTTPS redirect is enabled

## 4. Post-Deployment Configuration

### Update Supabase Settings

1. **Site URL**
   - Go to Authentication > Settings
   - Update Site URL to your production domain

2. **Redirect URLs**
   - Add your production domain to allowed redirect URLs
   - Format: `https://your-domain.com/auth/callback`

### SEO Configuration

1. **Update Metadata**
   - Update `metadataBase` in `src/app/layout.tsx`
   - Update sitemap configuration in `next-sitemap.config.js`

2. **Robots.txt**
   - Update the Host field in `public/robots.txt`
   - Ensure sitemap URL is correct

### PWA Configuration

1. **Update Manifest**
   - Update `start_url` and `scope` in `public/manifest.json`
   - Ensure all icon files are present in `public/icons/`

2. **Service Worker**
   - The service worker is automatically registered
   - Test PWA functionality on mobile devices

## 5. Testing Deployment

### Functionality Tests

1. **Authentication**
   - Test sign up with email
   - Test magic link login
   - Test Google OAuth (if configured)
   - Verify role-based access

2. **Core Features**
   - Browse jobs without authentication
   - Create and edit profiles
   - Apply for jobs (doctors)
   - Post jobs (hospitals)
   - Send and receive messages

3. **PWA Features**
   - Test "Add to Home Screen" on mobile
   - Verify offline functionality
   - Test push notifications (if implemented)

### Performance Tests

1. **Lighthouse Audit**
   - Run Lighthouse on key pages
   - Ensure scores > 90 for all metrics
   - Fix any performance issues

2. **Core Web Vitals**
   - Monitor LCP, FID, and CLS
   - Use Vercel Analytics for ongoing monitoring

## 6. Monitoring and Analytics

### Vercel Analytics

1. **Enable Analytics**
   - Go to Project Settings > Analytics
   - Enable Web Analytics
   - Monitor Core Web Vitals

### Error Monitoring

1. **Vercel Functions**
   - Monitor function logs in Vercel dashboard
   - Set up alerts for errors

2. **Supabase Monitoring**
   - Monitor database performance
   - Set up alerts for high usage

### User Analytics (Optional)

Consider adding:
- Google Analytics 4
- Mixpanel for user behavior
- Hotjar for user experience insights

## 7. Maintenance

### Regular Updates

1. **Dependencies**
   - Keep Next.js and other dependencies updated
   - Test thoroughly before deploying updates

2. **Security**
   - Regularly review Supabase RLS policies
   - Monitor for security vulnerabilities
   - Keep authentication methods secure

### Backup Strategy

1. **Database Backups**
   - Supabase provides automatic backups
   - Consider additional backup strategies for critical data

2. **Code Backups**
   - Ensure code is backed up in GitHub
   - Tag releases for easy rollback

## 8. Scaling Considerations

### Database Scaling

- Monitor Supabase usage and upgrade plan as needed
- Consider read replicas for high-traffic scenarios
- Optimize queries and add indexes as needed

### CDN and Caching

- Vercel provides global CDN automatically
- Consider additional caching strategies for API responses
- Implement proper cache headers

### Performance Optimization

- Monitor bundle size and optimize as needed
- Implement code splitting for large features
- Use Next.js Image optimization for all images

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors
   - Verify all environment variables are set
   - Check for missing dependencies

2. **Authentication Issues**
   - Verify Supabase URLs and keys
   - Check redirect URL configuration
   - Ensure RLS policies are correct

3. **Database Connection Issues**
   - Verify Supabase service role key
   - Check network connectivity
   - Review database logs in Supabase

### Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MedBridge GitHub Issues](https://github.com/your-repo/issues)

## Security Checklist

- [ ] All environment variables are secure
- [ ] RLS policies are properly configured
- [ ] Authentication is working correctly
- [ ] File uploads are restricted and secure
- [ ] API endpoints are protected
- [ ] HTTPS is enforced
- [ ] Content Security Policy is configured
- [ ] Rate limiting is implemented (if needed)

---

For additional support or questions about deployment, please refer to the project documentation or create an issue in the GitHub repository.
