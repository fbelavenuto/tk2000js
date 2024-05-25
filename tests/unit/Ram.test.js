import { CBus } from '../../src/core/Bus';
import { CRam } from '../../src/core/Ram';

let ram = null;

jest.mock('./../../src/core/Bus')
const bus = new CBus();

describe('Testing CRam', () => {
    it('should make CRam instance and call CBus methods', () => {
        ram = new CRam(bus);
        expect(ram).not.toBeNull()
        expect(bus.addDevice).toBeCalled()
        expect(bus.registerAddr).toBeCalledTimes(0)
        expect(bus.registerIntervalAddr).toBeCalled()
    })

    it('should read 0x00 from any address', () => {
        expect(ram.read(0x0000)).toBe(0);
        expect(ram.read(0x0001)).toBe(0);
        expect(ram.read(0x0002)).toBe(0);
        expect(ram.read(0xBFFE)).toBe(0);
        expect(ram.read(0xBFFF)).toBe(0);
    })

    it('should write modify data', () => {
        ram.write(0x0000, 0xAA)
        ram.write(0x0010, 0x55)
        ram.write(0x0100, 0xA5)
        ram.write(0x1000, 0x5A)
        expect(ram.read(0x0000)).toBe(0xAA);
        expect(ram.read(0x0001)).toBe(0);
        expect(ram.read(0x0010)).toBe(0x55);
        expect(ram.read(0x0011)).toBe(0);
        expect(ram.read(0x0100)).toBe(0xA5);
        expect(ram.read(0x0101)).toBe(0);
        expect(ram.read(0x1000)).toBe(0x5A);
        expect(ram.read(0x1001)).toBe(0);
    })

    it('should call others methods do nothing', () => {
        expect(() => {
            ram.reset()
            ram.update()
        }).not.toThrow()
    })

})
