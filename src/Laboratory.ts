export interface Ingredient {
    substance: string;
    quantity: number;
}

export type Reactions = Record<string, Ingredient[]>;

export class Laboratory {
    private stock: Map<string, number>;
    private reactions: Reactions;

    constructor(substances: string[], reactions: Reactions = {}) {
        this.stock = new Map();
        this.reactions = reactions;

        substances.forEach(s => this.stock.set(s, 0));

        Object.keys(reactions).forEach(product => {
            if (!this.stock.has(product)) {
                this.stock.set(product, 0);
            }
        });
    }

    getQuantity(substance: string): number {
        if (!this.stock.has(substance)) {
            throw new Error('Unknown substance');
        }
        return this.stock.get(substance) || 0;
    }

    add(substance: string, quantity: number): void {
        if (quantity < 0) {
            throw new Error('Quantity must be positive');
        }
        
        const currentAmount = this.getQuantity(substance);
        this.stock.set(substance, Math.round((currentAmount + quantity) * 10000) / 10000);
    }

    getReactions(): Reactions {
        return this.reactions;
    }
}