
export class CAudio {

    constructor(bus, cpu) {
        this.mBus = bus;
        this.mCpu = cpu;
        this.mSprkState = false;
        this.mStartCycle = 0;
        this.mSegTime;
        this.level = 0.6;
        this.mBus.addDevice('audio', this);
        this.mBus.registerIntervalAddr('audio', 0xC030, 0xC03F);
        //
        this.ac = new (window.AudioContext || window.webkitAudioContext)();
        const osc = this.ac.createOscillator({channelCount: 1, channelCountMode: "explicit", frequency: 0});
        const ws = this.ac.createWaveShaper({channelCount: 1, channelCountMode: "explicit"});
        ws.curve = new Float32Array([-1, -1]);
        this.gn = this.ac.createGain({channelCount: 1, channelCountMode: "explicit", gain: 0});
        osc.connect(ws);
        ws.connect(this.gn);
        this.gn.connect(this.ac.destination);
        osc.start();
    }

    read(addr) {
        if((this.level == 0) || !this.gn) {
            return;
        }
        if (this.mCpu.mKhz == 1022) {
            this.mSprkState = !this.mSprkState;
            const time = (this.mCpu.mCumulativeCycles - this.mStartCycle) / 890000; // TODO: discovered by try-error!
            this.gn.gain.setValueAtTime(this.mSprkState ? this.level : 0, time + this.mSegTime);

        }
        return 0xFF;
    }

    write(addr, value) {
        this.read(addr)
    }

    reset() {
        this.mSprkState = false
        this.gn.gain.cancelScheduledValues(0);
        this.gn.gain.value = 0;
    }

    update() {
        if((this.level == 0) || !this.ac) {
            return;
        }
        this.mSegTime = this.ac.currentTime + 0.05;
        this.mStartCycle = this.mCpu.mCumulativeCycles;
    }

}
