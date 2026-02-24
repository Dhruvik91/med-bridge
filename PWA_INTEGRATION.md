# PWA Integration Documentation

## Overview
MedBridges now has full Progressive Web App (PWA) support, allowing users to install the app on their devices and use it offline.

## Features Implemented

### 1. **Service Worker with Workbox**
- Automatic service worker generation via `next-pwa`
- Smart caching strategies for different asset types
- Offline fallback support
- Background sync capabilities

### 2. **Web App Manifest**
Location: `/public/manifest.json`

Features:
- App name, description, and branding
- Theme colors (primary: `#0ea5e9`)
- Display mode: `standalone`
- App icons (192x192, 512x512) with maskable support
- App shortcuts for quick access:
  - Browse Jobs
  - Messages
  - Profile

### 3. **Offline Support**
- **Offline Page**: `/app/offline/page.tsx` - Custom offline experience
- **Fallback HTML**: `/public/fallback.html` - Static fallback for complete offline scenarios
- Previously visited pages cached and available offline
- Smart caching for images, fonts, and static assets

### 4. **Install Prompt**
Component: `/components/pwa-install-prompt.tsx`

Features:
- Detects when app can be installed
- Shows user-friendly install prompt
- Dismissible with 7-day cooldown
- Automatically hidden if already installed
- Detects standalone mode (iOS and Android)

### 5. **Update Notifications**
Component: `/components/pwa-update-prompt.tsx`

Features:
- Detects when new version is available
- Prompts user to update
- Seamless update experience
- Automatic reload after update

## Caching Strategies

### CacheFirst (Long-term assets)
- Google Fonts webfonts (365 days)
- Audio files (24 hours)
- Video files (24 hours)

### StaleWhileRevalidate (Frequently updated)
- Google Fonts stylesheets (7 days)
- Font files (7 days)
- Images (24 hours)
- Next.js images (24 hours)
- JavaScript files (24 hours)
- CSS files (24 hours)
- Next.js data (24 hours)

### NetworkFirst (Dynamic content)
- Static data assets (JSON, XML, CSV)
- Application pages (24 hours)
- API routes excluded from caching

## Configuration

### Next.js Config (`next.config.js`)
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    document: '/offline',
  },
  runtimeCaching: [...]
});
```

### Key Settings
- **dest**: Service worker files output to `/public`
- **register**: Auto-register service worker
- **skipWaiting**: Activate new service worker immediately
- **disable**: PWA disabled in development mode
- **fallbacks**: Custom offline page

## Files Added/Modified

### New Files
- `/src/components/pwa-install-prompt.tsx` - Install prompt component
- `/src/components/pwa-update-prompt.tsx` - Update notification component
- `/src/app/offline/page.tsx` - Offline page (React)
- `/public/fallback.html` - Static offline fallback
- `/PWA_INTEGRATION.md` - This documentation

### Modified Files
- `/next.config.js` - Added next-pwa configuration
- `/src/app/layout.tsx` - Added PWA components
- `/public/manifest.json` - Enhanced with maskable icons
- `/.gitignore` - Added PWA generated files
- `/package.json` - Added next-pwa dependency

### Generated Files (Auto-generated on build)
- `/public/sw.js` - Service worker
- `/public/workbox-*.js` - Workbox runtime

## Testing PWA

### Local Testing
1. Build the production version:
   ```bash
   npm run build
   npm start
   ```

2. Open Chrome DevTools > Application tab
3. Check:
   - Manifest
   - Service Workers
   - Cache Storage
   - Offline functionality

### Lighthouse Audit
Run Lighthouse audit in Chrome DevTools to verify PWA score:
- Performance
- Accessibility
- Best Practices
- SEO
- PWA

### Testing Install
1. Visit the site in Chrome/Edge
2. Look for install prompt in address bar
3. Or use the custom install prompt that appears
4. Install and verify standalone mode

### Testing Offline
1. Install the app
2. Open DevTools > Network tab
3. Set to "Offline"
4. Navigate through previously visited pages
5. Verify offline page appears for new pages

## Browser Support

### Full Support
- Chrome/Edge (Desktop & Mobile)
- Safari (iOS 11.3+)
- Firefox (Desktop & Mobile)
- Samsung Internet

### Features by Browser
- **Install Prompt**: Chrome, Edge, Samsung Internet
- **Offline Support**: All modern browsers
- **Push Notifications**: Chrome, Edge, Firefox
- **Background Sync**: Chrome, Edge

## Production Checklist

- [x] Service worker registered and working
- [x] Manifest file properly configured
- [x] Icons in all required sizes (192x192, 512x512)
- [x] Offline fallback page
- [x] Install prompt implemented
- [x] Update notifications implemented
- [x] Caching strategies optimized
- [x] Build successful without errors
- [x] HTTPS required for production (service workers only work over HTTPS)

## Deployment Notes

### HTTPS Requirement
Service workers require HTTPS in production. Ensure your hosting platform provides SSL certificates.

### Cache Invalidation
When deploying updates:
1. Service worker will detect new version
2. Update prompt will appear to users
3. Users can update immediately or on next visit
4. Old cache automatically cleaned up

### Monitoring
Monitor service worker registration and errors:
- Check browser console for service worker logs
- Monitor cache sizes
- Track install/update rates

## Future Enhancements

Potential improvements:
- [ ] Push notification implementation
- [ ] Background sync for form submissions
- [ ] Periodic background sync
- [ ] Share target API
- [ ] File handling API
- [ ] Badge API for notification counts
- [ ] Custom install screenshots in manifest

## Resources

- [Next PWA Documentation](https://github.com/shadowwalker/next-pwa)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)

## Support

For issues or questions about PWA functionality, check:
1. Browser console for service worker errors
2. Application tab in DevTools
3. Network tab for caching behavior
4. Lighthouse audit results
