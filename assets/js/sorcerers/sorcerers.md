---
layout: opencs
title: Sorcerers Game 
permalink: /gamify/sorcerers
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">

    // Adventure Game assets locations
    import Game from "{{site.baseurl}}/assets/js/sorcerers/essentials/Game.js";
    import GameLevelMaze from "{{site.baseurl}}/assets/js/sorcerers/GameLevelMaze.js";
    import GameLevelArchery from "{{site.baseurl}}/assets/js/sorcerers/GameLevelArchery.js";
    import GameLevelFortress from "{{site.baseurl}}/assets/js/sorcerers/GameLevelFortress.js"; 
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const gameLevelClasses = [GameLevelMaze, GameLevelArchery, GameLevelFortress];

    // Web Server Environment datas
    const environment = {
        path: "{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        gameLevelClasses: gameLevelClasses,
        // Game UI configuration
        gameUI: {
            showNavigation: true,
            showLevelSelect: true,
            showInfo: true,
            homeUrl: "/gamify/sorcerers",
            gameInfo: {
                title: "Murder Mystery Game",
                version: "1.0",
                developer: "DNHS CSSE March 2026",
                controls: "Use WASD keys to move your character."
            }
        }
    }

    // Launch Adventure Game
    const game = Game.main(environment);
</script>