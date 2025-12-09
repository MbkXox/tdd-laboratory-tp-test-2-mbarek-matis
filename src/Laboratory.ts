export class Laboratory {
    list: any[] = [];
    stockValues: any[] = [];

    constructor(substances: any) {
        this.list = substances;
        for(let i = 0; i < substances.length; i++) {
            this.stockValues[i] = 0;
        }
    }

    getQuantity(substance: any): number {
        let index = -1;
        for(let i = 0; i < this.list.length; i++) {
            if (this.list[i] === substance) {
                index = i;
                break;
            }
        }

        if (index === -1) {
            throw new Error('Unknown substance');
        }

        return this.stockValues[index];
    }
}