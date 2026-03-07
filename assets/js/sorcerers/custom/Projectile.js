import Character from '../essentials/Character.js';

/*
Projectile code reused from the Mansion Game boss fight from CSSE Tri 1
*/

class Projectile extends Character {
    constructor(gameEnv = null, targetx, targety, sourcex, sourcey, type) {
        super({id: type}, gameEnv);

        this.source_coords = { x: sourcex, y: sourcey };
        this.target_coords = { x: targetx, y: targety };
        this.type = type;

        // Get the main path
        const path = gameEnv.path;

        // Calculate angle and velocity to move in a straight line
        this.speed = 5; // adjust as needed
        this.velocity = {
            x: 0,
            y: -this.speed  // Always move upwards
        };

        this.revComplete = false;

        // Load sprite/image based on type
        if (type === "ARROW" || type === "PLAYER") {
            this.spriteSheet = new Image();
            this.frameIndex = 0;
            this.frameCount = 1; // single frame
            this.width = 60; // scale down if needed
            this.height = 70;  // Made even taller to fix vertical squashing
            this.spriteSheet.onload = () => this.imageLoaded = true;
            this.spriteSheet.src = path + "/images/mansionGame/arrow.png";
        } else if (type === "FIREBALL") {
            // Fireball is a single-frame static image (178x123 source). Use a scaled size preserving aspect ratio.
            this.spriteSheet = new Image();
            this.frameIndex = 0;
            this.frameCount = 1; // single frame
            // source aspect ~ 178 / 123 => width is larger; scale to a reasonable in-game size
            this.width = 64;
            this.height = 44; // keep aspect roughly (64 * 123 / 178 ≈ 44)
            this.spriteSheet.onload = () => this.imageLoaded = true;
            this.spriteSheet.src = path + "/images/mansionGame/staticfireball.png";
        }
        this.isAnimated = false;

        // Start at source position
        this.position = { x: sourcex, y: sourcey };
    }

    update() {
        // Move projectile
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Check if offscreen
        if (
            this.position.x < 0 || this.position.x > this.gameEnv.innerWidth ||
            this.position.y < 0 || this.position.y > this.gameEnv.innerHeight
        ) {
            this.revComplete = true;
            this.destroy();
        }

        // Draw (this sets canvas dimensions)
        this.draw();

        // Update canvas position after drawing
        this.setupCanvas();

        // Check if we are close enouph to the player
        this.execDamage();
    }

    draw() {
        const ctx = this.ctx;
        this.clearCanvas();

        if (!this.imageLoaded) {
            return;  // Don't try to draw until image is loaded
        }

        const travelAngle = Math.atan2(this.velocity.y, this.velocity.x); // radians

        // Base angle depends on how the sprite image faces by default
        // Arrow image faces left -> baseAngle = PI
        // Fireball image faces right -> baseAngle = 0
        const baseAngle = (this.type === 'ARROW' || this.type === 'PLAYER') ? Math.PI : 0;

        // Angle to rotate the sprite so it faces travel direction
        const drawAngle = travelAngle - baseAngle;

        if (this.isAnimated && this.spriteSheet.complete) {
            const frameWidth = Math.floor(this.spriteSheet.width / this.frameCols);
            const frameHeight = Math.floor(this.spriteSheet.height / this.frameRows);
            const col = this.frameIndex % this.frameCols;
            const row = Math.floor(this.frameIndex / this.frameRows);

            const dstW = Math.max(1, Math.floor(this.width));
            const dstH = Math.max(1, Math.floor(this.height));

            this.canvas.width = dstW;
            this.canvas.height = dstH;

            ctx.save();
            ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
            ctx.rotate(drawAngle);
            ctx.drawImage(
                this.spriteSheet,
                col * frameWidth, row * frameHeight, frameWidth, frameHeight,
                -dstW / 2, -dstH / 2, dstW, dstH
            );
            ctx.restore();

            // Advance frame
            this.frameIndex = (this.frameIndex + 1) % this.frameCount;

        } else if (this.spriteSheet.complete) {
            const srcW = this.spriteSheet.naturalWidth || this.spriteSheet.width;
            const srcH = this.spriteSheet.naturalHeight || this.spriteSheet.height;
            const dstW = Math.max(1, Math.floor(this.width));
            const dstH = Math.max(1, Math.floor(this.height));

            // Make canvas large enough to handle rotation (even larger for arrows)
            const maxDim = Math.ceil(Math.sqrt(dstW * dstW + dstH * dstH)) + 10;
            this.canvas.width = maxDim;
            this.canvas.height = maxDim;

            // draw
            ctx.save();
            ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
            ctx.rotate(drawAngle);
            ctx.drawImage(
                this.spriteSheet,
                0, 0, srcW, srcH,
                -dstW / 2, -dstH / 2, dstW, dstH
            );
            ctx.restore();
        }

        // Draw to screen
        this.setupCanvas();
    }

