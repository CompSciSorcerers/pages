
import GameEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import Barrier from './essentials/Barrier.js';
import GameLevelMaze from './GameLevelMaze (1).js';

class GameLevelCustom {
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;

        const bgData = {
            name: "custom_bg",
            src: path + "/images/gamebuilder/bg/alien_planet.jpg",
            pixels: { height: 772, width: 1134 }
        };

        const playerData = {
            id: 'playerData',
            src: path + "/images/gamebuilder/sprites/astro.png",
            SCALE_FACTOR: 20,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 0, y: 300 },
            pixels: { height: 770, width: 513 },
            orientation: { rows: 4, columns: 4 },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI/16 },
            left: { row: 2, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI/16 },
            upRight: { row: 3, start: 0, columns: 3, rotate: -Math.PI/16 },
            hitbox: { widthPercentage: 0.04, heightPercentage: 0 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
            };

        const npcData1 = {
            id: 'Samoorth',
            greeting: 'Ok you can pass now',
            src: path + "/images/gamify/tux.png",
            SCALE_FACTOR: 8,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 159, y: 283 },
            pixels: { height: 256, width: 352 },
            orientation: { rows: 8, columns: 11 },
            down: { row: 0, start: 0, columns: 3 },
            right: { row: Math.min(1, 8 - 1), start: 0, columns: 3 },
            left: { row: Math.min(2, 8 - 1), start: 0, columns: 3 },
            up: { row: Math.min(3, 8 - 1), start: 0, columns: 3 },
            upRight: { row: Math.min(3, 8 - 1), start: 0, columns: 3 },
            downRight: { row: Math.min(1, 8 - 1), start: 0, columns: 3 },
            upLeft: { row: Math.min(2, 8 - 1), start: 0, columns: 3 },
            downLeft: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ['Ok you can pass now'],
            interactionCount: 0,
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() { 
                this.interactionCount++;
                if (this.interactionCount === 1) {
                    if (thisx && typeof this.destroy === 'function') {
                        this.destroy();
                    }
                }
            }
        };
        const dbarrier_1 = {
            id: 'dbarrier_1', x: 6, y: 242, width: 163, height: 7, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_2 = {
            id: 'dbarrier_2', x: 169, y: 186, width: 10, height: 60, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_3 = {
            id: 'dbarrier_3', x: 178, y: 186, width: 48, height: 7, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_4 = {
            id: 'dbarrier_4', x: 217, y: 189, width: 7, height: 54, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_5 = {
            id: 'dbarrier_5', x: 217, y: 232, width: 84, height: 8, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_6 = {
            id: 'dbarrier_6', x: 299, y: 193, width: 10, height: 41, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_7 = {
            id: 'dbarrier_7', x: 309, y: 193, width: 80, height: 7, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_8 = {
            id: 'dbarrier_8', x: 379, y: 200, width: 8, height: 34, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_9 = {
            id: 'dbarrier_9', x: 350, y: 230, width: 33, height: 4, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_10 = {
            id: 'dbarrier_10', x: 386, y: 194, width: 59, height: 8, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_11 = {
            id: 'dbarrier_11', x: 433, y: 98, width: 10, height: 98, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_12 = {
            id: 'dbarrier_12', x: 176, y: 38, width: 320, height: 8, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_13 = {
            id: 'dbarrier_13', x: 353, y: 42, width: 6, height: 86, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_14 = {
            id: 'dbarrier_14', x: 209, y: 99, width: 81, height: 9, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_15 = {
            id: 'dbarrier_15', x: 210, y: 104, width: 10, height: 82, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_16 = {
            id: 'dbarrier_16', x: 83, y: 43, width: 92, height: 11, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_17 = {
            id: 'dbarrier_17', x: 109, y: 52, width: 10, height: 129, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_18 = {
            id: 'dbarrier_18', x: 63, y: 112, width: 41, height: 14, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_19 = {
            id: 'dbarrier_19', x: 75, y: 0, width: 10, height: 52, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_20 = {
            id: 'dbarrier_20', x: 14, y: 359, width: 233, height: 11, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_21 = {
            id: 'dbarrier_21', x: 241, y: 361, width: 14, height: 60, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_22 = {
            id: 'dbarrier_22', x: 311, y: 358, width: 22, height: 58, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_23 = {
            id: 'dbarrier_23', x: 26, y: 283, width: 225, height: 10, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_24 = {
            id: 'dbarrier_24', x: 245, y: 234, width: 8, height: 55, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_25 = {
            id: 'dbarrier_25', x: 346, y: 231, width: 16, height: 55, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_26 = {
            id: 'dbarrier_26', x: 312, y: 281, width: 37, height: 9, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_27 = {
            id: 'dbarrier_27', x: 333, y: 361, width: 168, height: 6, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };
this.classes = [      { class: GameEnvBackground, data: bgData },
      { class: Player, data: playerData },
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
      { class: Barrier, data: dbarrier_27 },
      { class: Npc, data: npcData1 }
];

        /* BUILDER_ONLY_START */
        // Post object summary to builder (debugging visibility of NPCs/walls)
        try {
            setTimeout(() => {
                try {
                    const objs = Array.isArray(gameEnv?.gameObjects) ? gameEnv.gameObjects : [];
                    const summary = objs.map(o => ({ cls: o?.constructor?.name || 'Unknown', id: o?.canvas?.id || '', z: o?.canvas?.style?.zIndex || '' }));
                    if (window && window.parent) window.parent.postMessage({ type: 'rpg:objects', summary }, '*');
                } catch (_) {}
            }, 250);
        } catch (_) {}
        // Report environment metrics (like top offset) to builder
        try {
            if (window && window.parent) {
                try {
                    const rect = (gameEnv && gameEnv.container && gameEnv.container.getBoundingClientRect) ? gameEnv.container.getBoundingClientRect() : { top: gameEnv.top || 0, left: 0 };
                    window.parent.postMessage({ type: 'rpg:env-metrics', top: rect.top, left: rect.left }, '*');
                } catch (_) {
                    try { window.parent.postMessage({ type: 'rpg:env-metrics', top: gameEnv.top, left: 0 }, '*'); } catch (__){ }
                }
            }
        } catch (_) {}
        // Listen for in-game wall visibility toggles from builder
        try {
            window.addEventListener('message', (e) => {
                if (!e || !e.data) return;
                if (e.data.type === 'rpg:toggle-walls') {
                    const show = !!e.data.visible;
                    if (Array.isArray(gameEnv?.gameObjects)) {
                        for (const obj of gameEnv.gameObjects) {
                            if (obj instanceof Barrier) {
                                obj.visible = show;
                            }
                        }
                    }
                } else if (e.data.type === 'rpg:set-drawn-barriers') {
                    const arr = Array.isArray(e.data.barriers) ? e.data.barriers : [];
                    // Track overlay barriers locally so we can remove/replace
                    window.__overlayBarriers = window.__overlayBarriers || [];
                    // Remove previous overlay barriers
                    try {
                        for (const ob of window.__overlayBarriers) {
                            if (ob && typeof ob.destroy === 'function') ob.destroy();
                        }
                    } catch (_) {}
                    window.__overlayBarriers = [];
                    // Add new overlay barriers
                    for (const bd of arr) {
                        try {
                            const data = {
                                id: bd.id,
                                x: bd.x,
                                y: bd.y,
                                width: bd.width,
                                height: bd.height,
                                visible: !!bd.visible,
                                hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
                                fromOverlay: true
                            };
                            const bobj = new Barrier(data, gameEnv);
                            gameEnv.gameObjects.push(bobj);
                            window.__overlayBarriers.push(bobj);
                        } catch (_) {}
                    }
                }
            });
        } catch (_) {}
        /* BUILDER_ONLY_END */
    }
}

export default GameLevelMaze;;