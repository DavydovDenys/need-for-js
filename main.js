// добавляет еще один звук
// const crash = new Audio('C.mp3')
// crash.play();


const HEIGHT_ELEM = 100;
const MAX_ENEMY = 7;
const audio = document.createElement('audio');
audio.src = 'C.mp3';
audio.style.cssText = `position: absolute; top: 10px`;
audio.volume = 0.1;
//создаем переменные для получения нужного <div></div>
const score = document.querySelector('.score'),    // <div class="score"></div>
  start = document.querySelector('.start'),        // <div class="start"></div>
  gameArea = document.querySelector('.gameArea'),  // <div class="gameArea"></div>
  car = document.createElement('div');             // создаем новый <div></div>

// добаавляем класс .car <div class="car"></div>  
car.classList.add('car');
gameArea.style.height = Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM) * HEIGHT_ELEM;

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
  return (gameArea.offsetHeight / heightElement) + 1;

}

function startGame(event) {
  
  const target = event.target;
  if (target === start) return;
  
  switch(target.id) {
    case 'easy':
      settings.speed = 3;
      settings.traffic = 4;
      break;
    case 'medium':
      settings.speed = 5;
      settings.traffic = 3;
      break;
      case 'hard':
        settings.speed = 8;
        settings.traffic = 2;
        break
  }
 
  
  // <div class="start"> добавляем класс hide
  start.classList.add('hide');
  gameArea.innerHTML = '';

  // audio.play();
  
  
  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = `${i * HEIGHT_ELEM}px`;
    line.y = i * HEIGHT_ELEM;
    line.style.height = `${HEIGHT_ELEM / 2}px`;
    gameArea.append(line);
  }

  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * settings.traffic); i++) {
    const enemy = document.createElement('div');
    const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
    enemy.classList.add('enemy');
    enemy.y = -HEIGHT_ELEM * settings.traffic * (i + 1);
    // enemy.style.left = Math.random() * (gameArea.offsetWidth - enemy.offsetWidth) + 'px';
    
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `transparent url(./image/enemy${randomEnemy}.png) center / cover no-repeat`;
    gameArea.append(enemy);
    enemy.style.left = Math.random() * (gameArea.offsetWidth - enemy.offsetWidth) + ' px';
   
  }

  settings.score = 0;
  settings.start = true;
  
  // добаваляем к <div class="gameArea"></div> дочерний <div class="car"></div>
  gameArea.append(car);

  car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
  car.style.top = 'auto';
  car.style.bottom = '10px';
  settings.x = car.offsetLeft;
  settings.y = car.offsetTop;

  
  
  requestAnimationFrame(playGame);
}

function playGame() {
  moveRoad();
  moveEnemy();

  if (settings.start) {
    settings.score += settings.speed;
    score.innerHTML = 'SCORE<br>' + settings.score; 

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
    // line.style.height = `${HEIGHT_ELEM / 2}px`

    if (line.y > gameArea.offsetHeight) {
      line.y = -HEIGHT_ELEM;
    }
  })
}

function moveEnemy() {
  let enemys = document.querySelectorAll('.enemy');
  
  enemys.forEach(function(item) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if (carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top) {
        settings.start = false;
        console.warn('ДТП');
        // crash.play();
        // audio.pause();
        start.classList.remove('hide');
        score.style.top = score.offsetHeight;
      }
    
    
    item.y += settings.speed / 2;
    item.style.top = item.y + 'px'; 
    
    if (item.y >= gameArea.offsetHeight) {
      item.y = -HEIGHT_ELEM * settings.traffic;
      item.style.left = Math.random() * (gameArea.offsetWidth - item.offsetWidth) + 'px';     
      item.style.background = `transparent url(./image/enemy${
        Math.floor(Math.random() * MAX_ENEMY) + 1       
      }.png) center / cover no-repeat`;
    }
  });
}
// console.log(Math.floor(getQuantityElements(100)));
// console.dir(gameArea);