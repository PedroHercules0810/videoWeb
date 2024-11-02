export abstract class Filter {
    red: number;
    green: number;
    blue: number;
    invert: number;

    constructor() {
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.invert = 0;
    }

    abstract calc(red: number, green: number, blue: number, invert: number): void;
}

export class FazNadaFilter extends Filter {
    calc(red: number, green: number, blue: number, invert: number): void {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.invert = invert;
    }
}

export class GreenFilter extends Filter {
    calc(red: number, green: number, blue: number, invert: number): void {
        this.red = 0;
        this.green = green;
        this.blue = 0;
        this.invert = invert;
    }
}

export class BlueFilter extends Filter {
    calc(red: number, green: number, blue: number, invert: number): void {
        this.red = 0;
        this.green = 0;
        this.blue = blue;
        this.invert = invert;
    }
}

export class RedFilter extends Filter {
    calc(red: number, green: number, blue: number, invert: number): void {
        this.red = red;
        this.green = 0;
        this.blue = 0;
        this.invert = invert;
    }
}

export class GrayFilter extends Filter {
    calc(red: number, green: number, blue: number, invert: number): void {
        const gray = (red + green + blue) / 3;
        this.red = gray;
        this.green = gray;
        this.blue = gray;
        this.invert = invert;
    }
}

export class InvertFilter extends Filter {
    calc(red: number, green: number, blue: number, invert: number): void {
        this.red = 255 - red;
        this.green = 255 - green;
        this.blue = 255 - blue;
        this.invert = invert;
    }
}

export const filters: Filter[] = [
    new FazNadaFilter(),
    new GreenFilter(),
    new BlueFilter(),
    new RedFilter(),
    new GrayFilter(),
    new InvertFilter(),
];
