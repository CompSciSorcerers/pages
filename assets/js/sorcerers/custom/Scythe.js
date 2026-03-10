import Enemy from '../essentials/Enemy.js';
import Player from '../essentials/Player.js';

class Scythe extends Enemy {
    constructor(gameEnv, spawnX = null) {
        console.log("Scythe constructor called with gameEnv:", gameEnv);
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;

        // Random spawn position at top of screen
        // Get the player position
        const players = gameEnv.gameObjects.filter(obj => obj instanceof Player);
        if (players.length === 0) {
            console.error("No player found in game environment");
            return;
        }
        const player = players[0];
        const spawnXPos = player.position.x;
        const spawnYPos = player.position.y;

        const targetXPos = spawnX !== null ? spawnX : Math.random() * (width - 64);
        const targetYPos = -64;

        console.log("Scythe spawn positions - from:", spawnXPos, spawnYPos, "to:", targetXPos, targetYPos);

        const scytheData = {
            id: `scythe_${Math.random().toString(36).substr(2, 9)}`,
            src: path + "/images/mansionGame/scythe.png",
            SCALE_FACTOR: 10,
            ANIMATION_RATE: 10,
            pixels: {width: 64, height: 64},
            INIT_POSITION: { 
                x: spawnXPos, 
                y: spawnYPos 
            },
            orientation: {rows: 1, columns: 1},
            down: {row: 0, start: 0, columns: 1},
            hitbox: {widthPercentage: 0.3, heightPercentage: 0.3}
        };

        super(scytheData, gameEnv);

        // Ellipse motion properties (similar to Mansion game's Boomerang)
        this.source_coords = { x: spawnXPos, y: spawnYPos };
        this.target_coords = { x: targetXPos, y: targetYPos };

        // Calculate ellipse center and dimensions
        this.ellipse_center = {
            x: (spawnXPos + targetXPos) / 2,
            y: (spawnYPos + targetYPos) / 2
        };

        this.ellipse_width = Math.sqrt((targetXPos - spawnXPos) ** 2 + (targetYPos - spawnYPos) ** 2);
        this.ellipse_height = this.ellipse_width / 3; // Make it less tall for better arc
        this.ellipse_tilt = Math.atan2(targetYPos - spawnYPos, targetXPos - spawnXPos);

        // Motion properties
        this.radian_prog = 0;
        this.radian_limit = 2 * Math.PI; // Full ellipse
        this.projectileSpeed = 0.03; // Radians per update

        // State tracking
        this.revComplete = false;
        this.rotationAngle = 0;
        this.rotationSpeed = 0.1; // Spinning speed

        // Override default velocity since we use ellipse motion
        this.velocity.x = 0;
        this.velocity.y = 0;

        // Manual image loading like Projectile class
        this.spriteSheet = new Image();
        this.imageLoaded = false;
        this.spriteSheet.onload = () => {
            this.imageLoaded = true;
            console.log("Scythe image loaded successfully");
        };
        this.spriteSheet.src = path + "/images/mansionGame/scythe.png";
    }

    update() {
        if (this.revComplete) return;

        // Debug: log that update is being called
        if (Math.random() < 0.01) { // Only log occasionally to avoid spam
            console.log("Scythe update called, position:", this.position.x, this.position.y);
        }

        // Check if scythe has completed its path
        if (this.radian_prog >= this.radian_limit) {
            this.revComplete = true;
            console.log("Scythe completed path, destroying...");
            this.destroy();
            return;
        }

        // Update position along elliptical path
        this.radian_prog += this.projectileSpeed;

        const cosProg = Math.cos(this.radian_prog);
        const sinProg = Math.sin(this.radian_prog);
        const cosTilt = Math.cos(this.ellipse_tilt);
        const sinTilt = Math.sin(this.ellipse_tilt);

        const x_coord = this.ellipse_center.x + 
                        (this.ellipse_width / 2) * cosProg * cosTilt - 
                        this.ellipse_height * sinProg * sinTilt;

        const y_coord = this.ellipse_center.y + 
                        (this.ellipse_width / 2) * cosProg * sinTilt + 
                        this.ellipse_height * sinProg * cosTilt;

        this.position.x = x_coord;
        this.position.y = y_coord;

        // Update rotation for spinning effect
        this.rotationAngle += this.rotationSpeed;

        // Check for collisions with player
        this.checkPlayerCollision();

        // Only call parent update if coordinates are set up
        if (this.source_coords && this.target_coords) {
            // Call parent update to handle drawing and collision checks
            super.update();
        } else {
            // Debug: check if parent update calls our draw
            console.log("Scythe: coordinates not set, calling super.update() anyway");
            super.update();
        }
    }

    checkPlayerCollision() {
        // Find all player objects
        const players = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Player' || 
            (obj.isPlayer !== undefined && obj.isPlayer)
        );

        if (players.length === 0) return;

        // Check collision with each player
        const HIT_DISTANCE = 40;

        for (const player of players) {
            const dx = player.position.x - this.position.x;
            const dy = player.position.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= HIT_DISTANCE) {
                this.handleCollisionWithPlayer();
                break;
            }
        }
    }

    handleCollisionWithPlayer() {
        console.log("Player hit by scythe!");

        // Mark scythe as complete and destroy it
        this.revComplete = true;
        this.destroy();

        // Handle player game over
        // Alert user that game is over
        alert("Game Over! You were defeated by a scythe!");
        // End the game
        document.writeln("<h1>Game Over! You were defeated by a scythe!</h1>");
    }

    draw() {
        if (!this.imageLoaded) {
            return;
        }

        // Debug: log drawing occasionally
        if (Math.random() < 0.01) {
            console.log("Scythe draw: position", this.position.x, this.position.y, "image loaded:", this.imageLoaded);
        }

        // Use parent's canvas system like Character class
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Apply rotation transformation
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate(this.rotationAngle);

        // Draw the scythe
        this.ctx.drawImage(
            this.spriteSheet,
            0, 0, this.spriteSheet.naturalWidth, this.spriteSheet.naturalHeight,
            -this.width/2, -this.height/2, this.width, this.height
        );

        this.ctx.restore();

        // Set up canvas position (this handles positioning)
        this.setupCanvas();
    }

    handleCollisionEvent() {
        // This method is called by the collision system
        // We'll handle collisions in our own checkPlayerCollision method
        console.log("Scythe collision detected");
    }

    destroy() {
        console.log("Scythe destroy called, removing from game...");

        // Remove from gameObjects array
        const index = this.gameEnv.gameObjects.indexOf(this);
        if (index > -1) {
            this.gameEnv.gameObjects.splice(index, 1);
            console.log("Scythe removed from gameObjects. Total objects:", this.gameEnv.gameObjects.length);
        }

        // Remove canvas from container
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
            console.log("Scythe canvas removed from container");
        }

        // Call parent destroy if it exists
        if (super.destroy) {
            super.destroy();
        }
    }
}

export default Scythe;
