class Box {
    constructor(x, y, w, h, label = "") {
        const options = {
            friction: 0.001,
            frictionAir: 0.05,
            restitution: 1,
            slop: 0,
            chamfer: 0
        };
        this.body = Bodies.rectangle(x, y, w, h, options);
        this.body.isStatic = false;
        Body.setMass(this.body, this.body.mass);
        World.add(world, this.body);
        this.w = w;
        this.h = h;
        this.isRemoved = false;
        this.background_colors = [];
        this.setColors( 0, [130,180,255] );
        this.changeLabel(label);
    }

    setColors(color, background_colors) {
        this.color = color;
        this.background_colors = background_colors;
        this.changeLabel(this.body.label);
    }

    isCollided(bodyB) {
        return bodyB.id === this.getId();
    }

    setTouched() {
        if (this.body.label == "BOX0") {
            this.setStatic(false);
            this.changeLabel("BOX1");
        } else if (this.body.label == "BOX1") {
            this.changeLabel("BOX2");
        } else if (this.body.label == "BOX2") {
            this.isRemoved = true;
            World.remove(world, this.body);
            return true;
        }
        return false;
    }

    changeColor(background_color) {
        this.background_color = background_color;
        // console.log(background_color);
    }

    changeLabel(label) {
        if (label) {
            this.body.label = label;
            if (label == "BOX0") {
                this.changeColor(this.background_colors[0]);
            }
            if (label == "BOX1") {
                this.changeColor(this.background_colors[1]);
            }
            if (label == "BOX2") {
                this.changeColor(this.background_colors[2]);
            }
        }
    }

    getId() {
        return this.body.id;
    }

    setStatic(isStatic) {
        this.body.isStatic = isStatic;
    }

    getStatic() {
        return this.body.isStatic;
    }

    show() {
        if (!this.isRemoved) {
            const pos = this.body.position;
            const angle = this.body.angle;
            push();
            translate(pos.x, pos.y);
            stroke(this.color);
            rotate(angle);
            fill(this.background_color);
            rectMode(CENTER);
            rect(0, 0, this.w, this.h);
            pop();
        }
    }
}
