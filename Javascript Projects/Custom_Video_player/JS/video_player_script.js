const video = document.querySelector("#video");
const play = document.querySelector("#play");
const stopVid = document.querySelector("#stop");
const progress = document.querySelector("#progress");
const timeStamp = document.querySelector("#timestamp");

//start and stop video

function toggleVideoStatus() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

//update play/pause icon
function updatePlayIcon() {
  if (video.paused) {
    play.innerHTML = '<i class="fa fa-play fa-2x"></i>';
  } else {
    play.innerHTML = '<i class="fa fa-pause fa-2x"></i>';
  }
}

//update progress & timestamp
function updateProgress() {
  progress.value = (video.currentTime / video.duration) * 100;

  //get minutes
  let mins = Math.floor(video.currentTime / 60);
  if (mins < 10) {
    mins = "0" + String(mins);
  }

  //get seconds
  let secs = Math.floor(video.currentTime % 60); //modulous operator
  if (secs < 10) {
    secs = "0" + String(secs);
  }

  timeStamp.innerHTML = `${mins}:${secs}`;
}

//update progress bar
function setVideoProgress() {
  video.currentTime = parseInt(progress.value * video.duration) / 100;
}

//stop video
function stopVideo() {
  video.currentTime = 0;
  video.pause();
}

//event listeners

video.addEventListener("click", toggleVideoStatus);
video.addEventListener("pause", updatePlayIcon);
video.addEventListener("play", updatePlayIcon);
video.addEventListener("timeupdate", updateProgress);

play.addEventListener("click", toggleVideoStatus);
stopVid.addEventListener("click", stopVideo);
progress.addEventListener("click", setVideoProgress);
