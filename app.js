// PulseVision - AI-Powered Driver Fatigue Detection System
// Main Application Logic

class FatigueDetector {
    constructor() {
        // DOM Elements
        this.video = document.getElementById('videoElement');
        this.canvas = document.getElementById('canvasElement');
        this.ctx = this.canvas.getContext('2d');
        this.alertOverlay = document.getElementById('alertOverlay');

        // Status Elements
        this.systemStatus = document.getElementById('systemStatus');
        this.earStatus = document.getElementById('earStatus');
        this.marStatus = document.getElementById('marStatus');
        this.headPoseStatus = document.getElementById('headPoseStatus');
        this.distractionCountElement = document.getElementById('distractionCount');
        this.alertCount = document.getElementById('alertCount');

        // Control Buttons
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.helpBtn = document.getElementById('helpBtn');

        // Settings
        this.earThreshold = document.getElementById('earThreshold');
        this.marThreshold = document.getElementById('marThreshold');
        this.closureDuration = document.getElementById('closureDuration');
        this.soundAlerts = document.getElementById('soundAlerts');
        this.continuousAlerts = document.getElementById('continuousAlerts');
        this.visualAlerts = document.getElementById('visualAlerts');

        // Modal
        this.helpModal = document.getElementById('helpModal');
        this.closeBtn = document.querySelector('.close-btn');

        // Detection State
        this.isMonitoring = false;
        this.faceMesh = null;
        this.camera = null;
        this.alerts = 0;
        this.faceDetected = false;

        // Fatigue Metrics
        this.eyeClosureStartTime = null;
        this.consecutiveClosedFrames = 0;
        this.yawnCount = 0;
        this.lastYawnTime = 0;

        // New UI Elements
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.toastContainer = document.getElementById('toastContainer');
        this.connectionStatus = document.getElementById('connectionStatus');

        // Session Statistics
        this.sessionStartTime = null;
        this.sessionDuration = document.getElementById('sessionDuration');
        this.totalBlinks = document.getElementById('totalBlinks');
        this.totalYawns = document.getElementById('totalYawns');
        this.avgEAR = document.getElementById('avgEAR');
        this.earHistory = [];
        this.blinkCount = 0;
        this.sessionInterval = null;

        // Audio Context for alerts
        this.audioContext = null;
        this.isAlertActive = false;
        this.alertCooldown = false;
        this.continuousAlertInterval = null;

        // Face Mesh Landmark Indices
        this.LEFT_EYE_INDICES = [33, 160, 158, 133, 153, 144];
        this.RIGHT_EYE_INDICES = [362, 385, 387, 263, 373, 380];
        this.MOUTH_INDICES = [61, 291, 0, 17, 146, 91];

        // Head pose landmarks (for orientation detection)
        this.NOSE_TIP = 1;
        this.CHIN = 152;
        this.LEFT_EYE_CORNER = 33;
        this.RIGHT_EYE_CORNER = 263;
        this.LEFT_MOUTH = 61;
        this.RIGHT_MOUTH = 291;

        // Additional detection states
        this.headPoseHistory = [];
        this.lookingAwayStartTime = null;
        this.lookingDownStartTime = null;
        this.headNodCount = 0;
        this.lastHeadPitch = 0;
        this.distractionCount = 0;

        this.init();
    }

