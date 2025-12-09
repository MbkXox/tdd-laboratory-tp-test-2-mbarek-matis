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

    add(name: string, qty: number): void {
        if (qty < 0) {
            throw new Error('Quantity must be positive');
        }

        if (!this.stock.has(name)) {
            throw new Error('Unknown substance');
        }

        let old = this.stock.get(name);
        if (old === undefined) old = 0;
        
        this.stock.set(name, old + qty);
    }
}