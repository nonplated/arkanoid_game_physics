class Ball {

    constructor(x, y, r, label='') {
        const options = {
            friction:    0.0000,
            frictionAir: 0.0000,
            restitution: 1,
            slope: 0,
            isStatic : false
        }
        this.lost = false;
        this.body = Bodies.circle(x, y, r, options);
        this.body.label = label || "BALL";
        Body.setMass(this.body, this.body.mass);
        World.add(world, this.body);
        this.r = r;
        this.setColors(255,255);
    }


    setColors(color, background_color) {
        this.color = color;
        this.background_color = background_color;
    }

    setMaxSpeed(maxSpeed) {
        let v_x = this.body.velocity.x;
        let v_y = this.body.velocity.y;
        if (v_x != v_y) {
            // do not exceed max speed
            // while ((v_x*v_x)+(v_y*v_y)>maxSpeed) {
            //     v_x = v_x * 0.9;
            //     v_y = v_y * 0.9;
            // }

            // dont let be ball to slow
            while ((v_x*v_x)+(v_y*v_y)<maxSpeed/2) {
                v_x = v_x * 1.1;
                v_y = v_y * 1.1;
            }
            Body.setVelocity(this.body, { x: v_x, y: v_y });
        }
    }

    show() {
        if (this.body) {
            const pos = this.body.position;
            const angle = this.body.angle;
            push();
            translate(pos.x, pos.y);
            rotate(angle);
            stroke(this.color);
            fill(this.background_color);
            rectMode(CENTER);
            circle(0, 0, this.r * 2);
            pop();
        }
    }
}
