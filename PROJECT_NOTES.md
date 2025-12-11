# Squad Dashboard - Project Notes

## 🔗 URLs

| Environment | URL |
|-------------|-----|
| **GitHub** | https://github.com/kaynguyenhcmc-sudo/squad-dashboard |
| **Vercel Beta** | https://squad-dashboard-beta.vercel.app |
| **Password** | `7Ak2Xp5O3N` |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel

---

## 💻 Development Commands

```bash
# Clone project
git clone https://github.com/kaynguyenhcmc-sudo/squad-dashboard.git
cd squad-dashboard

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 📦 Git Commands

```bash
# Check status
git status

# Pull latest code
git pull

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push
```

### First time setup on new machine:
```bash
git config --global user.email "kaynguyenhcmc@gmail.com"
git config --global user.name "Kay Nguyen"
```

---

## 🚀 Deploy to Vercel

```bash
# Deploy to production
npx vercel --prod --yes

# Update beta alias (if needed)
npx vercel alias [deployment-url] squad-dashboard-beta.vercel.app
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard home
│   ├── password/page.tsx     # Password protection
│   ├── review/page.tsx       # Video Review (main feature)
│   └── api/auth/route.ts     # Auth API
├── components/
│   ├── review/               # Video review components
│   └── icons/                # Icon components
├── data/
│   └── videoData.ts          # CSV data loader
└── middleware.ts             # Auth middleware

public/
├── videos/                   # Video files
├── data/dataScript.csv       # Transcript & sentiment data
└── logo.png                  # Company logo
```

---

## 🎬 Current Review Data

- **Officer**: Ofc. Scott, Kurt (5294)
- **Reviewer**: Tanioka, Sidney (stanioka)
- **Video**: Demo_clipAX.mp4

---

## 🎨 Design Tokens

| Element | Color |
|---------|-------|
| Background Dark | `#141217` |
| Background Card | `#1f1d23` |
| Text Primary | `#f2efed` |
| Text Secondary | `rgba(242,239,237,0.75)` |
| Accent Yellow | `#ffd563` |
| Accent Gold | `#fec62e` |
| Border | `rgba(242,239,237,0.12)` |

---

## 📝 Notes

- Video duration calculated from max timestamp in CSV
- Thumbnails generated client-side using canvas
- CSV fetched with cache-busting (`?_t=${Date.now()}`)
- ESC key closes all popups
- Always test on localhost before deploying

---

*Last updated: December 11, 2025*

