const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const confettiRoot = document.querySelector('.confetti');

function burstConfetti(count = 36) {
  const colors = ['#ff3fa4', '#ff8ccf', '#8a42ff', '#ffd36f', '#ffffff'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = 1.6 + Math.random() * 1.8 + 's';
    piece.style.animationDelay = Math.random() * .25 + 's';
    confettiRoot.appendChild(piece);
    setTimeout(() => piece.remove(), 3800);
  }
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => item.classList.remove('active'));
    panels.forEach((panel) => panel.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
    burstConfetti(12);
  });
});

const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');

photoInput.addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    photoPreview.classList.add('has-image');
    photoPreview.style.backgroundImage = `url(${reader.result})`;
    burstConfetti(28);
  };
  reader.readAsDataURL(file);
});

const cake = document.querySelector('.cake');
const wishBtn = document.getElementById('wishBtn');
const cakeMsg = document.getElementById('cakeMsg');

function blowCandles() {
  cake.classList.add('blown');
  cakeMsg.textContent = '소원 접수 완료! 우니 생일추카해 💖';
  cakeMsg.classList.remove('wished');
  void cakeMsg.offsetWidth;
  cakeMsg.classList.add('wished');
  burstConfetti(110);
  setTimeout(() => {
    cake.classList.remove('blown');
    cakeMsg.textContent = '우니 또 소원 빌어도 됨 👑';
    cakeMsg.classList.remove('wished');
  }, 3200);
}

wishBtn.addEventListener('click', blowCandles);
document.querySelectorAll('.candle').forEach((candle) => candle.addEventListener('click', blowCandles));

const giftBoxes = document.querySelectorAll('.gift-box');
const giftResult = document.getElementById('giftResult');

giftBoxes.forEach((box) => {
  box.addEventListener('click', () => {
    giftBoxes.forEach((item) => item.classList.remove('opened'));
    box.classList.add('opened');
    box.querySelector('b').textContent = '💖';
    giftResult.textContent = `당첨! ${box.dataset.gift}`;
    burstConfetti(64);
  });
});

window.addEventListener('load', () => burstConfetti(40));
