import GameEnvBackground  from "./MansionLogic/GameEnvBackground.js";
import Player from "./MansionLogic/Player.js";
import Npc from './MansionLogic/Npc.js';

class GameLevelFortress {
   constructor(gameEnv){

        // upon mansion level6 construction, 

        // keep reference to gameEnv for lifecycle methods
        this.gameEnv = gameEnv;

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
        let randomSong = ["marioCastle.mp3", "legendZelda.mp3"][Math.floor(Math.random()*2)]
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

        // This is the zombie npc
        const sprite_src_zombie = path + "/images/mansionGame/zombieNpc.png";
        const sprite_greet_zombie = "Hi, I'm a zombie.";
        const sprite_data_zombie1 = {
            id: 'ZombieNPC1',
            greeting: sprite_greet_zombie,
            src: sprite_src_zombie,
            SCALE_FACTOR: 4,
            ANIMATION_RATE: 30,
            pixels: {width: 3600, height: 1200},
            INIT_POSITION: {x: (width * 9 / 16), y: (height * 1 / 4)},
            orientation: {rows: 1, columns: 3 },
            down: {row: 0, start: 0, columns: 3 },
            hitbox: {widthPercentage: 0.2, heightPercentage: 0.2},
            // Add dialogues array for random messages
            dialogues: [
                "I heard the boss is waiting for you...",
                "Enter if you dare... he's waiting for you...",
                "I heard the Reaper himself was in there.",
                "You have no chance... his power is unstoppable...",
                "No one has survived a battle against the Reaper.",
                "Haha! You want to battle my boss? You'll die within the first minute...",
                "Go ahead. I aint stoppin' you. The Reaper'll finish you clean.",
                "You are a fool to challenge the Reaper.",
                "You will end up like me once you face the Reaper.",
                "Are you the next opponent for my master? That's unfortunate for you.",
            ],
            reaction: function() {
                // Don't do anything on touch
                // The Zombie only speaks when interacted with
            },
            interact: function() {
                // Placeholder empty interaction function
                // Replace with actual dialogue system when needed
            }
        };

        const sprite_data_zombie2 = {
            id: 'ZombieNPC2',
            greeting: sprite_greet_zombie,
            src: sprite_src_zombie,
            SCALE_FACTOR: 4,
            ANIMATION_RATE: 30,
            pixels: {width: 3600, height: 1200},
            INIT_POSITION: {x: (width * 5.5 / 16), y: (height * 1 / 4)},
            orientation: {rows: 1, columns: 3 },
            down: {row: 0, start: 0, columns: 3 , mirror: true},
            hitbox: {widthPercentage: 0.2, heightPercentage: 0.2},
            // Add dialogues array for random messages
            dialogues: [
                "Boss.js inherits and extends Enemy.js to add more danger.",
                "When you enter the battle room, your player becomes a FightingPlayer object, which extends the Player class.",
                "The arrows and fireballs that you fight with are all Projectile objects.",
                "The Reaper's scythe is a Boomerang object- meaning, it moves in an ellipse.",
                "I was supposed to be a harmless NPC... then they gave me dialogue arrays.",
                "All of this runs in a continuous update loop — one tick at a time.",
                "Both the arrows and fireballs are Projectile objects. Code reuse is peak!",
                "If I ever freeze, check the console. I might've thrown an error.",
                "The Reaper's attack is so powerful, it takes a Desmos graph to understand its power.", // reference to the desmos graph we used to calculate the scythe path!
                "*brains*"
            ],
            reaction: function() {
                // Don't do anything on touch
                // The Zombie only speaks when interacted with
            },
            interact: function() {
                // Placeholder empty interaction function
                // Replace with actual dialogue system when needed
            }
        }; 
        

        // invisible sprite for door collision that handles going to lv6 battle room
        const sprite_src_bossdoor = path + "/images/mansionGame/invisDoorCollisionSprite.png";
        const sprite_greet_bossdoor = "Battle the Reaper? Press E";
        const sprite_data_bossdoor = {
            id: 'Door',
            greeting: sprite_greet_bossdoor,
            src: sprite_src_bossdoor,
            SCALE_FACTOR: 6,
            ANIMATION_RATE: 100,
            pixels: {width: 2029, height: 2025},
            INIT_POSITION: {x: (width * 37 / 80), y: (height / 8)},
            orientation: {rows: 1, columns: 1},
            down: {row: 0, start: 0, columns: 1},
            hitbox: {widthPercentage: 0.1, heightPercentage: 0.2},
            dialogues: [
                "Many have entered. Few have returned.",
                "Dangerous things await you beyond this door..",
                "Prepare yourself. The journey beyond won't be easy."
            ],
            reaction: function() {
                // Don't show any reaction dialogue - this prevents the first alert
                // The interact function will handle all dialogue instead
            },
            // Ask the player whether they want to enter the doors-- if they do, move to the battle room
            interact: function() {
                // Placeholder empty interaction function
                // Replace with actual dialogue system when needed
            }
        };

        const sprite_src_chair = path + "/images/mansionGame/invisDoorCollisionSprite.png";
        const sprite_data_chair = {
            id: 'Chair',
            greeting: "Don't sit on me!",
            src: sprite_src_chair,
            SCALE_FACTOR: 6,
            ANIMATION_RATE: 100,
            pixels: {width: 2029, height: 2025},
            INIT_POSITION: {x: (width * 8 / 80), y: (height * 1 / 4)},
            orientation: {rows: 1, columns: 1},
            down: {row: 0, start: 0, columns: 1},
            hitbox: {widthPercentage: 0.1, heightPercentage: 0.2}
        };

        const sprite_src_chair2 = path + "/images/mansionGame/invisDoorCollisionSprite.png";
        const sprite_data_chair2 = {
            id: 'Chair 2',
            greeting: "Don't sit on me!",
            src: sprite_src_chair2,
            SCALE_FACTOR: 6,
            ANIMATION_RATE: 100,
            pixels: {width: 2029, height: 2025},
            INIT_POSITION: {x: (width * 71 / 80), y: (height * 9 / 40)},
            orientation: {rows: 1, columns: 1},
            down: {row: 0, start: 0, columns: 1},
            hitbox: {widthPercentage: 0.1, heightPercentage: 0.2}
        };

        // This is every sprite we want the game engine to render, and with whatever data
        this.classes = [
            {class: GameEnvBackground, data: image_data_chamber},
            {class: Player, data: sprite_data_mc},
            {class: Npc, data: sprite_data_zombie1},
            {class: Npc, data: sprite_data_zombie2}, // The second zombie is the one that talks about the code
            {class: Npc, data: sprite_data_bossdoor},
            {class: Npc, data: sprite_data_chair},
            {class: Npc, data: sprite_data_chair2}
        ];

    };
}

export default GameLevelFortress;
