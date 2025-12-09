import { Laboratory } from "../src/Laboratory.ts";

describe('Laboratory - Initialization', () => {
    it('should initialize with a list of substances and default stock to 0', () => {
        const lab = new Laboratory(['H2O', 'CO2']);
        expect(lab.getQuantity('H2O')).toBe(0);
        expect(lab.getQuantity('CO2')).toBe(0);
    });

    it('should handle empty substance list without crashing', () => {
        const lab = new Laboratory([]);
        expect(() => lab.getQuantity('Gold')).toThrow('Unknown substance');
    });

    it('should throw an error when accessing an unknown substance', () => {
        const lab = new Laboratory(['H2O']);
        expect(() => lab.getQuantity('Gold')).toThrow('Unknown substance');
    });

    it('should handle duplicate substances in initialization gracefully', () => {
        const lab = new Laboratory(['H2O', 'H2O']);
        expect(lab.getQuantity('H2O')).toBe(0);
    });
});

describe('Add Stock', () => {
    it('should add quantity to an existing substance', () => {
        const lab = new Laboratory(['H2O']);
        lab.add('H2O', 10);
        expect(lab.getQuantity('H2O')).toBe(10);
    });

    it('should accumulate quantities correctly (integers and floats)', () => {
        const lab = new Laboratory(['H2O']);
        lab.add('H2O', 1);
        lab.add('H2O', 2.72);
        lab.add('H2O', 6.58);
        expect(lab.getQuantity('H2O')).toBe(10.3);
    });

    it('should do nothing if adding 0', () => {
        const lab = new Laboratory(['H2O']);
        lab.add('H2O', 0);
        expect(lab.getQuantity('H2O')).toBe(0);
    });

    it('should throw error for negative quantity', () => {
        const lab = new Laboratory(['H2O']);
        expect(() => lab.add('H2O', -1)).toThrow('Quantity must be positive');
    });

    it('should throw error when adding to unknown substance', () => {
        const lab = new Laboratory(['H2O']);
        expect(() => lab.add('Gold', 10)).toThrow('Unknown substance');
    });
});

describe('Reactions & Products', () => {
    it('should register products defined in reactions as valid substances', () => {
        const reactions = { 
            'Ice': [{ substance: 'Water', quantity: 1 }] 
        };

        const lab = new Laboratory(['Water'], reactions);
        expect(lab.getQuantity('Ice')).toBe(0);
    });

    it('should allow adding stock directly to a product', () => {
        const reactions = { 'Ice': [{ substance: 'Water', quantity: 1 }] };
        const lab = new Laboratory(['Water'], reactions);
        
        lab.add('Ice', 10);
        expect(lab.getQuantity('Ice')).toBe(10);
    });

    it('should handle name collisions gracefully (substance declared as base AND product)', () => {
        const reactions = { 'Water': [{ substance: 'Hydrogen', quantity: 2 }] };
        const lab = new Laboratory(['Water'], reactions);

        expect(lab.getQuantity('Water')).toBe(0);
    });
});

describe('Making Products (Basic)', () => {
    const simpleReactions = {
        'C': [{ substance: 'A', quantity: 2 }, { substance: 'B', quantity: 5 }]
    };

    it('should make product when ingredients are sufficient', () => {
        const lab = new Laboratory(['A', 'B'], simpleReactions);
        lab.add('A', 10);
        lab.add('B', 25);
        
        const produced = lab.make('C', 2);
        
        expect(produced).toBe(2);
        expect(lab.getQuantity('C')).toBe(2);
        expect(lab.getQuantity('A')).toBe(6);
        expect(lab.getQuantity('B')).toBe(15);
    });

    it('should be limited by the scarcest ingredient', () => {
        const lab = new Laboratory(['A', 'B'], simpleReactions);
        lab.add('A', 10);
        lab.add('B', 5);
        
        const produced = lab.make('C', 5);
        
        expect(produced).toBe(1);
        expect(lab.getQuantity('C')).toBe(1);
        expect(lab.getQuantity('A')).toBe(8);
        expect(lab.getQuantity('B')).toBe(0);
    });

    it('should produce 0 if one ingredient is missing (0 stock)', () => {
        const lab = new Laboratory(['A', 'B'], simpleReactions);
        lab.add('A', 10);

        expect(lab.make('C', 1)).toBe(0);
        expect(lab.getQuantity('C')).toBe(0);
        expect(lab.getQuantity('A')).toBe(10);
    });

    it('should throw error if recipe does not exist', () => {
        const lab = new Laboratory(['A']);
        expect(() => lab.make('UnknownProduct', 1)).toThrow('Unknown recipe');
    });
});

describe('Chained Reactions', () => {
    const breadReactions = {
        'Dough': [{ substance: 'Flour', quantity: 1 }, { substance: 'Water', quantity: 1 }],
        'Bread': [{ substance: 'Dough', quantity: 1 }, { substance: 'Heat', quantity: 1 }]
    };

    it('should use a manufactured product (stored) as an ingredient for another reaction', () => {
        const lab = new Laboratory(['Flour', 'Water', 'Heat'], breadReactions);
        
        lab.add('Flour', 10);
        lab.add('Water', 10);
        lab.add('Heat', 10);

        lab.make('Dough', 5);
        expect(lab.getQuantity('Dough')).toBe(5);

        lab.make('Bread', 3);
        
        expect(lab.getQuantity('Bread')).toBe(3);
        expect(lab.getQuantity('Dough')).toBe(2);
        expect(lab.getQuantity('Heat')).toBe(7);
    });
    
    it('should fail cleanly if intermediate product is missing from stock', () => {
            const lab = new Laboratory(['Flour', 'Water', 'Heat'], breadReactions);
            lab.add('Heat', 10);
            
            const made = lab.make('Bread', 1);
            expect(made).toBe(0);
    });
});

describe('Optional: Circular Dependencies', () => {
    it('should handle circular dependencies by using available stock to break the loop', () => {
        
        const reactions = {
            'A': [{ substance: 'B', quantity: 1 }, { substance: 'C', quantity: 1 }],
            'C': [{ substance: 'A', quantity: 0.2 }, { substance: 'D', quantity: 1 }]
        };
        
        const lab = new Laboratory(['B', 'D', 'A'], reactions);
        
        lab.add('B', 1);
        lab.add('C', 0.5);
        lab.add('A', 0.1);
        lab.add('D', 0.5);

        const produced = lab.make('A', 1);

        expect(produced).toBe(1);
        expect(lab.getQuantity('A')).toBe(1);
        expect(lab.getQuantity('B')).toBe(0);
        expect(lab.getQuantity('C')).toBe(0);
        expect(lab.getQuantity('D')).toBe(0);
    });
});