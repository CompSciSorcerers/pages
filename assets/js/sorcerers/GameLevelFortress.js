import GameEnvBackground  from "./essentials/GameEnvBackground.js";
import Player from "./essentials/Player.js";
import Npc from './essentials/Npc.js';
import Barrier from './essentials/Barrier.js';
import DialogueSystem from './essentials/DialogueSystem.js';
import Scythe from './custom/Scythe.js';

class GameLevelFortress {
   static friendlyName = "Level 6: Fortress";
   
   constructor(gameEnv){

        // keep reference to gameEnv for lifecycle methods
        this.gameEnv = gameEnv;
        this.scytheSpawnTimer = 0;
        this.scytheSpawnInterval = 120; // Spawn scythe every 2 seconds (60 FPS)

        let width = gameEnv.innerWidth;
        let height = gameEnv.innerHeight;
        let path = gameEnv.path;


        // Pause DOM audio elements
        try {
            const audioElements = document.querySelectorAll('audio'); // Selects all <audio> elements
            audioElements.forEach(audio => {
                try { if (!audio.paused) audio.pause(); } catch (e) {}
            });
        } catch (e) { /* ignore */ }

        // Level music: play Legend of Zelda theme when entering this level
        // update: now changed to mario castle theme
        // Will be stopped when transitioning to the battle room below
        let randomSong = ["marioCastle.mp3", "legendZelda.mp3"][Math.floor(Math.random() * 2)];
        const levelMusic = new Audio(path + `/assets/sounds/mansionGame/${randomSong}`);
        levelMusic.loop = true;
        levelMusic.volume = 0.3;
        levelMusic.play().catch(err => console.warn('Level music failed to play:', err));
        // Expose the level music so other modules (end screen, etc.) can stop it
        try { if (typeof window !== 'undefined') window._levelMusic = levelMusic; } catch (e) {}

        // This is the background image data
        const image_src_chamber = path + "/images/mansionGame/bgBossIntroChamber.png"
        const image_data_chamber = {
            name: 'bossintro',
            greeting: "You hear a faint echo from behind the ebony doors.",
            src: image_src_chamber,
            pixels: {height: 580, width: 1038},
            mode: 'stretch'
        };

        // This is the data for the player
        const sprite_src_mc = path + "/images/mansionGame/spookMcWalk.png"; // be sure to include the path
        const MC_SCALE_FACTOR = 6;
        const sprite_data_mc = {
            id: 'Spook',
            greeting: "Hi, I am Spook.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 300,
            ANIMATION_RATE: 10,
            INIT_POSITION: { x: (width / 2 - width / (5 * MC_SCALE_FACTOR)), y: height - (height / MC_SCALE_FACTOR)}, 
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
            keypress: {up: 87, left: 65, down: 83, right: 68} // W, A, S, D
        };

        // This is the panicked npc
        const paniced_npc_src = path + "/images/mansionGame/zombieNpc.png";
        const PANICED_NPC_SCALE_FACTOR = 4;
        const sprite_data_panic_npc = {
            id: 'Panicked NPC',
            greeting: "Help!",
            src: paniced_npc_src,
            SCALE_FACTOR: PANICED_NPC_SCALE_FACTOR,
            ANIMATION_RATE: 30,
            pixels: {width: 3600, height: 1200},
            INIT_POSITION: {x: (width * 9 / 16), y: height - (height / PANICED_NPC_SCALE_FACTOR)},
            orientation: {rows: 1, columns: 3 },
            down: {row: 0, start: 0, columns: 3 },
            hitbox: {widthPercentage: 0.2, heightPercentage: 0.5},
            // Add dialogues array for random messages
            dialogues: [
                "I'm so scared! The scythes have been comming for me!",
                "Rumor has it that missiles with scythes!",
                "I don't want to face the scythes and missiles!",
                "Flee for yourself! I'll be hit before you can save me!",
                "Try dodging the scythes and missiles! It's your only hope!",
                "I'm trapped! Please help me!"
            ],

            // This is the reaction when the npc is interacted with -- empty for no reaction
            reaction: function() {},

            // This is the interaction function
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
                const whattosay = this.data.dialogues[Math.floor(Math.random() * this.data.dialogues.length)];
                this.dialogueSystem.showDialogue(
                    whattosay,
                    "Panicked NPC",
                    this.spriteData.src
                );
            }
        };

        // Barrier at one-third height from bottom
        const barrier_data = {
            id: 'bottom_barrier',
            x: 0,
            y: height - (height / 3),
            width: width,
            height: 20,
            color: 'rgba(139, 69, 19, 0.8)',
            visible: false,
            zIndex: 10
        };

        // This is every sprite we want the game engine to render, and with whatever data
        this.classes = [
            {class: GameEnvBackground, data: image_data_chamber},
            {class: Player, data: sprite_data_mc},
            {class: Npc, data: sprite_data_panic_npc},
            {class: Barrier, data: barrier_data}
        ];

        // Start spawning scythes
        this.startScytheSpawning();

        // Log
        console.log("GameLevelFortress initialized");
    }

    update() {
        // Spawn scythes at intervals
        this.scytheSpawnTimer++;
        if (this.scytheSpawnTimer >= this.scytheSpawnInterval) {
            console.log("Scythe spawn timer reached, spawning scythe...");
            this.spawnScythe();
            this.scytheSpawnTimer = 0;
        }
    }

    startScytheSpawning() {
        console.log("Scythe spawning system initialized - will spawn in update method");
    }

    spawnScythe() {
        console.log("Attempting to spawn scythe...");
        const scythe = new Scythe(this.gameEnv);
        console.log("Scythe created:", scythe);
        this.gameEnv.gameObjects.push(scythe);
        console.log("Scythe added to gameObjects. Total objects:", this.gameEnv.gameObjects.length);
        this.gameEnv.container.appendChild(scythe.canvas);
        console.log("Scythe canvas added to container");
    }
}

export default GameLevelFortress;
