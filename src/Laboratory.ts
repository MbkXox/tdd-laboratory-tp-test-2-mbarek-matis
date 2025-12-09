export class Laboratory {
    private stock: Map<string, number>;

    constructor(substances: string[]) {
        this.stock = new Map();
        const uniqueSubstances = new Set(substances);
        uniqueSubstances.forEach(s => this.stock.set(s, 0));
    }

    getQuantity(substance: string): number {
        if (!this.stock.has(substance)) {
            throw new Error('Unknown substance');
        }
        return this.stock.get(substance) || 0;
    }
}