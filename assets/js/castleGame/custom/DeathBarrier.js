import Barrier from '../../GameEnginev1/essentials/Barrier.js';
import showDeathScreen from './DeathScreen.js';

class DeathBarrier extends Barrier {
    constructor(data, gameEnv) {
        super(data, gameEnv);
        this._hasTriggeredDeath = false;
    }

    update() {
        super.update();

        if (this._hasTriggeredDeath) return;

        const player = this.gameEnv?.gameObjects?.find(obj => obj.constructor?.name === 'Player');
        if (!player || !player.canvas || !this.canvas) return;

        this.isCollision(player);

        if (this.collisionData?.hit) {
            this._hasTriggeredDeath = true;
            player.isDead = true;

            console.log('[MazeDebug] DeathBarrier hit player:', this.canvas?.id || this.id || 'unknown');

            try {
                // showDeathScreen(player, 'You got lost in the maze.');
            } catch (error) {
                console.error('DeathBarrier failed to show death screen:', error);
                this._hasTriggeredDeath = false;
                player.isDead = false;
            }
        }
    }
}

export default DeathBarrier;
