import GameEnvBackground  from "./essentials/GameEnvBackground.js";
import Player from "./essentials/Player.js";
import Npc from './essentials/Npc.js';

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
        const sprite_src_zombie = path + "/images/mansionGame/zombieNpc.png";
        const sprite_greet_zombie = "Hi, I'm a zombie.";
        const sprite_data_zombie1 = {
            id: 'Panicked NPC',
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
                "I'm so scared! The scythes have been comming for me!",
                "Rumor has it that missiles with scythes!",
                "I don't want to face the scythes and missiles!",
                "Flee for yourself! I'll be hit before you can save me!",
                "Try dodging the scythes and missiles! It's your only hope!",
                "I'm trapped! Please help me!"
            ],
            // Use the default reaction function, and have no interaction function
            interact: function() {}
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
