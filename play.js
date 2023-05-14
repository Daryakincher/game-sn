class GameField {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this._cells = [];
      this._create();
    }
  
    
    _create() {
      const fieldElement = document.querySelector(".field");
      fieldElement.style.width = `${this.width * 50}px`;
      fieldElement.style.height = `${this.height * 50}px`;
  
      for (let i = 0; i < this.width * this.height; i++) {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
  
        this._cells.push(cellElement);
        fieldElement.appendChild(cellElement);
      }
  
      document.querySelector(
        ".button"
      ).textContent = `Нажмите кнопку, чтобы начать`;
    }
  
    clear() {
      this._cells.forEach((cell) => {
        cell.className = "cell";
      });
      document.querySelector(".button").style.background = "#2e42db";
      document.querySelector(".button").textContent = ``;
    }
  
    getCell(x, y) {
      return this._cells[y * this.width + x];
    }
  }
  
  class Snake {
    constructor(fieldWidth, fieldHeight) {
      this._fieldWidth = fieldWidth;
      this._fieldHeight = fieldHeight;
      this.reset();
      this.resetNew();
      this.setScore();
    }
 
    reset() {
      this.snakeFigure = [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
      ];
      this._movement = { x: 1, y: 0 };
      this.isAlive = true;
    }
  
    resetNew() {
      this._scoreValue = 0;
      this._maxValue = 0;
    }
  
    resetСurrent() {
      this._scoreValue = 0;
      this._maxValue = localStorage.getItem("maxValue") || 0;
    }
  
    draw(field) {
      this.snakeFigure.forEach((cell, index) => {
        const element = field.getCell(cell.x, cell.y);
        if (index === 0) {
          element.classList.add("snake-head");
        } else {
          element.classList.add("snake-figure");
        }
      });
    }
  
    move(appleX, appleY) {
      const snakeHead = this._getNextSnakeHead();
      if (this._isCollision(snakeHead)) {
        this.isAlive = false;
        return false;
      }
  
      this.snakeFigure.unshift(snakeHead);
      if (snakeHead.x === appleX && snakeHead.y === appleY) {
        this._scoreValue++;
        this._maxValue =
          this._scoreValue > this._maxValue ? this._scoreValue : this._maxValue;
        localStorage.setItem("maxValue", this._maxValue);
        localStorage.setItem("scoreValue", this._scoreValue);
        return true;
      }
    
      this.snakeFigure.pop();
      return false;
    }
  
    setScore() {
      document.querySelector(
        ".score-value"
      ).textContent = `СЧЕТ: ${this._scoreValue}`;
      document.querySelector(
        ".max-value"
      ).textContent = `ЛУЧШИЙ РЕЗУЛЬТАТ: ${this._maxValue}`;
    }
  
    _getNextSnakeHead() {
      const snakeHead = this.snakeFigure[0];
      return {
        x: snakeHead.x + this._movement.x,
        y: snakeHead.y + this._movement.y,
      };
    }
  
    _isCollision(point) {
      return (
        point.x < 0 ||
        point.x >= this._fieldWidth ||
        point.y < 0 ||
        point.y >= this._fieldHeight ||
        this.snakeFigure.some((cell) => cell.x === point.x && cell.y === point.y)
      );
    }

    setDirection(movement) {
      if (movement.x !== -this._movement.x || movement.y !== -this._movement.y) {
        this._movement = movement;
      }
    }
  
    getNextSpeed(baseSpeed) {
      return baseSpeed - (baseSpeed / 20) * this._scoreValue;
    }
  }
  

  class Apple {
    generate(field, snake) {
      do {
        this.x = Math.floor(Math.random() * field.width);
        this.y = Math.floor(Math.random() * field.height);
      } while (
        snake.snakeFigure.some((cell) => cell.x === this.x && cell.y === this.y)
      );
    }
  
    draw(field) {
      const element = field.getCell(this.x, this.y);
      element.classList.add("apple");
    }
  }
  
  let isGameOn = false;
  const field = new GameField(10, 10);
  const snake = new Snake(field.width, field.height);
  const apple = new Apple();
  
  function startGame() {
    isGameOn = true;
  
    setEventListener(snake);
  
    apple.generate(field, snake);
    game(field, snake, apple);
  }

  function game(field, snake, apple) {
    field.clear();
 
    const gotApple = snake.move(apple.x, apple.y);
    if (gotApple) {
      apple.generate(field, snake);
      snake.setScore();
    }

    if (!snake.isAlive) {
      isGameOn = false;
      document.querySelector(".button").style.background = "#bf0224";
      document.querySelector(
        ".button"
      ).textContent = `Игра окончена.\u00A0 \u00A0 Ваш счет: ${snake._scoreValue}.\u00A0 \u00A0 Перезапустить.`;
      snake.reset();
      snake.resetСurrent();
      snake.setScore();
      return;
    }
  
    snake.draw(field);
    apple.draw(field);
  
    setTimeout(() => {
      game(field, snake, apple);
    }, snake.getNextSpeed(500));
  }
  
  function setEventListener(snake) {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
          snake.setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          snake.setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          snake.setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          snake.setDirection({ x: 1, y: 0 });
          break;
      }
    });
  }
  
  document.querySelector(".field").addEventListener("click", function () {
    if (!isGameOn) {
      startGame();
    }
  });
  
  document.querySelector(".button").addEventListener("click", function () {
    if (!isGameOn) {
      startGame();
    }
  });

 