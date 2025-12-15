# 🔊 Alert Sound System Guide

## Enhanced Audio Alert Features

PulseVision now includes an advanced alert sound system designed to effectively capture driver attention during fatigue detection.

---

## 🎵 Alert Sound Pattern

### Standard Alert (Single Trigger)

When fatigue is detected, the system plays:

1. **Three High-Frequency Beeps** (880 Hz - A5 note)
   - Duration: 0.3 seconds each
   - Interval: 0.4 seconds between beeps
   - Pattern: BEEP - pause - BEEP - pause - BEEP

2. **One Low-Frequency Emphasis** (440 Hz - A4 note)
   - Starts after the three beeps
   - Duration: 0.5 seconds
   - Creates a siren-like attention-grabbing effect

**Total Duration:** ~1.7 seconds per alert cycle

---

## 🔁 Continuous Alert Mode

### How to Enable

1. Open PulseVision in your browser
2. Scroll to **Settings Panel**
3. Check the box: **"Continuous Alert Sound (Repeats while fatigue detected)"**

### Behavior

When enabled:
- ✅ First alert plays immediately when fatigue is detected
- ✅ Alert repeats every **2.5 seconds** while fatigue persists
- ✅ Stops automatically when fatigue is no longer detected
- ✅ Stops when monitoring is paused/stopped

**Why 2.5 seconds?**
- Gives time for the full alert pattern to play (~1.7s)
- Provides brief silence between cycles
- Urgent enough to maintain attention
- Not so frequent as to be overwhelming

---

## ⚙️ Settings Combinations

### Recommended Configurations

#### 1. **Normal Use (Default)**
```
✅ Enable Sound Alerts
❌ Continuous Alert Sound
✅ Enable Visual Alerts
```
**Best for:** Regular monitoring with occasional fatigue events

#### 2. **High Alert Mode**
```
✅ Enable Sound Alerts
✅ Continuous Alert Sound
✅ Enable Visual Alerts
```
**Best for:** Long-distance driving, night driving, or when extra alertness is critical

#### 3. **Silent Mode**
```
❌ Enable Sound Alerts
❌ Continuous Alert Sound
✅ Enable Visual Alerts
```
**Best for:** Testing, public demonstrations, or noise-sensitive environments

#### 4. **Sound Only**
```
✅ Enable Sound Alerts
✅ Continuous Alert Sound
❌ Enable Visual Alerts
```
**Best for:** Situations where screen visibility is limited

---

## 🎛️ Technical Details

### Audio Technology

**Web Audio API Implementation:**
- Type: Oscillator-based synthesis
- Waveform: Square wave (more alerting than sine wave)
- Volume: 40% for high beeps, 30% for low beep
- Attack/Decay: Linear envelope for smooth sound

### Why Square Wave?

Square waves are used instead of sine waves because they:
- Sound more "alarm-like" and urgent
- Cut through ambient noise better
- Are more attention-grabbing
- Have a distinctive, recognizable quality

### Browser Compatibility

Works on all modern browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS/Android)

**Note:** Some browsers require user interaction before playing audio. Clicking "Start Monitoring" fulfills this requirement.

---

## 🧪 Testing the Alert Sound

### Quick Test

1. Start monitoring
2. Enable "Continuous Alert Sound"
3. Close your eyes for 2-3 seconds
4. Listen for:
   - Three quick high beeps
   - One lower "woop" sound
   - Pattern repeats every 2.5 seconds
   - Stops when you open your eyes

### Adjusting Sensitivity

If alerts trigger too easily:
- Increase "Eye Closure Threshold" to 0.25-0.30
- Increase "Closure Duration" to 3-4 seconds

If alerts don't trigger enough:
- Decrease "Eye Closure Threshold" to 0.15-0.18
- Decrease "Closure Duration" to 1-1.5 seconds

---

## 🔧 Troubleshooting

### No Sound Playing

**Possible Causes:**
1. ❌ Sound alerts disabled in settings
2. ❌ Browser/system volume muted
3. ❌ Audio context not initialized

**Solutions:**
1. ✅ Check "Enable Sound Alerts" is checked
2. ✅ Ensure system/browser volume is up
3. ✅ Click "Start Monitoring" to initialize audio
4. ✅ Try reloading the page

### Continuous Alert Won't Stop

**Possible Causes:**
1. Fatigue is still being detected
2. Settings threshold too sensitive

**Solutions:**
1. Ensure good lighting on your face
2. Open eyes fully and look at camera
3. Adjust eye closure threshold higher
4. Click "Stop Monitoring" to force stop

### Alert Sounds Distorted

**Possible Causes:**
1. CPU overload
2. Multiple alerts playing simultaneously

**Solutions:**
1. Close unnecessary browser tabs
2. Restart monitoring
3. Disable continuous mode temporarily

---

## 📊 Alert Effectiveness

### Design Goals

The alert sound system is designed to:
- ⚡ **Grab Attention:** Distinctive pattern that cuts through ambient noise
- 🎯 **Be Non-Invasive:** Not overly loud or annoying
- 🔄 **Provide Urgency:** Continuous mode for persistent fatigue
- 🛑 **Encourage Action:** Sound pattern suggests "wake up" and "take action"

### Psychological Impact

- **High-Low Pattern:** Mimics emergency vehicle sirens
- **Repetition:** Reinforces urgency in continuous mode
- **Volume Balance:** Loud enough to alert, not so loud to startle

---

## 🎓 For Academic/Testing Purposes

### Documenting Alert Effectiveness

When testing for the 85% accuracy goal:

**Track Alert Responsiveness:**
1. Time to recognition (how fast user notices alert)
2. Alert completion rate (user takes action)
3. False positive rate (alerts when not fatigued)
4. False negative rate (no alert when fatigued)

**User Feedback:**
- Survey drivers on alert effectiveness
- Measure reaction time to alerts
- Compare single vs. continuous mode effectiveness

---

## 💡 Tips for Optimal Use

1. **Start with defaults** - Test before adjusting
2. **Use continuous mode sparingly** - Can be distracting
3. **Adjust volume** - System volume should be comfortable but attention-grabbing
4. **Combine with visual** - Multi-sensory alerts are more effective
5. **Take breaks** - Alerts are warnings, not substitutes for rest

---

## 🔮 Future Enhancements (Potential)

Ideas for future versions:
- Voice alerts ("Please take a break")
- Customizable alert sounds
- Volume control slider
- Different patterns for different fatigue levels
- Haptic feedback support (mobile devices)

---

**Drive Safe. Stay Alert. Listen to PulseVision.** 🚗🔊
