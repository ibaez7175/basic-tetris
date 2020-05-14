let names = ['Idaliz', 'Baez', 'Felicity', 'Martini']

/*names.forEach(name => {
    console.log(`${name} is the best!`)
})*/

console.log(names.splice(1, 1))
console.log(names)

var shapes = ['circle', 'hexagon', 'tetromino']

console.log(shapes.concat(names))

function addScore() {
    for (let i=0; i <shapes.length ; i++){
        console.log(shapes[i])
    }
}
addScore()