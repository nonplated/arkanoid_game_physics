class Star {
    constructor(x, y, r, label = "") {
        const options = {
            friction: 0.0,
            frictionAir: 0.0,
            restitution: 1,
        };
        this.sides = 7;
        this.r = r / 2;
        this.body = Bodies.circle(x, y, this.r / 2, options);
        this.body.label = label || "STAR";
        Body.setMass(this.body, this.body.mass);
        World.add(world, this.body);
        this.isRemoved = false;
        this.setColors(255,255);
    }

    setColors(color, background_color) {
        this.color = color;
        this.background_color = background_color;
    }

    setRemoved(status) {
        this.isRemoved = status;
        return this.isRemoved;
    }

    polygon(x, y, radius, npoints) {
        let angle = TWO_PI / npoints;
        beginShape();
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = x + cos(a) * radius;
            let sy = y + sin(a) * radius;
            vertex(sx, sy);
        }
        endShape(CLOSE);
    }

    show() {
        if (this.body && !this.isRemoved) {
            const pos = this.body.position;
            const angle = this.body.angle;
            push();
            translate(pos.x, pos.y);
            rotate(angle);
            stroke(this.color);
            fill(this.background_color);
            rectMode(CENTER);
            circle(0, 0, this.r);
            pop();
        }
    }
}
