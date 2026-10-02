# C&N Spotless — Website

Mobile window tinting across Broward County, FL — (954) 213-7808 · clayontrowers6@gmail.com

The public site: homepage, car / home / business tint pages, gallery, quote form, animations and all the SEO. Visitor tracking and the quote form send to your **backend** (the other download).

## 1. Connect it to your backend
Deploy the backend first, then open `public/assets/site.js` in any text editor (Notepad works) and fill in line 11:

```js
var API_URL = "https://cn-spotless-backend.vercel.app";   // ← your backend's address, no slash at the end
```

Until this is set, the site works but nothing is tracked, and the quote form opens the visitor's email app instead.

## 2. Deploy to Vercel
1. **Upload to GitHub** — new repository `cn-spotless-website` at https://github.com/new → *uploading an existing file* → drag in everything in this folder → Commit.
2. **Import into Vercel** — https://vercel.com → *Add New… → Project* → pick `cn-spotless-website` → *Deploy*. Leave the settings as they are; `vercel.json` handles it. Vercel runs `npm run build` on every deploy, which generates the SEO files.
3. **Connect your domain** — *Settings → Domains* → add `cnmobiletinting.shopzencho.com` (vercel.json redirects `shopzencho.com` to it so the site has a single address) (set any `www` to redirect to the main one), then follow the DNS steps for wherever you bought the domain.
4. **Check the backend allows it** — the backend's `ALLOWED_ORIGINS` setting must include your website's address(es). If you test on the `.vercel.app` address first, add that too.

## 3. Get found on Google
- Submit `https://cnmobiletinting.shopzencho.com/sitemap.xml` in Google Search Console (https://search.google.com/search-console).
- Set up your **Google Business Profile** (https://business.google.com) as a service-area business covering Broward County, category "Window tinting service". This matters more than anything on the site.
- Ask every customer for a Google review.

## Editing the site
| To change… | Edit |
|---|---|
| Homepage text, nav, footer, phone | `public/index.html` (nav/footer copy to the other pages automatically) |
| Cities served, service page text, social links | `BUSINESS` and `SERVICES` at the top of `scripts/build-pages.js` |
| Styles / animations | `public/assets/site.css` |
| Backend address | `API_URL` in `public/assets/site.js` |

After editing, Vercel rebuilds automatically when you upload the change to GitHub. To preview on your own computer (Node.js 20+): `npm run preview` → http://localhost:3000

## Before launch
- Replace the `#` social links in the footer of `public/index.html` with your real Facebook / Instagram / TikTok.
- Paste real customer reviews into the Reviews section (template in the HTML comment above it).
- Have someone look over the Privacy Policy / Terms (footer).
- Add real home photos to the residential page when you have them.
