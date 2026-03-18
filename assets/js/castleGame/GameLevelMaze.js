// Adventure Game Custom Level
// Exported from GameBuilder on 2026-03-05T17:24:14.526Z
// How to use this file:
// 1) Save as assets/js/adventureGame/GameLevelGamelevelmaze.js in your repo.
// 2) Reference it in your runner or level selector. Examples:
//    import GameLevelPlanets from '/assets/js/GameEnginev1/GameLevelPlanets.js';
//    import GameLevelGamelevelmaze from '/assets/js/adventureGame/GameLevelGamelevelmaze.js';
//    export const gameLevelClasses = [GameLevelPlanets, GameLevelGamelevelmaze];
//    // or pass it directly to your GameControl as the only level.
// 3) Ensure images exist and paths resolve via 'path' provided by the engine.
// 4) You can add more objects to this.classes inside the constructor.

import GameEnvBackground from '../GameEnginev1/essentials/GameEnvBackground.js';
import Player from '../GameEnginev1/essentials/Player.js';
import Npc from '../GameEnginev1/essentials/Npc.js';
import Barrier from '../GameEnginev1/essentials/Barrier.js';

class GameLevelMaze {
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;

        console.log("Width:", width, "Height:", height);

        const bgData = {
            name: "custom_bg",
            src: path + "/images/gamebuilder/bg/maze.jpg",
            pixels: { height: 2048, width: 2048 }
        };

 const sprite_src_mc = path + "/images/castleGame/playerSpritesheet.png";
        const MC_SCALE_FACTOR = 7;
        const sprite_data_mc = {
            id: 'Knight',
            greeting: "Hi, I am a Knight.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 500,
            ANIMATION_RATE: 100,
            INIT_POSITION: { 
                x: 0.5 * width, 
                y: 0.75 * height
            },
            pixels: {height: 432, width: 234},
            orientation: {rows: 4, columns: 3},
            down: {row: 0, start: 0, columns: 3},
            downRight: {row: 2, start: 0, columns: 3, rotate: Math.PI/16},
            downLeft: {row: 1, start: 0, columns: 3, rotate: -Math.PI/16},
            left: {row: 1, start: 0, columns: 3},
            right: {row: 2, start: 0, columns: 3},
            up: {row: 3, start: 0, columns: 3},
            upLeft: {row: 1, start: 0, columns: 3, rotate: Math.PI/16},
            upRight: {row: 2, start: 0, columns: 3, rotate: -Math.PI/16},
            hitbox: {widthPercentage: 0.1, heightPercentage: 0.15},
            keypress: {up: 87, left: 65, down: 83, right: 68}, // W, A, S, D
        };
        
