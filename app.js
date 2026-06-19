const fileA = document.getElementById('fileA');
const fileB = document.getElementById('fileB');
const canvasA = document.getElementById('canvasA');
const canvasB = document.getElementById('canvasB');
const calculateBtn = document.getElementById('calculateBtn');
const resultsPanel = document.getElementById('resultsPanel');

const scoreDisplay = document.getElementById('scoreDisplay');
const bondName = document.getElementById('bondName');
const bondDesc = document.getElementById('bondDesc');

// Progress Elements Mapping
const vLove = document.getElementById('vLove'); const barLove = document.getElementById('barLove');
const vFriend = document.getElementById('vFriend'); const barFriend = document.getElementById('barFriend');
const vPartner = document.getElementById('vPartner'); const barPartner = document.getElementById('barPartner');
const vHate = document.getElementById('vHate'); const barHate = document.getElementById('barHate');
const vEnemy = document.getElementById('vEnemy'); const barEnemy = document.getElementById('barEnemy');

let imgA = null, imgB = null;
let ratioA = 0, ratioB = 0;

fileA.addEventListener('change', (e) => {
    if (e.target.files.length) {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (ev) => {
            imgA = new Image(); imgA.src = ev.target.result;
            imgA.onload = () => { canvasA.classList.remove('hidden'); canvasA.width = 300; canvasA.height = 300; canvasA.getContext('2d').drawImage(imgA, 0, 0, 300, 300); };
        };
    }
});

fileB.addEventListener('change', (e) => {
    if (e.target.files.length) {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (ev) => {
            imgB = new Image(); imgB.src = ev.target.result;
            imgB.onload = () => { canvasB.classList.remove('hidden'); canvasB.width = 300; canvasB.height = 300; canvasB.getContext('2d').drawImage(imgB, 0, 0, 300, 300); };
        };
    }
});

async function analyzeFaceStructures() {
    const faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
    faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: false, minDetectionConfidence: 0.5 });

    return new Promise((resolve) => {
        let completed = 0;
        faceMesh.onResults((results) => {
            completed++;
            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                const pts = results.multiFaceLandmarks[0];
                const width = Math.abs(pts[234].x - pts[454].x);
                const height = Math.abs(pts[10].y - pts[152].y);
                if (completed === 1) ratioA = width / (height || 1);
                if (completed === 2) ratioB = width / (height || 1);
            }
            if (completed === 2) resolve();
        });
        faceMesh.send({ image: imgA }).then(() => faceMesh.send({ image: imgB }));
    });
}

async function computeBondingMatrix() {
    if (!imgA || !imgB) return alert("Please upload both portraits first, bhai! 🤦‍♂️");
    
    calculateBtn.textContent = "TRACING PLANETARY GRIDS...";
    resultsPanel.classList.add('opacity-10', 'scale-95'); 
    
    await analyzeFaceStructures();

    if (ratioA === 0) ratioA = 0.83;
    if (ratioB === 0) ratioB = 0.80;

    const structuralDelta = Math.abs(ratioA - ratioB);
    
    let coreScore = Math.floor(100 - (structuralDelta * 240));
    if (coreScore > 98) coreScore = 96;
    if (coreScore < 45) coreScore = 62;

    // Multidimensional Astro Array Logic Matrix
    let loveVal = Math.floor(coreScore + (Math.random() * 6));
    let friendVal = Math.floor((100 - structuralDelta * 90) - (Math.random() * 8));
    let partnerVal = Math.floor(coreScore * 0.96 + (Math.random() * 4));
    let hateVal = Math.floor((100 - coreScore) + (Math.random() * 10));
    let enemyVal = Math.floor((100 - friendVal) * 0.5);

    const lockBounds = (v) => Math.max(5, Math.min(99, v));
    loveVal = lockBounds(loveVal); friendVal = lockBounds(friendVal); partnerVal = lockBounds(partnerVal);
    hateVal = lockBounds(hateVal); enemyVal = lockBounds(enemyVal);

    // Sync baseline numbers text parameters
    scoreDisplay.textContent = `${coreScore}%`;
    vLove.textContent = `${loveVal}%`; barLove.style.width = `${loveVal}%`;
    vFriend.textContent = `${friendVal}%`; barFriend.style.width = `${friendVal}%`;
    vPartner.textContent = `${partnerVal}%`; barPartner.style.width = `${partnerVal}%`;
    vHate.textContent = `${hateVal}%`; barHate.style.width = `${hateVal}%`;
    vEnemy.textContent = `${enemyVal}%`; barEnemy.style.width = `${enemyVal}%`;

    // Astrological Analysis Mapping Interface Router
    if (coreScore > 82) {
        bondName.textContent = "🌌 Venus-Jupiter Perfect Trine Alignment";
        bondDesc = `Your facial structures mirror an ancient 120-degree alignment. Venus drives immediate compatibility, lowering conversational barriers. With a 5-Star Friendship profile, your charts lock a high-retention lifecycle. Perfect dual matrix harmony.`;
    } else if (coreScore > 65) {
        bondName.textContent = "🪐 Mercury Moon Hexagonal Synchronization";
        bondDesc = `A highly balancing mental profile! Mercury's coordinates keep intellectual sync sharp (Friendship: ${friendVal}%). Mild friction tides (Friction: ${hateVal}%) arise due to differing solar houses, but your core baseline matrix ensures continuous gravitational protection loops.`;
    } else {
        bondName.textContent = "⚔️ Saturn-Mars Opposition Axis Quadrant";
        bondDesc = `Your charts intercept on a conflicting geometric axis. Arch-Enemy multipliers point to rapid ego trigger zones. However, cosmic paradox rules dictate that this extreme polarization creates intense magnetic pull. A wild ride with massive separate growth vectors.`;
    }

    // 🔥 FIX: REMOVE DIM-BARRIERS & OVERWRITE ABSOLUTE PROGRAMMATIC INLINE NEON RADIANCE
    resultsPanel.classList.remove('opacity-10', 'pointer-events-none', 'scale-95');
    resultsPanel.classList.add('opacity-100', 'scale-100');
    
    scoreDisplay.style.color = "#ffffff";
    scoreDisplay.style.textShadow = "0 0 12px #f43f5e, 0 0 25px #ec4899, 0 0 45px #a855f7, 0 0 70px #6366f1";

    calculateBtn.textContent = "🔮 Read Astro-Neural Charts";
}

calculateBtn.addEventListener('click', computeBondingMatrix);