
export const EMOD = {
    accumulator: 0,        // A (Accumulator)
    implied: 1,            // Implied
    immediate: 2,          // # Immediate
    zeroPage: 3,           // zp Zero Page
    relative: 4,           // r Relative
    absolute: 5,           // a Absolute
    absoluteX: 6,          // a,X Absolute, X
    absoluteY: 7,          // a,Y Absolute, Y
    zeroPageX: 8,          // zp,X Zero Page, X
    zeroPageY: 9,          // zp,Y Zero Page, Y
    absoluteIndirect: 10,  // (a) Indirect
    zeroPageXIndirect: 11, // (zp,X) Zero Page Indexed Indirect
    zeroPageIndirectY: 12, // (zp),Y Zero Page Indexed with Y
    invalid1: 13,          // Opcode invalid 1 byte
    invalid2: 14,          // Opcode invalid 2 bytes
    invalid3: 15           // Opcode invalid 3 bytes
}

export const modes = {

    [EMOD.accumulator]: (cpu) => {
        return cpu.mRegA;
    },

    [EMOD.implied]: (cpu) => {
        return 0;
    },

    [EMOD.immediate]: (cpu) => {
        const addr = cpu.mRegPC
        cpu.incrementPC()
        return addr
    },

    [EMOD.relative]: (cpu) => {
        const addr = cpu.mRegPC
        cpu.incrementPC()
        return addr
    },

    [EMOD.absolute]: (cpu) => {
        const addr = cpu.readWord(cpu.mRegPC)
        cpu.incrementPC(2)
        return addr
    },

    [EMOD.absoluteIndirect]: (cpu) => {
        const addr = cpu.readWord(cpu.readWord(cpu.mRegPC));
        cpu.incrementPC(2)
        return addr
    },

    [EMOD.absoluteX]: (cpu) => {
        const addr = (cpu.readWord(cpu.mRegPC) + cpu.mRegX) & 0xffff;
        cpu.incrementPC(2)
        return addr;
    },

    [EMOD.absoluteY]: (cpu) => {
        var addr = (cpu.readWord(cpu.mRegPC) + cpu.mRegY) & 0xffff;
        cpu.incrementPC(2)
        return addr;
    },

    [EMOD.zeroPageY]: (cpu) => {
        const addr = (cpu.readByte(cpu.mRegPC) + cpu.mRegY) & 0xff;
        cpu.incrementPC()
        return addr
    },

    [EMOD.zeroPageX]: (cpu) => {
        const addr = (cpu.readByte(cpu.mRegPC) + cpu.mRegX) & 0xff;
        cpu.incrementPC()
        return addr
    },

    [EMOD.zeroPage]: (cpu) => {
        const addr = cpu.readByte(cpu.mRegPC);
        cpu.incrementPC()
        return addr
    },

    [EMOD.zeroPageXIndirect]: (cpu) => {
        const addr = cpu.readWord((cpu.readByte(cpu.mRegPC) + cpu.mRegX) & 0xff);
        cpu.incrementPC()
        return addr
    },

    [EMOD.zeroPageIndirectY]: (cpu) => {
        const addr = (cpu.readWord(cpu.readByte(cpu.mRegPC)) + cpu.mRegY) & 0xffff;
        cpu.incrementPC()
        return addr;
    },

    [EMOD.invalid1]: (cpu) => {
        return 0;
    },

    [EMOD.invalid2]: (cpu) => {
        const addr = cpu.readByte(cpu.mRegPC)
        cpu.incrementPC()
        return addr
    },

    [EMOD.invalid3]: (cpu) => {
        const addr = cpu.readWord(cpu.mRegPC)
        cpu.incrementPC(2)
        return addr
    },

}
