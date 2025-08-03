import { Game } from './game.js';

let game;

window.restartGame = function() {
    game.restart();
};

window.addEventListener('load', () => {
    game = new Game();
});