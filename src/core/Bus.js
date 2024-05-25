
export class CBus {

    /*************************************************************************************************/
    constructor() {
        this.mDevices = new Map();
        this.mBusMap = new Array();
        this.mBusMap.fill(undefined, 0, 0xFFFF);
    }

    /*************************************************************************************************/
    addDevice(name, device) {
        this.mDevices.set(name, device);
    }

    /*************************************************************************************************/
    registerAddr(name, addr) {
        const device = this.mDevices.get(name);
        if (device && 'read' in device) {
            this.mBusMap[addr] = device;
        }
    }

    /*************************************************************************************************/
    registerIntervalAddr(name, addrInitial, addrFinal) {
        const device = this.mDevices.get(name);
        if (device && 'read' in device) {
            for (let a = addrInitial; a <= addrFinal; a++) {
                this.mBusMap[a] = device;
            }
        }
    }

    /*************************************************************************************************/
    readByte(addr) {
        const device = this.mBusMap[addr];
        if (device) {
            return device.read(addr) & 0xFF;
        }
        return 0xFF;
    }

    /*************************************************************************************************/
    writeByte(addr, data) {
        const device = this.mBusMap[addr];
        if (device) {
            device.write(addr, data & 0xFF);
        }
    }

    /*************************************************************************************************/
    resetAll() {
        this.mDevices.forEach((device, key) => {
            device.reset();
        });
    }
    
    /*************************************************************************************************/
    updateAll() {
        this.mDevices.forEach((device, key) => {
            device.update();
        });
    }
}