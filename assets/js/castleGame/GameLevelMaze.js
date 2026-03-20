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
            src: compscisorcerers.github.io/pages/images/castleGame/dungeonMaze.png,
            pixels: { height: 772, width: 1134 }
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
            dialogues: ["a"],
            reaction: function() { console.log('test (reaction)'); },
            interact: function() { 
                console.log("Hello traveler, be wary of the maze ahead...");
            }
        };

        const dbarrier_1 = {
            id: 'dbarrier_1', x: 498, y: 0, width: 6, height: 295, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_2 = {
            id: 'dbarrier_2', x: 0, y: 0, width: 7, height: 296, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_3 = {
            id: 'dbarrier_3', x: 7, y: 71, width: 14, height: 225, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_4 = {
            id: 'dbarrier_4', x: 20, y: 72, width: 13, height: 188, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_5 = {
            id: 'dbarrier_5', x: 33, y: 200, width: 56, height: 60, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_6 = {
            id: 'dbarrier_6', x: 63, y: 71, width: 26, height: 129, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_7 = {
            id: 'dbarrier_7', x: 88, y: 71, width: 191, height: 64, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_8 = {
            id: 'dbarrier_8', x: 117, y: 156, width: 54, height: 64, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_9 = {
            id: 'dbarrier_9', x: 144, y: 220, width: 27, height: 38, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_10 = {
            id: 'dbarrier_10', x: 199, y: 134, width: 27, height: 125, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_11 = {
            id: 'dbarrier_11', x: 226, y: 199, width: 162, height: 60, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_12 = {
            id: 'dbarrier_12', x: 444, y: 71, width: 54, height: 81, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_13 = {
            id: 'dbarrier_13', x: 444, y: 152, width: 28, height: 108, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_14 = {
            id: 'dbarrier_14', x: 418, y: 201, width: 24, height: 58, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_15 = {
            id: 'dbarrier_15', x: 20, y: 286, width: 476, height: 10, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_16 = {
            id: 'dbarrier_16', x: 7, y: 1, width: 437, height: 38, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_17 = {
            id: 'dbarrier_17', x: 472, y: 0, width: 27, height: 37, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_18 = {
            id: 'dbarrier_18', x: 308, y: 40, width: 26, height: 131, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_19 = {
            id: 'dbarrier_19', x: 391, y: 39, width: 25, height: 133, visible: true /* BUILDER_DEFAULT */,
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
      { class: Barrier, data: dbarrier_19 }


    ];

    }

}

export default GameLevelMaze;