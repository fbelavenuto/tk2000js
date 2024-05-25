import { CBus } from '../../src/core/Bus';
import { CKeyboard } from '../../src/core/Keyboard';

jest.mock('./../../src/core/Bus')
const bus = new CBus();
let keyboard = undefined;

describe('Testing CKeyboard basic', () => {
    it('should make CKeyboard instance and call CBus methods', () => {
        keyboard = new CKeyboard(bus);
        expect(keyboard).not.toBeNull()
        expect(bus.addDevice).toBeCalled()
        expect(bus.registerAddr).toBeCalledTimes(0)
        expect(bus.registerIntervalAddr).toBeCalled()
    })

    it('should read() return correct data', () => {
        keyboard.mCtrl = false;
        keyboard.mKbOutCtrl = false;
        expect(keyboard.read(0)).toBe(0);
        keyboard.mCtrl = true;
        keyboard.mKbOutCtrl = true;
        expect(keyboard.read(0)).toBe(1);
    })

    it('should write() set correct data to read', () => {
        keyboard.write(0xC000, 0xFF);
        expect(keyboard.mKbOut).toBe(0xFF)
    })

    it('should reset() resets data', () => {
        keyboard.mCtrl = true;
        keyboard.mKbOutCtrl = true;
        keyboard.reset();
        expect(keyboard.mCtrl).toBeFalsy();
        expect(keyboard.mKbOutCtrl).toBeFalsy();
    })

})

test.todo('Add test for keyboard events')