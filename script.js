const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const backgroundImageSrc = 'images/background.png';  // Używaj poprawnego rozszerzenia
const fruitImages = [
    'images/apple.png',
    'images/banana.png',
    'images/pear.png'
];

let backgroundImage;
let fruits = [];
let images = {};

async function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image at ${src}`));
        img.src = src;
    });
}

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
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

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

function startGame() {
    startTimer();
    update();
}

preloadImages();
