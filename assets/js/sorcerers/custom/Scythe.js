import Enemy from '../essentials/Enemy.js';

class Scythe extends Enemy {
    constructor(gameEnv, spawnX = null) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        
        const scytheData = {
            id: `scythe_${Math.random().toString(36).substr(2, 9)}`,
            src: path + "/images/mansionGame/scythe.png",
            SCALE_FACTOR: 2,
            ANIMATION_RATE: 10,
            pixels: {width: 64, height: 64},
            INIT_POSITION: { 
                x: spawnX !== null ? spawnX : Math.random() * (width - 64), 
                y: -64 
            },
            orientation: {rows: 1, columns: 1},
            down: {row: 0, start: 0, columns: 1},
            hitbox: {widthPercentage: 0.2, heightPercentage: 0.2}
        };
        
        super(scytheData, gameEnv);
        this.velocity.y = 3; // Move downward
        this.velocity.x = 0;
    }

    update() {
        super.update();
        
        // Remove scythe if it goes off screen
        if (this.position.y > this.gameEnv.innerHeight) {
            this.destroy();
        }
    }

    handleCollisionEvent() {
        console.log("Player hit by scythe! Player loses.");
        this.playerDestroyed = true;
        // Don't restart level, just log for now as requested
        this.destroy(); // Remove scythe after hitting player
    }
}

export default Scythe;
