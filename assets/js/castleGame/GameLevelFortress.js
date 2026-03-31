import GameEnvBackground from "../GameEnginev1.1/essentials/GameEnvBackground.js";
import Player from "../GameEnginev1.1/essentials/Player.js";
import Npc from '../GameEnginev1.1/essentials/Npc.js';
import Barrier from '../GameEnginev1.1/essentials/Barrier.js';
import DialogueSystem from './custom/DialogueSystem.js';
import Scythe from './custom/Scythe.js';
import Interceptor from './custom/Interceptor.js';
import showEndScreen from "./custom/EndScreen.js";
import Leaderboard from "../GameEnginev1.1/essentials/Leaderboard.js";

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
    static friendlyName = "Level 4: Fortress";

    /**
     * Constructs the Fortress game level with all game objects and systems
     * @param {Object} gameEnv - The game environment containing width, height, path, and other properties
     */
    constructor(gameEnv) {

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
        this.scytheSpawnTimer = -300;  // Delay the first spawn
        /**
         * Interval for scythe spawning (120 frames = 2 seconds at 60 FPS)
         * @type {number}
         */
        this.scytheSpawnInterval = 120; // Spawn scythe every 2 seconds (60 FPS)

        /**
         * Game timer properties
         * @type {number}
         */
        this.gameTimer = 0; // Tracks elapsed time in frames
        this.startTime = Date.now(); // Start time in milliseconds
        this.timerElement = null; // DOM element for timer display

        /**
         * Scoring system properties
         * @type {Object}
         */
        this.scores = {
            scythesDestroyed: 0,    // Track successful interceptions
            survivalTime: 0,        // Track survival time in seconds
            completionTime: 0       // Track time to complete level
        };
        this.levelCompleted = false; // Track if player reached target

        let width = gameEnv.innerWidth;
        let height = gameEnv.innerHeight;
        let path = gameEnv.path;


        // Pause DOM audio elements - prevents audio conflicts when entering level
        try {
            const audioElements = document.querySelectorAll('audio'); // Selects all <audio> elements
            audioElements.forEach(audio => {
                try { if (!audio.paused) audio.pause(); } catch (e) { }
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
        try { if (typeof window !== 'undefined') window._levelMusic = levelMusic; } catch (e) { }

        /**
         * Background image data for the boss intro chamber
         * Creates atmospheric setting with stretched background image
         */
        const image_src_chamber = path + "/images/castleGame/dungeon.jpg"
        const image_data_chamber = {
            name: 'bossintro',
            greeting: "You hear a faint echo from behind the ebony doors.",
            src: image_src_chamber,
            pixels: { height: 426, width: 240 }, // Original image dimensions
            mode: 'stretch' // Stretch to fit game viewport
        };

        /**
         * Player character sprite data for Spook character
         * Multi-directional sprite sheet with walking animations
         */
        const sprite_src_mc = path + "/images/castleGame/playerSpritesheet.png";
        const MC_SCALE_FACTOR = 7;
        const sprite_data_mc = {
            id: 'Knight',
            greeting: "Hi, I am a Knight.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 500,
            ANIMATION_RATE: 100,
            INIT_POSITION: { x: 0.5 * width, y: 0.8 * height },  // Relative positioning (0-1 scale)
            pixels: { height: 432, width: 234 },
            orientation: { rows: 4, columns: 3 },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
            downLeft: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
            left: { row: 1, start: 0, columns: 3 },
            right: { row: 2, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upLeft: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
            upRight: { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.15 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }, // W, A, S, D
        };

        /**
         * Panicked NPC sprite data - interactive character with dialogue system
         * Single-frame sprite with randomized dialogue messages
         */
        const paniced_npc_src = path + "/images/castleGame/kingSprite.png";
        const PANICED_NPC_SCALE_FACTOR = 4; // Medium-sized NPC
        const sprite_data_panic_npc = {
            id: 'King',
            greeting: "Help!",
            src: paniced_npc_src,
            SCALE_FACTOR: PANICED_NPC_SCALE_FACTOR,
            ANIMATION_RATE: 30, // Slower animation for static sprite
            pixels: { width: 234, height: 432 }, // Large single sprite image
            INIT_POSITION: { x: 0.5625 * width, y: 0.8 * height }, // Right side positioning
            orientation: { rows: 4, columns: 3 }, // Multiple frames for animation
            down: { row: 0, start: 0, columns: 3 }, // Animation state
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

            reaction: function () { }, // No visual reaction to interaction

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
            interact: function () {
                // Clear any existing dialogue first to prevent duplicates
                if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
                    this.dialogueSystem.closeDialogue();
                }

                // Create a new dialogue system if needed - lazy initialization
                if (!this.dialogueSystem) {
                    try {
                        this.dialogueSystem = new DialogueSystem();
                    } catch (error) {
                        console.error('Error creating DialogueSystem:', error);
                        return;
                    }
                }

                // Select random dialogue message - provides variety for repeated interactions
                const whattosay = this.data.dialogues[Math.floor(Math.random() * this.data.dialogues.length)];

                // Display dialogue with NPC sprite - shows entire sprite sheet as background
                try {
                    this.dialogueSystem.showDialogue(
                        whattosay,
                        "Panicked NPC",
                        this.spriteData.src, // Full sprite sheet displayed (legacy behavior),
                        {
                            columns: 3,
                            rows: 4,
                            frameX: 0,
                            frameY: 0,
                            frameWidth: 78,
                            frameHeight: 108
                        }
                    );
                } catch (error) {
                    console.error('Error calling showDialogue:', error);
                }
            }
        };

        const target_npc_src = path + "/images/castleGame/greenKnight.png";
        const TARGET_NPC_SCALE_FACTOR = 4; // Medium-sized NPC
        const sprite_data_target_npc = {
            id: 'Target',
            greeting: "Come to me to end the game!",
            src: target_npc_src,
            SCALE_FACTOR: TARGET_NPC_SCALE_FACTOR,
            ANIMATION_RATE: 30, // Slower animation for static sprite
            pixels: { width: 234, height: 432 }, // Large single sprite image
            INIT_POSITION: { x: Math.random() * width, y: 0.1 * height }, // Right side positioning
            orientation: { rows: 4, columns: 3 }, // Multiple frames for animation
            down: { row: 0, start: 0, columns: 3 }, // Animation state
            hitbox: { widthPercentage: 0.2, heightPercentage: 0.5 }, // Tall narrow hitbox
            dialogues: [],

            reaction: function () {
                // No reaction needed for target NPC
            },

            interact: function () {
                try { 
                    // Mark level as completed before showing end screen
                    if (this.gameEnv && this.gameEnv.currentLevel && this.gameEnv.currentLevel.onLevelCompleted) {
                        this.gameEnv.currentLevel.onLevelCompleted();
                    }
                    showEndScreen(this.gameEnv, '/images/castleGame/castleGameEndScreen.png'); 
                } catch (e) { console.warn('Error showing end screen:', e); }
            }
        };

        /**
         * Invisible barrier object at one-sixth height from top
         * Creates gameplay boundary and collision detection zone
         */
        const barrier_data = {
            id: 'bottom_barrier',
            x: 0, // Spans full width
            y: (height / 6), // Positioned at 1/6 from top
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
            { class: Npc, data: sprite_data_target_npc }, // Target NPC
            { class: Barrier, data: barrier_data } // Collision boundary
        ];

        /**
         * Game object initialization - instantiates all level entities
         * Called by game engine to create playable environment
         * Objects are instantiated in rendering order for proper layering
         */
        // Start spawning scythes - initializes projectile spawning system
        this.startScytheSpawning();

        // Set up Space key event listener for interceptor firing
        this.setupInterceptorControls();

        // Create and position timer display
        this.createTimerDisplay();

        // Initialize scoring system
        this.initializeScoring();

        // Initialize leaderboard
        this.initializeLeaderboard();

        // Initialize score manager for leaderboard integration
        this.gameEnv.initScoreManager().then(() => {
            console.log('Score manager initialized successfully');
            // Show the score display in the leaderboard
            if (this.gameEnv.scoreManager) {
                this.gameEnv.scoreManager.toggleScoreDisplay();
            }
        }).catch(error => {
            console.warn('Failed to initialize score manager:', error);
        });

        // Replace NPC's dialogueSystem with our custom version (after objects are created)
        setTimeout(() => {
            const npcs = this.gameEnv.gameObjects.filter(obj =>
                obj.constructor.name === 'Npc'
            );
            npcs.forEach((npc, index) => {
                if (npc.id === 'King') {
                    npc.dialogueSystem = new DialogueSystem();
                }
            });
        }, 100);
    }

    /**
     * Initialize the scoring system for the level
     * Sets up GameEnv score configuration and stats tracking
     */
    initializeScoring() {
        // Configure score tracking in GameEnv
        this.gameEnv.scoreConfig = {
            counterVar: 'finalScore',           // Primary scoring metric (total score)
            counterLabel: 'Score',              // Display label
            scoreVar: 'finalScore'             // Backend score variable
        };

        // Initialize stats object if it doesn't exist
        if (!this.gameEnv.stats) {
            this.gameEnv.stats = {};
        }

        // Set initial scores
        this.gameEnv.stats.scythesDestroyed = 0;
        this.gameEnv.stats.survivalTime = 0;
        this.gameEnv.stats.finalScore = 0;
        this.gameEnv.stats.gameName = 'FortressGame';
    }

    /**
     * Initialize the leaderboard widget
     * Creates a collapsible leaderboard with game-specific configuration
     */
    initializeLeaderboard() {
        // Create leaderboard instance with game-specific options
        this.leaderboard = new Leaderboard(this.gameEnv.gameControl, {
            gameName: 'FortressGame',
            initiallyHidden: false,  // Show leaderboard by default
            parentId: 'game-container' // Mount inside game container if available
        });
    }

    /**
     * Update scoring when a scythe is destroyed
     * Called by Interceptor objects when they destroy a scythe
     */
    onScytheDestroyed() {
        this.scores.scythesDestroyed++;
        
        // Update all stats to prevent flickering
        this.gameEnv.stats.scythesDestroyed = this.scores.scythesDestroyed;
        this.gameEnv.stats.survivalTime = this.scores.survivalTime;
        this.gameEnv.stats.finalScore = this.calculateCurrentScore();
        
        console.log('Scythe destroyed! New score:', this.gameEnv.stats.finalScore);
    }

    /**
     * Calculate and update the final score
     * Combines all scoring metrics into a single score
     */
    updateFinalScore() {
        const survivalBonus = Math.floor((Date.now() - this.startTime) / 1000); // Seconds survived
        this.scores.survivalTime = survivalBonus;
        
        // Update all stats to prevent flickering
        this.gameEnv.stats.survivalTime = survivalBonus;
        this.gameEnv.stats.scythesDestroyed = this.scores.scythesDestroyed;
        this.gameEnv.stats.finalScore = this.calculateCurrentScore();
    }

    /**
     * Update only the survival time component of the score
     * Called periodically to update survival time without recalculating everything
     */
    updateSurvivalTime() {
        const survivalBonus = Math.floor((Date.now() - this.startTime) / 1000);
        this.scores.survivalTime = survivalBonus;
        
        // Update stats with all current values to prevent flickering
        this.gameEnv.stats.survivalTime = survivalBonus;
        this.gameEnv.stats.scythesDestroyed = this.scores.scythesDestroyed;
        this.gameEnv.stats.finalScore = this.calculateCurrentScore();
        
        // Let the score manager's auto-sync handle the display update
        // Don't manually call updateScoreDisplay to avoid conflicts
    }

    /**
     * Calculate the current score without updating stats
     * Used for display purposes
     */
    calculateCurrentScore() {
        const survivalBonus = this.scores.survivalTime;
        const destructionScore = this.scores.scythesDestroyed * 100;
        const completionBonus = this.levelCompleted ? 500 : 0;
        return destructionScore + survivalBonus + completionBonus;
    }

    /**
     * Mark level as completed and calculate final score
     * Called when player reaches the target NPC
     */
    onLevelCompleted() {
        if (!this.levelCompleted) {
            this.levelCompleted = true;
            this.scores.completionTime = Math.floor((Date.now() - this.startTime) / 1000);
            this.updateFinalScore();
            
            console.log('Level completed! Final scores:', this.scores);
        }
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
        // Increment game timer - tracks elapsed frames
        this.gameTimer++;

        // Update timer display
        this.updateTimerDisplay();

        // Update survival time score every 60 frames (1 second)
        if (this.gameTimer % 60 === 0) {
            this.updateSurvivalTime();
        }

        // Increment spawn timer - tracks elapsed frames since last scythe
        this.scytheSpawnTimer++;

        // Check spawn condition - compares timer against configured interval
        const MAX_SCYTHES = 10;
        if (this.scytheSpawnTimer >= this.scytheSpawnInterval) {
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
     * - Prepares timer-based spawning for continuous threat generation
     * - Actual spawning occurs in update() method based on timing
     */
    startScytheSpawning() {
        // System is ready - spawning will occur in update() method
    }

    /**
     * Sets up interceptor controls - Space key event listener for firing interceptors
     * Handles player input for defensive interceptor projectiles
     */
    setupInterceptorControls() {
        // Bind the fireInterceptor method to maintain context
        this.boundFireInterceptor = this.fireInterceptor.bind(this);
        this.boundFireInterceptorTouch = this.fireInterceptorTouch.bind(this);

        // Add keyboard event listener
        document.addEventListener('keydown', this.boundFireInterceptor);

        // Add touch event listener for mobile devices
        document.addEventListener('touchstart', this.boundFireInterceptorTouch, { passive: false });
        document.addEventListener('click', this.boundFireInterceptorTouch); // Also handle mouse clicks for consistency
    }

    /**
     * Fires an interceptor from the player's position upward
     * Triggered when player presses the Space key or I key
     * 
     * @param {KeyboardEvent} event - The keyboard event object
     */
    fireInterceptor(event) {
        // Check if Space key (keyCode 32) or I key (keyCode 73) was pressed
        if ((event.code === 'Space' || event.keyCode === 32) ||
            (event.code === 'KeyI' || event.keyCode === 73)) {
            event.preventDefault(); // Prevent default key behavior

            // Find the player object
            const players = this.gameEnv.gameObjects.filter(obj =>
                obj.constructor.name === 'Player'
            );

            if (players.length === 0) {
                console.warn('No player found for interceptor firing');
                return;
            }

            const player = players[0];

            // Calculate spawn position (center of player, slightly above)
            const spawnX = player.position.x + player.width / 2 - 20; // Center interceptor on player
            const spawnY = player.position.y - 20; // Spawn slightly above player

            // Create new interceptor
            const interceptor = new Interceptor(this.gameEnv, spawnX, spawnY);

            // Add to game objects and container
            this.gameEnv.gameObjects.push(interceptor);
            this.gameEnv.container.appendChild(interceptor.canvas);
        }
    }

    /**
     * Fires an interceptor from touch or click events
     * Triggered when player taps screen on mobile devices or clicks with mouse
     * 
     * @param {TouchEvent|MouseEvent} event - The touch or mouse event object
     */
    fireInterceptorTouch(event) {
        event.preventDefault(); // Prevent default touch/click behavior

        // Find the player object
        const players = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Player'
        );

        if (players.length === 0) {
            console.warn('No player found for interceptor firing');
            return;
        }

        const player = players[0];

        // Calculate spawn position (center of player, slightly above)
        const spawnX = player.position.x + player.width / 2 - 20; // Center interceptor on player
        const spawnY = player.position.y - 20; // Spawn slightly above player

        // Create new interceptor
        const interceptor = new Interceptor(this.gameEnv, spawnX, spawnY);

        // Add to game objects and container
        this.gameEnv.gameObjects.push(interceptor);
        this.gameEnv.container.appendChild(interceptor.canvas);
    }

    /**
     * Scythe projectile spawning - creates new scythe objects in game world
     * Dynamically adds threats to increase gameplay difficulty
     * 
     * Object Creation Process:
     * 1. Instantiates new Scythe object with current game environment
     * 2. Adds scythe to active game objects array for update/render cycle
     * 3. Appends scythe canvas to DOM container for visual rendering
     * 
     * Property Updates During Execution:
     * - gameEnv.gameObjects array grows with each new scythe
     * - DOM container gains new canvas elements
     * - Scythe objects receive game environment reference for positioning
     * 
     * @returns {void} - Modifies game state by adding new projectile
     */
    spawnScythe() {
        const scythe = new Scythe(this.gameEnv); // Create with environment context

        // Add to active game objects - enables update/render cycle participation
        this.gameEnv.gameObjects.push(scythe);

        // Add to visual container - enables rendering in game viewport
        this.gameEnv.container.appendChild(scythe.canvas);
    }

    /**
     * Creates the timer display element positioned at top-left of game
     * Styles the timer with appropriate positioning and formatting
     */
    createTimerDisplay() {
        // Create timer element
        this.timerElement = document.createElement('div');
        this.timerElement.id = 'game-timer';
        this.timerElement.style.position = 'fixed';
        this.timerElement.style.top = '60px';
        this.timerElement.style.left = '20px';
        this.timerElement.style.color = '#ffffff';
        this.timerElement.style.fontSize = '24px';
        this.timerElement.style.fontWeight = 'bold';
        this.timerElement.style.fontFamily = 'Arial, sans-serif';
        this.timerElement.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        this.timerElement.style.zIndex = '10000';
        this.timerElement.style.pointerEvents = 'none';
        this.timerElement.style.userSelect = 'none';
        this.timerElement.style.backgroundColor = 'rgba(0,0,0,0.5)';
        this.timerElement.style.padding = '5px 10px';
        this.timerElement.style.borderRadius = '5px';

        // Add to document body for better visibility
        document.body.appendChild(this.timerElement);

        // Initial timer display
        this.updateTimerDisplay();
    }

    /**
     * Updates the timer display with current elapsed time
     * Formats time as MM:SS (minutes:seconds)
     */
    updateTimerDisplay() {
        if (!this.timerElement) return;

        // Calculate elapsed time in seconds
        const elapsedMs = Date.now() - this.startTime;
        const elapsedSeconds = Math.floor(elapsedMs / 1000);

        // Format as MM:SS
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Update display
        this.timerElement.textContent = `Time: ${timeString}`;
    }

    /**
     * Cleanup method - removes event listeners and performs cleanup
     * Called when level is destroyed or transitioned away from
     */
    cleanup() {
        // Remove keyboard event listener
        if (this.boundFireInterceptor) {
            document.removeEventListener('keydown', this.boundFireInterceptor);
        }

        // Remove touch and click event listeners
        if (this.boundFireInterceptorTouch) {
            document.removeEventListener('touchstart', this.boundFireInterceptorTouch);
            document.removeEventListener('click', this.boundFireInterceptorTouch);
        }

        // Remove timer display element
        if (this.timerElement && this.timerElement.parentNode) {
            this.timerElement.parentNode.removeChild(this.timerElement);
        }

        // Clean up leaderboard
        if (this.leaderboard) {
            this.leaderboard.destroy();
        }

        // Clean up score manager
        if (this.gameEnv.scoreManager) {
            this.gameEnv.scoreManager.destroy();
        }
    }
}

export default GameLevelFortress;
