# 🚀 PulseVision Deployment Guide

Quick guide to deploy PulseVision to various platforms.

---

## 📋 Prerequisites

- Git installed on your computer
- GitHub account (for GitHub Pages)
- Modern web browser

---

## 🌐 Method 1: GitHub Pages (Recommended - Free)

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New Repository"
3. Name: `pulsevision` (or any name you prefer)
4. Make it Public
5. Click "Create Repository"

### Step 2: Push Your Code

```bash
# Navigate to project directory
cd "C:\Users\User\OneDrive\Desktop\Y3S1\IT Project Work\PulseVision"

# Initialize Git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: PulseVision fatigue detection system"

# Add remote (replace with your username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/pulsevision.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** section (left sidebar)
4. Under "Source", select **main** branch
5. Click **Save**
6. Wait 1-2 minutes

### Step 4: Access Your Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/pulsevision/
```

---

## ⚡ Method 2: Vercel (Fast Deployment)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy

```bash
# Navigate to project directory
cd "C:\Users\User\OneDrive\Desktop\Y3S1\IT Project Work\PulseVision"

# Login to Vercel
vercel login

# Deploy
vercel
```

### Step 3: Follow Prompts

- Set up and deploy: Yes
- Which scope: (choose your account)
- Link to existing project: No
- Project name: pulsevision
- Directory: ./
- Override settings: No

Your site will be live instantly!

---

## 🎯 Method 3: Netlify (Drag & Drop)

### Step 1: Visit Netlify

Go to [netlify.com](https://netlify.com)

### Step 2: Drag & Drop

1. Click "Add new site" → "Deploy manually"
2. Drag the entire `PulseVision` folder
3. Wait for deployment

Your site is live!

---

## 🖥️ Method 4: Local Testing

### Using Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Visit: `http://localhost:8000`

### Using Node.js

```bash
npx http-server -p 8000
```

Visit: `http://localhost:8000`

### Using PHP

```bash
php -S localhost:8000
```

Visit: `http://localhost:8000`

---

## ✅ Post-Deployment Checklist

After deploying, verify:

- [ ] Site loads correctly
- [ ] Camera permission prompt appears
- [ ] Video feed displays (mirror mode)
- [ ] Face detection works (green dots appear)
- [ ] Eye detection highlights (red contours)
- [ ] Mouth detection highlights (blue contours)
- [ ] Alerts trigger on eye closure
- [ ] Sound alerts work (if enabled)
- [ ] Help modal opens
- [ ] Settings sliders work
- [ ] Reset button functions
- [ ] Works on mobile devices
- [ ] HTTPS is enabled (required for camera)

---

## 🔧 Troubleshooting Deployment

### Camera Not Working

**Cause:** Non-HTTPS connection

**Solution:**
- GitHub Pages automatically uses HTTPS
- For custom servers, enable SSL/TLS
- Use localhost for testing (works without HTTPS)

### 404 Error on GitHub Pages

**Cause:** Wrong settings or branch

**Solution:**
1. Check Settings → Pages
2. Ensure correct branch is selected
3. Wait a few minutes for deployment
4. Clear browser cache

### Slow Loading

**Cause:** MediaPipe libraries loading

**Solution:**
- Normal on first load
- Libraries are cached after initial load
- Consider using CDN alternatives if needed

---

## 📱 Mobile Deployment Notes

### iOS Safari
- Works perfectly
- Requires HTTPS
- May need "Allow" for camera

### Android Chrome
- Full support
- Requires HTTPS
- Excellent performance

### Testing Mobile

Use browser DevTools device emulation:
1. Open DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Select mobile device
4. Test responsiveness

---

## 🎓 For Academic Submission

### Required Files

Ensure these files are included:
- `index.html` - Main application
- `styles.css` - Styling
- `app.js` - Application logic
- `README.md` - Documentation
- `DEPLOYMENT_GUIDE.md` - This guide

### Submission Package

Create a ZIP file:
```bash
# Navigate to parent directory
cd "C:\Users\User\OneDrive\Desktop\Y3S1\IT Project Work"

# Create ZIP (Windows)
Compress-Archive -Path PulseVision -DestinationPath PulseVision.zip
```

Include:
1. Source code (all files)
2. README.md
3. Live demo URL (if deployed)
4. Screenshots/demo video (optional)

---

## 📊 Testing for 85% Accuracy Goal

### Test Protocol

1. **Prepare Test Cases** (minimum 100 events)
   - 25 prolonged eye closures (>2s) → Should Alert
   - 25 brief eye closures (<1s) → Should NOT Alert
   - 25 yawn events → Should Alert
   - 25 normal behaviors → Should NOT Alert

2. **Record Results**
   - True Positives (TP): Correctly detected fatigue
   - True Negatives (TN): Correctly ignored normal behavior
   - False Positives (FP): Incorrectly flagged normal as fatigue
   - False Negatives (FN): Missed actual fatigue

3. **Calculate Accuracy**
   ```
   Accuracy = (TP + TN) / (TP + TN + FP + FN)
   Target: ≥ 85%
   ```

### Documentation

Record in a spreadsheet:
| Test # | Event Type | Expected | Actual | Result |
|--------|------------|----------|--------|---------|
| 1      | Eye close 3s | Alert  | Alert  | ✓ TP   |
| 2      | Normal blink | No Alert | No Alert | ✓ TN |

---

## 🔗 Useful Links

- [MediaPipe Docs](https://google.github.io/mediapipe/)
- [GitHub Pages Guide](https://pages.github.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)

---

## 💡 Tips

1. **Always use HTTPS** for webcam access
2. **Test on multiple devices** before submission
3. **Document any issues** and solutions
4. **Keep the interface simple** (user resistance constraint)
5. **Provide clear help guides** (included in app)

---

**Good luck with your deployment! 🚀**
