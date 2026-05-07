
const BG_IMAGES = ["img/01.jpg", "img/02.jpg", "img/03.jpg", "img/04.jpg"];

let currentBgIndex = 0; 

const bgLayer = document.getElementById("bg-layer");

function changeBackground() {
  currentBgIndex = (currentBgIndex + 1) % BG_IMAGES.length;
  bgLayer.style.opacity = "0";

  setTimeout(() => {
    bgLayer.style.backgroundImage = `url('${BG_IMAGES[currentBgIndex]}')`;
    bgLayer.style.opacity = "1";
  }, 1500); 
}

function initBackground() {
  bgLayer.style.backgroundImage = `url('${BG_IMAGES[currentBgIndex]}')`;
  bgLayer.style.opacity = "1";
}

initBackground();
setInterval(changeBackground, 19000);
