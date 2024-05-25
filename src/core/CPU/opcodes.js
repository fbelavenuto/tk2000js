
export const EOPC = {
    ADC: 0,
    AND: 1,
    ASL: 2,
    BCC: 3,
    BCS: 4,
    BEQ: 5,
    BIT: 6,
    BMI: 7,
    BNE: 8,
    BPL: 9,
    BRK: 10,
    BVC: 11,
    BVS: 12,
    CLC: 13,
    CLD: 14,
    CLI: 15,
    CLV: 16,
    CMP: 17,
    CPX: 18,
    CPY: 19,
    DEC: 20,
    DEX: 21,
    DEY: 22,
    EOR: 23,
    INC: 24,
    INX: 25,
    INY: 26,
    JMP: 27,
    JSR: 28,
    LDA: 29,
    LDX: 30,
    LDY: 31,
    LSR: 32,
    NOP: 33,
    ORA: 34,
    PHA: 35,
    PHP: 36,
    PLA: 37,
    PLP: 38,
    ROL: 39,
    ROR: 40,
    RTI: 41,
    RTS: 42,
    SBC: 43,
    SEC: 44,
    SED: 45,
    SEI: 46,
    STA: 47,
    STX: 48,
    STY: 49,
    TAX: 50,
    TAY: 51,
    TSX: 52,
    TXA: 53,
    TXS: 54,
    TYA: 55,
    ASL_ACC: 56,
    LSR_ACC: 57,
    ROL_ACC: 58,
    ROR_ACC: 59,
    INVALID1: 60,
    INVALID2: 61,
    INVALID3: 62,
}

// Flags
const mFlags = {
    N: 0x80, // Negative
    V: 0x40, // oVerflow
    B: 0x10, // Break
    D: 0x08, // Decimal
    I: 0x04, // Interrupt
    Z: 0x02, // Zero
    C: 0x01  // Carry
};

/* Helpers */

// Flags helper
function setFlag(cpu, f, on) {
    cpu.mRegFlags = on ? (cpu.mRegFlags | f) : (cpu.mRegFlags & ~f);
}

function testFlag(cpu, f) {
    return (cpu.mRegFlags & f) != 0
}

function testNZ(cpu, val) {
    cpu.mRegFlags = (val == 0) ? (cpu.mRegFlags | mFlags.Z) : (cpu.mRegFlags & ~mFlags.Z);
    cpu.mRegFlags = (val & 0x80) ? (cpu.mRegFlags | mFlags.N) : (cpu.mRegFlags & ~mFlags.N);
    return val;
}

// Branch Helper
function hlpBranch(cpu, addr, flag, testSet) {
    const offset = cpu.readByte(addr)
    if (testFlag(cpu, flag) == testSet) {
        const oldPage = cpu.mRegPC >> 8
        const newPC = cpu.mRegPC + (offset > 127 ? offset - 256 : offset)
        const newPage = newPC >> 8
        cpu.mRegPC = newPC
    }
}

// Add/Sub Helper
function addHlp(cpu, addr, sub) {
    let a = cpu.mRegA
    let b = cpu.readByte(addr)
    if (sub) {
        b ^= 0xff;
    }

    const carry = (cpu.mRegFlags & mFlags.C)
    // KEGS
    let result, v
    if ((cpu.mRegFlags & mFlags.D) !== 0) {
        result = (a & 0x0f) + (b & 0x0f) + carry;
        if (sub) {
            if (result < 0x10) {
                result = (result - 0x06) & 0x0f;
            }
            result += (a & 0xf0) + (b & 0xf0);
            v = (result >> 1) ^ result;
            if (result < 0x100) {
                result = (result + 0xa0) & 0xff;
            }
        } else {
            if (result > 0x09) {
                result = (result - 0x0a) | 0x10; // carry to MSN
            }
            result += (a & 0xf0) + (b & 0xf0);
            v = (result >> 1) ^ result;
            if (result > 0x99) {
                result += 0x60;
            }
        }
    } else {
        result = a + b + carry
        v = (result ^ a) & 0x80
    }

    if (((a ^ b) & 0x80) !== 0) {
        v = 0;
    }
    setFlag(cpu, mFlags.C, result > 0xff);
    setFlag(cpu, mFlags.V, v != 0);
    return testNZ(cpu, result & 0xff)
}

