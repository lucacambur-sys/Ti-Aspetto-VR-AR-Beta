// src/VideoPlayer.ts
import * as THREE from 'three';

export class VideoPlayer {
    private video: HTMLVideoElement;
    private texture: THREE.VideoTexture;
    private isPlaying: boolean = false;

    constructor() {
        this.video = document.createElement('video');
        this.video.loop = true;
        this.video.muted = true;
        this.video.playsInline = true;
        
        this.texture = new THREE.VideoTexture(this.video);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.format = THREE.RGBAFormat;
    }

    public setSource(src: string): void {
        this.video.src = src;
        this.video.load();
    }

    public play(): void {
        if (this.video.src) {
            this.video.play();
            this.isPlaying = true;
        }
    }

    public pause(): void {
        this.video.pause();
        this.isPlaying = false;
    }

    public getVideoTexture(): THREE.VideoTexture {
        return this.texture;
    }

    public getIsPlaying(): boolean {
        return this.isPlaying;
    }
}