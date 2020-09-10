const MAX_ENEMY = 7;
const audio = document.createElement('audio');
audio.src = 'C.mp3';
audio.style.cssText = `position: absolute; top: 10px`;
audio.volume = 0.3;
//создаем переменные для получения нужного <div></div>
const score = document.querySelector('.score'),    // <div class="score"></div>
  start = document.querySelector('.start'),        // <div class="start"></div>
  gameArea = document.querySelector('.gameArea'),  // <div class="gameArea"></div>
  car = document.createElement('div');             // создаем новый <div></div>

// добаавляем класс .car <div class="car"></div>  
car.classList.add('car');

// добавляем обработчик событий(click)-при нажатии вызывается ф-я startGame
start.addEventListener('click', startGame);

// добавляем обработчик событий(keydown)-при нажатии на любую клавишу вызывается ф-я startGame
document.addEventListener('keydown', startRun);

// добавляем обработчик событий(keyup)-когда отпускаем клавишу вызывается ф-я stopRun
document.addEventListener('keyup', stopRun);


const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
};

const settings = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3
};


function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

function startGame() {
  // <div class="start"> добавляем класс hide
  start.classList.add('hide');
  audio.play();
  
  
  for (let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = `${i * 100}px`;
    line.y = i * 100;
    gameArea.append(line);
  }

  for (let i = 0; i < getQuantityElements(100 * settings.traffic); i++) {
    const enemy = document.createElement('div');
    const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
    enemy.classList.add('enemy');
    enemy.y = -100 * settings.traffic * (i + 1);
    enemy.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `transparent url(./image/enemy${randomEnemy}.png) center / cover no-repeat`;
    gameArea.append(enemy);
    console.log(randomEnemy);
  }

  settings.start = true;
  
  // добаваляем к <div class="gameArea"></div> дочерний <div class="car"></div>
  gameArea.append(car);
  settings.x = car.offsetLeft;
  settings.y = car.offsetTop;
  
  requestAnimationFrame(playGame);
}

function playGame() {
  moveRoad();
  moveEnemy();

  if (settings.start) {
    
    if (keys.ArrowLeft && settings.x > 0) {
      settings.x -= settings.speed;  
    }
    
    if (keys.ArrowRight && settings.x < (gameArea.offsetWidth - car.offsetWidth)) {
      settings.x += settings.speed;
    }
    
    if (keys.ArrowUp && settings.y > 0) {
      settings.y -= settings.speed
    }

    if (keys.ArrowDown && settings.y < (gameArea.offsetHeight - car.offsetHeight)) {
      settings.y += settings.speed
    }
    
    car.style.left = settings.x + 'px';
    car.style.top = settings.y + 'px';
    
    requestAnimationFrame(playGame);
  }
}

function startRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    // event.preventDefault();
    keys[event.key] = true;
  }
}

function stopRun(event) {
  // event.preventDefault();
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = false;
  }
   
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(function(line) {
    line.y += settings.speed;
    line.style.top = line.y + 'px';

    if (line.y > document.documentElement.clientHeight) {
      line.y = -100;
    }
  })
}

function moveEnemy() {
  let enemys = document.querySelectorAll('.enemy');
  enemys.forEach(function(item) {
    item.y += settings.speed / 2;
    item.style.top = item.y + 'px'; 
    
    if (item.y >= document.documentElement.clientHeight) {
      item.y = -100 * settings.traffic;
      item.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';     
      item.style.background = `transparent url(./image/enemy${
        Math.floor(Math.random() * MAX_ENEMY) + 1       
      }.png) center / cover no-repeat`;
    }
  });
}