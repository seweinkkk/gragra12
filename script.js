const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let fruits = [];
let timer = 30;
let gameOver = false;

// Ścieżki do obrazków
const backgroundImageSrc = 'images/background.png';  // Poprawione rozszerzenie
const fruitImages = [
    'images/apple.png',
    'images/banana.png',
    'images/pear.png'
];

// Funkcja do ładowania obrazków jako obietnic
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image at ${src}`));
    });
}

// Załaduj wszystkie obrazki
Promise.all(fruitImages.map(loadImage))
    .then(imagesArray => {
        imagesArray.forEach((img, index) => {
            images[fruitImages[index]] = img;
        });
        console.log('Fruit images loaded');
    })
    .catch(error => console.error(error));

const images = {};
loadImage(backgroundImageSrc)
    .then(img => {
        backgroundImage = img;
        console.log('Background image loaded');
    })
    .catch(error => console.error(error));

// Funkcja do losowego wyboru obrazka
function getRandomFruitImage() {
    const randomIndex = Math.floor(Math.random() * fruitImages.length);
    return fruitImages[randomIndex];
}

function Fruit() {
    this.x = Math.random() * canvas.width;
    this.y = -50;
    this.size = 30;
    this.imageSrc = getRandomFruitImage();
    this.image = new Image();
    this.image.src = this.imageSrc;
    this.image.onload = () => console.log(`Fruit image loaded: ${this.imageSrc}`);
    this.image.onerror = () => console.error(`Failed to load fruit image: ${this.imageSrc}`);
}

function drawFruit(fruit) {
    const img = images[fruit.imageSrc];
    if (img) {
        ctx.drawImage(img, fruit.x, fruit.y, fruit.size, fruit.size);
    } else {
        console.error(`Image not found: ${fruit.imageSrc}`);
    }
}

function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (backgroundImage) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);  // Rysowanie tła
    }

    fruits.forEach((fruit, index) => {
        fruit.y += 3; // Przesuwanie owoców w dół
        if (fruit.y > canvas.height) {
            fruits.splice(index, 1); // Usuwanie owoców, które spadły poza ekran
        } else {
            drawFruit(fruit); // Rysowanie owoców
        }
    });

    if (Math.random() < 0.02) {
        fruits.push(new Fruit()); // Dodawanie nowych owoców losowo
    }

    if (timer <= 0) {
        gameOver = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '48px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 60);
        ctx.font = '24px Arial';
        ctx.fillText('Final Score: ' + score, canvas.width / 2, canvas.height / 2);
        return;
    }

    requestAnimationFrame(update); // Kontynuowanie aktualizacji gry
}

function startTimer() {
    setInterval(() => {
        if (timer > 0) {
            timer--;
            timerElement.innerText = 'Time: ' + timer;
        }
    }, 1000);
}

canvas.addEventListener('click', (e) => {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    fruits.forEach((fruit, index) => {
        if (x > fruit.x && x < fruit.x + fruit.size && y > fruit.y && y < fruit.y + fruit.size) {
            score++;
            scoreElement.innerText = 'Score: ' + score;
            fruits.splice(index, 1); // Usuwanie klikniętego owocu
        }
    });
});

function startGame() {
    score = 0;
    timer = 30;
    gameOver = false;
    fruits = [];
    scoreElement.innerText = 'Score: ' + score;
    timerElement.innerText = 'Time: ' + timer;
    startTimer();
    update(); // Rozpoczęcie aktualizacji gry
}

// Uruchomienie gry po załadowaniu strony
window.onload = startGame;
