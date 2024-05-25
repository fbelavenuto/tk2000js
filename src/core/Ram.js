
export class CRam {

    /*************************************************************************************************/
    constructor(mBus) {
		this.mBus = mBus;
		this.mRam = new Uint8Array(0xC000);
		mBus.addDevice('ram', this);
        mBus.registerIntervalAddr('ram', 0x0000, 0xBFFF);
        this.mRam.fill(0);
        this.mRam.fill(0xFF, 0x2000, 0x2FFF);
        this.mRam.fill(0xFF, 0xA000, 0xAFFF);
    }

    /*************************************************************************************************/
    read(addr) {
        //assert(addr < 0xC000, "Addres out of range");
        return this.mRam[addr & 0xFFFF];
    }

    /*************************************************************************************************/
    write(addr, data) {
        //assert(addr < 0xC000, "Addres out of range");
        this.mRam[addr & 0xFFFF] = data & 0xFF;
    }

    /*************************************************************************************************/
    reset() {
        
    }

    /*************************************************************************************************/
    update() {
        
    }

}
