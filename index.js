import { Game } from './game.js';

let game;

function restartGame() {
    game.restart();
}

window.addEventListener('load', () => {
    game = new Game();
});