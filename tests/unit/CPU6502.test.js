import { CCPU6502 } from '../../src/core/CPU/CPU6502';
import { CBus } from '../../src/core/Bus';
import assembler from '../utils'

let cpu = null;

class CTestBus extends CBus {

    constructor() {
        super();
        this.memory = new Uint8Array(0x10000);
    }

    loadBin(addr, bin) {
        this.memory.set(bin, addr)
    }

    addDevice = jest.fn()

    registerAddr = jest.fn()

    registerIntervalAddr = jest.fn()

    readByte(addr) {
        return this.memory[addr]
    }

    writeByte(addr, data) {
        this.memory[addr] = data
    }

    resetAll = jest.fn()

    updateAll = jest.fn()

    reset() {
        bus.memory.fill(0)
        bus.memory[0xFFFA] = 0x00
        bus.memory[0xFFFB] = 0x03
        bus.memory[0xFFFC] = 0x00   // Reset vector = 0x300
        bus.memory[0xFFFD] = 0x03
        bus.memory[0xFFFE] = 0xAA   // BRK vector = 0x55AA
        bus.memory[0xFFFF] = 0x55
    }
}
const bus = new CTestBus();


describe('Testing CCPU6502', () => {
    /****************************************************************************************/
    it('should make CCPU6502 instance and call only CBus addDevice method', () => {
        cpu = new CCPU6502(bus);
        expect(cpu).not.toBeNull()
        expect(bus.addDevice).toBeCalled()
        expect(bus.registerAddr).not.toBeCalled();
        expect(bus.registerIntervalAddr).not.toBeCalled();
    })

    /****************************************************************************************/
    it('should write byte and read correct data', () => {
        cpu.writeByte(0, 0xAA)
        expect(cpu.readByte(0)).toBe(0xAA)
    })

    /****************************************************************************************/
    it('should write word and read correct data (endianess)', () => {
        cpu.writeWord(0x1000, 0xA55A)
        expect(cpu.readWord(0x1000)).toBe(0xA55A)
        expect(cpu.readByte(0x1000)).toBe(0x5A)
        expect(cpu.readByte(0x1001)).toBe(0xA5)
        cpu.writeByte(0x2000, 0x55)
        cpu.writeByte(0x2001, 0xAA)
        expect(cpu.readWord(0x2000)).toBe(0xAA55)
    })

    /****************************************************************************************/
    it('should call reset initialize registers', () => {
        bus.reset()
        cpu.reset()
        expect(cpu.mRegA).toEqual(0)
        expect(cpu.mRegX).toEqual(0)
        expect(cpu.mRegY).toEqual(0)
        expect(cpu.mRegS).toEqual(0xFF)
        expect(cpu.mRegPC).toEqual(0x300)
        expect(cpu.mRegFlags).toEqual(0x20)
    })

    /****************************************************************************************/
    it('should call update method do nothing', () => {
        expect(() => {
            cpu.update()
        }).not.toThrow()
    })
});

/* Helpers */
/****************************************************************************************/
function hlpAssExec(code) {
    const obj = assembler(code)
    bus.loadBin(0x300, obj['code'])
    return cpu.stepOpcodes(obj['lines'])
}

/****************************************************************************************/
function hlpCheckAllRegs(a, x, y, s, pc, f) {
    expect(cpu.mRegA).toEqual(a)
    expect(cpu.mRegX).toEqual(x)
    expect(cpu.mRegY).toEqual(y)
    expect(cpu.mRegS).toEqual(s)
    expect(cpu.mRegPC).toEqual(pc)
    expect(cpu.mRegFlags).toEqual(f)
}

/****************************************************************************************/
function hlpCheckAXYRegs(a, x, y) {
    expect(cpu.mRegA).toEqual(a)
    expect(cpu.mRegX).toEqual(x)
    expect(cpu.mRegY).toEqual(y)
}

/****************************************************************************************/
function hlpCheckMem(addr, expected) {
    for (let i = 0; i < expected.length; i++) {
        expect(bus.memory[addr + i]).toBe(expected[i]);
    }
}

