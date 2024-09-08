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
const backgroundImageSrc = 'images/background.png';  // Poprawne rozszerzenie pliku
const fruitImages = [
    'images/apple.png',
    'images/banana.png',
    'images/pear.png'
];

let backgroundImage;
let images = {};

// Funkcja do ładowania obrazka
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image at ${src}`));
        img.src = src;
    });
}

// Funkcja do wstępnego ładowania obrazków
async function preloadImages() {
    try {
        backgroundImage = await loadImage(backgroundImageSrc);
        for (const fruitSrc of fruitImages) {
            const img = await loadImage(fruitSrc);
            images[fruitSrc] = img;
        }
        startGame();  // Uruchom grę po załadowaniu obrazków
    } catch (error) {
        console.error(error);
    }
}

// Funkcja rysująca owoc na kanwie
function drawFruit(fruit) {
    const img = images[fruit.imageSrc];
    if (img) {
        ctx.drawImage(img, fruit.x, fruit.y, fruit.size, fruit.size);
    } else {
        console.error(`Image not found: ${fruit.imageSrc}`);
    }
}

// Funkcja do aktualizacji stanu gry
function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);  // Rysowanie tła

    fruits.forEach((fruit, index) => {
        fruit.y += 3;
        if (fruit.y > canvas.height) {
            fruits.splice(index, 1);
        } else {
            drawFruit(fruit);
        }
    });

    if (Math.random() < 0.02) {
        fruits.push(new Fruit());
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

    requestAnimationFrame(update);
}

// Funkcja do startu timera
function startTimer() {
    setInterval(() => {
        if (timer > 0) {
            timer--;
            timerElement.innerText = 'Time: ' + timer;
        }
    }, 1000);
}

// Klasa do reprezentacji owoców
function Fruit() {
    this.x = Math.random() * canvas.width;
    this.y = -50;
    this.size = 30;
    this.imageSrc = getRandomFruitImage();  // Losowy obrazek owocu
}

// Funkcja losująca obrazek owocu
function getRandomFruitImage() {
    const randomIndex = Math.floor(Math.random() * fruitImages.length);
    return fruitImages[randomIndex];
}

// Funkcja obsługująca kliknięcia na kanwie
canvas.addEventListener('click', (e) => {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    fruits = fruits.filter(fruit => {
        if (x >= fruit.x && x <= fruit.x + fruit.size && y >= fruit.y && y <= fruit.y + fruit.size) {
            score++;
            scoreElement.innerText = 'Score: ' + score;
            return false;
        }
        return true;
    });
});

// Rozpocznij grę
preloadImages();
