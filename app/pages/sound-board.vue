<template>
    <div class="keys">
        <div data-key="65" class="key">
            <kbd>A</kbd>
            <span class="sound">blaster</span>
        </div>
        <div data-key="83" class="key">
            <kbd>S</kbd>
            <span class="sound">Chewy</span>
        </div>
        <div data-key="68" class="key">
            <kbd>D</kbd>
            <span class="sound">Han</span>
        </div>
        <div data-key="70" class="key">
            <kbd>F</kbd>
            <span class="sound">C3PO</span>
        </div>
        <div data-key="71" class="key">
            <kbd>G</kbd>
            <span class="sound">Obi Wan</span>
        </div>
        <div data-key="72" class="key">
            <kbd>H</kbd>
            <span class="sound">Yoda</span>
        </div>
        <div data-key="74" class="key">
            <kbd>J</kbd>
            <span class="sound">Jabba</span>
        </div>
        <div data-key="75" class="key">
            <kbd>K</kbd>
            <span class="sound">Luke</span>
        </div>
        <div data-key="76" class="key">
            <kbd>L</kbd>
            <span class="sound">Darth Vadar</span>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

function removeTransition(e) {
  if (e.propertyName !== 'transform') return;
  e.target.classList.remove('playing');
}

function playSound(e) {
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
  if (!audio) return;

  key.classList.add('playing');
  audio.currentTime = 0;
  audio.play();
}

onMounted(() => {
  const keys = Array.from(document.querySelectorAll('.key'));
  keys.forEach(key => key.addEventListener('transitionend', removeTransition));
  window.addEventListener('keydown', playSound);
});
</script>

<style scoped>
html {
  font-size: 10px;
  background: url('/img/zda8BoW.jpg') bottom center;
  background-size: cover;
}
body,html {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}

.keys {
  display: flex;
  flex: 1;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
}

.key {
  border: .4rem solid black;
  border-radius: .5rem;
  margin: 1rem;
  font-size: 1.5rem;
  padding: 1rem .5rem;
  transition: all .07s ease;
  width: 10rem;
  text-align: center;
  color: white;
  background: rgba(0,0,0,0.4);
  text-shadow: 0 0 .5rem black;
}

.playing {
  transform: scale(1.1);
  border-color: #ffc600;
  box-shadow: 0 0 1rem #ffc600;
}

kbd {
  display: block;
  font-size: 4rem;
}

.sound {
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: .1rem;
  color: #ffc600;
}
</style>