const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const playButton = document.getElementById('playButton');

// Ustawienia kanwy
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Zmienna gry
let score = 0;
let fruits = [];
let timer = 30;
let gameOver = false;

// Ścieżki do obrazków
const backgroundImageSrc = 'images/background.png';  // Upewnij się, że rozszerzenie jest poprawne
const fruitImages = [
    'images/apple.png',
    'images/banana.png',
    'images/pear.png'
];

// Obiekty do załadowania
const images = {
    background: new Image(),
    fruits: fruitImages.map(src => {
        const img = new Image();
        img.src = src;
        return img;
    })
};

// Załaduj obrazki i uruchom grę
function loadImages() {
    return new Promise((resolve, reject) => {
        let loadedImages = 0;
        const totalImages = fruitImages.length + 1;  // +1 for the background image

        // Ładowanie obrazka tła
        images.background.src = backgroundImageSrc;
        images.background.onload = () => {
            loadedImages++;
            if (loadedImages === totalImages) {
                resolve();
            }
        };
        images.background.onerror = () => reject(new Error(`Failed to load image at ${backgroundImageSrc}`));

        // Ładowanie obrazków owoców
        images.fruits.forEach((img, index) => {
            img.onload = () => {
                loadedImages++;
                if (loadedImages === totalImages) {
                    resolve();
                }
            };
            img.onerror = () => reject(new Error(`Failed to load image at ${fruitImages[index]}`));
        });
    });
}

// Funkcja rysująca tło
function drawBackground() {
    ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
}

// Funkcja do losowego wyboru obrazka owocu
function getRandomFruitImage() {
    const randomIndex = Math.floor(Math.random() * images.fruits.length);
    return images.fruits[randomIndex];
}

// Funkcja owoców
function Fruit() {
    this.x = Math.random() * canvas.width;
    this.y = -50;
    this.size = 30;
    this.image = getRandomFruitImage();  // Losowo wybiera obrazek
}

// Funkcja rysująca owoc
function drawFruit(fruit) {
    if (fruit.image.complete) {  // Sprawdź, czy obrazek jest załadowany
        ctx.drawImage(fruit.image, fruit.x, fruit.y, fruit.size, fruit.size);
    }
}

// Funkcja aktualizacji gry
function update() {
    if (gameOver) return;

    drawBackground();  // Rysuj tło

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

// Funkcja startowa licznika
function startTimer() {
    setInterval(() => {
        if (timer > 0) {
            timer--;
            timerElement.innerText = 'Time: ' + timer;
        }
    }, 1000);
}

// Funkcja startowa gry
function startGame() {
    loadImages()
        .then(() => {
            document.getElementById('home').style.display = 'none';  // Ukryj sekcję startową
            document.getElementById('game').style.display = 'flex';  // Pokaż sekcję gry
            startTimer();
            update();
        })
        .catch(error => {
            console.error('Error loading images:', error);
        });
}

// Obsługuje kliknięcia na kanwie
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

// Obsługuje kliknięcia przycisku "Play"
playButton.addEventListener('click', () => {
    startGame();  // Uruchom grę po kliknięciu przycisku
});
