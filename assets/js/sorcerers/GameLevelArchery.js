
import GameEnvBackground  from '../essentials/GameEnvBackground.js';
import FightingPlayer from './custom/FightingPlayer.js';
import Npc  from '../essentials/essentials/Npc.js';

class GameLevelArchery {
    constructor(gameEnv) {
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;
        const path = gameEnv.path;

        // --- Floor ---
        const image_src_floor = path + "/images/mansionGame/bossFloorPattern.png";
        const image_data_floor = {
            name: 'floor',
            src: image_src_floor,
            pixels: {height: 341, width: 498}
        };

        // --- Player ---
        const sprite_src_mc = path + "/images/mansionGame/spookMcWalk.png";
        const MC_SCALE_FACTOR = 7;
        const sprite_data_mc = {
            id: 'Spook',
            greeting: "Hi, I am Spook.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 1500,
            ANIMATION_RATE: 100,
            INIT_POSITION: { 
                x: (width / 2 - width / (5 * MC_SCALE_FACTOR)), 
                y: height - (height / MC_SCALE_FACTOR)
            },
            pixels: {height: 2400, width: 3600},
            orientation: {rows: 2, columns: 3},
            down: {row: 1, start: 0, columns: 3},
            downRight: {row: 1, start: 0, columns: 3, rotate: Math.PI/16},
            downLeft: {row: 0, start: 0, columns: 3, rotate: -Math.PI/16},
            left: {row: 0, start: 0, columns: 3},
            right: {row: 1, start: 0, columns: 3},
            up: {row: 1, start: 0, columns: 3},
            upLeft: {row: 0, start: 0, columns: 3, rotate: Math.PI/16},
            upRight: {row: 1, start: 0, columns: 3, rotate: -Math.PI/16},
            hitbox: {widthPercentage: 0.45, heightPercentage: 0.2},
            keypress: {up: 87, left: 65, down: 83, right: 68}, // W, A, S, D
        };
    }
}
