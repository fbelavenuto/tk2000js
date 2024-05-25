import { CObserver } from "../utils/Observer.js";
import { CVideo } from './Video.js';
import { CCPU6502 } from './CPU/CPU6502.js';
import { CRom } from './Rom.js';
import { CRam } from './Ram.js';
import { CBus } from './Bus.js';
import { CKeyboard } from './Keyboard.js';
import { CTape } from './Tape.js';
import { CAudio } from './Audio.js';
import { CRenderCanvas } from '../renderCanvas.js';
import { CKeyboardListener } from '../kbdListener.js';

export class CMachine extends CObserver {
    constructor(canvas) {
        super();
        this.rafId = undefined;
        this.tsant = 0
        this.bus = new CBus();
        this.ram = new CRam(this.bus);
        this.rom = new CRom(this.bus);
        this.cpu = new CCPU6502(this.bus);
        this.video = new CVideo(this.bus);
        this.keyboard = new CKeyboard(this.bus);
        this.audio = new CAudio(this.bus, this.cpu);
        this.tape = new CTape(this.bus, this.cpu);
        this.tape.insertCt2()

        this.renderCanvas = new CRenderCanvas(canvas);
        this.video.addObserver(this.renderCanvas);

        this.kbdListener = new CKeyboardListener();
        this.kbdListener.addObserver(this.keyboard);
        this.kbdListener.addObserver(this);
        this.bus.resetAll();
    }

    loop(ts) {
        const time = ts - this.tsant    // ms
        this.tsant = ts
        let cyclesToRun = Math.floor(this.cpu.mKhz * time)
        const maxCycles = this.cpu.mKhz * 60
        if (cyclesToRun > maxCycles) {
            cyclesToRun = maxCycles;
        }
        document.getElementById('fps').value = Math.floor(1000 / time)
        document.getElementById('cycles').value = cyclesToRun
        document.getElementById('khz').value = this.cpu.mKhz
        this.cpu.stepCycles(cyclesToRun, undefined)
        this.bus.updateAll()
        this.rafId = requestAnimationFrame(this.loop.bind(this))
    }

    cancel() {
        cancelAnimationFrame(this.rafId)
        this.renderCanvas.clear();
    }

    notify(msg) {
        if (msg.msg == 'key') {
            const key = msg.key.toLowerCase();
            if (key == 'f12') {
                this.bus.resetAll()
            }
        }
    }
}
