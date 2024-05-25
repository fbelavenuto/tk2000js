import data from '../pitfall2.ct2.js'

export class CTape {

    /*************************************************************************************************/
    constructor(bus, cpu) {
        this.mBus = bus;
        this.mCpu = cpu
        this.mMotorA = false;
        this.mMotorB = false;
        this.mPlay = false;
        this.mQueueCycles = [];
        this.mStartCycle = 0;
        this.mCyclesNeeded = 0;
        this.mCasOut = 0;
		this.mBus.addDevice('tape', this);
        this.mBus.registerAddr('tape', 0xC040);   // Needs ROM modified
        this.mBus.registerIntervalAddr("tape", 0xC020, 0xC02F); // Tape Out
        this.mBus.registerIntervalAddr("tape", 0xC052, 0xC053); // Motor A
        this.mBus.registerIntervalAddr("tape", 0xC056, 0xC057); // Motor B

    }

    /*************************************************************************************************/
    read(addr) {
        if ((addr & 0xF0) == 0x40) {
            if (!this.mPlay) {
                this.play();
                return 0x00;
            }
            const actualCycle = this.mCpu.mCumulativeCycles;
            if (this.mStartCycle == 0 && this.mQueueCycles.length > 0) {
                this.mStartCycle = actualCycle;
                this.mCyclesNeeded = this.mQueueCycles.shift()

            }
            if (actualCycle - this.mStartCycle > this.mCyclesNeeded) {
                this.mStartCycle = actualCycle;
                this.mCasOut ^= 0x80;
                if (this.mQueueCycles.length > 0) {
                    this.mCyclesNeeded = this.mQueueCycles.shift()
                } else {
                    this.mStartCycle = 0;
                    this.mPlay = false;
                    this.mCpu.mKhz = 1022;
                }
            }
        }
        return this.mCasOut;
    }

    /*************************************************************************************************/
    write(addr, data) {
        if (addr == 0xC052) {
            this.mMotorA = false;
        } else if (addr == 0xC053) {
            this.mMotorA = true;
        } else if (addr == 0xC056) {
            this.mMotorB = false;
        } else if (addr == 0xC057) {
            this.mMotorB = true;
        }
    }

    /*************************************************************************************************/
    reset() {
        this.mMotorA = false;
        this.mMotorB = false;
    }

    /*************************************************************************************************/
    update() {

    }

    /*************************************************************************************************/
    play() {
        this.mPlay = true;
        this.mCpu.mKhz = 4096;
    }

    /*************************************************************************************************/
    stop() {
        this.mPlay = false;
        this.mQueueCycles = []
    }

    /*************************************************************************************************/
    insertCt2() {
        function cmpArray(arr1, arr2) {
            return arr1.every((val, idx) => {
                return val == arr2[idx]
            })
        }
        const header = [67, 84, 75, 50];
        const cabA = [67, 65, 0, 0];
        const cabB = [67, 66, 0, 0]
        const cabDA = [68, 65]
        const ct2Data = data
        if (!cmpArray(ct2Data.slice(0, 4), header)) {
            return false;
        }
        let offset = 4
        const dataLen = ct2Data.length
        this.stop();
        while (true) {
            if (offset+3 > dataLen) {
                break;
            }
            const chunk = ct2Data.slice(offset, offset+4)
            if (cmpArray(chunk, cabA)) {
                for (let i = 0; i < 500; i++) {
                    this.mQueueCycles.push(500);
                    this.mQueueCycles.push(500);
                }
                offset += 4;
            } else if (cmpArray(chunk, cabB)) {
                this.mQueueCycles.push(464);
                this.mQueueCycles.push(679);
                for (let i = 0; i < 32; i++) {
                    this.mQueueCycles.push(679);
                    this.mQueueCycles.push(679);
                }
                this.mQueueCycles.push(199);
                this.mQueueCycles.push(250);
                offset += 4;
            } else if (cmpArray(chunk.slice(0, 1), cabDA)) {
                const chunkSize = chunk[2] | chunk[3] << 8;
                offset += 4;
                for (let i = 0; i < chunkSize; i++) {
                    const b = ct2Data[offset++]
                    for (let j = 0; j < 8; j++) {
                        let mask = 1 << (7 - j);
                        if ((mask & b) == mask) {
                            // 1
                            this.mQueueCycles.push(500);
                            this.mQueueCycles.push(500);
                        } else {
                            // 0
                            this.mQueueCycles.push(250);
                            this.mQueueCycles.push(250);
                        }
                    }
                }
            }
        }
        return true;
    }

}