    init() {
        // Event Listeners
        this.startBtn.addEventListener('click', () => this.startMonitoring());
        this.stopBtn.addEventListener('click', () => this.stopMonitoring());
        this.resetBtn.addEventListener('click', () => this.resetStats());
        this.helpBtn.addEventListener('click', () => this.openHelp());
        this.closeBtn.addEventListener('click', () => this.closeHelp());

        // Settings Updates
        this.earThreshold.addEventListener('input', (e) => {
            document.getElementById('earThresholdValue').textContent = e.target.value;
        });

        this.marThreshold.addEventListener('input', (e) => {
            document.getElementById('marThresholdValue').textContent = e.target.value;
        });

        this.closureDuration.addEventListener('input', (e) => {
            document.getElementById('closureDurationValue').textContent = parseFloat(e.target.value).toFixed(1);
        });

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target === this.helpModal) {
                this.closeHelp();
            }
        });

        this.updateStatus('Ready to start', 'normal');
    }

    async startMonitoring() {
        try {
            this.showLoading('Initializing AI...');
            this.updateStatus('Initializing AI...', 'warning');
            console.log('Starting monitoring...');

            // Check if MediaPipe is loaded
            if (typeof FaceMesh === 'undefined') {
                console.error('FaceMesh not loaded!');
                throw new Error('MediaPipe Face Mesh library not loaded. Please refresh the page.');
            }
            console.log('MediaPipe FaceMesh library loaded successfully');

            // Initialize MediaPipe Face Mesh
            this.showLoading('Loading AI model...');
            this.faceMesh = new FaceMesh({
                locateFile: (file) => {
                    const path = `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1675466862/${file}`;
                    console.log('Loading file:', path);
                    return path;
                }
            });
            console.log('FaceMesh instance created');

            this.faceMesh.setOptions({
                maxNumFaces: 1,
                refineLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });
            console.log('FaceMesh options configured');

            this.faceMesh.onResults((results) => this.onResults(results));
            console.log('FaceMesh results callback registered');

            // Check if Camera utility is loaded
            if (typeof Camera === 'undefined') {
                console.error('Camera utility not loaded!');
                throw new Error('MediaPipe Camera utility not loaded. Please refresh the page.');
            }
            console.log('Camera utility loaded successfully');

            // Initialize Camera
            this.showLoading('Starting camera...');
            this.camera = new Camera(this.video, {
                onFrame: async () => {
                    if (this.isMonitoring) {
                        await this.faceMesh.send({ image: this.video });
                    }
                },
                width: 640,
                height: 480
            });

            await this.camera.start();
            console.log('Camera started successfully');

            // Initialize Audio Context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Audio context initialized');

            this.isMonitoring = true;
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;

            // Start session tracking
            this.sessionStartTime = Date.now();
            this.startSessionTracking();

            // Add monitoring class to video wrapper
            const videoWrapper = document.querySelector('.video-wrapper');
            if (videoWrapper) videoWrapper.classList.add('monitoring');

            this.hideLoading();
            this.updateStatus('Monitoring Active', 'normal');
            this.showToast('Monitoring Started', 'Camera initialized successfully', 'success');
            this.updateConnectionStatus('Monitoring Active', true);

        } catch (error) {
            console.error('Error starting monitoring:', error);
            this.hideLoading();
            this.updateStatus('Error: ' + error.message, 'danger');
            this.showToast('Error', error.message || 'Failed to start monitoring. Please ensure camera permissions are granted.', 'error');
            this.updateConnectionStatus('Error', false);
        }
    }

    stopMonitoring() {
        this.isMonitoring = false;

        if (this.camera) {
            this.camera.stop();
        }

        // Stop session tracking
        this.stopSessionTracking();

        // Remove monitoring class
        const videoWrapper = document.querySelector('.video-wrapper');
        if (videoWrapper) videoWrapper.classList.remove('monitoring');

        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;

        this.updateStatus('Monitoring Stopped', 'warning');
        this.hideAlert();
        this.showToast('Monitoring Stopped', 'Session ended', 'warning');
        this.updateConnectionStatus('System Ready', true);
    }

    onResults(results) {
        if (!this.isMonitoring) return;

        // Set canvas dimensions
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];

            // Log first detection
            if (!this.faceDetected) {
                console.log('✓ Face detected! AI is working!');
                this.faceDetected = true;
            }

            // Draw face mesh
            this.drawLandmarks(landmarks);

            // Calculate fatigue metrics
            const ear = this.calculateEAR(landmarks);
            const mar = this.calculateMAR(landmarks);

            // Calculate head pose for additional safety features
            const headPose = this.calculateHeadPose(landmarks);

            // Update UI
            this.earStatus.textContent = ear.toFixed(3);
            this.marStatus.textContent = mar.toFixed(3);

            // Detect all safety issues (fatigue + distractions)
            this.detectFatigue(ear, mar, headPose);

        } else {
            this.updateStatus('No face detected', 'warning');
            this.earStatus.textContent = '--';
            this.marStatus.textContent = '--';
        }
    }

    calculateEAR(landmarks) {
        // Eye Aspect Ratio calculation
        const leftEAR = this.calculateEyeAspectRatio(landmarks, this.LEFT_EYE_INDICES);
        const rightEAR = this.calculateEyeAspectRatio(landmarks, this.RIGHT_EYE_INDICES);

        return (leftEAR + rightEAR) / 2.0;
    }

    calculateEyeAspectRatio(landmarks, eyeIndices) {
        // Get eye landmarks
        const points = eyeIndices.map(idx => landmarks[idx]);

        // Calculate vertical distances
        const v1 = this.euclideanDistance(points[1], points[5]);
        const v2 = this.euclideanDistance(points[2], points[4]);

        // Calculate horizontal distance
        const h = this.euclideanDistance(points[0], points[3]);

        // EAR formula
        const ear = (v1 + v2) / (2.0 * h);

        return ear;
    }

    calculateMAR(landmarks) {
        // Mouth Aspect Ratio calculation
        const mouthPoints = this.MOUTH_INDICES.map(idx => landmarks[idx]);

        // Calculate vertical distance (mouth opening)
        const v1 = this.euclideanDistance(mouthPoints[2], mouthPoints[3]);
        const v2 = this.euclideanDistance(mouthPoints[4], mouthPoints[5]);

        // Calculate horizontal distance (mouth width)
        const h = this.euclideanDistance(mouthPoints[0], mouthPoints[1]);

        // MAR formula
        const mar = (v1 + v2) / (2.0 * h);

        return mar;
    }

    euclideanDistance(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = (p1.z || 0) - (p2.z || 0);

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    // Calculate head pose angles (pitch, yaw, roll)
    calculateHeadPose(landmarks) {
        const noseTip = landmarks[this.NOSE_TIP];
        const chin = landmarks[this.CHIN];
        const leftEye = landmarks[this.LEFT_EYE_CORNER];
        const rightEye = landmarks[this.RIGHT_EYE_CORNER];

        // Calculate pitch (up/down - phone detection)
        const pitch = Math.atan2(chin.y - noseTip.y, chin.z - noseTip.z) * (180 / Math.PI);

        // Calculate yaw (left/right - looking away detection)
        const midEyeX = (leftEye.x + rightEye.x) / 2;
        const yaw = (noseTip.x - midEyeX) * 100; // Normalized

        // Calculate roll (head tilt)
        const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI);

        return { pitch, yaw, roll };
    }

    // Detect phone usage (looking down)
    detectPhoneUsage(pitch) {
        // If head is tilted down significantly (looking at phone/lap)
        const PHONE_PITCH_THRESHOLD = 15; // degrees down

        if (pitch > PHONE_PITCH_THRESHOLD) {
            if (this.lookingDownStartTime === null) {
                this.lookingDownStartTime = Date.now();
            } else {
                const duration = (Date.now() - this.lookingDownStartTime) / 1000;
                if (duration >= 2.0) { // Looking down for 2+ seconds
                    return true;
                }
            }
        } else {
            this.lookingDownStartTime = null;
        }
        return false;
    }

    // Detect head nodding (drowsiness indicator)
    detectHeadNodding(pitch) {
        const HEAD_NOD_THRESHOLD = 8; // degrees of movement

        // Detect rapid pitch changes (head nodding)
        if (this.lastHeadPitch !== 0) {
            const pitchChange = Math.abs(pitch - this.lastHeadPitch);

            if (pitchChange > HEAD_NOD_THRESHOLD) {
                const currentTime = Date.now();
                this.headPoseHistory.push(currentTime);

                // Remove old history (older than 5 seconds)
                this.headPoseHistory = this.headPoseHistory.filter(
                    time => currentTime - time < 5000
                );

                // If 3+ nods in 5 seconds = drowsiness
                if (this.headPoseHistory.length >= 3) {
                    this.headNodCount++;
                    return true;
                }
            }
        }
        this.lastHeadPitch = pitch;
        return false;
    }

    // Detect looking away from road
    detectLookingAway(yaw) {
        const LOOKING_AWAY_THRESHOLD = 25; // Significant turn

        if (Math.abs(yaw) > LOOKING_AWAY_THRESHOLD) {
            if (this.lookingAwayStartTime === null) {
                this.lookingAwayStartTime = Date.now();
            } else {
                const duration = (Date.now() - this.lookingAwayStartTime) / 1000;
                if (duration >= 1.5) { // Looking away for 1.5+ seconds
                    return true;
                }
            }
        } else {
            this.lookingAwayStartTime = null;
        }
        return false;
    }

    detectFatigue(ear, mar, headPose) {
        const earThresholdValue = parseFloat(this.earThreshold.value);
        const marThresholdValue = parseFloat(this.marThreshold.value);
        const closureDurationValue = parseFloat(this.closureDuration.value);

        // Track EAR for statistics
        this.earHistory.push(ear);
        if (this.earHistory.length > 100) this.earHistory.shift();

        let fatigueDetected = false;
        let fatigueReason = '';

        // Check for additional safety issues (phone, nodding, looking away)
        const isUsingPhone = this.detectPhoneUsage(headPose.pitch);
        const isNodding = this.detectHeadNodding(headPose.pitch);
        const isLookingAway = this.detectLookingAway(headPose.yaw);

        // Check for prolonged eye closure
        if (ear < earThresholdValue) {
            if (this.eyeClosureStartTime === null) {
                this.eyeClosureStartTime = Date.now();
                this.blinkCount++;
                this.totalBlinks.textContent = this.blinkCount;
            } else {
                const closureDuration = (Date.now() - this.eyeClosureStartTime) / 1000;

                if (closureDuration >= closureDurationValue) {
                    fatigueDetected = true;
                    fatigueReason = 'Prolonged eye closure detected';
                }
            }

            this.earStatus.classList.add('danger');
            this.earStatus.classList.remove('normal', 'warning');
        } else {
            this.eyeClosureStartTime = null;

            if (ear < earThresholdValue + 0.05) {
                this.earStatus.classList.add('warning');
                this.earStatus.classList.remove('normal', 'danger');
            } else {
                this.earStatus.classList.add('normal');
                this.earStatus.classList.remove('warning', 'danger');
            }
        }

        // Check for yawning
        if (mar > marThresholdValue) {
            const currentTime = Date.now();

            // Prevent counting the same yawn multiple times
            if (currentTime - this.lastYawnTime > 3000) {
                this.yawnCount++;
                this.lastYawnTime = currentTime;
                this.totalYawns.textContent = this.yawnCount;

                fatigueDetected = true;
                fatigueReason = 'Yawning detected';
            }

            this.marStatus.classList.add('danger');
            this.marStatus.classList.remove('normal', 'warning');
        } else {
            this.marStatus.classList.add('normal');
            this.marStatus.classList.remove('warning', 'danger');
        }

        // Check for phone usage (looking down)
        if (isUsingPhone) {
            fatigueDetected = true;
            fatigueReason = '📱 PHONE DETECTED - Keep eyes on road!';
            this.distractionCount++;
            this.headPoseStatus.textContent = '📱 Phone';
            this.headPoseStatus.classList.remove('normal', 'warning');
            this.headPoseStatus.classList.add('danger');
        }
        // Check for head nodding (drowsiness)
        else if (isNodding) {
            fatigueDetected = true;
            fatigueReason = '😴 HEAD NODDING - Pull over to rest!';
            this.headPoseStatus.textContent = '😴 Nodding';
            this.headPoseStatus.classList.remove('normal', 'warning');
            this.headPoseStatus.classList.add('danger');
        }
        // Check for looking away from road
        else if (isLookingAway) {
            fatigueDetected = true;
            fatigueReason = '👀 LOOKING AWAY - Focus on the road!';
            this.distractionCount++;
            this.headPoseStatus.textContent = '👀 Distracted';
            this.headPoseStatus.classList.remove('normal', 'warning');
            this.headPoseStatus.classList.add('danger');
        }
        // Normal head pose
        else {
            this.headPoseStatus.textContent = 'Normal';
            this.headPoseStatus.classList.remove('warning', 'danger');
            this.headPoseStatus.classList.add('normal');
        }

        // Update distraction counter
        this.distractionCountElement.textContent = this.distractionCount;

        // Update average EAR
        if (this.earHistory.length > 0) {
            const avgEarValue = this.earHistory.reduce((a, b) => a + b, 0) / this.earHistory.length;
            this.avgEAR.textContent = avgEarValue.toFixed(3);
        }

        // Trigger alert if fatigue detected
        if (fatigueDetected && !this.alertCooldown) {
            this.triggerAlert(fatigueReason);
        } else if (!fatigueDetected) {
            this.hideAlert();
        }

        // Update system status
        if (fatigueDetected) {
            this.updateStatus('FATIGUE DETECTED!', 'danger');
        } else {
            this.updateStatus('Monitoring Active', 'normal');
        }
    }

    triggerAlert(reason) {
        this.alerts++;
        this.alertCount.textContent = this.alerts;

        console.log('ALERT:', reason);

        // Visual Alert
        if (this.visualAlerts.checked && !this.isAlertActive) {
            this.showAlert();
        }

        // Sound Alert
        if (this.soundAlerts.checked && !this.isAlertActive) {
            this.playAlertSound();

            // Start continuous alerts if enabled
            if (this.continuousAlerts.checked && !this.continuousAlertInterval) {
                this.continuousAlertInterval = setInterval(() => {
                    if (this.soundAlerts.checked) {
                        this.playAlertSound();
                    }
                }, 2500); // Play alert every 2.5 seconds
            }
        }

        this.isAlertActive = true;

        // Set cooldown to prevent alert spam
        this.alertCooldown = true;
        setTimeout(() => {
            this.alertCooldown = false;
        }, 3000);
    }

    showAlert() {
        this.alertOverlay.classList.remove('hidden');

        setTimeout(() => {
            this.alertOverlay.classList.add('hidden');
            this.isAlertActive = false;
        }, 3000);
    }

    hideAlert() {
        this.alertOverlay.classList.add('hidden');
        this.isAlertActive = false;

        // Stop continuous alerts
        if (this.continuousAlertInterval) {
            clearInterval(this.continuousAlertInterval);
            this.continuousAlertInterval = null;
        }
    }

    playAlertSound() {
        if (!this.audioContext) return;

        // Create a repeating alert pattern (3 beeps)
        const beepTimes = [0, 0.4, 0.8]; // Three beeps at intervals
        const beepDuration = 0.3;
        const frequency = 880; // A5 note - more attention-grabbing

        beepTimes.forEach((startTime) => {
            // Create oscillator for each beep
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'square'; // More alert-sounding than sine

            // Envelope for beep
            const now = this.audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, now + startTime);
            gainNode.gain.linearRampToValueAtTime(0.4, now + startTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(0, now + startTime + beepDuration);

            oscillator.start(now + startTime);
            oscillator.stop(now + startTime + beepDuration);
        });

        // Add a lower frequency beep for emphasis (siren-like effect)
        const lowOscillator = this.audioContext.createOscillator();
        const lowGainNode = this.audioContext.createGain();

        lowOscillator.connect(lowGainNode);
        lowGainNode.connect(this.audioContext.destination);

        lowOscillator.frequency.value = 440; // A4 note
        lowOscillator.type = 'square';

        const now = this.audioContext.currentTime;
        lowGainNode.gain.setValueAtTime(0, now + 1.2);
        lowGainNode.gain.linearRampToValueAtTime(0.3, now + 1.25);
        lowGainNode.gain.linearRampToValueAtTime(0, now + 1.7);

        lowOscillator.start(now + 1.2);
        lowOscillator.stop(now + 1.7);
    }

    drawLandmarks(landmarks) {
        // Draw face mesh landmarks
        this.ctx.fillStyle = '#30FF30';

        for (const landmark of landmarks) {
            const x = landmark.x * this.canvas.width;
            const y = landmark.y * this.canvas.height;

            this.ctx.beginPath();
            this.ctx.arc(x, y, 1, 0, 2 * Math.PI);
            this.ctx.fill();
        }

        // Highlight eyes
        this.drawEyeContour(landmarks, this.LEFT_EYE_INDICES, '#FF3030');
        this.drawEyeContour(landmarks, this.RIGHT_EYE_INDICES, '#FF3030');

        // Highlight mouth
        this.drawMouthContour(landmarks, this.MOUTH_INDICES, '#3030FF');
    }

    drawEyeContour(landmarks, indices, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        for (let i = 0; i < indices.length; i++) {
            const point = landmarks[indices[i]];
            const x = point.x * this.canvas.width;
            const y = point.y * this.canvas.height;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }

        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawMouthContour(landmarks, indices, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        for (let i = 0; i < indices.length; i++) {
            const point = landmarks[indices[i]];
            const x = point.x * this.canvas.width;
            const y = point.y * this.canvas.height;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }

        this.ctx.closePath();
        this.ctx.stroke();
    }

    resetStats() {
        this.alerts = 0;
        this.alertCount.textContent = '0';
        this.yawnCount = 0;
        this.blinkCount = 0;
        this.consecutiveClosedFrames = 0;
        this.eyeClosureStartTime = null;
        this.earHistory = [];

        // Reset new detection counters
        this.distractionCount = 0;
        this.distractionCountElement.textContent = '0';
        this.headNodCount = 0;
        this.headPoseHistory = [];
        this.lookingAwayStartTime = null;
        this.lookingDownStartTime = null;
        this.lastHeadPitch = 0;

        // Reset session statistics
        this.totalBlinks.textContent = '0';
        this.totalYawns.textContent = '0';
        this.avgEAR.textContent = '0.00';

        this.showToast('Statistics Reset', 'All stats have been cleared', 'success');
        console.log('Statistics reset');
    }

    updateStatus(message, type = 'normal') {
        this.systemStatus.textContent = message;
        this.systemStatus.classList.remove('normal', 'warning', 'danger');
        this.systemStatus.classList.add(type);
    }

    openHelp() {
        this.helpModal.classList.remove('hidden');
    }

    closeHelp() {
        this.helpModal.classList.add('hidden');
    }

    // Loading Overlay Methods
    showLoading(message = 'Loading...') {
        const loadingContent = this.loadingOverlay.querySelector('.loading-content h3');
        if (loadingContent) {
            loadingContent.textContent = message;
        }
        this.loadingOverlay.classList.remove('hidden');
    }

    hideLoading() {
        this.loadingOverlay.classList.add('hidden');
    }

    // Toast Notification Methods
    showToast(title, message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const iconMap = {
            'success': '✓',
            'error': '✕',
            'warning': '⚠',
            'info': 'ℹ'
        };

        toast.innerHTML = `
            <span class="toast-icon">${iconMap[type] || 'ℹ'}</span>
            <div class="toast-message">
                <strong>${title}</strong><br>
                ${message}
            </div>
            <span class="toast-close">×</span>
        `;

        this.toastContainer.appendChild(toast);

        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => toast.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100px)';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    // Connection Status Methods
    updateConnectionStatus(message, isOnline = true) {
        const statusElement = this.connectionStatus.querySelector('span');
        if (statusElement) {
            statusElement.textContent = message;
        }

        if (isOnline) {
            this.connectionStatus.classList.remove('offline');
        } else {
            this.connectionStatus.classList.add('offline');
        }
    }

    // Session Tracking Methods
    startSessionTracking() {
        this.sessionInterval = setInterval(() => {
            if (this.sessionStartTime) {
                const elapsed = Math.floor((Date.now() - this.sessionStartTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                this.sessionDuration.textContent =
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    stopSessionTracking() {
        if (this.sessionInterval) {
            clearInterval(this.sessionInterval);
            this.sessionInterval = null;
        }
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const detector = new FatigueDetector();
    console.log('PulseVision initialized successfully');
});
