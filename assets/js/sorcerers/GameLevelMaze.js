
import GameEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import Barrier from './essentials/Barrier.js';

class GameLevelMaze {
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;

        // Dynamic reference dimensions based on viewer size
        const refWidth = width;
        const refHeight = height;
        
        // Original design dimensions (from background image)
        const designWidth = 1134;
        const designHeight = 772;
        
        // Calculate scale factors
        const scaleX = refWidth / designWidth;
        const scaleY = refHeight / designHeight;

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
            hitbox: { widthPercentage: 0.04 * scaleX, heightPercentage: 0 * scaleY },
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
            hitbox: { widthPercentage: 0.1 * scaleX, heightPercentage: 0.2 * scaleY },
            dialogues: ['Ok you can pass now'],
            interactionCount: 0,
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() { 
                this.interactionCount++;
                if (this.interactionCount === 1) {
                    if (this && typeof this.destroy === 'function') {
                        this.destroy();
                    }
                }
            }
        };
        const dbarrier_1 = {
            id: 'dbarrier_1', x: 0.010575, y: 0.88245, width: 163 * scaleX, height: 7 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_2 = {
            id: 'dbarrier_2', x: 0.297, y: 0.67815, width: 10 * scaleX, height: 60 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_3 = {
            id: 'dbarrier_3', x: 0.312975, y: 0.67815, width: 48 * scaleX, height: 7 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_4 = {
            id: 'dbarrier_4', x: 0.381375, y: 0.688725, width: 7 * scaleX, height: 54 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_5 = {
            id: 'dbarrier_5', x: 0.381375, y: 0.845775, width: 84 * scaleX, height: 8 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_6 = {
            id: 'dbarrier_6', x: 0.5256, y: 0.7038, width: 10 * scaleX, height: 41 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_7 = {
            id: 'dbarrier_7', x: 0.54315, y: 0.7038, width: 80 * scaleX, height: 7 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_8 = {
            id: 'dbarrier_8', x: 0.666225, y: 0.72945, width: 8 * scaleX, height: 34 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_9 = {
            id: 'dbarrier_9', x: 0.61515, y: 0.839025, width: 33 * scaleX, height: 4 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_10 = {
            id: 'dbarrier_10', x: 0.6786, y: 0.707175, width: 59 * scaleX, height: 8 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_11 = {
            id: 'dbarrier_11', x: 0.761175, y: 0.3573, width: 10 * scaleX, height: 98 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_12 = {
            id: 'dbarrier_12', x: 0.309375, y: 0.1386, width: 320 * scaleX, height: 8 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_13 = {
            id: 'dbarrier_13', x: 0.62055, y: 0.153225, width: 6 * scaleX, height: 86 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_14 = {
            id: 'dbarrier_14', x: 0.367425, y: 0.361125, width: 81 * scaleX, height: 9 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_15 = {
            id: 'dbarrier_15', x: 0.369225, y: 0.37935, width: 10 * scaleX, height: 82 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_16 = {
            id: 'dbarrier_16', x: 0.1458, y: 0.156825, width: 92 * scaleX, height: 11 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_17 = {
            id: 'dbarrier_17', x: 0.1917, y: 0.189675, width: 10 * scaleX, height: 129 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_18 = {
            id: 'dbarrier_18', x: 0.1107, y: 0.408375, width: 41 * scaleX, height: 14 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_19 = {
            id: 'dbarrier_19', x: 0.13185, y: 0.0, width: 10 * scaleX, height: 52 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_20 = {
            id: 'dbarrier_20', x: 0.024525, y: 1.3095, width: 233 * scaleX, height: 11 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_21 = {
            id: 'dbarrier_21', x: 0.423675, y: 1.31625, width: 14 * scaleX, height: 60 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_22 = {
            id: 'dbarrier_22', x: 0.54675, y: 1.305675, width: 22 * scaleX, height: 58 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_23 = {
            id: 'dbarrier_23', x: 0.045675, y: 1.032075, width: 225 * scaleX, height: 10 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_24 = {
            id: 'dbarrier_24', x: 0.43065, y: 0.8532, width: 8 * scaleX, height: 55 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_25 = {
            id: 'dbarrier_25', x: 0.608175, y: 0.8424, width: 16 * scaleX, height: 55 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_26 = {
            id: 'dbarrier_26', x: 0.54855, y: 1.024875, width: 37 * scaleX, height: 9 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
            fromOverlay: true
        };

        const dbarrier_27 = {
            id: 'dbarrier_27', x: 0.58545, y: 1.31625, width: 168 * scaleX, height: 6 * scaleY, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0 * scaleX, heightPercentage: 0.0 * scaleY },
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

export default GameLevelMaze;