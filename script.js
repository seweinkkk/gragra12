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

// Tablica z nazwami obrazków
const fruitImages = [
    'images/apple.png',
    'images/banana.png',
    'images/pear.png'
];

// Funkcja do losowego wyboru obrazka
function getRandomFruitImage() {
    const randomIndex = Math.floor(Math.random() * fruitImages.length);
    return fruitImages[randomIndex];
}

// Klasa owoców
function Fruit() {
    this.x = Math.random() * canvas.width;
    this.y = -50;
    this.size = 30;
    this.image = new Image();
    this.image.src = getRandomFruitImage();
    
    // Sprawdź, czy obrazek został załadowany
    this.image.onload = () => {
        console.log('Obrazek załadowany:', this.image.src);
    };

    // Obsłuż błąd ładowania obrazka
    this.image.onerror = () => {
        console.error('Błąd ładowania obrazka:', this.image.src);
    };
}

function drawFruit(fruit) {
    if (fruit.image.complete && fruit.image.naturalWidth !== 0) {
        ctx.drawImage(fruit.image, fruit.x, fruit.y, fruit.size, fruit.size);
    } else {
        console.error('Obrazek jest uszkodzony lub nie został załadowany:', fruit.image.src);
    }
}

function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    fruits = fruits.filter(fruit => {
        if (x >= fruit.x && x <= fruit.x + fruit.size && y >= fruit.y && y <= fruit.y + fruit.size) {
            score++;
            scoreElement.innerText = 'Score: ' + score;
            return false;
        }
        return true;
    });
});

startTimer();
update();
