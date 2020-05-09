class Paddle {
    constructor(x, y, w, h) {
        const options = {
            friction: 0.001,
            frictionAir: 0.05,
            restitution: 1,
            isStatic: true,
        };
        this.body = Bodies.circle(x, y, w / 2, options);
        World.add(world, this.body);
        this.speed = createVector();
        this.w = w / 2;
        this.h = h;
        this.increasePower = false;
        this.setColors(255,0);
    }

    setColors(color, background_color) {
        this.color = color;
        this.background_color = background_color;
    }

    moveLeft() {
        let pos = this.body.position;
        Body.setPosition(this.body, {
            x: Math.max(pos.x - 8, this.w + 20),
            y: pos.y,
        });
    }

    moveRight() {
        let pos = this.body.position;
        Body.setPosition(this.body, {
            x: Math.min(pos.x + 8, width - this.w - 20),
            y: pos.y,
        });
    }

    setIncreasePower(increasePower) {
        this.increasePower = increasePower;
        if (increasePower) {
            this.body.restitution=2;
        } else {
            this.body.restitution=1;
        }
    }

    show() {
        if (this.body && this.body.label != "removed") {
            const pos = this.body.position;
            const angle = this.body.angle;
            push();
            translate(pos.x, pos.y);
            stroke(this.color);
            if (this.increasePower) {
                strokeWeight(5);
            } else {
                strokeWeight(2);
            }
            fill(this.background_color);
            rectMode(CENTER);
            circle(0, 0, this.w * 2);
            pop();
        }
    }
}
