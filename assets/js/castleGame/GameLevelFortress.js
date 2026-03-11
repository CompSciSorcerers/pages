import GameEnvBackground  from "./essentials/GameEnvBackground.js";
import Player from "./essentials/Player.js";
import Npc from './essentials/Npc.js';
import Barrier from './essentials/Barrier.js';
import DialogueSystem from './essentials/DialogueSystem.js';
import Scythe from './custom/Scythe.js';

/**
 * Represents the Fortress game level with all game objects and systems
 * @class GameLevelFortress
 */
class GameLevelFortress {
   /**
    * Friendly name of the game level
    * @static
    * @type {string}
    */
   static friendlyName = "Level 3: Fortress";

    /**
     * Constructs the Fortress game level with all game objects and systems
     * @param {Object} gameEnv - The game environment containing width, height, path, and other properties
     */
    constructor(gameEnv){

        // keep reference to gameEnv for lifecycle methods
        /**
         * Reference to the game environment
         * @type {Object}
         */
        this.gameEnv = gameEnv;
        /**
         * Timer for scythe spawning - increments each frame
         * @type {number}
         */
        this.scytheSpawnTimer = 0;
        /**
         * Interval for scythe spawning (120 frames = 2 seconds at 60 FPS)
         * @type {number}
         */
        this.scytheSpawnInterval = 120; // Spawn scythe every 2 seconds (60 FPS)

        let width = gameEnv.innerWidth;
        let height = gameEnv.innerHeight;
        let path = gameEnv.path;


        // Pause DOM audio elements - prevents audio conflicts when entering level
        try {
            const audioElements = document.querySelectorAll('audio'); // Selects all <audio> elements
            audioElements.forEach(audio => {
                try { if (!audio.paused) audio.pause(); } catch (e) {}
            });
        } catch (e) { /* ignore */ }

        /**
         * Level music initialization - random theme selection and playback
         * Chooses between Mario Castle and Zelda themes for variety
         * Music loops continuously and is exposed globally for other modules to control
         */
        // Level music: play Legend of Zelda theme when entering this level
        // update: now changed to mario castle theme
        // Will be stopped when transitioning to the battle room below
        let randomSong = ["marioCastle.mp3", "legendZelda.mp3"][Math.floor(Math.random() * 2)];
        const levelMusic = new Audio(path + `/assets/sounds/mansionGame/${randomSong}`);
        levelMusic.loop = true; // Continuous playback
        levelMusic.volume = 0.3; // Moderate volume level
        levelMusic.play().catch(err => console.warn('Level music failed to play:', err));
        // Expose the level music so other modules (end screen, etc.) can stop it
        try { if (typeof window !== 'undefined') window._levelMusic = levelMusic; } catch (e) {}

        /**
         * Background image data for the boss intro chamber
         * Creates atmospheric setting with stretched background image
         */
        const image_src_chamber = path + "/images/mansionGame/bgBossIntroChamber.png"
        const image_data_chamber = {
            name: 'bossintro',
            greeting: "You hear a faint echo from behind the ebony doors.",
            src: image_src_chamber,
            pixels: {height: 580, width: 1038}, // Original image dimensions
            mode: 'stretch' // Stretch to fit game viewport
        };

        /**
         * Player character sprite data for Spook character
         * Multi-directional sprite sheet with walking animations
         */
        const sprite_src_mc = path + "/images/mansionGame/spookMcWalk.png";
        const MC_SCALE_FACTOR = 6; // Large character for visibility
        const sprite_data_mc = {
            id: 'Spook',
            greeting: "Hi, I am Spook.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 300, // Movement speed multiplier
            ANIMATION_RATE: 10, // Frames between animation updates
            INIT_POSITION: { x: 0.5, y: 0.8 }, // Center-bottom spawn
            pixels: { height: 2400, width: 3600 }, // Large sprite sheet (2 rows x 3 columns)
            orientation: { rows: 2, columns: 3 }, // 6 total frames
            // Directional animation mappings
            down: { row: 1, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI/16 },
            left: { row: 0, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 1, start: 0, columns: 3 },
            upLeft: { row: 0, start: 0, columns: 3, rotate: Math.PI/16 },
            upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI/16 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 }, // Narrow hitbox for precise collision
            keypress: { up: 87, left: 65, down: 83, right: 68 } // WASD controls
        };

