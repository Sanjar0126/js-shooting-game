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

    const deviceWidth = window.innerWidth;
    const deviceHeight = window.innerHeight;

    const displayWidth = deviceWidth * scale;
    const displayHeight = deviceHeight * scale;
    
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';
    
    canvas.width = displayWidth * devicePixelRatio;
    canvas.height = displayHeight * devicePixelRatio;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(devicePixelRatio, devicePixelRatio);
    
    if (window.game) {
        window.game.handleResize(displayWidth, displayHeight);
    }
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);
resizeCanvas();

window.addEventListener('load', () => {
    window.game = new Game();
    setTimeout(resizeCanvas, 100);
});