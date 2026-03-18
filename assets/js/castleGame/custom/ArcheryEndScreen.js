
/**
 * Shows the end screen when the player wins the archery game
 * @param gameEnv - The game environment object
 * @param filepath - The path to the end screen image (default: '/images/sorcerers/archeryWinScreen.png')
 */
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

    const timeLabel = document.createElement('div');
    timeLabel.textContent = `Time taken: ${formattedTime}`;
    timeLabel.style.position = 'absolute';
    timeLabel.style.left = '50%';
    timeLabel.style.bottom = '30%';
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
    commentaryLabel.style.bottom = '20%';
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
