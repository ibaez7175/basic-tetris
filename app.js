document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const width = 10
    let nextRandom = 0
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    let timerId
    let score = 0
    let colors = [
        'blueviolet',
        'crimson',
        'royalblue',
        'orange',
        'lawngreen'
    ]

//The Tetrominos shapes
const lTetromino = [
    [1,  width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width*2+1, width+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]
const tTetromino = [
    [1,  width+1, width, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width+1, width, width*2+1]
]
const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
]
const zTetromino = [
    [1, width+1, width, width*2],
    [width+1,width,width*2+2,width*2+1],
    [1, width+1, width, width*2],
    [width+1,width,width*2+2,width*2+1]
]
const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
]

const theTetrominos = [lTetromino, tTetromino, oTetromino, zTetromino, iTetromino]

let currentPosition = 4
let currentRotation = 0

//randomly select a tetromino and it's first rotation
let random = Math.floor(Math.random()*theTetrominos.length)
console.log(random)
let current = theTetrominos[random] [currentRotation]

//draw the first rotation of first tetromino
function draw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
}

//undraw the Tetromino
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = '' 
    })
}

//move the tetrominos down the grid - using start/pause instead
//timerId = setInterval(moveDown, 500)

//assign functions to keyCodes
function control(e){
    if(e.keyCode === 37){
        moveLeft()
    } else if(e.keyCode === 39){
        moveRight()
    } else if(e.keyCode === 38){
        rotate()
    } else if(e.keyCode === 40){
        moveDown()
    }
    
}
document.addEventListener('keyup', control)

function moveDown(){
    undraw()
    currentPosition += width
    draw()
    freeze()
}

//freeze function

function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //start a new tetromino falling
        random = nextRandom
        nextRandom = Math.floor(Math.random()*theTetrominos.length)
        current = theTetrominos[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
    }
}

//move the tetromino to the left, unless at the edge or blocked
function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if(!isAtLeftEdge) currentPosition -=1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition +=1
    }
    draw()
}

function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === 9)

    if(!isAtRightEdge) currentPosition +=1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition -=1
    }
    draw()
}

//rotate the tetromino
function rotate() {
    undraw()
    currentRotation ++
    if(currentRotation === current.length){ //rotation gets to 4 make it go back to 0
        currentRotation = 0
    }
    current = theTetrominos[random][currentRotation]
    draw()
}

//show up-next tetromino in mini-grid
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
let displayIndex = 0

//Tetromino without rotations
const upNextTetro = [
    [1,  displayWidth+1, displayWidth*2+1, 2], //lTetro
    [1,  displayWidth+1, displayWidth, displayWidth+2], //tTetro
    [0,1,displayWidth,displayWidth+1], //oTetro
    [1, displayWidth+1, displayWidth, displayWidth*2], //zTetro
    [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1] //iTetro
]

//display shape in mini-grid
function displayShape() {
    //remove any trace of a tetromino for the entire mini-grid
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
    })
    upNextTetro[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}

//add functionality to the button
startBtn.addEventListener('click', () => {
    if (timerId){
        clearInterval(timerId)
        timerId = null
    } else {
        draw()
        timerId = setInterval(moveDown, 500)
        nextRandom = Math.floor(Math.random()*theTetrominos.length)
        displayShape()
    }
})

//add score
function addScore() {
    for (let i=0; i < 399 ; i +=width){
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
      
      if(row.every(index => squares[index].classList.contains('taken'))){
          score +=10
          scoreDisplay.innerHTML = score
          row.forEach(index => {
              squares[index].classList.remove('taken')
              squares[index].classList.remove('tetromino')
              squares[index].style.backgroundColor = ''
          })
          const squaresRemoved = squares.splice(i, width)
          squares = squaresRemoved.concat(squares)
          squares.forEach(cell => grid.appendChild(cell))
      }
    }
}

//game over
function gameOver(){
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        scoreDisplay.innerHTML = 'end'
        clearInterval(timerId)
    }
}


})


