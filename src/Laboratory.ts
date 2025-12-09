export class Laboratory {
    private stock: Map<string, number>;
    public allReactions: any;

    constructor(substances: string[], reactions: any = {}) {
        this.stock = new Map();
        this.allReactions = reactions;

        // Init substances
        substances.forEach(s => this.stock.set(s, 0));

        // Init produits : boucle for..in sur l'objet any
        for (let key in reactions) {
            if (Object.prototype.hasOwnProperty.call(reactions, key)) {
                // Si pas déjà présent (pour gérer la collision)
                if (!this.stock.has(key)) {
                    this.stock.set(key, 0);
                }
            }
        }
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
        this.stock.set(substance, currentAmount + quantity);
    }
}