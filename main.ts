function isOnSnake (x: number, y: number) {
    for (let body of snake) {
        if (body.x() == x && body.y() == y) {
            return true
        }
    }
    return false
}
function moveForward () {
    dx = dxOffset[direction]
    px += dx[0]
    py += dx[1]
    if (!(validPixelCoordinate(px, py))) {
        gameOver()
    }
    snake.unshift(game.createSprite(px, py))
    last = snake.pop()
    last.delete()
}
function turnLeft () {
    direction = (direction + 3) % 4
}
function resetGame () {
    game.setScore(0)
    score = 0
    direction = 0
    px = 0
    py = 0
    for (let s of snake) {
        s.delete()
    }
    snake = initSnake([
    px,
    py,
    px + 1,
    py
    ])
    placeNextApple()
    game.resume()
}
input.onButtonPressed(Button.A, function () {
    turnLeft()
})
function initSnake (arr: any[]) {
    for (let i = 0; i + 1 < arr.length; i += 2) {
        result.push(game.createSprite(arr[i], arr[i + 1]));
    }
return result
}
input.onButtonPressed(Button.AB, function () {
    resetGame()
})
function gameOver () {
    game.setScore(score)
    game.pause()
    basic.pause(1000)
    game.gameOver()
}
function turnRight () {
    direction = (direction + 1) % 4
}
function letComputerPlay () {
    let x2 = snake[0].x();
let y2 = snake[0].y();
// next distance to apple if moving forward
    dx2 = dxOffset[direction]
    nx1 = x2 + dx2[0]
    ny1 = y2 + dx2[1]
    dist1 = 9999
    if (validPixelCoordinate(nx1, ny1)) {
        dist1 = Math.abs(nx1 - apple.x()) + Math.abs(ny1 - apple.y())
    }
    // next distance to apple if turning right
    dx1 = (direction + 1) % 4
    dx2 = dxOffset[dx1]
    nx2 = x2 + dx2[0]
    ny2 = y2 + dx2[1]
    dist2 = 9999
    if (validPixelCoordinate(nx2, ny2)) {
        dist2 = Math.abs(nx2 - apple.x()) + Math.abs(ny2 - apple.y())
    }
    // next distance to apple if turning left
    dx22 = (direction + 3) % 4
    dx2 = dxOffset[dx22]
    nx3 = x2 + dx2[0]
    ny3 = y2 + dx2[1]
    dist3 = 9999
    if (validPixelCoordinate(nx3, ny3)) {
        dist3 = Math.abs(nx3 - apple.x()) + Math.abs(ny3 - apple.y())
    }
    if (dist1 <= dist2 && dist1 <= dist3) {
        // best strategy is moving forward without turning
        return
    } else if (dist2 <= dist1 && dist2 <= dist3) {
        turnRight()
    } else if (dist3 <= dist1 && dist3 <= dist2) {
        turnLeft()
    }
}
input.onButtonPressed(Button.B, function () {
    turnRight()
})
function placeNextApple () {
    let x, y;
do {
        x = Math.randomRange(0, 4);
        y = Math.randomRange(0, 4);
    } while (isOnSnake(x, y));
apple.goTo(x, y);
apple.setBrightness(100);
}
function validPixelCoordinate (nx: number, ny: number) {
    return nx >= 0 && nx <= 4 && ny >= 0 && ny <= 4 && !(isOnSnake(nx, ny))
}
let delay = 0
let dist3 = 0
let ny3 = 0
let nx3 = 0
let dx22 = 0
let dist2 = 0
let ny2 = 0
let nx2 = 0
let dx1 = 0
let dist1 = 0
let ny1 = 0
let nx1 = 0
let dx2: number[] = []
let score = 0
let last: game.LedSprite = null
let dx: number[] = []
let py = 0
let px = 0
let dxOffset: number[][] = []
let direction = 0
let snake: game.LedSprite[] = []
let result: game.LedSprite[] = []
direction = 1
dxOffset = [
[1, 0],
[0, 1],
[-1, 0],
[0, -1]
]
snake = initSnake([
px,
py,
px + 1,
py
])
let apple = game.createSprite(2, 2)
// when snake grows to 10 pixels, it stops growing
// to avoid filling the LED
let maxLength = 10
placeNextApple()
basic.forever(function () {
    if (game.isGameOver()) {
        return;
    }
    delay = Math.max(100, 1000 - score * 50)
    basic.pause(delay)
    // letComputerPlay();
    moveForward()
    if (snake[0].isTouching(apple)) {
        if (snake.length < maxLength) {
            snake.push(snake[snake.length - 1])
        }
        score += 1
        placeNextApple()
    }
})
