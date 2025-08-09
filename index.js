import { Game } from './game.js';

window.startGame = function () {
    window.game.startNewGame();
};

window.toggleSettings = function () {
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

window.showInstructions = function () {
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

window.restartGame = function () {
    window.game.restart();
};

window.returnToMenu = function () {
    window.game.showMenu();
};

function resizeCanvas() {
    const canvas = document.getElementById('gameCanvas');
    const scale = 0.95;
    
    const width = window.innerWidth * scale;
    const height = window.innerHeight * scale;
    
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    canvas.width = width;
    canvas.height = height;
    
    if (window.game) {
        window.game.handleResize(width, height);
    }
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);
resizeCanvas();

window.addEventListener('load', () => {
    window.game = new Game();
    setTimeout(resizeCanvas, 100);
});