    // Deal damage to the player
    execDamage() {
        if (typeof window !== 'undefined' && window.__battleRoomFadeComplete === false) {
            return;
        }

        // If the player is too close...
        const PLAYER_HIT_DISTANCE = 50;
        const REAPER_HORIZONTAL_HIT_DISTANCE = 75;
        const REAPER_VERTICAL_HIT_DISTANCE = 100;

        const ARROW_DAMAGE = 10;
        const PLAYER_DAMAGE = 75;  // Control how much damage per hit the player does
        const FIREBALL_DAMAGE = 15;
        const DAMAGE_DEALT = this.type == "FIREBALL" ? FIREBALL_DAMAGE : this.type == "ARROW" ? ARROW_DAMAGE : PLAYER_DAMAGE;
        if (this.type === 'PLAYER') {
            const reapers = this.gameEnv.gameObjects.filter(obj => obj.constructor.name === 'Boss');
            if (reapers.length === 0) return null;
            let nearestBoss = reapers[0];
            let minDist = Infinity;

            // Find the closest boss
            for (const reaper of reapers) {
                const dx = reaper.position.x - this.position.x;
                const dy = reaper.position.y - this.position.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDist) {
                    minDist = dist;
                    nearestBoss = reaper;
                }
            }

            // Do distance formula calculation and return
            const xDiff = Math.abs(nearestBoss.position.x - this.position.x);
            const yDiff = Math.abs((nearestBoss.position.y + 85) - this.position.y); // +50 accounts for the center of the boss being offset
            // console.log(`Boss Y: ${nearestBoss.position.y}, Projectile Y: ${this.position.y}, YDiff: ${yDiff}`);

            if (xDiff <= REAPER_HORIZONTAL_HIT_DISTANCE && yDiff <= REAPER_VERTICAL_HIT_DISTANCE) {
                this.revComplete = true;
                this.destroy();
                nearestBoss.healthPoints -= DAMAGE_DEALT;
                console.log("Reaper Health:", nearestBoss.healthPoints);
                if (nearestBoss.data.health <= 0) {
                    console.log("Game over -- the player has won!");
                    // Show victory screen
                    try { showEndScreen(this.gameEnv); } catch (e) { console.warn('Error showing victory screen:', e); }
                }
            }

        } else {
            const players = this.gameEnv.gameObjects.filter(obj => obj.constructor.name === 'Player' || obj.constructor.name === 'FightingPlayer');
            if (players.length === 0) return null;

            let nearest = players[0];
            let minDist = Infinity;

            // Find the closest player
            for (const player of players) {
                const dx = player.position.x - this.position.x;
                const dy = player.position.y - this.position.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = player;
                }
            }

            // Do distance formula calculation
            const xDiff = nearest.position.x - this.position.x;
            const yDiff = nearest.position.y - this.position.y;
            const distanceFromPlayer = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

            if (distanceFromPlayer <= PLAYER_HIT_DISTANCE) {
                this.revComplete = true;
                this.destroy();
                if (!nearest.data) nearest.data = { health: 100 }; // Initialize health if not exists
                nearest.data.health -= DAMAGE_DEALT;
                console.log("Player Health:", nearest.data.health);
                if (nearest.data.health <= 0) {
                    console.log("Game over -- the player has been defeated!");
                    // no death screen in archery version
                }
            }

            // Update the player health bar to accurately show the new health (if available)
        }
    }

    // Optional helper called when projectile should 'die'.
    // In this simplified sorcerers version it just removes itself.
    die() {
        this.destroy();
    }

    // Carry over the method that is destroying the image once it's offscreen
    destroy() {
        super.destroy();
    }
}

export default Projectile;
