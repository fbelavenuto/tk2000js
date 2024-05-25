import { CBus } from '../../src/core/Bus';
import { CCPU6502 } from '../../src/core/CPU/CPU6502';
import { CTape } from '../../src/core/Tape';

let tape = null;

jest.mock('../../src/core/Bus')
const bus = new CBus();
jest.mock('../../src/core/CPU/CPU6502')
const cpu = new CCPU6502();

describe('Testing CTape', () => {
    it('should make CTape instance and call CBus methods', () => {
        tape = new CTape(bus, cpu);
        expect(tape).not.toBeNull()
        expect(bus.addDevice).toBeCalled()
        expect(bus.registerAddr).toBeCalled()
        expect(bus.registerIntervalAddr).toBeCalledTimes(3)
    })

    it('should turn on and off MotorA', () => {
        tape.write(0xC053, 0)
        expect(tape.mMotorA).toBeTruthy()
        tape.write(0xC052, 0)
        expect(tape.mMotorA).toBeFalsy()
    })

    it('should turn on and off Second Page', () => {
        tape.write(0xC057, 0)
        expect(tape.mMotorB).toBeTruthy()
        tape.write(0xC056, 0)
        expect(tape.mMotorB).toBeFalsy()
    })

    it('should call reset() reset flags', () => {
        tape.mMotorA = true;
        tape.mMotorB = true;
        tape.reset();
        expect(tape.mMotorA).toBeFalsy()
        expect(tape.mMotorB).toBeFalsy()
    })

    it('should call insertCt2() returns true', () => {
        expect(tape.insertCt2()).toBeTruthy();
    })

    it('should call read() returns 0', () => {
        expect(tape.read(0xC040)).toBe(0);
        tape.play()
        expect(tape.read(0xC040)).toBe(0);
    })

    it('should call update() do nothing', () => {
        expect(() => {
            tape.update()
        }).not.toThrow()
    })

})
