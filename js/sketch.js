const {
    Engine,
    World,
    Bodies,
    MouseConstraint,
    Constraint,
    Mouse,
    Body,
    Events,
    Bounds,
    Composite,
    Common,
    Svg,
    Composites,
} = Matter;

const MAX_BALLS = 2;
var ballsLeft = MAX_BALLS; // how many balls will player have on startup;

let grounds = [];
let boxes = [];
let stars = [];
let ball;
let paddle;
let world, engine;
var mConstraint;
var paddleHeight = 500; // y posision of paddle, should be equal: height - 100
const maxBallSpeed = 70;
var countBoxes = 0;
var countStars = 0;
var countActiveBoxes = 0;
const isMouseEnabled = false;
var isGameOver = false;
var isGamePaused = true;

// HTML + CSS creatives
var ballsLeftDiv; // where the ball left will appear
var gamePointsDiv; //where points will be displayed
var scoreDiv; // where the gamePointsDiv and ballsLeftDiv will be

var themes = [
    //color_light, color_darker, color_darkest, board_background, walls
    ["#EEEBD3", "#F7C548", "#A98743", "#071C19", "#437C90", "Ocean Beach"], // cool
    ["#DCF2B0", "#AFD4AA", "#888284", "#4E0806", "#C7AC92", "Retro Ketchup"],
    ["#F9ADA0", "#F9627D", "#C65B7C", "#23061F", "#83B692", "Retro Violet"],
    ["#F5FBEF", "#E85D75", "#9D69A3", "#131828", "#40F99B", "Green Poland"], // cool
    ["#FDF8ED", "#98DFEA", "#07BEB8", "#25283D", "#8F3985", "Clear Night"], // cool
    ["#FFEEDB", "#ED9B40", "#61C9A8", "#4B0607", "#AA8F66", "Camel Evening"], // cool
];

function setup() {
    js_info = select("#javascript_enable_info").hide();

    ballsLeftDiv = createDiv(scoreDiv);
    ballsLeftDiv.class("ballsLeftDiv");
    gamePointsDiv = createDiv(scoreDiv);
    gamePointsDiv.class("gamePointsDiv");

    scoreDiv = createDiv("");
    scoreDiv.class("scoreDiv");
    scoreDiv.child(ballsLeftDiv);
    scoreDiv.child(gamePointsDiv);

    const canvas = createCanvas(600, 600);

    createP().html("Hit ENTER to start.");
    createP().html("Press SPACE to increase speed of the ball.");
    createP().html("Use &#x2BC7; and &#x2BC8; to move the paddle.");

    engine = Engine.create();
    world = engine.world;

    Bounds.create();
    engine.world.gravity.scale = 0; //we need no gravity or very very small

    grounds[0] = new Ground(10, height / 2, 20, height);
    grounds[1] = new Ground(width - 10, height / 2, 20, height);
    grounds[2] = new Ground(width / 2, 10, width, 20);

    makePaddle();
    makeBall();
    resetBall();
    makePuzzle();
    // check puzzle matrix rows:4 x cols:6 bcs of some double elements.

    setCollisionEvent();

    if (isMouseEnabled) {
        const mouse = Mouse.create(canvas.elt);
        const options = {
            mouse: mouse,
        };
        mConstraint = MouseConstraint.create(engine, options);
        World.add(world, mConstraint);
    }
}

function setColorTheme() {
    let theme_number = Math.floor(random() * themes.length);
    theme = themes[theme_number];
    console.log("Theme: " + theme[5] + " (" + theme_number + ")");
    paddle.setColors(theme[0], theme[3]);
    boxes.forEach((box) => {
        box.setColors(theme[3], [theme[2], theme[1], theme[0]]);
    });
    stars.forEach((star) => {
        star.setColors(theme[0], theme[0]);
    });
    grounds.forEach((ground) => {
        ground.setColors(theme[4], theme[4]);
    });
    ball.setColors(theme[0], theme[0]);
    background_color = theme[3];
}

function makePuzzle() {
    makeRandomBlocks(round(random() * 6) + 2, round(random() * 3) + 2);
    setColorTheme();
}

function makeBall() {
    ball = new Ball(width / 2, paddleHeight - 70, 12);
}

function resetBall() {
    isGamePaused = true;
    Body.setPosition(ball.body, { x: width / 2, y: paddleHeight - 100 });
    Body.setVelocity(ball.body, { x: 0, y: 5 });
}

function resetPaddle() {
    Body.setPosition(paddle.body, { x: width / 2, y: paddleHeight });
}

function removeStars() {
    stars.forEach((star) => {
        World.remove(world, star.body);
    });
    stars = [];
}

