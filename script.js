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

const photoPreview = document.getElementById('photoPreview');
const photoTools = document.getElementById('photoTools');
const resetPhotoPosition = document.getElementById('resetPhotoPosition');
const photoCaption = document.getElementById('photoCaption');
const photoStrip = document.getElementById('photoStrip');
const birthdayPhotos = [
  'images/KakaoTalk_Photo_2026-08-21-20-12-11.jpeg',
  'images/KakaoTalk_Photo_2026-08-21-20-12-16.jpeg',
  'images/KakaoTalk_Photo_2026-08-21-20-12-23.jpeg',
  'images/KakaoTalk_Photo_2026-08-21-20-12-27.jpeg',
  'images/KakaoTalk_Photo_2026-08-21-20-12-30.jpeg',
  'images/KakaoTalk_Photo_2026-08-21-20-12-37.jpeg',
  'images/KakaoTalk_Photo_2026-08-21-20-12-40.jpeg',
  'images/KakaoTalk_Photo_2026-08-21-20-12-46.jpeg',
];
const photoStateKey = 'wooniBirthdayPhotoPositions';
const selectedPhotoKey = 'wooniBirthdaySelectedPhoto';
let photoPosition = { x: 50, y: 50 };
let dragStart = null;
let didDragPhoto = false;
let selectedPhoto = localStorage.getItem(selectedPhotoKey) || birthdayPhotos[0];

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function getPhotoPositions() {
  return JSON.parse(localStorage.getItem(photoStateKey) || '{}');
}

function savePhotoPositions(positions) {
  localStorage.setItem(photoStateKey, JSON.stringify(positions));
}

function applyPhoto(image, position = photoPosition) {
  photoPosition = {
    x: clamp(position.x ?? 50),
    y: clamp(position.y ?? 50),
  };
  selectedPhoto = image;
  localStorage.setItem(selectedPhotoKey, image);
  photoPreview.classList.add('has-image');
  photoPreview.style.backgroundImage = `url(${image})`;
  photoPreview.style.setProperty('--photo-x', `${photoPosition.x}%`);
  photoPreview.style.setProperty('--photo-y', `${photoPosition.y}%`);
  photoTools.classList.add('active');
  const photoIndex = birthdayPhotos.indexOf(image) + 1;
  photoCaption.textContent = `${photoIndex}/${birthdayPhotos.length} · 사진을 손가락으로 밀어서 위치 조정 ✨`;
  document.querySelectorAll('.photo-thumb').forEach((thumb) => {
    thumb.classList.toggle('active', thumb.dataset.photo === image);
  });
}

function selectPhoto(image) {
  const positions = getPhotoPositions();
  applyPhoto(image, positions[image] || { x: 50, y: 50 });
  burstConfetti(18);
}

function savePhotoPosition() {
  const positions = getPhotoPositions();
  positions[selectedPhoto] = photoPosition;
  savePhotoPositions(positions);
}

function resetPosition() {
  photoPosition = { x: 50, y: 50 };
  applyPhoto(selectedPhoto, photoPosition);
  savePhotoPosition();
}

birthdayPhotos.forEach((photo, index) => {
  const thumb = document.createElement('button');
  thumb.type = 'button';
  thumb.className = 'photo-thumb';
  thumb.dataset.photo = photo;
  thumb.style.backgroundImage = `url(${photo})`;
  thumb.setAttribute('aria-label', `추억 사진 ${index + 1} 보기`);
  thumb.addEventListener('click', () => selectPhoto(photo));
  photoStrip.appendChild(thumb);
});

if (!birthdayPhotos.includes(selectedPhoto)) selectedPhoto = birthdayPhotos[0];
selectPhoto(selectedPhoto);

resetPhotoPosition.addEventListener('click', resetPosition);

photoPreview.addEventListener('click', (event) => {
  if (photoPreview.classList.contains('has-image') && didDragPhoto) {
    event.preventDefault();
    didDragPhoto = false;
  }
});

photoPreview.addEventListener('pointerdown', (event) => {
  if (!photoPreview.classList.contains('has-image')) return;
  event.preventDefault();
  dragStart = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    position: { ...photoPosition },
  };
  didDragPhoto = false;
  photoPreview.classList.add('dragging');
  photoPreview.setPointerCapture(event.pointerId);
});

photoPreview.addEventListener('pointermove', (event) => {
  if (!dragStart || dragStart.pointerId !== event.pointerId) return;
  const rect = photoPreview.getBoundingClientRect();
  const dx = ((event.clientX - dragStart.x) / rect.width) * 100;
  const dy = ((event.clientY - dragStart.y) / rect.height) * 100;
  if (Math.abs(dx) > 1 || Math.abs(dy) > 1) didDragPhoto = true;
  photoPosition = {
    x: clamp(dragStart.position.x + dx),
    y: clamp(dragStart.position.y + dy),
  };
  photoPreview.style.setProperty('--photo-x', `${photoPosition.x}%`);
  photoPreview.style.setProperty('--photo-y', `${photoPosition.y}%`);
});

function endPhotoDrag(event) {
  if (!dragStart || dragStart.pointerId !== event.pointerId) return;
  photoPreview.classList.remove('dragging');
  photoPreview.releasePointerCapture(event.pointerId);
  dragStart = null;
  savePhotoPosition();
}

photoPreview.addEventListener('pointerup', endPhotoDrag);
photoPreview.addEventListener('pointercancel', endPhotoDrag);

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
