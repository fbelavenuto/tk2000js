import { instructions } from './instructions.js';
import { modes } from './modes.js';

/*
 * Adapted from https://github.com/whscullin/apple2js/blob/master/js/cpu6502.js
 *
 * Copyright 2010-2019 Will Scullin <scullin@scullinsteel.com>
 *
 * Permission to use, copy, modify, distribute, and sell this software and its
 * documentation for any purpose is hereby granted without fee, provided that
 * the above copyright notice appear in all copies and that both that
 * copyright notice and this permission notice appear in supporting
 * documentation.  No representations are made about the suitability of this
 * software for any purpose.  It is provided "as is" without express or
 * implied warranty.
 */

 export class CCPU6502 {

    // Constructor
    constructor(mBus) {
        this.mBus = mBus;
        this.mKhz = 1022;
        // Registers
        this.mRegA = 0;
        this.mRegX = 0;
        this.mRegY = 0;
        this.mRegS = 0xFF;
        this.mRegFlags = 0x20; // On an 6502, bit 5 always must be 1
        this.mRegPC = 0;
        /* Memory Locations */
        this.mMemoryLocs = {
            STACK: 0x100,
            NMI: 0xFFFA,
            RESET: 0xFFFC,
            BRK: 0xFFFE
        };
        // Cycles
        this.mCumulativeCycles = 0;
        // Instructions table
        this.mInstTbl = instructions;
        // addressing modes
        this.mAddrModes = modes;
        // Opcode arrays
        this.mOpcArr = [];
        // Initialize Opcode Array
        for (let idx = 0; idx < 0x100; idx++) {
            /* istanbul ignore else */
            if (this.mInstTbl[idx]) {
                this.mOpcArr[idx] = this.mInstTbl[idx];
            }
            else {
                throw Error('Missing opcode ' + idx);
            }
        }
        this.mThrowInBRK = true;
        mBus.addDevice("cpu", this);
    }

    incrementPC(val = 1) {
        this.mRegPC = (this.mRegPC + val) & 0xffff;
    }

    // Memory methods
    readByte(addr) {
        return this.mBus.readByte(addr);
    }

    writeByte(addr, value) {
        this.mBus.writeByte(addr, value);
    }

    readWord(addr) {
        let result = this.mBus.readByte(addr);
        result |= this.mBus.readByte(addr + 1) << 8;
        return result;
    }

    writeWord(addr, value) {
        this.mBus.writeByte(addr, value & 0xFF);
        this.mBus.writeByte(addr + 1, value >> 8);
    }

    reset() {
        this.mRegA = 0;
        this.mRegX = 0;
        this.mRegY = 0;
        this.mRegS = 0xFF;
        this.mRegFlags = 0x20;
        this.mRegPC = this.readWord(this.mMemoryLocs.RESET);
    }

    update() {
    }

    step(cb) {
        const opcode = this.readByte(this.mRegPC);
        const pc = this.mRegPC
        this.incrementPC();
        const [name, fnc, mode, cycles] = this.mOpcArr[opcode];
        // Call Address Mode function to get address
        const addr = this.mAddrModes[mode](this);
        // Call Opcode function to execute opcode
        fnc(addr, this);
        this.mCumulativeCycles += cycles;
        if (cb) {
            cb({
                name: name,
                A: this.mRegA,
                X: this.mRegX,
                Y: this.mRegY,
                S: this.mRegS,
                F: this.mRegFlags,
                PC: pc
            });
        }
        return cycles;
    }

    stepCycles(cyclesToRun, cb) {
        let cyclesRun = 0;
        while (cyclesRun < cyclesToRun) {
            cyclesRun += this.step(cb);
        }
        return cyclesRun;
    }

    // To unitary test
    stepOpcodes(steps) {
        let cycles = 0;
        while (steps--) {
            cycles += this.step(undefined);
        }
        return cycles;
    }
}
