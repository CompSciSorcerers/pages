
/**
 * Shows the end screen when the player wins the archery game
 * @param gameEnv - The game environment object
 * @param filepath - The path to the end screen image (default: '/images/sorcerers/archeryWinScreen.png')
 */

import GameLevelMaze from '../GameLevelMaze.js';
import LeaderboardManager from './LeaderboardManager.js';

export default function showEndScreen(gameEnv) {
    if (typeof document === 'undefined') return;

    const timeTaken = window.timeStarted ? (Date.now() / 1000.0) - window.timeStarted : null;
    console.log(`Archery game won! Time taken: ${timeTaken !== null ? timeTaken + ' seconds' : 'Error calculating time'}`);
    const formattedTime = timeTaken !== null ? `${timeTaken.toFixed(2)} seconds` : 'N/A';


    // Prevent adding multiple overlays
    if (document.getElementById('archery-victory-overlay')) return;
    // Determine resource path
    const path = (gameEnv && gameEnv.path) ? gameEnv.path : '';

    const overlay = document.createElement('div');
    overlay.id = 'archery-victory-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.85)';
    overlay.style.zIndex = '10000';

    const img = document.createElement('img');
    // use previously computed `path` variable
    img.src = path + '/images/sorcerers/archeryWinScreen.png';
    img.alt = 'Victory';
    img.style.maxWidth = '95%';
    img.style.maxHeight = '95%';
    img.style.boxShadow = '0 0 40px rgba(255,255,255,0.2)';
    overlay.appendChild(img);

    // Leaderboard manager - calculate score before using it
    const leaderboard = new LeaderboardManager('archery');
    const score = leaderboard.timeToScore(timeTaken);

    const timeLabel = document.createElement('div');
    timeLabel.innerHTML = `<div>Time: ${formattedTime}</div><div style="margin-top: 8px; font-size: 1.2rem; color: #ffd700;">Score: ${score.toLocaleString()}</div>`;
    timeLabel.style.position = 'absolute';
    timeLabel.style.left = '50%';
    timeLabel.style.bottom = '58%';
    timeLabel.style.transform = 'translateX(-50%)';
    timeLabel.style.color = '#ffffff';
    timeLabel.style.fontSize = '1.5rem';
    timeLabel.style.fontWeight = '700';
    timeLabel.style.fontFamily = "'Press Start 2P', monospace";
    timeLabel.style.letterSpacing = '0.08em';
    timeLabel.style.lineHeight = '1.4';
    timeLabel.style.textShadow = '0 2px 12px rgba(0,0,0,0.9)';
    timeLabel.style.pointerEvents = 'none';
    timeLabel.style.textAlign = 'center';
    overlay.appendChild(timeLabel);

    // commentary label

    var commentary;
    if (timeTaken < 10){
        commentary = "You're literally hacking lol";
    } else if (timeTaken < 20){
        commentary = "Good stuff, marksman...";
    } else if (timeTaken < 30){
        commentary = "Seems average, I guess...";
    } else if (timeTaken < 40){
        commentary = "Come on, you can do better than that...";
    } else if (timeTaken < 50){
        commentary = "Might want to practice just a liiiiiiiiiitle bit more";
    } else if (timeTaken < 60){
        commentary = "I've seen glaciers move with more urgency than this.";
    } else if (timeTaken < 70) {
        commentary = "Oof. Is your mouse made of lead, or are you just like this?";
    } else {
        commentary = "I could train my pet rock to do better than this.";
    }
    const commentaryLabel = document.createElement('div');
    commentaryLabel.textContent = commentary;
    commentaryLabel.style.position = 'absolute';
    commentaryLabel.style.left = '50%';
    commentaryLabel.style.bottom = '68%';
    commentaryLabel.style.transform = 'translateX(-50%)';
    commentaryLabel.style.color = '#ffe354';
    commentaryLabel.style.fontSize = '1.1rem';
    commentaryLabel.style.fontWeight = '700';
    commentaryLabel.style.fontFamily = "'Press Start 2P', monospace";
    commentaryLabel.style.letterSpacing = '0.08em';
    commentaryLabel.style.lineHeight = '1.4';
    commentaryLabel.style.textShadow = '0 2px 12px rgba(0,0,0,0.9)';
    commentaryLabel.style.pointerEvents = 'none';
    commentaryLabel.style.textAlign = 'center';
    overlay.appendChild(commentaryLabel);

    // Leaderboard title
    const leaderboardTitle = document.createElement('div');
    leaderboardTitle.textContent = 'TOP SCORES (Loading...)';
    leaderboardTitle.style.position = 'absolute';
    leaderboardTitle.style.left = '50%';
    leaderboardTitle.style.bottom = '45%';
    leaderboardTitle.style.transform = 'translateX(-50%)';
    leaderboardTitle.style.color = '#ffe354';
    leaderboardTitle.style.fontSize = '0.8rem';
    leaderboardTitle.style.fontWeight = '700';
    leaderboardTitle.style.fontFamily = "'Press Start 2P', monospace";
    leaderboardTitle.style.letterSpacing = '0.1em';
    leaderboardTitle.style.textShadow = '0 2px 8px rgba(0,0,0,0.9)';
    leaderboardTitle.style.pointerEvents = 'none';
    overlay.appendChild(leaderboardTitle);

    // Leaderboard container
    const leaderboardContainer = document.createElement('div');
    leaderboardContainer.style.position = 'absolute';
    leaderboardContainer.style.left = '50%';
    leaderboardContainer.style.bottom = '32%';
    leaderboardContainer.style.transform = 'translateX(-50%)';
    leaderboardContainer.style.width = '80%';
    leaderboardContainer.style.maxWidth = '600px';
    leaderboardContainer.style.maxHeight = '200px';
    leaderboardContainer.style.overflow = 'auto';
    leaderboardContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    leaderboardContainer.style.border = '2px solid #ffe354';
    leaderboardContainer.style.borderRadius = '8px';
    leaderboardContainer.style.padding = '12px';
    leaderboardContainer.innerHTML = '<p style="color: #aaa; text-align: center;">Loading leaderboard...</p>';
    overlay.appendChild(leaderboardContainer);

    // Load leaderboard asynchronously
    (async () => {
        try {
            const leaderboardHTML = await leaderboard.getLeaderboardHTML();
            leaderboardContainer.innerHTML = leaderboardHTML;
            leaderboardTitle.textContent = 'TOP SCORES';
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
            leaderboardContainer.innerHTML = '<p style="color: #ff6b6b; text-align: center;">Failed to load leaderboard</p>';
            leaderboardTitle.textContent = 'TOP SCORES (Error)';
        }
    })();

    // Save score section
    const saveSection = document.createElement('div');
    saveSection.style.position = 'absolute';
    saveSection.style.left = '50%';
    saveSection.style.bottom = '13%';
    saveSection.style.transform = 'translateX(-50%)';
    saveSection.style.display = 'flex';
    saveSection.style.gap = '10px';
    saveSection.style.alignItems = 'center';
    saveSection.style.zIndex = '10001';

    const playerNameInput = document.createElement('input');
    playerNameInput.type = 'text';
    playerNameInput.placeholder = 'Your name';
    playerNameInput.style.padding = '8px 12px';
    playerNameInput.style.border = '2px solid #ffe354';
    playerNameInput.style.borderRadius = '4px';
    playerNameInput.style.background = '#1f2738';
    playerNameInput.style.color = '#ffffff';
    playerNameInput.style.fontFamily = "'Press Start 2P', monospace";
    playerNameInput.style.fontSize = '0.6rem';
    playerNameInput.style.minWidth = '150px';
    playerNameInput.maxLength = 20;
    saveSection.appendChild(playerNameInput);

    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.textContent = 'Save Score';
    saveButton.style.padding = '8px 15px';
    saveButton.style.border = '2px solid #ffe354';
    saveButton.style.borderRadius = '4px';
    saveButton.style.background = '#2a5d3a';
    saveButton.style.color = '#ffe354';
    saveButton.style.fontFamily = "'Press Start 2P', monospace";
    saveButton.style.fontSize = '0.6rem';
    saveButton.style.cursor = 'pointer';
    saveButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
    saveButton.style.transition = 'all 0.3s ease';

    saveButton.addEventListener('mouseover', () => {
        saveButton.style.background = '#3a7d4a';
        saveButton.style.transform = 'scale(1.05)';
    });

    saveButton.addEventListener('mouseout', () => {
        saveButton.style.background = '#2a5d3a';
        saveButton.style.transform = 'scale(1)';
    });

    saveButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const playerName = playerNameInput.value.trim();
        
        if (!playerName) {
            alert('Please enter your name!');
            return;
        }

        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';
        
        leaderboard.saveScore(playerName, timeTaken)
            .then(result => {
                let message = `Score saved!\n\nPlayer: ${result.playerName}\nScore: ${result.score}\nTime: ${result.timeTaken}s\nRank: #${result.rank}`;
                if (result.isNewHighScore) {
                    message = `🏆 NEW HIGH SCORE! 🏆\n\n${message}`;
                }
                alert(message);
                
                // Refresh leaderboard display
                leaderboard.getLeaderboardHTML()
                    .then(html => {
                        leaderboardContainer.innerHTML = html;
                    })
                    .catch(err => {
                        console.error('Failed to refresh leaderboard:', err);
                        leaderboardContainer.innerHTML = '<p style="color: #ff6b6b; text-align: center;">Failed to load leaderboard</p>';
                    });
                
                // Disable inputs after save
                playerNameInput.disabled = true;
                saveButton.disabled = true;
                saveButton.style.opacity = '0.5';
                saveButton.style.cursor = 'default';
                saveButton.textContent = 'Score Saved!';
            })
            .catch(error => {
                console.error('Failed to save score:', error);
                alert('Failed to save score: ' + error.message);
                saveButton.disabled = false;
                saveButton.textContent = 'Save Score';
            });
    });

    saveSection.appendChild(saveButton);
    overlay.appendChild(saveSection);

    const actionButton = document.createElement('button');
    actionButton.type = 'button';
    actionButton.textContent = 'Enter the castle';
    actionButton.style.position = 'absolute';
    actionButton.style.left = '50%';
    actionButton.style.bottom = '4%';
    actionButton.style.transform = 'translateX(-50%)';
    actionButton.style.padding = '12px 22px';
    actionButton.style.border = '2px solid #ffffff';
    actionButton.style.borderRadius = '8px';
    actionButton.style.background = '#1f2738';
    actionButton.style.color = '#ffffff';
    actionButton.style.fontFamily = "'Press Start 2P', monospace";
    actionButton.style.fontSize = '0.75rem';
    actionButton.style.letterSpacing = '0.05em';
    actionButton.style.cursor = 'pointer';
    actionButton.style.boxShadow = '0 6px 18px rgba(0,0,0,0.5)';
    actionButton.style.zIndex = '10001';
    actionButton.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!gameEnv || !gameEnv.gameControl) return;

        // Prevent double-click transitions.
        actionButton.disabled = true;
        actionButton.style.opacity = '0.65';
        actionButton.style.cursor = 'default';

        const gameControl = gameEnv.gameControl;
        const fadeOverlay = document.createElement('div');
        const fadeInMs = 700;
        const fadeOutMs = 700;

        Object.assign(fadeOverlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            opacity: '0',
            zIndex: '10002',
            pointerEvents: 'none',
            transition: `opacity ${fadeInMs}ms ease-in-out`
        });

        try { document.body.appendChild(fadeOverlay); } catch (err) { console.warn('Could not append fade overlay:', err); }

        const switchToMazeLevel = () => {
            try {
                gameControl._originalLevelClasses = gameControl.levelClasses;
                gameControl.levelClasses = [GameLevelMaze];
                gameControl.currentLevelIndex = 0;
                gameControl.isPaused = false;
                gameControl.transitionToLevel();
            } catch (err) {
                console.warn('Failed to transition to maze level:', err);
            }
        };

        requestAnimationFrame(() => {
            fadeOverlay.style.opacity = '1';
        });

        setTimeout(() => {
            try { overlay.remove(); } catch (err) { /* ignore */ }

            switchToMazeLevel();

            setTimeout(() => {
                fadeOverlay.style.transition = `opacity ${fadeOutMs}ms ease-in-out`;
                fadeOverlay.style.opacity = '0';

                setTimeout(() => {
                    try { fadeOverlay.remove(); } catch (err) { /* ignore */ }
                }, fadeOutMs + 100);
            }, 220);
        }, fadeInMs + 30);
    });
    overlay.appendChild(actionButton);

    // Disable click-to-close: keep overlay visible until game control/timeout handles the transition.
    // This prevents accidental dismissal when the player clicks the screen.
    overlay.addEventListener('click', (e) => {
        // swallow clicks so they don't remove the overlay or interact with underlying elements
        e.stopPropagation();
        e.preventDefault();
    });

    // Append to body
    try { document.body.appendChild(overlay); } catch (e) { console.warn('Failed to append victory overlay:', e); }


    // Fallback: stop the level after a short delay
    setTimeout(() => {
        try {
            if (gameEnv && gameEnv.gameControl && gameEnv.gameControl.currentLevel) {
                gameEnv.gameControl.currentLevel.continue = false;
            }
        } catch (e) { /* ignore */ }
    }, 500);
}
