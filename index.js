const body = document.querySelector('body')
const canvas = document.querySelector('#canvas')
const text = document.querySelector('#text')
const input = document.querySelector('#input')
const link = document.querySelector('#link')
const audio = new Audio('confetti.wav');

const RANDOM = [
    'WOW!',
    'Congratulations!',
    `HAPPY ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]}!`
]

const PARTICLE_SCALE = 2

const url = new URL(document.location)

if(url.searchParams) {
    const parsed = url.searchParams.get('t') || ''
    const decoded = atob(parsed)
    text.innerText = decoded
    input.value = decoded
}

if(!text.innerText) {
    const sample = RANDOM[Math.floor(Math.random() * (RANDOM.length))]
    text.innerText = sample
    input.value = sample
}

const cannon = confetti.create(canvas, {
    resize: true,
    useWorker: false
});

function fireCannon(playSound) {
    const count = 200;

    const defaults = {
        origin: { y: 1  },
        useWorker: true
    };

    function fireSingle(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    if(playSound) {
        audio.play()
    }

    fireSingle(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fireSingle(0.2, {
        spread: 60,
        scalar: 1 * PARTICLE_SCALE
    });

    fireSingle(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8 * PARTICLE_SCALE
    });

    fireSingle(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2 * PARTICLE_SCALE
    });

    fireSingle(0.1, {
        spread: 120,
        startVelocity: 45,
        scalar: 1 * PARTICLE_SCALE
    });
}

function updateUrl(entered) {
    const encoded = btoa(entered);
    text.innerText = entered

    const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}?t=${encoded}`;
    window.history.pushState({ path: url }, '', url)
}

body.addEventListener('click', () => {
    fireCannon(true)
})

text.addEventListener('click', () => {
    text.style.display = 'none'
    input.style.display = 'block'
    input.focus()
    event.stopImmediatePropagation()
})

input.addEventListener('click', (event) => {
    event.stopImmediatePropagation()
})

input.addEventListener('change', (event) => {
    updateUrl(event.target.value)
})

input.addEventListener('blur', (event) => {
    text.style.display = 'block'
    input.style.display = 'none'
    event.stopImmediatePropagation()
})

link.addEventListener('click', (event) => {
    event.stopImmediatePropagation()

    const entered = window.prompt('Enter input');
    if(!entered) return

    updateUrl(entered);

    text.style.display = 'block';
    input.style.display = 'none';
    fireCannon()
})

setInterval(() => {
    fireCannon(false)
}, 5000)

fireCannon(false)
