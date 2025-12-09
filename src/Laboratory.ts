export interface Ingredient {
    substance: string;
    quantity: number;
}

export type Reactions = Record<string, Ingredient[]>;

export class Laboratory {
    private readonly stock: Map<string, number>;
    private readonly reactions: Reactions;

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

    private round(num: number): number {
        return Math.round(num * 10000) / 10000;
    }

    add(substance: string, quantity: number): void {
        if (quantity < 0) {
            throw new Error('Quantity must be positive');
        }
        const currentAmount = this.getQuantity(substance);
        this.stock.set(substance, this.round(currentAmount + quantity));
    }

    getReactions(): Reactions {
        return this.reactions;
    }

    private calculateMaxProduction(ingredients: Ingredient[], desired: number): number {
        let max = desired;
        for (const ing of ingredients) {
            const available = this.getQuantity(ing.substance);
            if (ing.quantity === 0) continue; 
            
            const possible = available / ing.quantity;
            if (possible < max) max = possible;
        }
        return max;
    }

    private consumeIngredients(ingredients: Ingredient[], amount: number): void {
        for (const ing of ingredients) {
            const needed = ing.quantity * amount;
            const current = this.getQuantity(ing.substance);
            this.stock.set(ing.substance, this.round(current - needed));
        }
    }

    private prepareIngredients(product: string, quantity: number, scope: Set<string>): void {
        const ingredients = this.reactions[product];
        if (!ingredients) return;

        for (const ing of ingredients) {
            const stock = this.getQuantity(ing.substance);
            const required = ing.quantity * quantity;

            if (stock < required) {
                const missing = required - stock;
                this.make(ing.substance, missing, scope);
            }
        }
    }

    make(product: string, quantity: number, currentlyCrafting: Set<string> = new Set()): number {
        if (!this.reactions[product]) {
            if (currentlyCrafting.size > 0) return 0;
            throw new Error('Unknown recipe');
        }

        if (currentlyCrafting.has(product)) {
            return 0;
        }

        currentlyCrafting.add(product);

        this.prepareIngredients(product, quantity, currentlyCrafting);

        const ingredients = this.reactions[product];
        const actualQuantity = this.calculateMaxProduction(ingredients, quantity);

        this.consumeIngredients(ingredients, actualQuantity);
        this.add(product, actualQuantity);

        currentlyCrafting.delete(product);

        return actualQuantity;
    }
}