function removeBoxes() {
    boxes.forEach((box) => {
        World.remove(world, box.body);
    });
    boxes = [];
}

function resetGame() {
    ballsLeft = MAX_BALLS;
    gamePoints = 0;
    countBoxes = 0;
    countStars = 0;

    removeStars();
    removeBoxes();

    makePuzzle();
    resetBall();
    resetPaddle();
}

function setCollisionEvent() {
    Events.on(engine, "collisionStart", function (event) {
        event.pairs.forEach((pair) => {
            if (pair.bodyA.label === "BALL" || pair.bodyB.label === "BALL") {
                boxes.forEach((box) => {
                    if (
                        box.isCollided(pair.bodyA) ||
                        box.isCollided(pair.bodyB)
                    ) {
                        if (box.setTouched()) {
                            countBoxes += 1;
                            countActiveBoxes -= 1;
                        }
                    }
                });
            }
        });
    });
}

function makePaddle() {
    paddle = new Paddle(width / 2, paddleHeight, 70, 25);
}

function makeRandomBlocks(cols, rows) {
    countActiveBoxes = 0;
    boxes = [];
    colWidth = width / (cols + 3);
    rowHeight = height / 4 / (rows + 1);
    rowTop = height / 2.7 - rowHeight * rows;
    console.log(
        "Creating new puzzle matrix -> rows: " + rows + ", cols: " + cols
    );
    for (let c = 0; c < round(cols / 2); c++) {
        for (let r = 0; r < rows; r++) {
            if (random() > 0.5) {
                stars.push(
                    //left columns
                    new Star(
                        colWidth * 2 + c * colWidth,
                        rowTop + r * rowHeight,
                        30,
                        "STAR"
                    )
                );
                if (c != cols - c - 1) {
                    // right columns (for symetric)
                    stars.push(
                        new Star(
                            colWidth * 2 + (cols - c - 1) * colWidth,
                            rowTop + r * rowHeight,
                            30,
                            "STAR"
                        )
                    );
                }
            } else {
                box_type = Math.floor(Math.random() * 3);
                countActiveBoxes += 1;
                boxes.push(
                    new Box(
                        colWidth * 2 + c * colWidth,
                        rowTop + r * rowHeight,
                        colWidth,
                        rowHeight,
                        "BOX" + box_type
                    )
                );
                if (c != cols - c - 1) {
                    // right columns (for symetric)
                    countActiveBoxes += 1;
                    boxes.push(
                        new Box(
                            colWidth * 2 + (cols - c - 1) * colWidth,
                            rowTop + r * rowHeight,
                            colWidth,
                            rowHeight,
                            "BOX" + box_type
                        )
                    );
                }
            }
        }
    }
}

function removeLostObjects() {
    stars.forEach((star) => {
        // remove fallen little balls/stars
        if (!star.isRemoved && star.body.position.y > height) {
            World.remove(world, star.body);
            countStars += 1;
            star.setRemoved(true);
        }
    });
    if (ball.body.position.y > height) {
        if (ballsLeft > 0) {
            console.log("Lost ball, making new one...");
            ballsLeft -= 1;
            resetBall();
            resetPaddle();
        } else {
            isGameOver = true;
            console.log("GAME OVER. ");
        }
    }
}

function keyPressed() {
    if (keyCode === ENTER) {
        if (isGameOver) {
            resetGame();
            isGameOver = false;
            isGamePaused = true;
        } else if (isGamePaused) {
            isGamePaused = false;
        }
    }

    if (key === " ") {
        paddle.setIncreasePower(true);
    }
}

function keyReleased() {
    if (key === " ") {
        paddle.setIncreasePower(false);
    }
}

function draw() {
    if (isGameOver) {
        ballsLeftDiv.html("GAME OVER");
    }
    if (!isGameOver) {
        background(background_color);

        if (!isGamePaused) {
            Engine.update(engine);
        }

        ball.setMaxSpeed(maxBallSpeed);

        grounds.forEach((ground) => {
            ground.show();
        });
        boxes.forEach((box) => {
            box.show();
        });
        stars.forEach((star) => {
            star.show();
        });
        ball.show();

        removeLostObjects();

        if (countActiveBoxes == 0) {
            // start next puzzle
            removeStars();
            makePuzzle();
            resetBall();
            resetPaddle();
            isGamePaused = true;
        }

        if (keyIsDown(LEFT_ARROW)) {
            paddle.moveLeft();
        }
        if (keyIsDown(RIGHT_ARROW)) {
            paddle.moveRight();
        }
        paddle.show();

        let gamePoints = countBoxes * 5 + countStars * 1;

        ballsLeftDiv.html(ballsLeft);
        gamePointsDiv.html(gamePoints);
    }
}
