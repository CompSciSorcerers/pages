import Character from '../../GameEnginev1/essentials/Character.js';

/**
 * Interceptor class that fires upward to destroy scythes
 * Based on the Projectile class pattern but designed for defensive gameplay
 */
class Interceptor extends Character {
    constructor(gameEnv, spawnX, spawnY) {
        super({ id: 'interceptor' }, gameEnv);
        
        this.source_coords = { x: spawnX, y: spawnY };
        this.type = 'INTERCEPTOR';
        
        // Get the main path
        const path = gameEnv.path;
        
        // Movement properties - moves upward
        this.speed = 12; // Faster than regular projectiles for interception
        this.velocity = {
            x: 0,
            y: -this.speed  // Always move upwards
        };
        
        this.revComplete = false;
        this.hasIntercepted = false;
        
        // Visual properties
        this.spriteSheet = new Image();
        this.frameIndex = 0;
        this.frameCount = 1;
        this.width = 40; // Smaller than arrow
        this.height = 50;
        this.spriteSheet.onload = () => this.imageLoaded = true;
        this.spriteSheet.src = path + "/images/castleGame/arrow.png"; // Use arrow sprite as base
        
        // Start at source position
        this.position = { x: spawnX, y: spawnY };
        
        // Add glow effect for visual distinction
        this.glowColor = '#00ffff'; // Cyan glow for interceptor
    }
    
    update() {
        if (this.revComplete) return;
        
        // Move interceptor upward
        this.position.y += this.velocity.y;
        
        // Check if offscreen
        if (this.position.y < -this.height) {
            this.revComplete = true;
            this.destroy();
            return;
        }
        
        // Check for scythe interceptions
        this.checkScytheInterception();
        
        // Draw and setup canvas
        this.draw();
        this.setupCanvas();
    }
    
    checkScytheInterception() {
        if (this.hasIntercepted) return;
        
        // Find all scythe objects
        const scythes = this.gameEnv.gameObjects.filter(obj => 
            obj.constructor.name === 'Scythe'
        );
        
        if (scythes.length === 0) return;
        
        for (const scythe of scythes) {
            // Calculate distance between interceptor and scythe
            const interceptorCenterX = this.position.x + this.width / 2;
            const interceptorCenterY = this.position.y + this.height / 2;
            const scytheCenterX = scythe.position.x + scythe.width / 2;
            const scytheCenterY = scythe.position.y + scythe.height / 2;
            
            const dx = scytheCenterX - interceptorCenterX;
            const dy = scytheCenterY - interceptorCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Interception distance threshold
            const INTERCEPTION_DISTANCE = (this.width + scythe.width) / 2.5;
            
            if (distance <= INTERCEPTION_DISTANCE) {
                this.handleInterception(scythe);
                break;
            }
        }
    }
    
    handleInterception(scythe) {
        this.hasIntercepted = true;
        this.revComplete = true;
        
        // Create visual effect for interception
        this.createInterceptionEffect();
        
        // Destroy the scythe
        scythe.destroy();
        
        // Destroy this interceptor
        this.destroy();
    }
    
    createInterceptionEffect() {
        // Create a simple visual effect at the interception point
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: absolute;
            left: ${this.position.x + this.width / 2}px;
            top: ${this.position.y + this.height / 2}px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: radial-gradient(circle, #00ffff, #0088ff, transparent);
            pointer-events: none;
            z-index: 1000;
            animation: interceptorExplosion 0.5s ease-out forwards;
        `;
        
        // Add CSS animation if not already present
        if (!document.getElementById('interceptor-styles')) {
            const style = document.createElement('style');
            style.id = 'interceptor-styles';
            style.textContent = `
                @keyframes interceptorExplosion {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(effect);
        
        // Remove effect after animation
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 500);
    }
    
    draw() {
        const ctx = this.ctx;
        this.clearCanvas();
        
        if (!this.imageLoaded) {
            return;
        }
        
        // Set canvas dimensions
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Draw interceptor with glow effect
        ctx.save();
        
        // Add glow shadow
        ctx.shadowColor = this.glowColor;
        ctx.shadowBlur = 10;
        
        // Draw the sprite
        ctx.drawImage(
            this.spriteSheet,
            0, 0, this.spriteSheet.naturalWidth, this.spriteSheet.naturalHeight,
            0, 0, this.width, this.height
        );
        
        ctx.restore();
    }
    
    destroy() {
        // Remove from gameObjects array
        const index = this.gameEnv.gameObjects.indexOf(this);
        if (index > -1) {
            this.gameEnv.gameObjects.splice(index, 1);
        }
        
        // Remove canvas from container
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        // Call parent destroy if it exists
        if (super.destroy) {
            super.destroy();
        }
    }
}

export default Interceptor;
