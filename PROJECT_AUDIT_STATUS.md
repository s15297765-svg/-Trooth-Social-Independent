# Trooth Social Independent — Project Audit Status

## Web app
- Main public entry: `index.html`
- Home route: `index.html` (the legacy `feed.html` route now forwards to the main Home)
- Current Home UI includes social feed, Stories, post composer, photo/video posting, comments, likes, sharing, profile/login, Friends, Groups, Business, News, Sports, Stores, Property, and Film & Fashion.
- Current home design uses the saved strong-green professional theme and responsive mobile navigation.
- Main Home is the single primary feed experience; navigation is kept on `index.html`.

## Deployment
- GitHub Pages deployment workflow: `.github/workflows/static.yml`
- Deployment source branch: `main`.
- Pages workflow applies cache-busted social/profile bridges during deployment.

## APK
- Current target release: **v1.7**
- Android versionCode: **17**
- Android versionName: **1.7**
- APK artifact name: `Trooth-Social-Independent-APK-v1.7`
- Build workflow: `.github/workflows/package.yml`
- APK is generated from the current `main` branch web app source and packaged as an Android WebView application.
- Stability rule: the APK loads the bundled `index.html` from Android assets instead of depending on the live GitHub Pages URL at runtime. Supabase/network features may still use the internet normally.
- Navigation target: compact three-line mobile navigation; the second row shows News, Sports, International, Stores, Film / Fashion and Property with visible labels.

## Verification rule
- Do not provide an APK download as current until the corresponding GitHub Actions build has completed successfully and the artifact has been checked.
