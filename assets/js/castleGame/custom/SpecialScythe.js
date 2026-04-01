import Enemy from '../../GameEnginev1.1/essentials/Enemy.js';
import Player from '../../GameEnginev1.1/essentials/Player.js';
import showDeathScreen from './DeathScreen.js';

/**
 * SpecialScythe class - a bigger, uninterceptable scythe that bounces off screen edges
 */
class SpecialScythe extends Enemy {
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;

        // Random spawn position at top of screen
        const spawnXPos = Math.random() * (width - 100);
        const spawnYPos = -100;

        const scytheData = {
            id: `special_scythe_${Math.random().toString(36).substr(2, 9)}`,
            src: path + "/images/mansionGame/scythe.png",
            SCALE_FACTOR: 6, // Smaller scale factor = bigger scythe (normal is 10)
            ANIMATION_RATE: 10,
            pixels: { width: 64, height: 64 },
            INIT_POSITION: {
                x: spawnXPos,
                y: spawnYPos
            },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.3, heightPercentage: 0.3 }
        };

        super(scytheData, gameEnv);

        // Initialize hittingNPC flag
        this._hittingNPC ??= false;

        // Check for NPC collision
        this.checkNPCCollision();

        // Mark as special scythe
        this.isSpecial = true;

        // Disable dialogue system for special scythes - they shouldn't talk to players
        if (this.dialogueSystem) {
            this.dialogueSystem = null;
        }
        
        // Remove interact key listeners to prevent dialogue triggers
        if (this.removeInteractKeyListeners) {
            this.removeInteractKeyListeners();
        }

        // Bouncing motion properties instead of ellipse
        this.velocity = {
            x: (Math.random() - 0.5) * 8, // Random horizontal velocity
            y: Math.random() * 3 + 2 // Downward velocity
        };

        // State tracking
        this.revComplete = false;
        this.rotationAngle = 0;
        this.rotationSpeed = 0.1; // Spinning speed

        // Manual image loading like Projectile class
        this.spriteSheet = new Image();
        this.imageLoaded = false;
        this.spriteSheet.onload = () => {
            this.imageLoaded = true;
        };
        this.spriteSheet.src = path + "/images/mansionGame/scythe.png";

        // Visual distinction - red glow
        this.glowColor = '#ff0000';

        // Add a pulsing effect
        this.pulseTimer = 0;
        this.pulseSpeed = 0.1;

        // Lifetime properties
        this.creationTime = Date.now(); // Track when scythe was created
        this.lifespan = 30000; // 30 seconds in milliseconds
    }

    update() {
        if (this.revComplete) return;

        // Check if scythe has exceeded its lifespan (30 seconds)
        const currentTime = Date.now();
        if (currentTime - this.creationTime >= this.lifespan) {
            this.revComplete = true;
            this.destroy();
            return;
        }

        // Special scythes ignore NPC collisions - they pass through NPCs
        // This prevents them from getting stuck
        this._hittingNPC = false;

        // Update positioning logic - special scythes always move
        // Bouncing motion instead of ellipse
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Bounce off screen edges
        if (this.position.x <= 0 || this.position.x >= this.gameEnv.innerWidth - this.width) {
            this.velocity.x = -this.velocity.x; // Reverse horizontal velocity
            this.position.x = Math.max(0, Math.min(this.gameEnv.innerWidth - this.width, this.position.x));
        }

        if (this.position.y <= 0 || this.position.y >= this.gameEnv.innerHeight - this.height) {
            this.velocity.y = -this.velocity.y; // Reverse vertical velocity
            this.position.y = Math.max(0, Math.min(this.gameEnv.innerHeight - this.height, this.position.y));
        }

        // Update rotation for spinning effect
        this.rotationAngle += this.rotationSpeed;

        // Update pulsing effect
        this.pulseTimer += this.pulseSpeed;

        // Check for collisions with player
        this.checkPlayerCollision();

        // Check for collisions with regular scythes
        this.checkRegularScytheCollisions();

        super.update();
    }

    checkPlayerCollision() {
        // Find all player objects
        const players = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Player' ||
            (obj.isPlayer !== undefined && obj.isPlayer)
        );

        if (players.length === 0) return;

        // Check collision with each player using relative hit distance
        for (const player of players) {
            // Calculate center points of both sprites
            const scytheCenterX = this.position.x + this.width / 2;
            const scytheCenterY = this.position.y + this.height / 2;
            const playerCenterX = player.position.x + player.width / 2;
            const playerCenterY = player.position.y + player.height / 2;

            // Calculate distance between center points
            const dx = playerCenterX - scytheCenterX;
            const dy = playerCenterY - scytheCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Use relative hit distance based on sprite sizes
            const HIT_DISTANCE = (this.width + player.width) / 3; // One-third of combined width

            if (distance <= HIT_DISTANCE) {
                this.handleCollisionWithPlayer();
                break;
            }
        }
    }

    checkNPCCollision() {
        // Find all NPC objects
        const npcs = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Npc' ||
            (obj.isNpc !== undefined && obj.isNpc)
        );

        if (npcs.length === 0) return;

        // Check collision with each NPC using relative hit distance
        for (const npc of npcs) {
            // Calculate center points of both sprites
            const scytheCenterX = this.position.x + this.width / 2;
            const scytheCenterY = this.position.y + this.height / 2;
            const npcCenterX = npc.position.x + npc.width / 2;
            const npcCenterY = npc.position.y + npc.height / 2;

            // Calculate distance between center points
            const dx = npcCenterX - scytheCenterX;
            const dy = npcCenterY - scytheCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Use relative hit distance based on sprite sizes
            const HIT_DISTANCE = (this.width + npc.width) / 3; // One-third of combined width

            if (distance <= HIT_DISTANCE) {
                this._hittingNPC = true;
                break;
            }
        }
    }

    checkRegularScytheCollisions() {
        // Find all regular scythe objects (not special scythes)
        const regularScythes = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Scythe' && !obj.isSpecial
        );

        if (regularScythes.length === 0) return;

        // Check collision with each regular scythe
        for (const regularScythe of regularScythes) {
            // Calculate center points of both scythes
            const specialCenterX = this.position.x + this.width / 2;
            const specialCenterY = this.position.y + this.height / 2;
            const regularCenterX = regularScythe.position.x + regularScythe.width / 2;
            const regularCenterY = regularScythe.position.y + regularScythe.height / 2;

            // Calculate distance between center points
            const dx = regularCenterX - specialCenterX;
            const dy = regularCenterY - specialCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Use relative hit distance based on sprite sizes
            const HIT_DISTANCE = (this.width + regularScythe.width) / 3;

            if (distance <= HIT_DISTANCE) {
                // Destroy the regular scythe
                regularScythe.revComplete = true;
                regularScythe.destroy();
                
                // Create explosion effect at collision point
                this.createExplosionEffect(regularCenterX, regularCenterY);
            }
        }
    }

    createExplosionEffect(x, y) {
        // Create a visual explosion effect
        const explosion = document.createElement('div');
        explosion.style.position = 'absolute';
        explosion.style.left = x + 'px';
        explosion.style.top = y + 'px';
        explosion.style.width = '30px';
        explosion.style.height = '30px';
        explosion.style.backgroundColor = '#ffff00';
        explosion.style.borderRadius = '50%';
        explosion.style.transform = 'translate(-50%, -50%)';
        explosion.style.pointerEvents = 'none';
        explosion.style.zIndex = '1000';
        
        // Add to game container
        const gameContainer = this.gameEnv.canvasContainer || document.body;
        gameContainer.appendChild(explosion);

        // Animate explosion
        let scale = 1;
        let opacity = 1;
        const animateExplosion = () => {
            scale += 0.2;
            opacity -= 0.05;
            
            explosion.style.transform = `translate(-50%, -50%) scale(${scale})`;
            explosion.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animateExplosion);
            } else {
                gameContainer.removeChild(explosion);
            }
        };
        
        requestAnimationFrame(animateExplosion);
    }

    handleCollisionWithPlayer() {
        // Mark scythe as complete and destroy it
        this.revComplete = true;
        this.destroy();

        // Find the player object
        const player = this.gameEnv.gameObjects.find(obj => obj.constructor.name === 'Player');

        // Display that the user has failed the game
        showDeathScreen(player);
    }

    draw() {
        if (!this.imageLoaded) {
            return;
        }

        // Use parent's canvas system like Character class
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Apply rotation transformation with pulsing effect
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate(this.rotationAngle);
        
        // Add pulsing scale effect
        const pulseScale = 1 + Math.sin(this.pulseTimer) * 0.1;
        this.ctx.scale(pulseScale, pulseScale);

        // Add red glow effect
        this.ctx.shadowColor = this.glowColor;
        this.ctx.shadowBlur = 15;

        // Draw the scythe
        this.ctx.drawImage(
            this.spriteSheet,
            0, 0, this.spriteSheet.naturalWidth, this.spriteSheet.naturalHeight,
            -this.width / 2, -this.height / 2, this.width, this.height
        );

        this.ctx.restore();

        // Set up canvas position (this handles positioning)
        this.setupCanvas();
    }

    /**
     * Override to prevent interception
     * Special scythes cannot be intercepted
     */
    canBeIntercepted() {
        return false;
    }

    /**
     * Override collision handling for interceptors
     * Interceptors should pass through special scythes
     */
    handleInterceptorCollision(interceptor) {
        // Do nothing - special scythes are immune to interceptors
        return false;
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

export default SpecialScythe;
