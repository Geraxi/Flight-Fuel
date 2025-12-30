# iOS Native App Setup - FlightFuel

## ✅ Capacitor Setup Complete!

Your React web app has been successfully configured with Capacitor to create a native iOS app.

## 📁 Project Structure

- **iOS Project**: `ios/App/`
- **Xcode Workspace**: `ios/App/App.xcworkspace`
- **Configuration**: `capacitor.config.ts`

## 🚀 Next Steps

### 1. Fix CocoaPods Deployment Target

The iOS deployment target needs to be updated. Open `ios/App/Podfile` and ensure it has:

```ruby
platform :ios, '13.0'  # or higher
```

Then run:
```bash
cd ios/App && export LANG=en_US.UTF-8 && pod install
```

### 2. Open in Xcode

```bash
npm run cap:ios
```

Or manually:
```bash
open ios/App/App.xcworkspace
```

**⚠️ Important**: Always open the `.xcworkspace` file, NOT the `.xcodeproj` file!

### 3. Configure API Endpoint

Since this is a mobile app, you'll need to configure where API calls go. You have two options:

#### Option A: Use a Remote Server (Recommended for Production)

1. Deploy your backend server (Express) to a hosting service (Heroku, Railway, Render, etc.)
2. Update `capacitor.config.ts`:
   ```typescript
   server: {
     url: 'https://your-api-server.com',
     androidScheme: 'https',
     iosScheme: 'https',
   },
   ```

#### Option B: Use Local Bundle (For Testing)

- Comment out the `server.url` in `capacitor.config.ts` to use the bundled web app
- Note: This won't work for API calls, only for UI testing

### 4. Configure App Signing in Xcode

1. Open `ios/App/App.xcworkspace` in Xcode
2. Select the **App** project in the left sidebar
3. Select the **App** target
4. Go to **Signing & Capabilities** tab
5. Select your **Team** (you'll need an Apple Developer account)
6. Xcode will automatically manage provisioning profiles

### 5. Set Bundle Identifier

The bundle identifier is currently `com.flightfuel.app`. If you want to change it:
1. Update it in Xcode (Signing & Capabilities)
2. Update `appId` in `capacitor.config.ts`
3. Run `npx cap sync ios`

### 6. Build & Run

1. Select a simulator or connected device in Xcode
2. Click the **Play** button (▶️) or press `Cmd+R`
3. The app will build and launch

### 7. Test Features

- ✅ Navigation
- ✅ Authentication (Clerk)
- ⚠️ API calls (need server URL configured)
- ✅ Camera access (for food scanning)
- ✅ Native device features

### 8. Prepare for App Store

#### Before Submission:

1. **Update App Icons**
   - Replace icons in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Need sizes: 20pt, 29pt, 40pt, 60pt (@2x and @3x)

2. **Update Splash Screen**
   - Already configured in `capacitor.config.ts`
   - Assets in `ios/App/App/Assets.xcassets/Splash.imageset/`

3. **Set Version & Build Number**
   - In Xcode: Select App target → General tab
   - Set **Version** (e.g., 1.0.0)
   - Set **Build** number (increment for each submission)

4. **Configure Info.plist**
   - Add required privacy descriptions (camera, photos, etc.)
   - Location: `ios/App/App/Info.plist`

5. **Test on Real Device**
   - Connect iPhone via USB
   - Select device in Xcode
   - Build and run

6. **Archive & Submit**
   - Product → Archive
   - Once archived, click **Distribute App**
   - Follow App Store Connect wizard

## 📝 Important Notes

### API Configuration

**Current Issue**: The app makes API calls to relative URLs (`/api/...`). For a mobile app, you need:

1. **Either**: Configure a server URL in `capacitor.config.ts`
2. **Or**: Update all API calls to use an absolute URL

To make API calls work, you could:

```typescript
// In client/src/lib/api.ts, add a base URL:
const API_BASE_URL = import.meta.env.VITE_API_URL || (Capacitor.isNativePlatform() ? 'https://your-server.com' : '');

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  // ... rest of code
}
```

### Clerk Authentication

Clerk has been configured with Capacitor-compatible redirect origins. Make sure to:
1. Add your app's bundle ID to Clerk's allowed origins
2. Configure deep linking if needed

### Environment Variables

For production builds, you may need to:
- Set environment variables in Xcode build settings
- Or use a `.env` file that gets bundled (using a vite plugin)

## 🔧 Available NPM Scripts

- `npm run cap:sync` - Sync web assets to iOS project
- `npm run cap:ios` - Open iOS project in Xcode
- `npm run cap:build` - Build and sync in one command

## 📚 Resources

- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [App Store Submission Guide](https://developer.apple.com/app-store/submissions/)
- [Xcode Guide](https://developer.apple.com/xcode/)

---

**Status**: ✅ Capacitor configured, iOS project created
**Next**: Fix Podfile deployment target, open in Xcode, configure API endpoint

