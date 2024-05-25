import rom from '../TK2000.rom.js'

export class CRom {

    constructor(mBus) {
        this.mBus = mBus;
        mBus.addDevice('rom', this);
        mBus.registerIntervalAddr('rom', 0xC100, 0xFFFF);
        // Image of ROM
        this.mRom = rom
    }

    read(addr) {
        return this.mRom[(addr - 0x100) & 0x3FFF];
    }

    write(addr, data) {
        // Nothing
    }

    reset() {

    }

    update() {

    }

}
