
import GameEnvBackground  from '../GameEnginev1/essentials/GameEnvBackground.js';
import Player from '../GameEnginev1/essentials/Player.js';
import Npc  from '../GameEnginev1/essentials/Npc.js';
import Barrier from '../GameEnginev1/essentials/Barrier.js';
import Enemy from '../GameEnginev1/essentials/Enemy.js';
import GameLevelArchery from './GameLevelArchery.js';

/**
 * GameLevelArchery
 * 
 * Defines the configuration for the Archery mini-game level.
 * This class constructs the objects that will exist in the level,
 * including the background, player, NPC, barrier, and moving target.
 * 
 * Each object is described with a configuration object that determines
 * sprite properties, positioning, animations, and gameplay behavior.
 */
class GameLevelOutside {

    /**
     * Creates a new Archery level configuration.
     *
     * @param {GameEnvironment} gameEnv - The main game env object
     */
    constructor(gameEnv) {
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;
        const path = gameEnv.path;

        // --- Floor ---
        const image_src_floor = path + "/images/castleGame/castleOutside.png";
        const image_data_floor = {
            name: 'floor',
            src: image_src_floor,
            pixels: {height: 755, width: 1206}
        };

        /**
         * Player character sprite configuration.
         *
         * Represents the main controllable character (knight)
         * The player can move around the map and interact with NPCs. It can also shoot arrows.
         */
        const sprite_src_mc = path + "/images/castleGame/playerSpritesheet.png";
        const MC_SCALE_FACTOR = 15;
        const sprite_data_mc = {
            id: 'Knight',
            greeting: "Hi, I am a Knight.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 1500,
            ANIMATION_RATE: 40,
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
    

        /**
         * DarkKnight NPC configuration:
         *
         * Acts as the  trigger to start the archery mini-game.
         * When the player interacts (presses E), a dialogue appears allowing the player to start or cancel the game.
         */
        const sprite_src_darkKnight = path + "/images/castleGame/darkKnight.png";
        const sprite_greet_darkKnight = "Start the game? Press E";
        const sprite_data_darkKnight = {
            id: 'DarkKnight',
            greeting: sprite_greet_darkKnight,
            src: sprite_src_darkKnight,
            SCALE_FACTOR: 12,
            ANIMATION_RATE: 40,
            pixels: {width: 242, height: 432},
            INIT_POSITION: {x: 0.49 * width, y: 0.33 * height},
            orientation: {rows: 4, columns: 3},
            down: {row: 0, start: 0, columns: 3},
            left: {row: 1, start: 0, columns: 3},
            right: {row: 2, start: 0, columns: 3},
            up: {row: 3, start: 0, columns: 3},
            hitbox: {widthPercentage: 0.1, heightPercentage: 0.2},
            dialogues: [
                "Are you ready to play some archery?"
            ],
            reaction: function() {
                // Don't show any reaction dialogue - this prevents the first alert
                // The interact function will handle all dialogue instead
            },
            
            // This is where the interactions for starting the game are handled
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
                    "Are you to enter the castle?",
                    "DarkKnight",
                    this.spriteData.src
                );
                
                // Add buttons directly to the dialogue
                this.dialogueSystem.addButtons([
                    {
                        text: "Start",
                        primary: true,
                        action: () => {
                            this.dialogueSystem.closeDialogue();
                            
                            this.dialogueSystem.closeDialogue();
                            
                            // Clean up the current game state
                            if (gameEnv && gameEnv.gameControl) {
                                // Store reference to the current game control
                                const gameControl = gameEnv.gameControl;
                                
                                // Create fade overlay for transition
                                const fadeOverlay = document.createElement('div');
                                const fadeInMs = 2000; // longer fade in
                                const fadeOutMs = 1200; // fade out duration
                                // Reset the battle room fade flag
                                window.__startFadeComplete = false;
                                Object.assign(fadeOverlay.style, {
                                    position: 'fixed',
                                    top: '0',
                                    left: '0',
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: '#000',
                                    opacity: '0',
                                    transition: `opacity ${fadeInMs}ms ease-in-out`,
                                    zIndex: '9999'
                                });
                                document.body.appendChild(fadeOverlay);

                               
                                console.log("Starting battle level transition...");

                                // Fade in
                                requestAnimationFrame(() => {
                                    fadeOverlay.style.opacity = '1';

                                    // Mark that the battle-room fade-complete flag is not yet set.
                                    // This flag will be set to true once the overlay is fully removed
                                    // so enemies in the battle room can wait for the screen to finish
                                    // fading before they begin moving/attacking.
                                    try { window.__startFadeComplete = false; } catch(e) {}

                                    // Create a centered transition text that will type itself
                                    const transitionText = document.createElement('div');
                                    const fullText = 'oogity boogity aufhUYAGFKASULHJDFkjdf??';
                                    transitionText.textContent = '';
                                    const typingSpeed = 50; // ms per char -- CHANGE TO 80 WHEN FINISHED THE SLOW SPEED IS FOR DEVELOPMENT
                                    Object.assign(transitionText.style, {
                                        position: 'fixed',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        color: 'rgb(136, 0, 255)',
                                        fontSize: '6vw',
                                        fontWeight: '800',
                                        textAlign: 'center',
                                        zIndex: '10000',
                                        pointerEvents: 'none',
                                        opacity: '0',
                                        transition: `opacity ${Math.min(600, fadeOutMs)}ms ease-in-out`,
                                        textShadow: '0 3px 8px rgba(181, 0, 0, 0.85)',
                                        letterSpacing: '0.05em'
                                    });

                                    document.body.appendChild(transitionText);

                                    // Fade the text in so characters appear as they type
                                    requestAnimationFrame(() => {
                                        transitionText.style.opacity = '1';
                                    });

                                    // Typewriter effect
                                    let charIndex = 0;
                                    let typingInterval = null;
                                    const startTyping = () => {
                                        typingInterval = setInterval(() => {
                                            transitionText.textContent += fullText.charAt(charIndex);
                                            charIndex++;
                                            if (charIndex >= fullText.length) {
                                                clearInterval(typingInterval);
                                                typingInterval = null;
                                            }
                                        }, typingSpeed);
                                    };

                                    startTyping();

                                    // Compute when to perform the level transition: wait until both fadeIn and typing complete
                                    const typingDuration = fullText.length * typingSpeed;
                                    const waitMs = Math.max(fadeInMs, typingDuration) + 200; // small hold after -- CHANGE TO 800 WHEN FINISHED THE SLOW SPEED IS FOR DEVELOPMENT

                                    setTimeout(() => {
                                        // Clean up current level properly
                                        if (gameControl.currentLevel) {
                                            // Properly destroy the current level
                                            console.log("Destroying current level...");
                                            gameControl.currentLevel.destroy();
                                            
                                            // Force cleanup of any remaining canvases
                                            const gameContainer = document.getElementById('gameContainer');
                                            const oldCanvases = gameContainer.querySelectorAll('canvas:not(#gameCanvas)');
                                            oldCanvases.forEach(canvas => {
                                                console.log("Removing old canvas:", canvas.id);
                                                canvas.parentNode.removeChild(canvas);
                                            });
                                        }
                                        
                                        console.log("Setting up battle room level...");
                                        
                                        // IMPORTANT: Store the original level classes for return journey
                                        gameControl._originalLevelClasses = gameControl.levelClasses;
                                        
                                        // Change the level classes to GameLevelEnd
                                        gameControl.levelClasses = [GameLevelArchery];
                                        gameControl.currentLevelIndex = 0;
                                        
                                        // Make sure game is not paused
                                        gameControl.isPaused = false;
                                    
                                        
                                        // Fade out overlay after transition (with untype animation)
                                        setTimeout(() => {
                                            const untypeSpeed = 50; // ms per character removal
                                            let untypeIndex = fullText.length - 1;

                                            const untypeInterval = setInterval(() => {
                                                if (untypeIndex >= 0) {
                                                    transitionText.textContent = fullText.substring(0, untypeIndex);
                                                    untypeIndex--;
                                                } else {
                                                    clearInterval(untypeInterval);

                                                    // Once untyped, fade everything out
                                                    fadeOverlay.style.transition = `opacity ${fadeOutMs}ms ease-in-out`;
                                                    transitionText.style.transition = `opacity ${fadeOutMs}ms ease-in-out`;
                                                    fadeOverlay.style.opacity = '0';
                                                    transitionText.style.opacity = '0';

                                                    // Remove both elements after fade-out completes
                                                    setTimeout(() => {
                                                        try { document.body.removeChild(fadeOverlay); } catch (e) {}
                                                        try { document.body.removeChild(transitionText); } catch (e) {}
                                                        // Now the archery level visuals have finished fading in for the player.
                                                        // Signal to in-level enemies that it's OK to start moving.
                                                        try { window.__startFadeComplete = true; } catch (e) {}
                                                    }, fadeOutMs + 150);
                                                }
                                            }, untypeSpeed);
                                        }, waitMs + 300);

                                        // Start the boss fight with the same control
                                        console.log("Transitioning to archery level...");
                                        gameControl.transitionToLevel();


                                    }, waitMs);
                                });
                            }
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


        this.classes = [
            {class: GameEnvBackground, data: image_data_floor},
            {class: Player, data: sprite_data_mc},
            {class: Npc, data: sprite_data_darkKnight},
        ];
    }
}

export default GameLevelOutside;
