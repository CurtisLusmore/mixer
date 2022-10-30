navigator.serviceWorker.register('worker.js');

const ids = {
  'whitenoise': 0.5,
  'lullaby': 1.0,
  'heartbeat': 1.0,
  'shh': 1.0,
  'rain': 1.0,
  'thunder': 1.0,
  'river': 1.0,
  'wave': 1.0,
  'fire': 1.0,
  'bird': 1.0,
  'cricket': 1.0,
};

function play() {
  for (const id in ids) {
    document.getElementById(id).play();
  }
  document.getElementById('play').classList.add('hidden');
  document.getElementById('pause').classList.remove('hidden');
  setMediaSession();
}

function pause() {
  for (const id in ids) {
    document.getElementById(id).pause();
  }
  document.getElementById('play').classList.remove('hidden');
  document.getElementById('pause').classList.add('hidden');
}

let timer;
function setTimer() {
  clearInterval(timer);
  play();
  let remaining = new Date(20 * 60 * 1000);
  const timerSpan = document.getElementById('timer');
  const pad = n => n < 10 ? '0' + n : n;
  timerSpan.innerText = `${pad(remaining.getMinutes())}:${pad(remaining.getSeconds())}`;
  timer = setInterval(function () {
    remaining.setSeconds(remaining.getSeconds() - 1);
    if (remaining.getTime() > 0) {
      timerSpan.innerText = `${pad(remaining.getMinutes())}:${pad(remaining.getSeconds())}`;
    }
    else {
      pause();
      resetTimer();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  const timerSpan = document.getElementById('timer');
  timerSpan.innerText = '00:00';
}

function setVolume(event) {
  const id = event.target.name;
  const value = event.target.value;
  localStorage.setItem(`mixer-${id}`, value);
  const volume = value / 100;
  const multiplier = ids[id];
  document.getElementById(id).volume = volume * multiplier;
  setMediaSession();
}

window.addEventListener('load', function () {
  for (const id in ids) {
    const cacheValue = this.localStorage.getItem(`mixer-${id}`);
    if (cacheValue) document.forms[0].elements[id].value = cacheValue;
    const elem = document.getElementById(id);
    const volume = document.forms[0].elements[id].value / 100;
    const multiplier = ids[id];
    elem.volume = volume * multiplier;
  }
});

function setMediaSession() {
  let title = '';
  for (const id in ids) {
    const icon = document.getElementById(`${id}-label`).innerText;
    const volume = document.forms[0].elements[id].value / 100;
    if (volume > 0) title += icon;
  }
  title = title || 'Silence';
  navigator.mediaSession.metadata = new MediaMetadata({
    title: title,
    artist: 'Mixer',
    artwork: [
      { src: 'favicon.png', sizes: '240x240', type: 'image/png' },
    ],
  });
}

navigator.mediaSession.setActionHandler('play', function () {
  play();
  navigator.mediaSession.playbackState = 'playing';
});

navigator.mediaSession.setActionHandler('pause', function () {
  pause();
  navigator.mediaSession.playbackState = 'paused';
});

navigator.mediaSession.setActionHandler('stop', function () {
  pause();
  resetTimer();
  navigator.mediaSession.playbackState = 'paused';
});