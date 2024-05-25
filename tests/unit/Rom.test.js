import { CBus } from '../../src/core/Bus';
import { CRom } from '../../src/core/Rom';

let rom = null;

jest.mock('./../../src/core/Bus')
const bus = new CBus();

describe('Testing CRom', () => {
    it('should make CRom instance and call CBus methods', () => {
        rom = new CRom(bus);
        expect(rom).not.toBeNull()
        expect(bus.addDevice).toBeCalled()
        expect(bus.registerAddr).toBeCalledTimes(0)
        expect(bus.registerIntervalAddr).toBeCalled()
    })

    it('should read correct values', () => {
        expect(rom.read(0xC100)).toBe(0xE9);
        expect(rom.read(0xC101)).toBe(0x81);
        expect(rom.read(0xC102)).toBe(0x4A);
        expect(rom.read(0xFFFE)).toBe(0x40);
        expect(rom.read(0xFFFF)).toBe(0xFA);
    })

    it('should write do not modify data', () => {
        rom.write(0xC100, 0xAA)
        expect(rom.read(0xC100)).toBe(0xE9);
    })

    it('should call others methods do nothing', () => {
        expect(() => {
            rom.reset()
            rom.update()
        }).not.toThrow()
    })
})
