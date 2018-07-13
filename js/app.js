var COL = 101;
var ROW = 83;
var playerRow = 4;
var playerCol = 2;
var collide = false;
var gameSpeed = 500;
var numEnemiesPerRow = 2;
var gameFinished = false;
// 这是我们的玩家要躲避的敌人
var Enemy = function(x = 0, y = 60, row = 1) {
  // 要应用到每个敌人的实例的变量写在这里
  // 我们已经提供了一个来帮助你实现更多
  this.x = x;
  this.y = y;
  this.refresh = false;
  this.timerSet = false;
  // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
  this.sprite = 'images/enemy-bug.png';
  this.row = row;
  this.col = 0;
  this.speed = Math.round(Math.random()*200+400);
};

var gameFinish = function(){
  gameFinished = true;
  ctx.font = '50px serif';
  ctx.textAlign = 'center';
  ctx.strokeStyle = 'black';
  //ctx.moveTo(ctx.width/2, ctx.height/2);
  setTimeout(()=>{ctx.strokeText('Game Cleared!',ctx.canvas.width/2, ctx.canvas.height/2 );}, 500);
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
  // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
  // 都是以同样的速度运行的
  if(!gameFinished){
    if(this.x < 510){
      this.x+=this.speed*dt;
      this.col = Math.round((this.x+0.5*COL)/COL-1);
      if(this.row == playerRow && this.col == playerCol){
        collide = true;
      }
    }else{
      if(this.refresh){
        this.x = -100;
        this.timerSet = false;
        this.refresh = false;
      }else if(!this.timerSet){
        this.timerSet = true;
        setTimeout(()=>{
          this.refresh = true;
        }, Math.round(Math.random()*1000));
      }
    }
  }

  //this.x+=100*dt;

};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var playerClass = function(){
  this.x = 2*COL;
  this.y = 4*ROW;
  this.sprite = 'images/char-boy.png';
  this.row = 4;
  this.col = 2;
};

playerClass.prototype = Object.create(Enemy.prototype);

playerClass.prototype.update = function(){
  if(!gameFinished){
    playerRow = this.row;
    playerCol = this.col;
    if(collide){
      collide = false;
      this.x = 2*COL;
      this.y = 4*ROW;
      this.row = 4;
      this.col = 2;
    }
  }
  if(this.row == 0){
    gameFinish();
  }
};



playerClass.prototype.handleInput = function(key) {
  if(!gameFinished){
    switch(key){
      case 'left':
        if(this.col == 0)
          break;
        this.x-=COL;
        this.col--;
        break;
      case 'right':
        if(this.col == 4)
          break;
        this.x+=COL;
        this.col++;
        break;
      case 'up':
        if(this.row == 0)
          break;
        this.y-=ROW;
        this.row--;
        break;
      case 'down':
        if(this.row == 5)
          break;
        this.y+=ROW;
        this.row++;
        break;
    }
  }

};



// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var player = new playerClass();
var allEnemies = [];

for(let i = 0; i < 3; i++){
  for(let j = 0; j < numEnemiesPerRow; j++){
    let yAxis = i == 0? 60: 150;
    yAxis = i == 2? 230: yAxis;
    allEnemies.push(new Enemy(Math.random()*400, yAxis,i+1));
  }
}

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
