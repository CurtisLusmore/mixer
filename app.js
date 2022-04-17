const ids = {
  'whitenoise': 0.5,
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
  document.getElementById('play').classList.toggle('hidden');
  document.getElementById('pause').classList.toggle('hidden');
}

function pause() {
  for (const id in ids) {
    document.getElementById(id).pause();
  }
  document.getElementById('play').classList.toggle('hidden');
  document.getElementById('pause').classList.toggle('hidden');
}

function setVolume(event) {
  const id = event.target.name;
  const volume = event.target.value / 100;
  const multiplier = ids[id];
  document.getElementById(id).volume = volume * multiplier;
}

window.addEventListener('load', function () {
  for (const id in ids) {
    const elem = document.getElementById(id);
    const volume = document.forms[0].elements[id].value;
    const multiplier = ids[id];
    elem.volume = volume * multiplier;
  }
});