// Stack management
function pushByte(cpu, val) {
    cpu.writeByte(cpu.mMemoryLocs.STACK | cpu.mRegS, val);
    cpu.mRegS = (cpu.mRegS + 0xff) & 0xff;
}

function pushWord(cpu, val) {
    pushByte(cpu, val >> 8);
    pushByte(cpu, val & 0xff);
}

function popByte(cpu) {
    cpu.mRegS = (cpu.mRegS + 0x01) & 0xff;
    return cpu.readByte(cpu.mMemoryLocs.STACK | cpu.mRegS);
}

function popWord(cpu) {
    let lsb = popByte(cpu);
    let msb = popByte(cpu);
    return (msb << 8) | lsb;
}


/*************************************************************/
export const opcodes = {

    /* Invalid Opcodes */
    [EOPC.INVALID1]: (addr, cpu) => {
        //console.log('Opcode invalid 1 byte'); // TODO: revisit
    },
    [EOPC.INVALID2]: (addr, cpu) => {
        //console.log('Opcode invalid 2 bytes'); // TODO: revisit
    },
    [EOPC.INVALID3]: (addr, cpu) => {
        //console.log('Opcode invalid 3 bytes'); // TODO: revisit
    },

    /* No-Op */
    [EOPC.NOP]: (addr, cpu) => {

    },

    /* Break */
    [EOPC.BRK]: (addr, cpu) => {
        pushWord(cpu, cpu.mRegPC);
        pushByte(cpu, cpu.mRegFlags | mFlags.B);
        setFlag(cpu, mFlags.I, true);
        cpu.mRegPC = cpu.readWord(cpu.mMemoryLocs.BRK);
        if (cpu.mThrowInBRK) {
            throw Error("BRK executed");
        }
    },

    /* Load Accumulator */
    [EOPC.LDA]: (addr, cpu) => {
        cpu.mRegA = testNZ(cpu, cpu.readByte(addr));
    },

    /* Load X Register */
    [EOPC.LDX]: (addr, cpu) => {
        cpu.mRegX = testNZ(cpu, cpu.readByte(addr));
    },

    /* Load Y Register */
    [EOPC.LDY]: (addr, cpu) => {
        cpu.mRegY = testNZ(cpu, cpu.readByte(addr));
    },

    /* Store Accumulator */
    [EOPC.STA]: (addr, cpu) => {
        cpu.writeByte(addr, cpu.mRegA);
    },

    /* Store X Register */
    [EOPC.STX]: (addr, cpu) => {
        cpu.writeByte(addr, cpu.mRegX);
    },

    /* Store Y Register */
    [EOPC.STY]: (addr, cpu) => {
        cpu.writeByte(addr, cpu.mRegY);
    },

    /* Reset Bit */
    [EOPC.CLC]: (addr, cpu) => {
        setFlag(cpu, mFlags.C, false)
    },
    [EOPC.CLD]: (addr, cpu) => {
        setFlag(cpu, mFlags.D, false)
    },
    [EOPC.CLI]: (addr, cpu) => {
        setFlag(cpu, mFlags.I, false)
    },
    [EOPC.CLV]: (addr, cpu) => {
        setFlag(cpu, mFlags.V, false)
    },

    /* Set Bit */
    [EOPC.SEC]: (addr, cpu) => {
        setFlag(cpu, mFlags.C, true)
    },
    [EOPC.SED]: (addr, cpu) => {
        setFlag(cpu, mFlags.D, true)
    },
    [EOPC.SEI]: (addr, cpu) => {
        setFlag(cpu, mFlags.I, true)
    },

    /* Add with Carry */
    [EOPC.ADC]: (addr, cpu) => {
        cpu.mRegA = addHlp(cpu, addr, false);
    },

    /* Subtract with Carry */
    [EOPC.SBC]: (addr, cpu) => {
        cpu.mRegA = addHlp(cpu, addr, true);
    },

    /* Increment Memory */
    [EOPC.INC]: (addr, cpu) => {
        const val = cpu.readByte(addr);
        cpu.writeByte(addr, testNZ(cpu, (val + 1) & 0xff));
    },

    /* Increment X */
    [EOPC.INX]: (addr, cpu) => {
        cpu.mRegX = testNZ(cpu, (cpu.mRegX + 1) & 0xff);
    },

    /* Increment Y */
    [EOPC.INY]: (addr, cpu) => {
        cpu.mRegY = testNZ(cpu, (cpu.mRegY + 1) & 0xff);
    },

    /* Decrement Memory */
    [EOPC.DEC]: (addr, cpu) => {
        const val = cpu.readByte(addr);
        cpu.writeByte(addr, testNZ(cpu, (val + 0xff) & 0xff));
    },

    /* Decrement X */
    [EOPC.DEX]: (addr, cpu) => {
        cpu.mRegX = testNZ(cpu, (cpu.mRegX + 0xff) & 0xff);
    },

    /* Decrement Y */
    [EOPC.DEY]: (addr, cpu) => {
        cpu.mRegY = testNZ(cpu, (cpu.mRegY + 0xff) & 0xff);
    },

    /* Logical Or Accumulator */
    [EOPC.ORA]: (addr, cpu) => {
        cpu.mRegA = testNZ(cpu, cpu.mRegA | cpu.readByte(addr));
    },

    /* Logical Exclusive Or Accumulator */
    [EOPC.EOR]: (addr, cpu) => {
        cpu.mRegA = testNZ(cpu, cpu.mRegA ^ cpu.readByte(addr));
    },

    /* Logical And Accumulator */
    [EOPC.AND]: (addr, cpu) => {
        cpu.mRegA = testNZ(cpu, cpu.mRegA & cpu.readByte(addr));
    },

    /* Arithmetic Shift Left */
    [EOPC.ASL_ACC]: (addr, cpu) => {
        const a = addr
        setFlag(cpu, mFlags.C, (a & 0x80) != 0);
        cpu.mRegA = testNZ(cpu, (a << 1) & 0xff);
    },
    [EOPC.ASL]: (addr, cpu) => {
        const val = cpu.readByte(addr);
        setFlag(cpu, mFlags.C, (val & 0x80) != 0);
        cpu.writeByte(addr, testNZ(cpu, (val << 1) & 0xff));
    },

    /* Logical Shift Right */
    [EOPC.LSR_ACC]: (addr, cpu) => {
        const a = addr
        setFlag(cpu, mFlags.C, (a & 0x01) != 0);
        cpu.mRegA = testNZ(cpu, a >> 1);
    },
    [EOPC.LSR]: (addr, cpu) => {
        const val = cpu.readByte(addr);
        setFlag(cpu, mFlags.C, (val & 0x01) != 0);
        cpu.writeByte(addr, testNZ(cpu, val >> 1));
    },

    /* Rotate Left */
    [EOPC.ROL_ACC]: (addr, cpu) => {
        const a = addr
        const c = cpu.mRegFlags & mFlags.C
        setFlag(cpu, mFlags.C, (a & 0x80) != 0);
        cpu.mRegA = testNZ(cpu, (a << 1) & 0xff | c);
    },
    [EOPC.ROL]: (addr, cpu) => {
        const val = cpu.readByte(addr);
        const c = cpu.mRegFlags & mFlags.C
        setFlag(cpu, mFlags.C, (val & 0x80) != 0);
        cpu.writeByte(addr, testNZ(cpu, (val << 1) & 0xff | c));
    },

    /* Rotate Right */
    [EOPC.ROR_ACC]: (addr, cpu) => {
        const a = addr
        const c = (cpu.mRegFlags & mFlags.C) != 0
        setFlag(cpu, mFlags.C, (a & 0x01) != 0);
        cpu.mRegA = testNZ(cpu, (a >> 1) & 0xff | (c ? 0x80 : 0));
    },
    [EOPC.ROR]: (addr, cpu) => {
        const val = cpu.readByte(addr);
        const c = (cpu.mRegFlags & mFlags.C) != 0
        setFlag(cpu, mFlags.C, (val & 0x01) != 0);
        cpu.writeByte(addr, testNZ(cpu, (val >> 1) & 0xff | (c ? 0x80 : 0)));
    },

    /* Compare */
    [EOPC.CMP]: (addr, cpu) => {
        const val = cpu.readByte(addr) ^ 0xFF;
        const result = cpu.mRegA + val + 1
        setFlag(cpu, mFlags.C, result > 0xff);
        testNZ(cpu, result & 0xff);
    },
    [EOPC.CPX]: (addr, cpu) => {
        const val = cpu.readByte(addr) ^ 0xFF;
        const result = cpu.mRegX + val + 1
        setFlag(cpu, mFlags.C, result > 0xff);
        testNZ(cpu, result & 0xff);
    },
    [EOPC.CPY]: (addr, cpu) => {
        const val = cpu.readByte(addr) ^ 0xFF;
        const result = cpu.mRegY + val + 1
        setFlag(cpu, mFlags.C, result > 0xff);
        testNZ(cpu, result & 0xff);
    },

    /* Transfers and stack */
    [EOPC.TAX]: (addr, cpu) => {
        cpu.mRegX = testNZ(cpu, cpu.mRegA)
    },
    [EOPC.TAY]: (addr, cpu) => {
        cpu.mRegY = testNZ(cpu, cpu.mRegA)
    },
    [EOPC.TSX]: (addr, cpu) => {
        cpu.mRegX = testNZ(cpu, cpu.mRegS)
    },
    [EOPC.TXA]: (addr, cpu) => {
        cpu.mRegA = testNZ(cpu, cpu.mRegX)
    },
    [EOPC.TXS]: (addr, cpu) => {
        cpu.mRegS = cpu.mRegX
    },
    [EOPC.TYA]: (addr, cpu) => {
        cpu.mRegA = testNZ(cpu, cpu.mRegY)
    },
    [EOPC.PHA]: (addr, cpu) => {
        pushByte(cpu, cpu.mRegA)
    },
    [EOPC.PHP]: (addr, cpu) => {
        pushByte(cpu, cpu.mRegFlags)
    },
    [EOPC.PLA]: (addr, cpu) => {
        cpu.mRegA = testNZ(cpu, popByte(cpu))
    },
    [EOPC.PLP]: (addr, cpu) => {
        cpu.mRegFlags = testNZ(cpu, popByte(cpu))
    },

    /* Bit */
    [EOPC.BIT]: (addr, cpu) => {
        const val = cpu.readByte(addr)
        setFlag(cpu, mFlags.Z, (val & cpu.mRegA) === 0);
        setFlag(cpu, mFlags.N, (val & 0x80) != 0);
        setFlag(cpu, mFlags.V, (val & 0x40) != 0);
    },

    /* Branches */
    [EOPC.BCC]: (addr, cpu) => {
        hlpBranch(cpu, addr, mFlags.C, false)
    },
    [EOPC.BCS]: (addr, cpu) => {
        hlpBranch(cpu, addr, mFlags.C, true)
    },
    [EOPC.BNE]: (addr, cpu) => {
        hlpBranch(cpu, addr, mFlags.Z, false)
    },
    [EOPC.BEQ]: (addr, cpu) => {
        hlpBranch(cpu, addr, mFlags.Z, true)
    },
    [EOPC.BPL]: (addr, cpu) => {
        hlpBranch(cpu, addr, mFlags.N, false)
    },
    [EOPC.BMI]: (addr, cpu) => {
        hlpBranch(cpu, addr, mFlags.N, true)
    },
    [EOPC.BVC]: (addr, cpu) => {
        hlpBranch(cpu, addr, mFlags.V, false)
    },
    [EOPC.BVS]: (addr, cpu) => {
        hlpBranch(cpu, addr, mFlags.V, true)
    },

    /* Jump */
    [EOPC.JMP]: (addr, cpu) => {
        cpu.mRegPC = addr
    },

    /* Jump Subroutine */
    [EOPC.JSR]: (addr, cpu) => {
        pushWord(cpu, (cpu.mRegPC - 1) & 0xFFFF)
        cpu.mRegPC = addr
    },

    /* Return from Subroutine */
    [EOPC.RTS]: (addr, cpu) => {
        const returnAddr = popWord(cpu) + 1
        cpu.mRegPC = returnAddr & 0xFFFF
    },

    /* Return from Interruption */
    [EOPC.RTI]: (addr, cpu) => {
        cpu.mRegFlags = popByte(cpu) & ~mFlags.B
        const returnAddr = popWord(cpu) + 1
        cpu.mRegPC = returnAddr & 0xFFFF
    },


}

