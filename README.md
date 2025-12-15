# 🚗 PulseVision: AI-Powered Driver Fatigue Detection

A lightweight, browser-based fatigue monitoring system that uses AI and Computer Vision to detect driver fatigue in real-time. Works with any standard webcam, requiring no extra hardware.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Testing](#testing)
- [Project Aims](#project-aims)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 About

### Background & Problem Statement

**Issue:** Driver fatigue is a major cause of road accidents, yet most drivers lack affordable, easy-to-use, real-time monitoring tools.

**Solution:** PulseVision addresses this gap. It is a browser-based fatigue monitoring system that works with any standard webcam, requiring no extra hardware.

**Constraint:** The primary constraint is user resistance to change. Our design prioritizes an extremely simple UI and provides clear help guides to ease adoption and win user trust.

---

## ✨ Features

- ✅ **Real-time Fatigue Detection** - Monitors eye closure, yawning, and head pose
- ✅ **Browser-Based** - No installation required, works on any device with a webcam
- ✅ **Privacy-Focused** - All processing happens locally; no data leaves your device
- ✅ **Customizable Alerts** - Visual and auditory warnings
- ✅ **Adjustable Sensitivity** - Fine-tune detection thresholds
- ✅ **Cross-Platform** - Works on laptops, smartphones, and tablets
- ✅ **Lightweight** - Minimal resource usage
- ✅ **User-Friendly** - Simple interface with comprehensive help guide

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Structure and webcam access
- **CSS3** - Responsive design and animations
- **JavaScript (ES6+)** - Application logic

### AI/Computer Vision
- **MediaPipe Face Mesh** - Real-time facial landmark detection
- **TensorFlow.js** - Machine learning framework (alternative)

### Deployment
- **Static Web Host** - GitHub Pages, Vercel, Netlify, or any HTTP server

---

## 📦 Installation

### Option 1: Run Locally (Recommended for Development)

1. **Clone or Download the Project**
   ```bash
   cd PulseVision
   ```

2. **Start a Local Web Server**

   **Using Python:**
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Using Node.js:**
   ```bash
   npx http-server -p 8000
   ```

   **Using PHP:**
   ```bash
   php -S localhost:8000
   ```

3. **Open in Browser**
   ```
   http://localhost:8000
   ```

### Option 2: Deploy to GitHub Pages

1. **Push to GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: PulseVision project"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Select `main` branch
   - Click Save

3. **Access Your Site**
   ```
   https://<username>.github.io/<repository-name>/
   ```

### Option 3: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts** and your site will be live!

---

## 🚀 Usage

### Quick Start

1. **Open the Application**
   - Navigate to `index.html` in your browser
   - Or visit your deployed URL

2. **Grant Camera Permission**
   - Click "Start Monitoring"
   - Allow camera access when prompted

3. **Position Yourself**
   - Ensure your face is clearly visible
   - Good lighting is important

4. **Monitor in Real-Time**
   - The system will track your fatigue indicators
   - Alerts will trigger if fatigue is detected

### Controls

- **Start Monitoring** - Begin fatigue detection
- **Stop Monitoring** - Pause detection
- **Reset Stats** - Clear alert counter and statistics
- **Help (?)** - Open comprehensive help guide

### Settings

Adjust detection sensitivity using the sliders:

- **Eye Closure Threshold (EAR):** 0.15 - 0.30 (default: 0.20)
  - Lower values = more sensitive to eye closure

- **Yawn Threshold (MAR):** 0.5 - 0.8 (default: 0.65)
  - Higher values = less sensitive to yawning

- **Eye Closure Duration:** 1 - 5 seconds (default: 2.0)
  - How long eyes must be closed to trigger alert

- **Enable Sound Alerts** - Toggle audio warnings
- **Enable Visual Alerts** - Toggle visual overlay warnings

---

## 🔬 How It Works

### Detection Pipeline

1. **Capture**
   - Access webcam feed using JavaScript `getUserMedia` API
   - Stream video at 640x480 resolution

2. **Detect**
   - Pass video frames to MediaPipe Face Mesh
   - Extract 468 facial landmarks in real-time
   - Process at ~30 FPS for smooth detection

3. **Analyze**
   - Calculate **Eye Aspect Ratio (EAR)** from eye landmarks
   - Calculate **Mouth Aspect Ratio (MAR)** from mouth landmarks
   - Track metrics over time

4. **Alert**
   - Trigger JavaScript-based alerts when thresholds are crossed
   - Visual overlay + Audio beep (if enabled)

### Algorithms

#### Eye Aspect Ratio (EAR)

Measures eye openness based on eye landmark geometry:

```
EAR = (||p2 - p6|| + ||p3 - p5||) / (2 * ||p1 - p4||)
```

Where:
- `p1, p4` = horizontal eye corners
- `p2, p3, p5, p6` = vertical eye landmarks

**Interpretation:**
- EAR ≈ 0.25-0.35 → Eyes open
- EAR < 0.20 → Eyes closing/closed

#### Mouth Aspect Ratio (MAR)

Measures mouth opening for yawn detection:

```
MAR = (||p2 - p3|| + ||p4 - p5||) / (2 * ||p0 - p1||)
```

Where:
- `p0, p1` = mouth corners (horizontal)
- `p2, p3, p4, p5` = vertical mouth landmarks

**Interpretation:**
- MAR < 0.5 → Mouth closed
- MAR > 0.65 → Yawning detected

### Face Mesh Landmarks

MediaPipe Face Mesh provides 468 3D facial landmarks:
- **Eyes:** Indices 33-133 (left), 362-263 (right)
- **Mouth:** Indices 0, 17, 61, 91, 146, 291
- **Full mesh** for additional analysis

---

## ⚙️ Configuration

### Adjusting Detection Parameters

Edit these values in `app.js` for custom behavior:

```javascript
// Default thresholds
this.LEFT_EYE_INDICES = [33, 160, 158, 133, 153, 144];
this.RIGHT_EYE_INDICES = [362, 385, 387, 263, 373, 380];
this.MOUTH_INDICES = [61, 291, 0, 17, 146, 91];
```

### MediaPipe Configuration

```javascript
this.faceMesh.setOptions({
    maxNumFaces: 1,              // Detect single face
    refineLandmarks: true,        // High accuracy mode
    minDetectionConfidence: 0.5,  // Detection threshold
    minTrackingConfidence: 0.5    // Tracking threshold
});
```

---

## 🌐 Deployment

### Requirements
- Modern web browser (Chrome, Firefox, Edge, Safari)
- HTTPS connection (required for webcam access)
- Webcam/camera device

### Production Checklist

- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify HTTPS is enabled
- [ ] Test camera permissions flow
- [ ] Validate alert thresholds
- [ ] Performance optimization
- [ ] Cross-browser compatibility

### Hosting Options

1. **GitHub Pages** (Free)
   - Static hosting
   - HTTPS included
   - Easy deployment

2. **Vercel** (Free)
   - Instant deployment
   - Global CDN
   - HTTPS included

3. **Netlify** (Free)
   - Continuous deployment
   - Custom domains
   - HTTPS included

4. **Custom Server**
   - Apache/Nginx
   - Must enable HTTPS
   - More control

---

## 🧪 Testing

### Manual Testing

1. **Eye Closure Test**
   - Close eyes for 2+ seconds
   - Verify alert triggers

2. **Yawn Test**
   - Yawn naturally
   - Verify detection and alert

3. **False Positive Test**
   - Normal driving behavior
   - Should not trigger alerts

4. **Lighting Test**
   - Test in various lighting conditions
   - Verify consistent detection

### Accuracy Goal

**Target:** Minimum 85% accuracy in detecting critical fatigue events

**Metric Calculation:**
```
Accuracy = (True Positives + True Negatives) / Total Test Events
```

**Test Events:**
- Eye closure > 2s (True Positive expected)
- Rapid head nod (True Positive expected)
- Normal behavior (True Negative expected)

**Timeframe:** End of final testing phase (Week 11)

---

## 🎯 Project Aims

1. ✅ Design a lightweight, cross-platform web app for real-time driver monitoring
2. ✅ Utilize AI/CV to accurately detect key fatigue indicators (eye closure, head pose, yawn frequency)
3. ✅ Provide instant, non-intrusive visual and auditory alerts directly in the browser
4. ✅ Create a fully browser-based solution, ensuring zero installation and maximum accessibility

### Key Improvements

- **Accessibility:** Device-agnostic; works on any device with a browser
- **Cost-Effectiveness:** Software-only solution with no special hardware
- **Real-Time & Private:** All processing is client-side; data never leaves the user's device

---

## 🐛 Troubleshooting

### Camera Not Working

**Issue:** Camera permission denied or not detected

**Solutions:**
1. Ensure HTTPS is enabled (required for webcam access)
2. Check browser permissions for camera access
3. Try a different browser (Chrome recommended)
4. Restart browser and grant permissions again

### Low Performance

**Issue:** Lag or slow detection

**Solutions:**
1. Close other browser tabs
2. Reduce video quality if possible
3. Use a more powerful device
4. Ensure good lighting (helps detection speed)

### False Alerts

**Issue:** Too many alerts during normal behavior

**Solutions:**
1. Adjust EAR threshold (increase value)
2. Increase closure duration requirement
3. Adjust MAR threshold (increase value)
4. Ensure proper lighting on face

### No Face Detected

**Issue:** System can't detect face

**Solutions:**
1. Improve lighting on your face
2. Position face in center of frame
3. Remove obstructions (sunglasses, mask)
4. Move closer to camera

---

## 👥 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team
- Check the Help guide in the application

---

## 🙏 Acknowledgments

- **MediaPipe** by Google for facial landmark detection
- **TensorFlow.js** for machine learning capabilities
- Open source community for inspiration and support

---

## 📊 Project Status

**Current Version:** 1.0.0
**Status:** Active Development
**Last Updated:** 2025
**Target Accuracy:** 85%+ fatigue detection accuracy

---

**Built with ❤️ for safer roads**

🚗 **Drive Safe. Stay Alert. Use PulseVision.**
