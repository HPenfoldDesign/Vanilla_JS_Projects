window.addEventListener('keydown', function (event) {
    const audio = document.querySelector(`audio[data-key="${event.keyCode}"]`);
    const key = document.querySelector(`.key[data-key="${event.keyCode}"]`);

    if (!audio) {return;} // stops function running.

    audio.currentTime = 0; //removes the playing loop so you can press the same button multiple times.
    audio.play();
    key.classList.add('playing');
});

function removeTransition(event) {
    if (event.propertyName !== 'transform') {return;}
    this.classList.remove('playing');
}

const keys = document.querySelectorAll('.key');
keys.forEach(key => key.addEventListener('transitionend', removeTransition));