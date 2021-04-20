const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "media/flappy-bird-set.png";

// réglages générales
let gamePlaying = false; //on joue ou pas? ecran d'accueil ou pas
const gravity = .5; // vitesse de la gravity
const speed = 5.2; //vitesse des poteaux qui arrivent
const size = [51, 36]; //taille de l'oiseau largeur et hauteur
const jump = -9.5; 
const cTenth = (canvas.width / 10);
// variable qui évolue au fil du jeux
    let index = 0, //pour créer l'effet d'optique
    bestScore = 0, //commence score = 0
    flight,   //le vol
    flyHeight, //la hauteur de vol
    currentScore, 
    pipes = []; //création des poteaux

    // pipe settings
const pipeWidth = 78;
const pipeGap = 270; // ecart entre les poteaux
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth; // emplacement des poteaux

const setup = () => {
  currentScore = 0;
  flight = jump;

  // set initial flyHeight (middle of screen - size of the bird)
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  // setup first 3 pipes
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}


const render = () => {
  // make the pipe and bird moving  c'est le rendu
  index++; //lui qui fait évoluer le rendement

  //background

  ctx.drawImage(img, 0 , 0, canvas.width, canvas.height, -((index * (speed /2)) % canvas.width) + canvas.width,0, canvas.width, canvas.height);
  ctx.drawImage(img, 0 , 0, canvas.width, canvas.height, -((index * (speed /2)) % canvas.width),0, canvas.width, canvas.height);
  if(gamePlaying === true){
    ctx.drawImage(img,  432, Math.floor((index % 9)/ 3) * size[1],...size, cTenth, flyHeight, ...size);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else{
    ctx.drawImage(img,  432, Math.floor((index % 9)/ 3) * size[1],...size, ((canvas.width / 2) - size[0] / 2), flyHeight,...size); //les 4 premiers paramètres sont où est l'image et les 4 derniers paramètres sont où on veut mettre l'image
    flyHeight = (canvas.height / 2) - (size[1] / 2);
  
    ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
    ctx.fillText('cliquez pour jouer', 48, 535);
    ctx.font = "bold 30px courier";
  }
 
//affichage des tuyaux du haut et bas
if(gamePlaying === true){
    pipes.map(pipe => {
        pipe[0] -= speed;

        ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0 ,pipeWidth, pipe[1]);
        ctx.drawImage(img, 432 + pipeWidth, 108,pipeWidth, canvas.height- pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);
    if(pipe[0] <= -pipeWidth){
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);

        // remove pipe  plus create new one

    pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
    }

    //fin de partie si crash poteau
    if([
        pipe[0]<= cTenth + size[0],
        pipe[0] + pipeWidth >= cTenth,
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
    ].every(elem => elem)) {
        gamePlaying = false;
        setup();
    }
    })
}

document.getElementById('bestScore').innerHTML = `Meilleur : ${bestScore}`;
document.getElementById('currentscore').innerHTML = `Actuel : ${currentScore}`;
  window.requestAnimationFrame(render);
}
setup();
img.onload = render;

document.addEventListener('click', () => gamePlaying = true);

document.addEventListener('touchstart', () => gamePlaying = true);
window.onclick = () => flight = jump;
window.ontouchstart = () => flight = jump;