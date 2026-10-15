/* Renee Michele sample player: only the pre-cut 45s audio files are requested. */
(function () {
  function init() {
    const root = document.getElementById('renee-player');
    if (!root || root.dataset.initialized === '1') return;
    root.dataset.initialized = '1';
    const audio = root.querySelector('#rnp-audio');
    const tracks = Array.from(root.querySelectorAll('.rnp-track'));
    const play = root.querySelector('#rnp-play');
    const prev = root.querySelector('#rnp-prev');
    const next = root.querySelector('#rnp-next');
    const title = root.querySelector('#rnp-current-title');
    const progress = root.querySelector('#rnp-progress');
    const elapsed = root.querySelector('#rnp-elapsed');
    const status = root.querySelector('#rnp-status');
    let selected = 0;
    const LIMIT = 45;
    const fmt = sec => '0:' + String(Math.min(LIMIT,Math.floor(sec || 0))).padStart(2,'0');
    const language = () => document.documentElement.getAttribute('data-ui-lang') === 'de' ? 'de' : 'en';
    const say = (en,de) => { status.textContent = language() === 'de' ? de : en; };
    function render() {
      title.textContent = tracks[selected].dataset.title;
      tracks.forEach((btn,index) => {
        const active = index === selected;
        btn.classList.toggle('is-selected', active);
        btn.setAttribute('aria-pressed', String(active));
        btn.querySelector('.rnp-trackicon').textContent = active && !audio.paused ? '▮▮' : '▶';
      });
      const running = !audio.paused && !audio.ended;
      play.textContent = running ? '❚❚' : '▶';
      play.setAttribute('aria-label', running ? 'Pause preview' : 'Play preview');
      let t = Math.min(LIMIT,Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
      progress.value = t;
      progress.style.setProperty('--percent',(t/LIMIT*100).toFixed(2)+'%');
      elapsed.textContent = fmt(t);
    }
    function select(index, autoPlay) {
      selected=(index+tracks.length)%tracks.length;
      audio.pause();
      audio.src=tracks[selected].dataset.src;
      audio.load();
      render();
      if(autoPlay) start(); else say('Ready to play','Bereit zum Anhören');
    }
    async function start() {
      if (!audio.getAttribute('src')) { audio.src=tracks[selected].dataset.src; audio.load(); }
      try { await audio.play();say('Playing preview','Hörprobe läuft'); }
      catch(e) { say('Unable to play this audio file','Die Audiodatei konnte nicht abgespielt werden'); }
      render();
    }
    play.addEventListener('click', () => audio.paused ? start() : (audio.pause(),say('Paused','Pausiert'),render()));
    prev.addEventListener('click', () => select(selected-1,true));
    next.addEventListener('click', () => select(selected+1,true));
    tracks.forEach((btn,index) => btn.addEventListener('click',() => select(index,true)));
    progress.addEventListener('input', () => {
      if (audio.readyState >= 1) audio.currentTime = Math.min(LIMIT-0.05,Math.max(0,Number(progress.value)));
      render();
    });
    audio.addEventListener('timeupdate', () => {
      if (audio.currentTime >= LIMIT) { audio.pause(); audio.currentTime = 0; say('Preview complete','Hörprobe beendet'); }
      render();
    });
    audio.addEventListener('pause',render);
    audio.addEventListener('play',render);
    audio.addEventListener('ended', () => {audio.pause();audio.currentTime=0;say('Preview complete','Hörprobe beendet');render();});
    audio.addEventListener('error', () => {if (audio.getAttribute('src')) say('Audio file could not be loaded','Audiodatei konnte nicht geladen werden');});
    // Initialize the first source only when a user clicks a control to avoid downloading audio on page load.
    render();
  }
  if(document.readyState === 'loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
