# Trooth Social Independent — Project Audit Status

## Web app
- Main public entry: `index.html`
- Home Feed: `feed.html`
- Current Home UI includes social feed, Stories, post composer, photo/video posting, comments, likes, sharing, profile/login, Friends, Groups, Business, News, Sports, Stores, Property, and Film & Fashion.
- Current home design uses the saved strong-green professional theme and responsive mobile navigation.
- Latest Home Feed design commit: `5092cf3667c15392874c588724bab45ddd50b66e`.

## Deployment
- GitHub Pages deployment workflow: `.github/workflows/static.yml`
- Deployment source branch: `main`.
- Pages workflow applies cache-busted social/profile bridges during deployment.

## APK
- Target release: v1.5
- Android versionCode: 7
- Android versionName: 1.5
- APK artifact name: `Trooth-Social-Independent-APK-v1.5`
- Build workflow: `.github/workflows/package.yml`
- APK is generated from the current `main` branch web app source and packaged as an Android WebView application.

## Verification rule
- Do not provide an APK download as current until the corresponding GitHub Actions build has completed successfully and the artifact has been checked.
