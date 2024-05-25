import { EOPC, opcodes } from './opcodes.js';
import { EMOD } from './modes.js';

export const instructions = {
    //     Name   Opcode Fnc         Operand Mode  Cycles

    // BRK
    0x00: ['BRK', opcodes[EOPC.BRK], EMOD.implied, 7],

    // LDA
    0xa9: ['LDA', opcodes[EOPC.LDA], EMOD.immediate, 2],
    0xa5: ['LDA', opcodes[EOPC.LDA], EMOD.zeroPage, 3],
    0xb5: ['LDA', opcodes[EOPC.LDA], EMOD.zeroPageX, 4],
    0xad: ['LDA', opcodes[EOPC.LDA], EMOD.absolute, 4],
    0xbd: ['LDA', opcodes[EOPC.LDA], EMOD.absoluteX, 4],
    0xb9: ['LDA', opcodes[EOPC.LDA], EMOD.absoluteY, 4],
    0xa1: ['LDA', opcodes[EOPC.LDA], EMOD.zeroPageXIndirect, 6],
    0xb1: ['LDA', opcodes[EOPC.LDA], EMOD.zeroPageIndirectY, 5],

    // LDX
    0xa2: ['LDX', opcodes[EOPC.LDX], EMOD.immediate, 2],
    0xa6: ['LDX', opcodes[EOPC.LDX], EMOD.zeroPage, 3],
    0xb6: ['LDX', opcodes[EOPC.LDX], EMOD.zeroPageY, 4],
    0xae: ['LDX', opcodes[EOPC.LDX], EMOD.absolute, 4],
    0xbe: ['LDX', opcodes[EOPC.LDX], EMOD.absoluteY, 4],

    // LDY
    0xa0: ['LDY', opcodes[EOPC.LDY], EMOD.immediate, 2],
    0xa4: ['LDY', opcodes[EOPC.LDY], EMOD.zeroPage, 3],
    0xb4: ['LDY', opcodes[EOPC.LDY], EMOD.zeroPageX, 4],
    0xac: ['LDY', opcodes[EOPC.LDY], EMOD.absolute, 4],
    0xbc: ['LDY', opcodes[EOPC.LDY], EMOD.absoluteX, 4],

    // STA
    0x85: ['STA', opcodes[EOPC.STA], EMOD.zeroPage, 3],
    0x95: ['STA', opcodes[EOPC.STA], EMOD.zeroPageX, 4],
    0x8d: ['STA', opcodes[EOPC.STA], EMOD.absolute, 4],
    0x9d: ['STA', opcodes[EOPC.STA], EMOD.absoluteX, 5],
    0x99: ['STA', opcodes[EOPC.STA], EMOD.absoluteY, 5],
    0x81: ['STA', opcodes[EOPC.STA], EMOD.zeroPageXIndirect, 6],
    0x91: ['STA', opcodes[EOPC.STA], EMOD.zeroPageIndirectY, 6],

    // STX
    0x86: ['STX', opcodes[EOPC.STX], EMOD.zeroPage, 3],
    0x96: ['STX', opcodes[EOPC.STX], EMOD.zeroPageY, 4],
    0x8e: ['STX', opcodes[EOPC.STX], EMOD.absolute, 4],

    // STY
    0x84: ['STY', opcodes[EOPC.STY], EMOD.zeroPage, 3],
    0x94: ['STY', opcodes[EOPC.STY], EMOD.zeroPageX, 4],
    0x8c: ['STY', opcodes[EOPC.STY], EMOD.absolute, 4],

    // ADC
    0x69: ['ADC', opcodes[EOPC.ADC], EMOD.immediate, 2],
    0x65: ['ADC', opcodes[EOPC.ADC], EMOD.zeroPage, 3],
    0x75: ['ADC', opcodes[EOPC.ADC], EMOD.zeroPageX, 4],
    0x6D: ['ADC', opcodes[EOPC.ADC], EMOD.absolute, 4],
    0x7D: ['ADC', opcodes[EOPC.ADC], EMOD.absoluteX, 4],
    0x79: ['ADC', opcodes[EOPC.ADC], EMOD.absoluteY, 4],
    0x61: ['ADC', opcodes[EOPC.ADC], EMOD.zeroPageXIndirect, 6],
    0x71: ['ADC', opcodes[EOPC.ADC], EMOD.zeroPageIndirectY, 5],

    // SBC
    0xe9: ['SBC', opcodes[EOPC.SBC], EMOD.immediate, 2],
    0xe5: ['SBC', opcodes[EOPC.SBC], EMOD.zeroPage, 3],
    0xf5: ['SBC', opcodes[EOPC.SBC], EMOD.zeroPageX, 4],
    0xeD: ['SBC', opcodes[EOPC.SBC], EMOD.absolute, 4],
    0xfD: ['SBC', opcodes[EOPC.SBC], EMOD.absoluteX, 4],
    0xf9: ['SBC', opcodes[EOPC.SBC], EMOD.absoluteY, 4],
    0xe1: ['SBC', opcodes[EOPC.SBC], EMOD.zeroPageXIndirect, 6],
    0xf1: ['SBC', opcodes[EOPC.SBC], EMOD.zeroPageIndirectY, 5],

    // INC
    0xe6: ['INC', opcodes[EOPC.INC], EMOD.zeroPage, 5],
    0xf6: ['INC', opcodes[EOPC.INC], EMOD.zeroPageX, 6],
    0xee: ['INC', opcodes[EOPC.INC], EMOD.absolute, 6],
    0xfe: ['INC', opcodes[EOPC.INC], EMOD.absoluteX, 7],

    // INX
    0xe8: ['INX', opcodes[EOPC.INX], EMOD.implied, 2],

    // INY
    0xc8: ['INY', opcodes[EOPC.INY], EMOD.implied, 2],

    // DEC
    0xc6: ['DEC', opcodes[EOPC.DEC], EMOD.zeroPage, 5],
    0xd6: ['DEC', opcodes[EOPC.DEC], EMOD.zeroPageX, 6],
    0xce: ['DEC', opcodes[EOPC.DEC], EMOD.absolute, 6],
    0xde: ['DEC', opcodes[EOPC.DEC], EMOD.absoluteX, 7],

    // DEX
    0xca: ['DEX', opcodes[EOPC.DEX], EMOD.implied, 2],

    // DEY
    0x88: ['DEY', opcodes[EOPC.DEY], EMOD.implied, 2],

    // ASL
    0x0A: ['ASL', opcodes[EOPC.ASL_ACC], EMOD.accumulator, 2],
    0x06: ['ASL', opcodes[EOPC.ASL], EMOD.zeroPage, 5],
    0x16: ['ASL', opcodes[EOPC.ASL], EMOD.zeroPageX, 6],
    0x0E: ['ASL', opcodes[EOPC.ASL], EMOD.absolute, 6],
    0x1E: ['ASL', opcodes[EOPC.ASL], EMOD.absoluteX, 7],

    // LSR
    0x4A: ['LSR', opcodes[EOPC.LSR_ACC], EMOD.accumulator, 2],
    0x46: ['LSR', opcodes[EOPC.LSR], EMOD.zeroPage, 5],
    0x56: ['LSR', opcodes[EOPC.LSR], EMOD.zeroPageX, 6],
    0x4E: ['LSR', opcodes[EOPC.LSR], EMOD.absolute, 6],
    0x5E: ['LSR', opcodes[EOPC.LSR], EMOD.absoluteX, 7],

    // ROL
    0x2A: ['ROL', opcodes[EOPC.ROL_ACC], EMOD.accumulator, 2],
    0x26: ['ROL', opcodes[EOPC.ROL], EMOD.zeroPage, 5],
    0x36: ['ROL', opcodes[EOPC.ROL], EMOD.zeroPageX, 6],
    0x2E: ['ROL', opcodes[EOPC.ROL], EMOD.absolute, 6],
    0x3E: ['ROL', opcodes[EOPC.ROL], EMOD.absoluteX, 7],

    // ROR
    0x6A: ['ROR', opcodes[EOPC.ROR_ACC], EMOD.accumulator, 2],
    0x66: ['ROR', opcodes[EOPC.ROR], EMOD.zeroPage, 5],
    0x76: ['ROR', opcodes[EOPC.ROR], EMOD.zeroPageX, 6],
    0x6E: ['ROR', opcodes[EOPC.ROR], EMOD.absolute, 6],
    0x7E: ['ROR', opcodes[EOPC.ROR], EMOD.absoluteX, 7],

    // AND
    0x29: ['AND', opcodes[EOPC.AND], EMOD.immediate, 2],
    0x25: ['AND', opcodes[EOPC.AND], EMOD.zeroPage, 3],
    0x35: ['AND', opcodes[EOPC.AND], EMOD.zeroPageX, 4],
    0x2D: ['AND', opcodes[EOPC.AND], EMOD.absolute, 4],
    0x3D: ['AND', opcodes[EOPC.AND], EMOD.absoluteX, 4],
    0x39: ['AND', opcodes[EOPC.AND], EMOD.absoluteY, 4],
    0x21: ['AND', opcodes[EOPC.AND], EMOD.zeroPageXIndirect, 6],
    0x31: ['AND', opcodes[EOPC.AND], EMOD.zeroPageIndirectY, 5],

    // ORA
    0x09: ['ORA', opcodes[EOPC.ORA], EMOD.immediate, 2],
    0x05: ['ORA', opcodes[EOPC.ORA], EMOD.zeroPage, 3],
    0x15: ['ORA', opcodes[EOPC.ORA], EMOD.zeroPageX, 4],
    0x0D: ['ORA', opcodes[EOPC.ORA], EMOD.absolute, 4],
    0x1D: ['ORA', opcodes[EOPC.ORA], EMOD.absoluteX, 4],
    0x19: ['ORA', opcodes[EOPC.ORA], EMOD.absoluteY, 4],
    0x01: ['ORA', opcodes[EOPC.ORA], EMOD.zeroPageXIndirect, 6],
    0x11: ['ORA', opcodes[EOPC.ORA], EMOD.zeroPageIndirectY, 5],

    // EOR
    0x49: ['EOR', opcodes[EOPC.EOR], EMOD.immediate, 2],
    0x45: ['EOR', opcodes[EOPC.EOR], EMOD.zeroPage, 3],
    0x55: ['EOR', opcodes[EOPC.EOR], EMOD.zeroPageX, 4],
    0x4D: ['EOR', opcodes[EOPC.EOR], EMOD.absolute, 4],
    0x5D: ['EOR', opcodes[EOPC.EOR], EMOD.absoluteX, 4],
    0x59: ['EOR', opcodes[EOPC.EOR], EMOD.absoluteY, 4],
    0x41: ['EOR', opcodes[EOPC.EOR], EMOD.zeroPageXIndirect, 6],
    0x51: ['EOR', opcodes[EOPC.EOR], EMOD.zeroPageIndirectY, 5],

    // CMP
    0xc9: ['CMP', opcodes[EOPC.CMP], EMOD.immediate, 2],
    0xc5: ['CMP', opcodes[EOPC.CMP], EMOD.zeroPage, 3],
    0xd5: ['CMP', opcodes[EOPC.CMP], EMOD.zeroPageX, 4],
    0xcD: ['CMP', opcodes[EOPC.CMP], EMOD.absolute, 4],
    0xdD: ['CMP', opcodes[EOPC.CMP], EMOD.absoluteX, 4],
    0xd9: ['CMP', opcodes[EOPC.CMP], EMOD.absoluteY, 4],
    0xc1: ['CMP', opcodes[EOPC.CMP], EMOD.zeroPageXIndirect, 6],
    0xd1: ['CMP', opcodes[EOPC.CMP], EMOD.zeroPageIndirectY, 5],

    // CPX
    0xE0: ['CPX', opcodes[EOPC.CPX], EMOD.immediate, 2],
    0xE4: ['CPX', opcodes[EOPC.CPX], EMOD.zeroPage, 3],
    0xEC: ['CPX', opcodes[EOPC.CPX], EMOD.absolute, 4],

    // CPY
    0xC0: ['CPY', opcodes[EOPC.CPY], EMOD.immediate, 2],
    0xC4: ['CPY', opcodes[EOPC.CPY], EMOD.zeroPage, 3],
    0xCC: ['CPY', opcodes[EOPC.CPY], EMOD.absolute, 4],

    // BIT
    0x24: ['BIT', opcodes[EOPC.BIT], EMOD.zeroPage, 3],
    0x2C: ['BIT', opcodes[EOPC.BIT], EMOD.absolute, 4],

    // BCC
    0x90: ['BCC', opcodes[EOPC.BCC], EMOD.relative, 2],

    // BCS
    0xB0: ['BCS', opcodes[EOPC.BCS], EMOD.relative, 2],

    // BEQ
    0xF0: ['BEQ', opcodes[EOPC.BEQ], EMOD.relative, 2],

    // BMI
    0x30: ['BMI', opcodes[EOPC.BMI], EMOD.relative, 2],

    // BNE
    0xD0: ['BNE', opcodes[EOPC.BNE], EMOD.relative, 2],

    // BPL
    0x10: ['BPL', opcodes[EOPC.BPL], EMOD.relative, 2],

    // BVC
    0x50: ['BVC', opcodes[EOPC.BVC], EMOD.relative, 2],

    // BVS
    0x70: ['BVS', opcodes[EOPC.BVS], EMOD.relative, 2],

    // TAX
    0xAA: ['TAX', opcodes[EOPC.TAX], EMOD.implied, 2],

    // TXA
    0x8A: ['TXA', opcodes[EOPC.TXA], EMOD.implied, 2],

    // TAY
    0xA8: ['TAY', opcodes[EOPC.TAY], EMOD.implied, 2],

    // TYA
    0x98: ['TYA', opcodes[EOPC.TYA], EMOD.implied, 2],

    // TSX
    0xBA: ['TSX', opcodes[EOPC.TSX], EMOD.implied, 2],

    // TXS
    0x9A: ['TXS', opcodes[EOPC.TXS], EMOD.implied, 2],

    // PHA
    0x48: ['PHA', opcodes[EOPC.PHA], EMOD.implied, 3],

    // PLA
    0x68: ['PLA', opcodes[EOPC.PLA], EMOD.implied, 4],

    // PHP
    0x08: ['PHP', opcodes[EOPC.PHP], EMOD.implied, 3],

    // PLP
    0x28: ['PLP', opcodes[EOPC.PLP], EMOD.implied, 4],

    // JMP
    0x4C: ['JMP', opcodes[EOPC.JMP], EMOD.absolute, 3],
    0x6C: ['JMP', opcodes[EOPC.JMP], EMOD.absoluteIndirect, 5],

    // JSR
    0x20: ['JSR', opcodes[EOPC.JSR], EMOD.absolute, 6],

    // RTS
    0x60: ['RTS', opcodes[EOPC.RTS], EMOD.implied, 6],

    // RTI
    0x40: ['RTI', opcodes[EOPC.RTI], EMOD.implied, 6],

    // SEC
    0x38: ['SEC', opcodes[EOPC.SEC], EMOD.implied, 2],

    // SED
    0xF8: ['SED', opcodes[EOPC.SED], EMOD.implied, 2],

    // SEI
    0x78: ['SEI', opcodes[EOPC.SEI], EMOD.implied, 2],

    // CLC
    0x18: ['CLC', opcodes[EOPC.CLC], EMOD.implied, 2],

    // CLD
    0xD8: ['CLD', opcodes[EOPC.CLD], EMOD.implied, 2],

    // CLI
    0x58: ['CLI', opcodes[EOPC.CLI], EMOD.implied, 2],

    // CLV
    0xB8: ['CLV', opcodes[EOPC.CLV], EMOD.implied, 2],

    // NOP
    0xea: ['NOP', opcodes[EOPC.NOP], EMOD.implied, 2],

    // Invalids
    0x02: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 2],
    0x03: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x04: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 5],
    0x07: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x0B: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x0C: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 6],
    0x0F: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0x12: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 5],
    0x13: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x14: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 5],
    0x17: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x1A: ['???', opcodes[EOPC.INVALID1], EMOD.invalid1, 2],
    0x1B: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0x1C: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 6],
    0x1F: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0x22: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 2],
    0x23: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x27: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x2B: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x2F: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0x32: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 5],
    0x33: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x34: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 4],
    0x37: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x3A: ['???', opcodes[EOPC.INVALID1], EMOD.invalid1, 2],
    0x3B: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0x3C: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 4],
    0x3F: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0x42: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 2],
    0x43: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x44: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 3],
    0x47: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x4B: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0x4F: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0x52: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 5],
    0x53: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x54: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 4],
    0x57: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x5A: ['???', opcodes[EOPC.INVALID1], EMOD.invalid1, 3],
    0x5B: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0x5C: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 8],
    0x5F: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0x62: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 2],
    0x63: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x64: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 3],
    0x67: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x6B: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0x6F: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0x72: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 5],
    0x73: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x74: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 4],
    0x77: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x7A: ['???', opcodes[EOPC.INVALID1], EMOD.invalid1, 4],
    0x7B: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0x7C: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 6],
    0x7F: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0x80: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 3],
    0x82: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 2],
    0x83: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x87: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x89: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],    // TODO: check if this opcode is valid (BIT immediate)
    0x8B: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0x8F: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0x92: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 5],
    0x93: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x97: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0x9B: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0x9C: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 4],
    0x9E: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 5],
    0x9F: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0xA3: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0xA7: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0xAB: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0xAF: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0xB2: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 5],
    0xB3: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0xB7: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0xBB: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0xBF: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0xC2: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 2],
    0xC3: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0xC7: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0xCB: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0xCF: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0xD2: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 5],
    0xD3: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0xD4: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 4],
    0xD7: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0xDA: ['???', opcodes[EOPC.INVALID1], EMOD.invalid1, 3],
    0xDB: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0xDC: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 4],
    0xDF: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0xE2: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 2],
    0xE3: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0xE7: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0xEB: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0xEF: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0xF2: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 5],
    0xF3: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0xF4: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 4],
    0xF7: ['???', opcodes[EOPC.INVALID2], EMOD.invalid2, 1],
    0xFA: ['???', opcodes[EOPC.INVALID1], EMOD.invalid1, 4],
    0xFB: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],
    0xFC: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 4],
    0xFF: ['???', opcodes[EOPC.INVALID3], EMOD.invalid3, 1],

}
