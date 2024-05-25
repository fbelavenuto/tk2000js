import { CBus } from '../../src/core/Bus';
import { CCPU6502 } from '../../src/core/CPU/CPU6502';
import { CAudio } from '../../src/core/Audio';

let audio = null;

jest.mock('../../src/core/Bus')
const bus = new CBus();
jest.mock('../../src/core/CPU/CPU6502')
const cpu = new CCPU6502();

cpu.mKhz = 1022

describe('Testing CAudio', () => {
    it('should make CAudio instance and call CBus methods', () => {
        audio = new CAudio(bus, cpu);
        expect(audio).not.toBeNull()
        expect(bus.addDevice).toBeCalled()
        expect(bus.registerAddr).toBeCalledTimes(0)
        expect(bus.registerIntervalAddr).toBeCalled()
    })

    it('should turn on and off SpkToogle', () => {
        audio.write(0xC030, 0)
        expect(audio.mSpkrToggle).toBeTruthy()
        audio.write(0xC030, 0)
        expect(audio.mSpkrToggle).toBeFalsy()
    })

    it('should call reset() reset flags', () => {
        audio.mSpkrToggle = true;
        audio.reset();
        expect(audio.mSpkrToggle).toBeFalsy()
    })

    it('should call read() returns 0xFF', () => {
        expect(audio.read(0xC0300)).toBe(0xFF);
    })

    it('should call update() do nothing', () => {
        expect(() => {
            audio.update()
        }).not.toThrow()
    })

})
