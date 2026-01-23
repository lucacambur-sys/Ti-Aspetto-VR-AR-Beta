// src/VRScene.ts
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { VideoPlayer } from './VideoPlayer';

export class VRScene {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private videoPlayer: VideoPlayer;
    private room?: THREE.Group;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.videoPlayer = new VideoPlayer();
        
        this.init();
    }

    private init(): void {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;
        document.body.appendChild(this.renderer.domElement);
        document.body.appendChild(VRButton.createButton(this.renderer));

        // Setup camera
        this.camera.position.set(0, 1.6, 0);
        this.scene.add(this.camera);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        this.scene.add(directionalLight);

        // Load room
        this.loadRoom();

        // Setup video
        this.setupVideoScreen();

        // Start animation loop
        this.renderer.setAnimationLoop(() => this.animate());
    }

    private async loadRoom(): Promise<void> {
        const loader = new THREE.GLTFLoader();
        
        try {
            const gltf = await loader.loadAsync('assets/models/room.glb');
            this.room = gltf.scene;
            this.scene.add(this.room);
        } catch (error) {
            console.error('Error loading room:', error);
            this.createFallbackRoom();
        }
    }

    private createFallbackRoom(): void {
        // Create simple room if model fails to load
        const roomGeometry = new THREE.BoxGeometry(10, 5, 10);
        const roomMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            side: THREE.BackSide 
        });
        const room = new THREE.Mesh(roomGeometry, roomMaterial);
        this.scene.add(room);
    }

    private setupVideoScreen(): void {
        const videoTexture = this.videoPlayer.getVideoTexture();
        const screenGeometry = new THREE.PlaneGeometry(4, 2.25);
        const screenMaterial = new THREE.MeshBasicMaterial({ 
            map: videoTexture,
            side: THREE.DoubleSide
        });
        
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 1.6, -4.9); // Posizione su parete frontale
        this.scene.add(screen);
    }

    private animate(): void {
        this.renderer.render(this.scene, this.camera);
    }

    public playVideo(): void {
        this.videoPlayer.play();
    }

    public pauseVideo(): void {
        this.videoPlayer.pause();
    }

    public setVideoSource(src: string): void {
        this.videoPlayer.setSource(src);
    }

    public onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}