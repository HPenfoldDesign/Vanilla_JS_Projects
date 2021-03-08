const container = document.querySelector("#container");
const text = document.querySelector("#text");

const totalTime = 7500;
const breatheTime = (totalTime / 5) * 2;
const holdTime = totalTime / 5;

//sets times of the words breathe in, hold and breath out as well as adding the keyframes css at the right times.

breathAnimation();

function breathAnimation() {
  text.innerText = "Breathe in";
  container.className = "container grow";

  setTimeout(() => {
    text.innerText = "Hold";

    setTimeout(() => {
      text.innerText = "Steady breath out";
      container.className = "container shrink";
    }, holdTime);
  }, breatheTime);
}

//set an interval for it to run again (every 7.5 seconds(totalTime))

setInterval(breathAnimation, totalTime);