        /**
         * Panicked NPC sprite data - interactive character with dialogue system
         * Single-frame sprite with randomized dialogue messages
         */
        const paniced_npc_src = path + "/images/sorcerers/snowman.png";
        const PANICED_NPC_SCALE_FACTOR = 4; // Medium-sized NPC
        const sprite_data_panic_npc = {
            id: 'Panicked NPC',
            greeting: "Help!",
            src: paniced_npc_src,
            SCALE_FACTOR: PANICED_NPC_SCALE_FACTOR,
            ANIMATION_RATE: 30, // Slower animation for static sprite
            pixels: { width: 840, height: 1221 }, // Large single sprite image
            INIT_POSITION: { x: 0.5625, y: 0.8 }, // Right side positioning
            orientation: { rows: 1, columns: 1 }, // Single frame sprite
            down: { row: 0, start: 0, columns: 1 }, // Only one animation state
            hitbox: { widthPercentage: 0.2, heightPercentage: 0.5 }, // Tall narrow hitbox
            /**
             * Randomized dialogue messages for NPC interaction
             * Provides story context and hints about game mechanics
             */
            dialogues: [
                "I'm so scared! The scythes have been comming for me!",
                "Rumor has it that missiles with scythes!",
                "I don't want to face the scythes and missiles!",
                "Flee for yourself! I'll be hit before you can save me!",
                "Try dodging the scythes and missiles! It's your only hope!",
                "I'm trapped! Please help me!"
            ],

            reaction: function() {}, // No visual reaction to interaction

            /**
             * NPC interaction handler - triggered when player collides with NPC
             * Part of game loop collision detection and response system
             * 
             * Interaction Flow:
             * 1. Checks for existing dialogue to prevent duplicates
             * 2. Creates dialogue system if not already instantiated
             * 3. Selects random dialogue message from available options
             * 4. Displays dialogue with NPC sprite as background
             * 
             * Object Property Updates:
             * - this.dialogueSystem: Created or reused for interaction
             * - Dialogue box appears in DOM with NPC sprite background
             * - Random message selection changes displayed content
             * 
             * @returns {void} - Creates UI elements for player interaction
             */
            interact: function() {
                // Clear any existing dialogue first to prevent duplicates
                if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
                    this.dialogueSystem.closeDialogue();
                }

                // Create a new dialogue system if needed - lazy initialization
                if (!this.dialogueSystem) {
                    this.dialogueSystem = new DialogueSystem();
                }

                // Select random dialogue message - provides variety for repeated interactions
                const whattosay = this.data.dialogues[Math.floor(Math.random() * this.data.dialogues.length)];

                // Display dialogue with NPC sprite - shows entire sprite sheet as background
                this.dialogueSystem.showDialogue(
                    whattosay,
                    "Panicked NPC",
                    this.spriteData.src // Full sprite sheet displayed (legacy behavior)
                );
            }
        };

        /**
         * Invisible barrier object at one-third height from bottom
         * Creates gameplay boundary and collision detection zone
         */
        const barrier_data = {
            id: 'bottom_barrier',
            x: 0, // Spans full width
            y: height - (height / 3), // Positioned at 1/3 from bottom
            width: width, // Full viewport width
            height: 20, // Thin barrier
            color: 'rgba(139, 69, 19, 0.8)', // Semi-transparent brown
            visible: false, // Invisible during gameplay
            zIndex: 10 // Above other objects for collision priority
        };

        /**
         * Array of game objects to be instantiated by the game engine
         * Defines rendering order: background -> player -> NPC -> barrier
         */
        this.classes = [
            { class: GameEnvBackground, data: image_data_chamber }, // Atmospheric background
            { class: Player, data: sprite_data_mc }, // Playable character
            { class: Npc, data: sprite_data_panic_npc }, // Interactive NPC
            { class: Barrier, data: barrier_data } // Collision boundary
        ];

        /**
         * Game object initialization - instantiates all level entities
         * Called by game engine to create playable environment
         * Objects are instantiated in rendering order for proper layering
         */
        // Start spawning scythes - initializes projectile spawning system
        this.startScytheSpawning();

        // Log initialization completion for debugging
        console.log("GameLevelFortress initialized");
    }

    /**
     * Game loop update method - called every frame by the game engine
     * Handles real-time game state updates and timing-based events
     * 
     * Execution Flow:
     * 1. Increments scythe spawn timer each frame
     * 2. Checks if spawn interval has been reached
     * 3. Triggers scythe spawning when conditions are met
     * 4. Resets timer for next spawn cycle
     * 
     * @returns {void} - No return value, modifies game state directly
     */
    update() {
        // Increment spawn timer - tracks elapsed frames since last scythe
        this.scytheSpawnTimer++;

        // Check spawn condition - compares timer against configured interval
        const MAX_SCYTHES = 10;
        if (this.scytheSpawnTimer >= this.scytheSpawnInterval) {
            console.log("Scythe spawn timer reached, spawning scythe(s)...");
            const numScythes = Math.floor(Math.random() * MAX_SCYTHES) + 1;
            for (let i = 0; i < numScythes; i++) {
                this.spawnScythe(); // Execute spawn logic
            }
            this.scytheSpawnTimer = 0; // Reset timer for next cycle
        }
    }

    /**
     * Scythe spawning system initialization - sets up projectile generation
     * Called once during level construction to prepare spawning mechanics
     * 
     * System Behavior:
     * - Logs initialization for debugging purposes
     * - Prepares timer-based spawning for continuous threat generation
     * - Actual spawning occurs in update() method based on timing
     */
    startScytheSpawning() {
        console.log("Scythe spawning system initialized - will spawn in update method");
    }

    /**
     * Scythe projectile spawning - creates new scythe objects in game world
     * Dynamically adds threats to increase gameplay difficulty
     * 
     * Object Creation Process:
     * 1. Instantiates new Scythe object with current game environment
     * 2. Adds scythe to active game objects array for update/render cycle
     * 3. Appends scythe canvas to DOM container for visual rendering
     * 4. Logs creation for debugging and monitoring
     * 
     * Property Updates During Execution:
     * - gameEnv.gameObjects array grows with each new scythe
     * - DOM container gains new canvas elements
     * - Scythe objects receive game environment reference for positioning
     * 
     * @returns {void} - Modifies game state by adding new projectile
     */
    spawnScythe() {
        console.log("Attempting to spawn scythe...");
        const scythe = new Scythe(this.gameEnv); // Create with environment context
        console.log("Scythe created:", scythe);

        // Add to active game objects - enables update/render cycle participation
        this.gameEnv.gameObjects.push(scythe);
        console.log("Scythe added to gameObjects. Total objects:", this.gameEnv.gameObjects.length);

        // Add to visual container - enables rendering in game viewport
        this.gameEnv.container.appendChild(scythe.canvas);
        console.log("Scythe canvas added to container");
    }
}

export default GameLevelFortress;
