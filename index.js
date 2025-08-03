import { Game } from './game.js';

let game;

window.startGame = function() {
    game.startNewGame();
};

window.toggleSettings = function() {
    const settings = document.getElementById('settingsPanel');
    const buttons = document.getElementById('menuButtons');
    const instructions = document.getElementById('instructionsPanel');
    
    if (settings.style.display === 'none') {
        settings.style.display = 'block';
        buttons.style.display = 'none';
        instructions.style.display = 'none';
    } else {
        settings.style.display = 'none';
        buttons.style.display = 'block';
    }
};

window.showInstructions = function() {
    const instructions = document.getElementById('instructionsPanel');
    const buttons = document.getElementById('menuButtons');
    const settings = document.getElementById('settingsPanel');
    
    if (instructions.style.display === 'none') {
        instructions.style.display = 'block';
        buttons.style.display = 'none';
        settings.style.display = 'none';
    } else {
        instructions.style.display = 'none';
        buttons.style.display = 'block';
    }
};

// Update the restart function
window.restartGame = function() {
    game.restart();
};

// Add return to menu function
window.returnToMenu = function() {
    game.showMenu();
};

// window.restartGame = function() {
//     game.restart();
// };

window.addEventListener('load', () => {
    game = new Game();
});