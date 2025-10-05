# 🚀 Quick Start Guide - Substack Integration

## ⚡ 2-Minute Setup

### Step 1: Install Dependencies
```bash
cd backend
npm install axios xml2js
cd ..
```

### Step 2: Start Servers
**Terminal 1:**
```bash
cd backend
npm run develop
```

**Terminal 2:**
```bash
npm run dev
```

### Step 3: Test
Visit: `http://localhost:5173/news`

✅ Done! Your Substack posts should now be displaying.

---

## 📝 Common Commands

### Start Development
```bash
# Backend
cd backend && npm run develop

# Frontend (new terminal)
npm run dev
```

### Test API
```bash
# In browser or curl
http://localhost:1337/api/substack/posts
```

### Build Production
```bash
npm run build
cd backend && npm run build
```

---

## 🔧 Quick Fixes

### Posts Not Loading?
1. Check backend is running (Terminal 1)
2. Test API: `http://localhost:1337/api/substack/posts`
3. Check browser console (F12)

### Error State Showing?
- Restart backend server
- Click "Try Again" button
- Check Substack RSS: `https://bobbakerart.substack.com/feed`

### Styling Issues?
- Hard refresh: `Ctrl + Shift + R`
- Clear browser cache
- Check News.css is imported

---

## 📚 Documentation Quick Links

| Document | Purpose |
|----------|---------|
| `SUBSTACK_SETUP_COMPLETE.md` | Overview & features |
| `SUBSTACK_INTEGRATION.md` | Technical documentation |
| `CHECKLIST.md` | Testing checklist |
| `VISUAL_OVERVIEW.md` | Architecture diagrams |
| `README.md` | Project documentation |

---

## 🎯 Key Files

### Backend
```
backend/src/api/substack/
├── routes/substack.js      # API route
├── controllers/substack.js # Handler
└── services/substack.js    # RSS fetcher
```

### Frontend
```
src/
├── News.jsx               # Main component
└── News.css               # Styling
```

---

## 🌐 Important URLs

| URL | Description |
|-----|-------------|
| `http://localhost:1337` | Backend admin |
| `http://localhost:1337/api/substack/posts` | API endpoint |
| `http://localhost:5173/news` | News page |
| `https://bobbakerart.substack.com` | Your Substack |
| `https://bobbakerart.substack.com/feed` | RSS feed |

---

## 🎨 Customization Cheat Sheet

### Change Post Limit
**File:** `src/News.jsx`
```javascript
const displayedPosts = posts.slice(0, 6); // Show 6 posts
```

### Change Excerpt Length
**File:** `backend/src/api/substack/services/substack.js`
```javascript
const excerpt = plainText.substring(0, 200) + '...';
```

### Change Grid Columns
**File:** `src/News.css`
```css
.posts-grid {
  grid-template-columns: repeat(2, 1fr); /* 2 columns */
}
```

### Change Colors
**File:** `src/News.css`
```css
/* Find and replace */
#d4a5ff          /* Accent purple */
#1a0a1f          /* Background dark */
rgba(255,255,255,0.X)  /* White opacity */
```

---

## 📊 Troubleshooting Matrix

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Blank page | Backend not running | Start backend |
| Error message | API unavailable | Check backend console |
| No posts | No Substack posts | Publish a post |
| Broken styling | CSS not loaded | Check import, clear cache |
| CORS error | Wrong URL/origin | Check CORS config |

---

## ✅ Pre-Flight Checklist

Before showing anyone:
- [ ] Backend running
- [ ] Frontend running  
- [ ] Posts loading
- [ ] Subscribe form works
- [ ] Links open correctly
- [ ] Mobile responsive
- [ ] No console errors

---

## 🆘 Emergency Contacts

**Documentation:**
- Read: `SUBSTACK_INTEGRATION.md`
- Check: `CHECKLIST.md`

**External:**
- Strapi: https://docs.strapi.io
- React: https://react.dev
- Substack: https://support.substack.com

---

## 💡 Pro Tips

1. **Keep Backend Running**: Leave Terminal 1 open with backend
2. **Hot Reload**: Frontend updates instantly on save
3. **Test API First**: Always check `/api/substack/posts` if posts don't load
4. **Clear Cache**: Use incognito mode to test without cache
5. **Check Logs**: Backend console shows helpful error messages

---

## 🎉 Success Indicators

You're good to go when:
- ✅ Posts load in < 2 seconds
- ✅ All links work
- ✅ Subscribe form displays
- ✅ Responsive on mobile
- ✅ No console errors
- ✅ Clean, professional look

---

**Need More Help?**

👉 Full documentation: `SUBSTACK_INTEGRATION.md`  
👉 Visual guide: `VISUAL_OVERVIEW.md`  
👉 Testing guide: `CHECKLIST.md`

**Ready to publish? Start writing on Substack and watch it appear on your site! 📸**
