import { CBus } from '../../src/core/Bus';

// Mock devices for tests
class TestDeviceMem {

    constructor() {
        this.readAccessed = 0;
        this.writeAccessed = 0;
        this.resetAccessed = 0;
        this.updateAccessed = 0;
    }

    read(addr) {
        ++this.readAccessed;
        return addr & 0xFF;
    }

    write(addr, data) {
        ++this.writeAccessed
    }

    reset() {
        ++this.resetAccessed
    }

    update() {
        ++this.updateAccessed
    }
}

class TestDeviceBase {
    constructor() {
        this.resetAccessed = 0;
        this.updateAccessed = 0;
    }

    reset() {
        ++this.resetAccessed
    }

    update() {
        ++this.updateAccessed
    }

}

const bus = new CBus();
const testDeviceMem = new TestDeviceMem();
const testDeviceBase = new TestDeviceBase();

beforeAll(() => {
    bus.addDevice('testDeviceMem', testDeviceMem);
    bus.addDevice('testDeviceBase', testDeviceBase)
})

describe('Testing adding invalid device', () => {
    beforeAll(() => {
        bus.registerAddr('invalid', 0x1234);
        bus.registerIntervalAddr('invalid', 0x0100, 0x0101);
    })
    it('should read 0xFF at 0x1234', () => {
        expect(bus.readByte(0)).toBe(0xFF);
    })
    it('should read 0xFF at 0x0100', () => {
        expect(bus.readByte(0x0100)).toBe(0xFF);
    })
    it('should do not write data, testDeviceMem.writeAccessed must be 0', () => {
        bus.writeByte(0x1234, 0x55)
        expect(testDeviceMem.writeAccessed).toBe(0)
    })
})

describe('Testing adding TestDeviceBase', () => {
    it('should not register address in a DeviceBase', () => {
        bus.registerAddr('testDeviceBase', 0x1122)
        expect(bus.readByte(0x1122)).toBe(0xFF);
    })
})

describe('Testing adding TestDeviceMem', () => {
    beforeAll(() => {
        bus.registerAddr('testDeviceMem', 0x10AA);
        bus.registerIntervalAddr('testDeviceMem', 0x2000, 0x2FFF);
    })

    it('should read 0xAA at 0x10AA', () => {
        expect(bus.readByte(0x10AA)).toBe(0xAA);
        expect(testDeviceMem.readAccessed).toBe(1);
    })
    it('should read 0xA5 at 0x25A5', () => {
        expect(bus.readByte(0x25A5)).toBe(0xA5);
        expect(testDeviceMem.readAccessed).toBe(2);
    })
    it('should write data at TestDevice', () => {
        bus.writeByte(0x10AA, 0xAA)
        bus.writeByte(0x2FFE, 0xAA)
        expect(testDeviceMem.writeAccessed).toBe(2)
    })
})

describe('Test resetting/updating devices', () => {
    beforeAll(() => {
        bus.resetAll();
        bus.updateAll();
    })
    it('should call TestDevice reset one time', () => {
        expect(testDeviceBase.resetAccessed).toBe(1)
        expect(testDeviceMem.resetAccessed).toBe(1)
    })
    it('should call TestDevice update one time', () => {
        expect(testDeviceBase.updateAccessed).toBe(1)
        expect(testDeviceMem.updateAccessed).toBe(1)
    })
})
