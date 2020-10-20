import {
    player
} from './main.js';

function manageKeyDown(e) {
    player.move(e.key == 'w', e.key == 's', e.key == 'a', e.key == 'd');
}

function manageKeyUp(e) {
    player.stop(e.key == 'w', e.key == 's', e.key == 'a', e.key == 'd');
}

export {
    manageKeyUp,
    manageKeyDown
};