         const npcData1 = {
            id: 'hey',
            greeting: 'Hey there!',
            src: path + "/images/gamify/chillguy.png",
            SCALE_FACTOR: 8,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 500, y: 300 },
            pixels: { height: 512, width: 384 },
            orientation: { rows: 4, columns: 3 },
            down: { row: 0, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            left: { row: 2, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ['alskdmalksmslaksmdlaksm'],
            reaction: function() { console.log(this.greeting); },
            interact: function() { 
                console.log(this.greeting);
            }
        };


        const dbarrier_1 = {
            id: 'dbarrier_1', x: 6, y: 242, width: 163, height: 7, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_2 = {
            id: 'dbarrier_2', x: 169, y: 186, width: 10, height: 60, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_3 = {
            id: 'dbarrier_3', x: 178, y: 186, width: 48, height: 7, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_4 = {
            id: 'dbarrier_4', x: 217, y: 189, width: 7, height: 54, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_5 = {
            id: 'dbarrier_5', x: 217, y: 232, width: 84, height: 8, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_6 = {
            id: 'dbarrier_6', x: 299, y: 193, width: 10, height: 41, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_7 = {
            id: 'dbarrier_7', x: 309, y: 193, width: 80, height: 7, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_8 = {
            id: 'dbarrier_8', x: 379, y: 200, width: 8, height: 34, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_9 = {
            id: 'dbarrier_9', x: 350, y: 230, width: 33, height: 4, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_10 = {
            id: 'dbarrier_10', x: 386, y: 194, width: 59, height: 8, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_11 = {
            id: 'dbarrier_11', x: 433, y: 98, width: 10, height: 98, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_12 = {
            id: 'dbarrier_12', x: 176, y: 38, width: 320, height: 8, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_13 = {
            id: 'dbarrier_13', x: 353, y: 42, width: 6, height: 86, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_14 = {
            id: 'dbarrier_14', x: 209, y: 99, width: 81, height: 9, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_15 = {
            id: 'dbarrier_15', x: 210, y: 104, width: 10, height: 82, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_16 = {
            id: 'dbarrier_16', x: 83, y: 43, width: 92, height: 11, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_17 = {
            id: 'dbarrier_17', x: 109, y: 52, width: 10, height: 129, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_18 = {
            id: 'dbarrier_18', x: 63, y: 112, width: 41, height: 14, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_19 = {
            id: 'dbarrier_19', x: 75, y: 0, width: 10, height: 52, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_20 = {
            id: 'dbarrier_20', x: 14, y: 359, width: 233, height: 11, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_21 = {
            id: 'dbarrier_21', x: 241, y: 361, width: 14, height: 60, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_22 = {
            id: 'dbarrier_22', x: 311, y: 358, width: 22, height: 58, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_23 = {
            id: 'dbarrier_23', x: 26, y: 283, width: 225, height: 10, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_24 = {
            id: 'dbarrier_24', x: 245, y: 234, width: 8, height: 55, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_25 = {
            id: 'dbarrier_25', x: 346, y: 231, width: 16, height: 55, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_26 = {
            id: 'dbarrier_26', x: 312, y: 281, width: 37, height: 9, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_27 = {
            id: 'dbarrier_27', x: 333, y: 361, width: 168, height: 6, visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        this.classes = [      { class: GameEnvBackground, data: bgData },
      { class: Player, data: sprite_data_mc },
      { class: Npc, data: npcData1 },
      { class: Barrier, data: dbarrier_1 },
      { class: Barrier, data: dbarrier_2 },
      { class: Barrier, data: dbarrier_3 },
      { class: Barrier, data: dbarrier_4 },
      { class: Barrier, data: dbarrier_5 },
      { class: Barrier, data: dbarrier_6 },
      { class: Barrier, data: dbarrier_7 },
      { class: Barrier, data: dbarrier_8 },
      { class: Barrier, data: dbarrier_9 },
      { class: Barrier, data: dbarrier_10 },
      { class: Barrier, data: dbarrier_11 },
      { class: Barrier, data: dbarrier_12 },
      { class: Barrier, data: dbarrier_13 },
      { class: Barrier, data: dbarrier_14 },
      { class: Barrier, data: dbarrier_15 },
      { class: Barrier, data: dbarrier_16 },
      { class: Barrier, data: dbarrier_17 },
      { class: Barrier, data: dbarrier_18 },
      { class: Barrier, data: dbarrier_19 },
      { class: Barrier, data: dbarrier_20 },
      { class: Barrier, data: dbarrier_21 },
      { class: Barrier, data: dbarrier_22 },
      { class: Barrier, data: dbarrier_23 },
      { class: Barrier, data: dbarrier_24 },
      { class: Barrier, data: dbarrier_25 },
      { class: Barrier, data: dbarrier_26 },
      { class: Barrier, data: dbarrier_27 }
];

    }

    checkWin(playerX, playerY) {
        if (playerX > (this.width * 0.8) && playerY < (this.height * 0.2)) {
            console.log("You won!");
        }
    }

    checkCollision(playerX, playerY) {
        const barriers = [
            { x: 6, y: 242, width: 163, height: 7 },
            { x: 169, y: 186, width: 10, height: 60 },
            { x: 178, y: 186, width: 48, height: 7 },
            { x: 217, y: 189, width: 7, height: 54 },
            { x: 217, y: 232, width: 84, height: 8 },
            { x: 299, y: 193, width: 10, height: 41 },
            { x: 309, y: 193, width: 80, height: 7 },
            { x: 379, y: 200, width: 8, height: 34 },
            { x: 350, y: 230, width: 33, height: 4 },
            { x: 386, y: 194, width: 59, height: 8 },
            { x: 433, y: 98, width: 10, height: 98 },
            { x: 176, y: 38, width: 320, height: 8 },
            { x: 353, y: 42, width: 6, height: 86 },
            { x: 209, y: 99, width: 81, height: 9 },
            { x: 210, y: 104, width: 10, height: 82 },
            { x: 83, y: 43, width: 92, height: 11 },
            { x: 109, y: 52, width: 10, height: 129 },
            { x: 63, y: 112, width: 41, height: 14 },
            { x: 75, y: 0, width: 10, height: 52 },
            { x: 14, y: 359, width: 233, height: 11 },
            { x: 241, y: 361, width: 14, height: 60 },
            { x: 311, y: 358, width: 22, height: 58 },
            { x: 26, y: 283, width: 225, height: 10 },
            { x: 245, y: 234, width: 8, height: 55 },
            { x: 346, y: 231, width: 16, height: 55 },
            { x: 312, y: 281, width: 37, height: 9 },
            { x: 333, y: 361, width: 168, height: 6 }
        ];

        for (let barrier of barriers) {
            if (playerX >= barrier.x && playerX <= barrier.x + barrier.width &&
                playerY >= barrier.y && playerY <= barrier.y + barrier.height) {
                console.log("You lost, reload the page or press esc");
                return true;
            }
        }
        return false;
    }
}

export default GameLevelMaze;