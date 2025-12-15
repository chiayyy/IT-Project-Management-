# ⚡ Quick Start Guide

Get PulseVision running in under 2 minutes!

---

## 🎯 Fastest Method (Windows)

### Option 1: Double-Click to Start

1. **Double-click** `START_SERVER.bat`
2. **Open browser** to `http://localhost:8000`
3. **Click** "Start Monitoring"
4. **Allow** camera access
5. **Done!** ✅

---

## 🖥️ Manual Start Methods

### Using Python (Recommended)

```bash
# Open Command Prompt in PulseVision folder
python -m http.server 8000
```

Then open: `http://localhost:8000`

### Using Node.js

```bash
npx http-server -p 8000
```

Then open: `http://localhost:8000`

### Using PHP

```bash
php -S localhost:8000
```

Then open: `http://localhost:8000`

---

## 📱 First Time Setup

### 1. Start the Application
- Use any method above
- Browser will open

### 2. Grant Camera Permission
- Click "Start Monitoring"
- Allow camera access when prompted
- ⚠️ **HTTPS required** (localhost works!)

### 3. Position Yourself
- Center your face in the frame
- Ensure good lighting
- Avoid obstructions (sunglasses, masks)

### 4. Monitor
- Green dots = Face detected ✅
- Red outlines = Eyes tracked
- Blue outline = Mouth tracked
- Yellow/Red alerts = Fatigue detected

---

## 🎛️ Quick Settings

### Adjust Sensitivity

**Too many alerts?**
- Increase "Eye Closure Threshold" → 0.25
- Increase "Closure Duration" → 3 seconds

**Not enough alerts?**
- Decrease "Eye Closure Threshold" → 0.18
- Decrease "Closure Duration" → 1.5 seconds

### Toggle Alerts

- ✅ **Sound Alerts** - Audio beep warning
- ✅ **Visual Alerts** - Red screen overlay

---

## 🐛 Common Issues

### "Camera Not Found"
→ Check browser permissions
→ Ensure no other app is using camera
→ Try different browser (Chrome recommended)

### "Site Can't Be Reached"
→ Ensure server is running
→ Check you're using correct port (8000)
→ Try `http://127.0.0.1:8000` instead

### "No Face Detected"
→ Improve lighting
→ Center your face
→ Remove obstructions
→ Move closer to camera

---

## ✅ Quick Test

Test if everything works:

1. **Close eyes for 3 seconds**
   - Alert should trigger ✅

2. **Yawn widely**
   - Alert should trigger ✅

3. **Normal behavior**
   - No alerts ✅

If all three work → System is functioning correctly! 🎉

---

## 📚 Need More Help?

- Click **"❓ Help"** button in app
- Read `README.md` for full documentation
- Check `DEPLOYMENT_GUIDE.md` for deployment options

---

## 🎓 For Testing/Grading

### Demo Preparation

1. ✅ Good lighting on face
2. ✅ Stable webcam position
3. ✅ Browser permissions granted
4. ✅ Settings adjusted for demo environment
5. ✅ Help guide ready to show

### Accuracy Testing

Run through test protocol in `DEPLOYMENT_GUIDE.md`:
- 25 eye closure tests
- 25 yawn tests
- 25 normal behavior tests
- Record results
- Calculate accuracy (target: 85%+)

---

**Ready to start? Double-click `START_SERVER.bat` now! 🚀**
