const canvas = document.getElementById ('canvas1');//id canvas 
const ctx = canvas.getContext('2d');//planos 2d
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//accediendo id="collisionCanvas" de index.html
const collisionCanvas = document.getElementById ('collisionCanvas');//id collisionCanvas 
const collisionCtx = collisionCanvas.getContext('2d');//planos 2d
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let score = 0;//inicializa variable score para funcion drawScore
ctx.font = '50px Impact';

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let ravens = [];//creacion array vacio
class Raven{
    //variable constructor
    constructor() {
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random()*0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'raven.png';
        this.frame = 0;
        this.maxFrame =4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() *50 + 50;
        this.randomColors =  [Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] +')';
        
        

        
    }
    //fentender funcion
    update(deltatime) {

        if(this.y < 0|| this.y > canvas.height -  this.height){
            this.directionY = this.directionX * -1;
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if (this.x < 0 - this.width) this.markedForDeletion = true;
        this.timeSinceFlap += deltatime;
        if(this.timeSinceFlap> this.flapInterval){
            if(this.frame>  this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
        }

    }
    draw() {
        collisionCtx.fillStyle =  this.color;
        collisionCtx.fillRect(this.x, 
                       this.y, 
                       this.width, 
                       this.height);
        ctx.drawImage(this.image, 
                      this.frame * this.spriteWidth,
                      0,this.spriteWidth,
                      this.spriteHeight,
                      this.x,
                      this.y, 
                      this.width,
                      this.height);
    }
}
//funcion que imprime 'puntitos en el borde superior(50,75)'
    function drawScore() {
        ctx.fillStyle = 'black';
        ctx.fillText('puntitos obtenidos: '+ score, 50, 75);
        ctx.fillStyle = 'white';
        ctx.fillText('puntitos obtenidos: '+ score, 50, 79)
        
    }
    //capturando evento click
    window.addEventListener('click',function(e){
        //console.log(e.y, e.x);
        const detetctPixelColor= ctx.getImageData(e.x,e.y,1,1);
        console.log(detetctPixelColor);
    })
   
    //creacion nuevo objeto tipo Raven
    const raven = new Raven();
    
    function animate(timestamp){
        //funcion clearRect???
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let deltatime = timestamp - lastTime;
        lastTime = timestamp;
        timeToNextRaven += deltatime;
        //valida la variable timeToNextRaven para devolver a 0
        if(timeToNextRaven > ravenInterval){
            ravens.push(new Raven());
            timeToNextRaven = 0;
            ravens.sort(function(a,b){
                return a.width - b.width;
            })
            
        }
        drawScore();
    [...ravens].forEach(object=>object.update(deltatime));
    [...ravens].forEach(object=>object.draw());
    ravens = ravens.filter(object=>!object.markedForDeletion);
    requestAnimationFrame(animate);
}
animate(0);
