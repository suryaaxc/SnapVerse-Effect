const fileInput = document.getElementById('fileInput');
const uploadPrompt = document.getElementById('uploadPrompt');
const outputCanvas = document.getElementById('outputCanvas');
const ctx = outputCanvas.getContext('2d');
const webcamVideo = document.getElementById('webcamVideo');
const startAiBtn = document.getElementById('startAiBtn');
const aiLoader = document.getElementById('aiLoader');

const renderMeshCheck = document.getElementById('renderMeshCheck');
const overlayImgCheck = document.getElementById('overlayImgCheck');

let avatarImage = null;
let faceMeshEngine = null;
let hardwareCamera = null;

// File Input Handler for Target Avatar
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                avatarImage = img;
                uploadPrompt.classList.add('hidden');
                outputCanvas.classList.remove('hidden');
                
                // Initialize default canvas frame boundary dimensions
                outputCanvas.width = 640;
                outputCanvas.height = 480;
                
                // Render initial thumbnail preview
                ctx.drawImage(avatarImage, 0, 0, 640, 480);
            };
        };
    }
});

// --- 🧠 CORE GOOGLE MEDIAPEEP TRACKING COMPILER ---
function initializeFaceMeshAI() {
    aiLoader.classList.remove('hidden');

    faceMeshEngine = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    // Configure tracking operational variables parameters
    faceMeshEngine.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    // Link asynchronous pipeline response handler
    faceMeshEngine.onResults(processNeuralResults);

    // Sync HTML5 camera utils script framework with webcam thread
    hardwareCamera = new Camera(webcamVideo, {
        onFrame: async () => {
            await faceMeshEngine.send({ image: webcamVideo });
        },
        width: 640,
        height: 480
    });

    hardwareCamera.start().then(() => {
        aiLoader.classList.add('hidden');
        startAiBtn.disabled = true;
        startAiBtn.textContent = "AI Mesh Pipeline Locked";
        startAiBtn.classList.from = "from-emerald-500";
        startAiBtn.classList.add("from-slate-700", "to-slate-800", "text-slate-500");
    }).catch(err => {
        aiLoader.classList.add('hidden');
        alert("Webcam track generation blocked by secure host constraints.");
        console.error(err);
    });
}

// --- 📐 HIGH-SPEED VECTOR PROCESSING LOOP ---
function processNeuralResults(results) {
    ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    
    // 1. If Checked, draw baseline avatar or fallback to webcam feed
    if (overlayImgCheck.checked && avatarImage) {
        ctx.drawImage(avatarImage, 0, 0, outputCanvas.width, outputCanvas.height);
    } else {
        ctx.drawImage(results.image, 0, 0, outputCanvas.width, outputCanvas.height);
    }

    // 2. Compute 468 point coordinate matrix indices
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const pointsArray = results.multiFaceLandmarks[0];

        if (renderMeshCheck.checked) {
            ctx.save();
            ctx.fillStyle = "rgba(6, 182, 212, 0.8)"; // Electric Cyan Neural Node
            
            for (let i = 0; i < pointsArray.length; i++) {
                const pt = pointsArray[i];
                // Convert relative dynamic bounds to absolute matrix coordinates mappings
                const coordinateX = pt.x * outputCanvas.width;
                const coordinateY = pt.y * outputCanvas.height;

                ctx.beginPath();
                ctx.arc(coordinateX, coordinateY, 1.5, 0, 2 * Math.PI);
                ctx.fill();
            }
            ctx.restore();
        }
    }
}

startAiBtn.addEventListener('click', () => {
    if (!avatarImage) return alert("Upload a portrait file asset first, bhai!");
    initializeFaceMeshAI();
});