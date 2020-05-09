class Ground extends Box {
    constructor(x, y, w, h) {
        super(x, y, w, h, 'GROUND');
        this.body.isStatic = true;
        this.setColors(255,255);
        // this.background_color = background_color;
        // this.color = color;
    }

    setColors(color, background_color) {
        this.color = color;
        this.background_color = background_color;
    }

    setStatic(isStatic) {
        // do nothing with ground (only in box needed)
    }

}