/****************************************************************************************/
/****************************************************************************************/
describe('Testing opcodes', () => {

    beforeEach(() => {
        cpu.mThrowInBRK = false;
        bus.reset()
        cpu.reset()
    })

    /****************************************************************************************/
    test('NOP opcode', () => {
        expect(hlpAssExec('NOP')).toBe(2)
        hlpCheckAllRegs(0, 0, 0, 0xFF, 0x301, 0x20)

    })

    /****************************************************************************************/
    test('BRK opcode', () => {
        expect(hlpAssExec('BRK')).toBe(7)
        hlpCheckAllRegs(0, 0, 0, 0xFC, 0x55AA, 0x24)
    })

    /****************************************************************************************/
    test("LDx, STx opcodes: Immediate, Zero Page", () => {
        expect(hlpAssExec(`
            LDA #$40
            STA $0
            LDX #$55
            STX $1
            LDY #$AA
            STY $2
        `)).toBe(15)
        hlpCheckAXYRegs(0x40, 0x55, 0xAA)
        hlpCheckMem(0, [0x40, 0x55, 0xAA])
    })

    /****************************************************************************************/
    test("LDx, STx opcodes: Absolute", () => {
        expect(hlpAssExec(`
            LDA #$40
            STA $1000
            LDX #$55
            STX $1001
            LDY #$AA
            STY $1002
            LDA $1001
            LDX $1002
            LDY $1000
        `)).toBe(30)
        hlpCheckAXYRegs(0x55, 0xAA, 0x40)
        hlpCheckMem(0x1000, [0x40, 0x55, 0xAA])
    });

    /****************************************************************************************/
    test("LDx, STx opcodes: Indexed absolute", () => {
        expect(hlpAssExec(`
            LDA #$AA
            LDX #$55
            LDY #$94
            STA $1055
            STX $10AA
            STY $1094
            LDA $1000,X
            STA $1000
            LDA $1000,Y
            LDX $1000,Y
            LDY $1000,X
        `)).toBe(38)
        hlpCheckAXYRegs(0x94, 0x94, 0x94)
        hlpCheckMem(0x1000, [0xAA])
    });

    /****************************************************************************************/
    test("LDx, STx opcodes: Indexed zero page", () => {
        expect(hlpAssExec(`
            LDA #$AA
            LDX #$55
            LDY #$94
            STA $55
            STX $AA
            STY $94
            LDA $00,X
            LDX $00,Y
            LDY $00,X
        `)).toBe(27)
        hlpCheckAXYRegs(0xAA, 0x94, 0x94)
    });

    /****************************************************************************************/
    test("LDA opcode: Indirect", () => {
        expect(hlpAssExec(`
            LDA #$22
            STA $00
            LDA #$33
            STA $01
            LDA #$11
            STA $67
            LDA #$99
            STA $68
            LDA #$AA
            LDX #$55
            LDY #$94
            STA $9911
            STX $33B6
            LDA ($12,X)
            STA $1000
            LDA ($00),Y
        `)).toBe(49)
        hlpCheckAXYRegs(0x55, 0x55, 0x94)
        hlpCheckMem(0x1000, [0xAA])
    });

    /****************************************************************************************/
    test('CLx opcodes', () => {
        cpu.mRegFlags = 0xFF
        expect(hlpAssExec(`
            CLC
            CLD
            CLI
            CLV
        `)).toBe(8)
        expect(cpu.mRegFlags).toEqual(0xB2)
    })

    /****************************************************************************************/
    test('SEx opcodes', () => {
        expect(hlpAssExec(`
            SEC
            SED
            SEI
        `)).toBe(6)
        expect(cpu.mRegFlags).toEqual(0x2D)
    })

    /****************************************************************************************/
    test("ADC opcode without flag D", () => {
        expect(hlpAssExec(`
            CLD
            CLC
            LDA #$12
            ADC #$34
            STA $00
            LDA #$12
            SEC
            ADC #$34
            STA $01
        `)).toBe(20)
        hlpCheckMem(0, [0x46, 0x47])
    })

    /****************************************************************************************/
    test("ADC opcode with flag D", () => {
        expect(hlpAssExec(`
            CLC
            SED
            LDA #$99
            ADC #$11
        `)).toBe(8)
        hlpCheckAXYRegs(0x10, 0x00, 0x00)
    })

    /****************************************************************************************/
    test("SBC opcode without flag D", () => {
        expect(hlpAssExec(`
            CLD
            CLC
            LDA #$12
            SBC #$34
            STA $00
            LDA #$12
            SEC
            SBC #$34
            STA $01
        `)).toBe(20)
        hlpCheckMem(0, [0xDD, 0xDE])
    })

    /****************************************************************************************/
    test("SBC opcode with flag D", () => {
        expect(hlpAssExec(`
            SEC
            SED
            LDA #$11
            SBC #$99
        `)).toBe(8)
        hlpCheckAXYRegs(0x12, 0x00, 0x00)
    })

    /****************************************************************************************/
    test("INx opcodes", () => {
        expect(hlpAssExec(`
            LDA #$10
            STA $00
            LDA #$22
            STA $1000
            LDX #$20
            LDY #$33
            INC $00
            INC $1000
            INX
            INY
        `)).toBe(30)
        hlpCheckAXYRegs(0x22, 0x21, 0x34)
        hlpCheckMem(0, [0x11])
        hlpCheckMem(0x1000, [0x23])
    })

    /****************************************************************************************/
    test("DEx opcodes", () => {
        expect(hlpAssExec(`
            LDA #$10
            STA $00
            LDX #$20
            LDY #$33
            DEC $00
            DEX
            DEY
        `)).toBe(18)
        hlpCheckAXYRegs(0x10, 0x1F, 0x32)
        hlpCheckMem(0, [0x0F])
    })

    /****************************************************************************************/
    test("ORA opcode", () => {
        expect(hlpAssExec(`
            LDA #$55
            ORA #$A5
            STA $00
            LDA #$AA
            STA $01
            LDA #$50
            ORA $01
        `)).toBe(17)
        hlpCheckAXYRegs(0xFA, 0x00, 0x00)
        hlpCheckMem(0, [0xF5])
    })

    /****************************************************************************************/
    test("EOR opcode", () => {
        expect(hlpAssExec(`
            LDA #$55
            EOR #$A5
            STA $00
            LDA #$99
            STA $01
            LDA #$88
            EOR $01
        `)).toBe(17)
        hlpCheckAXYRegs(0x11, 0x00, 0x00)
        hlpCheckMem(0, [0xF0])
    })

    /****************************************************************************************/
    test("AND opcode", () => {
        expect(hlpAssExec(`
            LDA #$45
            AND #$92
            STA $00
            LDA #$38
            STA $01
            LDA #$75
            AND $01
        `)).toBe(17)
        hlpCheckAXYRegs(0x30, 0x00, 0x00)
        hlpCheckMem(0, [0x00])
    })

    /****************************************************************************************/
    test("ASL opcode", () => {
        expect(hlpAssExec(`
            LDA #$55
            ASL A
            STA $00
            LDA #$98
            STA $01
            ASL $01
        `)).toBe(17)
        expect(cpu.mRegFlags).toEqual(0x21)
        hlpCheckMem(0, [0xAA, 0x30])
    })

    /****************************************************************************************/
    test("LSR opcode", () => {
        expect(hlpAssExec(`
            LDA #$AA
            LSR A
            STA $00
            LDA #$18
            STA $01
            LSR $01
        `)).toBe(17)
        expect(cpu.mRegFlags).toEqual(0x20)
        hlpCheckMem(0, [0x55, 0x0C])
    })

    /****************************************************************************************/
    test("ROL opcode", () => {
        expect(hlpAssExec(`
            LDA #$55
            CLC
            ROL A
            STA $00
            LDA #$98
            STA $01
            SEC
            ROL $01
        `)).toBe(21)
        expect(cpu.mRegFlags).toEqual(0x21)
        hlpCheckMem(0, [0xAA, 0x31])
    })

    /****************************************************************************************/
    test("ROR opcode", () => {
        expect(hlpAssExec(`
            LDA #$55
            CLC
            ROR A
            STA $00
            LDA #$98
            STA $01
            SEC
            ROR $01
        `)).toBe(21)
        expect(cpu.mRegFlags).toEqual(0xA0)
        hlpCheckMem(0, [0x2A, 0xCC])
    })

    /****************************************************************************************/
    test("CMP opcodes", () => {
        expect(hlpAssExec(`
            LDA #$45
            CMP #$45
        `)).toBe(4)
        hlpCheckAXYRegs(0x45, 0x00, 0x00)
        expect(cpu.mRegFlags).toEqual(0x23)
        cpu.reset()
        expect(hlpAssExec(`
            LDA #$99
            CMP #$88
        `)).toBe(4)
        expect(cpu.mRegFlags).toEqual(0x21)
        cpu.reset()
        expect(hlpAssExec(`
            LDA #$88
            CMP #$99
        `)).toBe(4)
        expect(cpu.mRegFlags).toEqual(0xA0)
    })

    /****************************************************************************************/
    test("CPX opcodes", () => {
        expect(hlpAssExec(`
            LDX #$45
            CPX #$45
        `)).toBe(4)
        hlpCheckAXYRegs(0x00, 0x45, 0x00)
        expect(cpu.mRegFlags).toEqual(0x23)
        cpu.reset()
        expect(hlpAssExec(`
            LDX #$99
            CPX #$88
        `)).toBe(4)
        expect(cpu.mRegFlags).toEqual(0x21)
        cpu.reset()
        expect(hlpAssExec(`
            LDX #$88
            CPX #$99
        `)).toBe(4)
        expect(cpu.mRegFlags).toEqual(0xA0)
    })

    /****************************************************************************************/
    test("CPY opcodes", () => {
        expect(hlpAssExec(`
            LDY #$45
            CPY #$45
        `)).toBe(4)
        hlpCheckAXYRegs(0x00, 0x00, 0x45)
        expect(cpu.mRegFlags).toEqual(0x23)
        cpu.reset()
        expect(hlpAssExec(`
            LDY #$99
            CPY #$88
        `)).toBe(4)
        expect(cpu.mRegFlags).toEqual(0x21)
        cpu.reset()
        expect(hlpAssExec(`
            LDY #$88
            CPY #$99
        `)).toBe(4)
        expect(cpu.mRegFlags).toEqual(0xA0)
    })

    /****************************************************************************************/
    test("TAx opcodes", () => {
        expect(hlpAssExec(`
            LDA #$32
            TAX
            LDA #$23
            TAY
        `)).toBe(8)
        hlpCheckAXYRegs(0x23, 0x32, 0x23)
    })

    /****************************************************************************************/
    test("TxA opcodes", () => {
        expect(hlpAssExec(`
            LDX #$FB
            TXA
            STA $0
            LDY #$FE
            TYA
            LDX $0
        `)).toBe(14)
        hlpCheckAXYRegs(0xFE, 0xFB, 0xFE)
    })

    /****************************************************************************************/
    test("TSX/TXS opcodes", () => {
        expect(hlpAssExec(`
            TSX
            STX $0
            LDX #$77
            TXS
            LDA $0
        `)).toBe(12)
        hlpCheckAXYRegs(0xFF, 0x77, 0x00)
        expect(cpu.mRegS).toBe(0x77)
    })

    /****************************************************************************************/
    test("Push Stack opcodes", () => {
        expect(hlpAssExec(`
            LDA #$45
            PHA
            PHP
        `)).toBe(8)
        hlpCheckMem(0x01FE, [0x20, 0x45])
        expect(cpu.mRegS).toBe(0xFD)
    })

    /****************************************************************************************/
    test("Pop Stack opcodes", () => {
        expect(hlpAssExec(`
            PHA
            PHP
            LDA #$45
            STA $01FF
            LDA #$97
            STA $01FE
            PLA
            PLP
        `)).toBe(26)
        hlpCheckAXYRegs(0x97, 0x00, 0x00)
        expect(cpu.mRegFlags).toBe(0x45)
        expect(cpu.mRegS).toBe(0xFF)
    })

    /****************************************************************************************/
    test("BIT opcode", () => {
        expect(hlpAssExec(`
            LDA #$B0
            STA $0
            LDA #$78
            BIT $0
            PHP
            LDA #$70
            STA $0
            LDA #$78
            BIT $0
            PHP
            LDA #$00
            BIT $0
        `)).toBe(31)
        expect(cpu.mRegFlags).toBe(0x62)
        hlpCheckMem(0x1FE,[0x60, 0xA0])
    })

    /****************************************************************************************/
    test("BCx opcode", () => {
        expect(hlpAssExec(`
            LDA #$55
            CLC
            BCC lbl1
            LDA #$AA
        lbl1: LDX #$66
            CLC
            BCS lbl2
            LDX #$77
        lbl2: NOP
        `)).toBe(23)
        hlpCheckAXYRegs(0x55, 0x77, 0x00)
    })

    /****************************************************************************************/
    test("BEQ/BNE opcode", () => {
        expect(hlpAssExec(`
            LDA #$55    ; Z = 0
            BNE lbl1
            LDA #$AA
        lbl1: LDX #$00  ; Z = 1
            BEQ lbl2
            LDX #$77
        lbl2: NOP
        `)).toBe(24)
        hlpCheckAXYRegs(0x55, 0x00, 0x00)
    })

    /****************************************************************************************/
    test("BPL/BMI opcode", () => {
        expect(hlpAssExec(`
            LDA #$55    ; N = 0
            BPL lbl1
            LDA #$AA
        lbl1: LDX #$90  ; N = 1
            BMI lbl2
            LDX #$77
        lbl2: NOP
        `)).toBe(24)
        hlpCheckAXYRegs(0x55, 0x90, 0x00)
    })

    /****************************************************************************************/
    test("BVx opcode", () => {
        expect(hlpAssExec(`
            LDA #$40    ; to force V flag
            STA $0
            LDA #$55
            CLV
            BVC lbl1
            LDA #$AA
        lbl1: LDX #$66
            BIT $0      ; V = 1
            BVS lbl2
            LDX #$77
        lbl2: NOP
        `)).toBe(34)
        hlpCheckAXYRegs(0x55, 0x66, 0x00)
    })

    /****************************************************************************************/
    test("Branch backward", () => {
        expect(hlpAssExec(`
            LDX #$00
        lbl1: INX
            CLC
            BCC lbl1
            NOP
        `)).toBe(10)
        hlpCheckAXYRegs(0x00, 0x02, 0x00)
    })

    /****************************************************************************************/
    test("JMP opcode: absolute", () => {
        expect(hlpAssExec(`
            LDA #$49
            JMP lbl1
            LDA #$94
            BRK
        lbl1: LDX #$85
        `)).toBe(21)
        hlpCheckAXYRegs(0x49, 0x85, 0x00)
    })

    /****************************************************************************************/
    test("JMP opcode: indirect", () => {
        expect(hlpAssExec(`
            LDA #<lbl1
            STA $1000
            LDA #>lbl1
            STA $1001
            LDA #$CB
            JMP ($1000)
            LDA #$94
            BRK
        lbl1: LDX #$85
            DCB $EA, $EA
        `)).toBe(25)
        hlpCheckAXYRegs(0xCB, 0x85, 0x00)
    })

    /****************************************************************************************/
    test("JSR/RTS opcode", () => {
        expect(hlpAssExec(`
            LDA #$49
            JSR lbl1
            LDY #$94
            JMP end
        lbl1: LDX #$87
            RTS
        end: NOP
        `)).toBe(23)
        hlpCheckAXYRegs(0x49, 0x87, 0x94)
        hlpCheckMem(0x1FE, [0x04, 0x03])
    })

    /****************************************************************************************/
    test("RTI opcode", () => {
        expect(hlpAssExec(`
            LDA #$FF
            JSR lbl1
            LDY #$94
            JMP end
        lbl1: LDX #$87
            PHA
            RTI
        end: NOP
        `)).toBe(26)
        hlpCheckAXYRegs(0xFF, 0x87, 0x94)
        hlpCheckMem(0x1FE, [0x04, 0x03])
        expect(cpu.mRegFlags).toBe(0xED)
    })

    /****************************************************************************************/
    test('Invalid opcode', () => {
        expect(hlpAssExec(`
            DCB $1A,$02,$0,$C,$0,$0
            NOP
            NOP
            NOP
        `)).toBe(10)
        hlpCheckAllRegs(0, 0, 0, 0xFF, 0x306, 0x20)
    })

    test('Test stepCycles()', () => {
        expect(cpu.stepCycles(1)).toBe(7);
    })

})
test.todo('Check cycles')
test.todo('Check more flags')
