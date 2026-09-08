# SLR Travels — static site

Files:
- `index.html` — the whole site (all pages: home, categories, packages, package details, destinations, gallery, journal, about, contact)
- `support.js` — runtime the page loads
- `logo-mark.png`, `logo-word.png`, `logo-full.png` — logo assets

## Deploy to Vercel

**Option A — drag and drop**
1. Unzip this folder.
2. Go to vercel.com/new, choose "Deploy" → drag the unzipped folder onto the page.
3. Framework preset: **Other**. No build command, output directory = the folder root.

**Option B — CLI**
```
npm i -g vercel
cd slr-travels-site
vercel
```
Accept the defaults; when asked for a build command press enter (none), output directory `./`.

**Option C — GitHub**
Push the folder contents to a repo root, then import the repo on Vercel with preset "Other".

## Notes
- Photos load from Wikimedia Commons over the network. Replace the URLs in `index.html` with your own images before going live.
- The contact form and newsletter are front-end only; wire them to your mail service or a form endpoint.
- The map on the contact page is an OpenStreetMap embed; swap the coordinates for your real office.
