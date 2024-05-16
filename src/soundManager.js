const path = require('path');
const audioPath = '../assets/sounds/';

function bootupSound() {
    const bootupSound = new Audio(path.join(audioPath, '1990s PC Startup Screen.wav'));
    bootupSound.play();
}

function playsound(sound) {
    const soundToPlay = new Audio(path.join(audioPath, sound));
    soundToPlay.play();
}

module.exports = {
    playSound,
    bootupSound
};