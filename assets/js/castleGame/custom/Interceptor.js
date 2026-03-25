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
        
        // Find nearest scythe and set target coordinates
        this.target_coords = this.findNearestScythe();
        
        // Get the main path
        const path = gameEnv.path;
        
        // Movement properties - moves toward target
        this.speed = 12; // Faster than regular projectiles for interception
        
        // Calculate velocity vector toward target
        if (this.target_coords) {
            const dx = this.target_coords.x - spawnX;
            const dy = this.target_coords.y - spawnY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                this.velocity = {
                    x: (dx / distance) * this.speed,
                    y: (dy / distance) * this.speed
                };
            } else {
                // Fallback to upward movement if no valid target
                this.velocity = { x: 0, y: -this.speed };
            }
        } else {
            // Fallback to upward movement if no scythes found
            this.velocity = { x: 0, y: -this.speed };
        }
        
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
    
    /**
     * Finds the nearest scythe at the time of interceptor creation
     * @returns {Object|null} - Coordinates of nearest scythe or null if none found
     */
    findNearestScythe() {
        // Find all scythe objects
        const scythes = this.gameEnv.gameObjects.filter(obj => 
            obj.constructor.name === 'Scythe'
        );
        
        if (scythes.length === 0) {
            return null;
        }
        
        let nearestScythe = null;
        let minDistance = Infinity;
        
        for (const scythe of scythes) {
            // Calculate distance from spawn position to scythe
            const dx = scythe.position.x + scythe.width / 2 - this.source_coords.x;
            const dy = scythe.position.y + scythe.height / 2 - this.source_coords.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestScythe = scythe;
            }
        }

        if (nearestScythe) {
            return {
                x: nearestScythe.position.x + nearestScythe.width / 2,
                y: nearestScythe.position.y + nearestScythe.height / 2
            };
        }

        return null;
    }

    update() {
        if (this.revComplete) return;

        // Move interceptor in straight line toward target
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Check if offscreen (in any direction)
        if (this.position.x < -this.width || 
            this.position.x > this.gameEnv.innerWidth ||
            this.position.y < -this.height || 
            this.position.y > this.gameEnv.innerHeight) {
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

        // Calculate rotation angle based on movement direction
        const travelAngle = Math.atan2(this.velocity.y, this.velocity.x);
        const drawAngle = travelAngle + Math.PI; // Adjust for sprite orientation

        // Draw interceptor with glow effect
        ctx.save();

        // Translate to center and rotate
        ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        ctx.rotate(drawAngle);
        
        // Add glow shadow
        ctx.shadowColor = this.glowColor;
        ctx.shadowBlur = 10;
        
        // Draw the sprite
        ctx.drawImage(
            this.spriteSheet,
            0, 0, this.spriteSheet.naturalWidth, this.spriteSheet.naturalHeight,
            -this.width / 2, -this.height / 2, this.width, this.height
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
