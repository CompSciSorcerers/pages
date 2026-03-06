
import GameEnvBackground  from '../essentials/GameEnvBackground.js';
import FightingPlayer from './custom/FightingPlayer.js';
import Npc  from '../essentials/essentials/Npc.js';

class GameLevelArchery {
    constructor(gameEnv) {
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;
        const path = gameEnv.path;

        window.archeryGameStarted = false;

        // --- Floor ---
        const image_src_floor = path + "/images/sorcerers/stoneFloor.png";
        const image_data_floor = {
            name: 'floor',
            src: image_src_floor,
            pixels: {height: 341, width: 498}
        };

        // --- Player ---
        const sprite_src_mc = path + "/images/sorcerers/spookMcWalk.png";
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
    

    const sprite_src_villager = path + "/images/sorcerers/villager.png";
    const sprite_greet_villager = "Start the game? Press E";
    const sprite_data_villager = {
        id: 'Villager',
        greeting: sprite_greet_villager,
        src: sprite_src_villager,
        SCALE_FACTOR: 6,
        ANIMATION_RATE: 100,
        pixels: {width: 2029, height: 2025},
        INIT_POSITION: {x: (width * 37 / 80), y: (height / 8)},
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1},
        hitbox: {widthPercentage: 0.1, heightPercentage: 0.2},
        dialogues: [
            "Are you ready to play some archery?"
        ],
        reaction: function() {
            // Don't show any reaction dialogue - this prevents the first alert
            // The interact function will handle all dialogue instead
        },
        interact: function() {
            // Clear any existing dialogue first to prevent duplicates
            if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
                this.dialogueSystem.closeDialogue();
            }
            
            // Create a new dialogue system if needed
            if (!this.dialogueSystem) {
                this.dialogueSystem = new DialogueSystem();
            }
            
            // Show portal dialogue with buttons
            this.dialogueSystem.showDialogue(
                "",
                "Villager",
                this.spriteData.src
            );
            
            // Add buttons directly to the dialogue
            this.dialogueSystem.addButtons([
                {
                    text: "Start",
                    primary: true,
                    action: () => {
                        this.dialogueSystem.closeDialogue();
                        
                        // remove the barrier and stuff here
                    }
                },
                {
                    text: "Nevermind",
                    action: () => {
                        this.dialogueSystem.closeDialogue();
                    }
                }
            ]);
        }
    };
    }
}

export default GameLevelArchery;
