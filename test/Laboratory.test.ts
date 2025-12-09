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
        lab.add('H2O', 10);
        lab.add('H2O', 0.5);
        expect(lab.getQuantity('H2O')).toBe(10.5);
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