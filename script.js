const canvas = document.getElementById('timelineCanvas');
const context = canvas.getContext('2d');
const videoPlayer = document.getElementById('videoPlayer');

canvas.width = 800;
canvas.height = 100;

let totalDurationInSeconds = 60; // Default duration 🥱

let playing = false;

let indicatorTimeInSeconds = totalDurationInSeconds / 2;

function timeToPosition(time) {
  return (time / totalDurationInSeconds) * canvas.width;
}

function positionToTime(position) {
  return (position / canvas.width) * totalDurationInSeconds;
}

function formatTime(seconds) {
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(1);
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds.toFixed(1)}s`;
}

function drawTimeline() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i <= canvas.width; i += 50) {
    context.beginPath();
    context.moveTo(i, 20);
    context.lineTo(i, canvas.height);
    context.strokeStyle = '#ccc';
    context.stroke();

    const time = positionToTime(i);
    const formattedTime = formatTime(time);
    context.fillStyle = '#333';
    context.fillText(`${formattedTime}`, i + 5, 15);
  }

  const indicatorPosition = timeToPosition(indicatorTimeInSeconds);
  context.fillStyle = '#007bff';
  context.fillRect(indicatorPosition - 1, 0, 2, canvas.height);
}

function updateVideoPosition() {
  videoPlayer.currentTime = indicatorTimeInSeconds;
}

drawTimeline();

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const clickPosition = event.clientX - rect.left;

  indicatorTimeInSeconds = positionToTime(clickPosition);
  drawTimeline();
  updateVideoPosition();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    indicatorTimeInSeconds = Math.max(0, indicatorTimeInSeconds - 1);
    drawTimeline();
    updateVideoPosition();
  } else if (event.key === 'ArrowRight') {
    indicatorTimeInSeconds = Math.min(
      totalDurationInSeconds,
      indicatorTimeInSeconds + 1
    );
    drawTimeline();
    updateVideoPosition();
  } else if (event.code === 'Space') {
    if (playing) {
      videoPlayer.pause();
      playing = false;
    } else {
      videoPlayer.play();
      playing = true;
    }
  }
  console.log(event.code);
});

videoPlayer.addEventListener('loadedmetadata', () => {
  totalDurationInSeconds = videoPlayer.duration;
  drawTimeline();
  updateVideoPosition();
});

videoPlayer.addEventListener('timeupdate', () => {
  indicatorTimeInSeconds = videoPlayer.currentTime;
  drawTimeline();
});
