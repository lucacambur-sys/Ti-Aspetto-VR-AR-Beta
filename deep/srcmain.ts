// src/main.ts
import { VRScene } from './VRScene';

// Crea l'istanza della scena VR
const vrScene = new VRScene();

// Imposta il video (sostituisci con il tuo percorso)
vrScene.setVideoSource('assets/videos/your-video.mp4');

// Setup UI controls
document.getElementById('playBtn')?.addEventListener('click', () => {
    vrScene.playVideo();
});

document.getElementById('pauseBtn')?.addEventListener('click', () => {
    vrScene.pauseVideo();
});

// Gestione resize finestra
window.addEventListener('resize', () => {
    vrScene.onWindowResize();
});

// Informazioni di debug
console.log('VR Video Room loaded successfully!');