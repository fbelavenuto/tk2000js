import { Assembler6502 } from '../assembler6502';

const assembler = new Assembler6502(false)

// reference: http://www.6502.org/tutorials/6502opcodes.html

// Utility
function check(code, expected) {
    expect(assembler.assembleCode(code)).toBe(true)
    const received = assembler.mMemory.slice(0x300, 0x300 + assembler.mCodeLen)
    expect(received).toEqual(expected)
}

describe('Testing JS 6502 Assembler', () => {

    /**************************************************************************/
    // ADC (ADd with Carry)
    // MODE           SYNTAX       HEX LEN TIM
    // Immediate     ADC #$44      $69  2   2
    // Zero Page     ADC $44       $65  2   3
    // Zero Page,X   ADC $44,X     $75  2   4
    // Absolute      ADC $4400     $6D  3   4
    // Absolute,X    ADC $4400,X   $7D  3   4+
    // Absolute,Y    ADC $4400,Y   $79  3   4+
    // Indirect,X    ADC ($44,X)   $61  2   6
    // Indirect,Y    ADC ($44),Y   $71  2   5+
    it('should compile ADC opcodes', () => {
        const code = `
        ADC #$44
        ADC $44
        ADC $44,X
        ADC $4400
        ADC $4400,X
        ADC $4400,Y
        ADC ($44,X)
        ADC ($44),Y
        ADC #123
        ADC 123
        ADC 9876
        `
        const expected = new Uint8Array([
            0x69, 0x44,
            0x65, 0x44,
            0x75, 0x44,
            0x6D, 0x00, 0x44,
            0x7D, 0x00, 0x44,
            0x79, 0x00, 0x44,
            0x61, 0x44,
            0x71, 0x44,
            0x69, 123,
            0x65, 123,
            0x6D, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // AND (bitwise AND with accumulator)
    // MODE           SYNTAX       HEX LEN TIM
    // Immediate     AND #$44      $29  2   2
    // Zero Page     AND $44       $25  2   3
    // Zero Page,X   AND $44,X     $35  2   4
    // Absolute      AND $4400     $2D  3   4
    // Absolute,X    AND $4400,X   $3D  3   4+
    // Absolute,Y    AND $4400,Y   $39  3   4+
    // Indirect,X    AND ($44,X)   $21  2   6
    // Indirect,Y    AND ($44),Y   $31  2   5+
    it('should compile AND opcodes', () => {
        const code = `
        AND #$44
        AND $44
        AND $44,X
        AND $4400
        AND $4400,X
        AND $4400,Y
        AND ($44,X)
        AND ($44),Y
        AND #123
        AND 123
        AND 9876
        `
        const expected = new Uint8Array([
            0x29, 0x44,
            0x25, 0x44,
            0x35, 0x44,
            0x2D, 0x00, 0x44,
            0x3D, 0x00, 0x44,
            0x39, 0x00, 0x44,
            0x21, 0x44,
            0x31, 0x44,
            0x29, 123,
            0x25, 123,
            0x2D, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // ASL (Arithmetic Shift Left)
    // MODE           SYNTAX       HEX LEN TIM
    // Accumulator   ASL A         $0A  1   2
    // Zero Page     ASL $44       $06  2   5
    // Zero Page,X   ASL $44,X     $16  2   6
    // Absolute      ASL $4400     $0E  3   6
    // Absolute,X    ASL $4400,X   $1E  3   7    
    // ASL shifts all bits left one position. 0 is shifted into bit 0 and the original bit 7 is shifted into the Carry.
    it('should compile ASL opcodes', () => {
        const code = `
        ASL A
        ASL $44
        ASL $44,X
        ASL $4400
        ASL $4400,X
        ASL 123
        ASL 9876
        `
        const expected = new Uint8Array([
            0x0A,
            0x06, 0x44,
            0x16, 0x44,
            0x0E, 0x00, 0x44,
            0x1E, 0x00, 0x44,
            0x06, 123,
            0x0E, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // BIT (test BITs)
    // MODE           SYNTAX       HEX LEN TIM
    // Zero Page     BIT $44       $24  2   3
    // Absolute      BIT $4400     $2C  3   4
    // BIT sets the Z flag as though the value in the address tested were ANDed with the accumulator. The S and V flags are set to match bits 7 and 6 respectively in the value stored at the tested address.
    it('should compile BIT opcodes', () => {
        const code = `
        BIT $44
        BIT $4400
        BIT 123
        BIT 9876
        `
        const expected = new Uint8Array([
            0x24, 0x44,
            0x2C, 0x00, 0x44,
            0x24, 123,
            0x2C, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // Branch Instructions
    // All branches are relative mode and have a length of two bytes. Syntax is "Bxx Displacement" or (better) "Bxx Label". See the notes on the Program Counter for more on displacements.
    // MNEMONIC                       HEX
    // BPL (Branch on PLus)           $10
    // BMI (Branch on MInus)          $30
    // BVC (Branch on oVerflow Clear) $50
    // BVS (Branch on oVerflow Set)   $70
    // BCC (Branch on Carry Clear)    $90
    // BCS (Branch on Carry Set)      $B0
    // BNE (Branch on Not Equal)      $D0
    // BEQ (Branch on EQual)          $F0
    it('should compile Branch opcodes with literals', () => {
        const code = `
        BPL $300
        BMI $303
        BVC $306
        BVS $306
        BCC 776
        BCS $30A
        BNE $30C
        BEQ 782
        `
        const expected = new Uint8Array([
            0x10, 0xFE,
            0x30, 0xFF,
            0x50, 0x00,
            0x70, 0xFE,
            0x90, 0xFE,
            0xB0, 0xFE,
            0xD0, 0xFE,
            0xF0, 0xFE,
            0x00
        ])
        check(code, expected)
    })
    // Banch
    it('should compile Branch opcodes with labels', () => {
        const code = `
        l1: BPL l1
        l2: BMI l2
        l3: BVC l3
        l4: BVS l4
        l5: BCC l6
        l6: BCS l8
        l7: BNE l5
        l8: BEQ l7
        `
        const expected = new Uint8Array([
            0x10, 0xFE,
            0x30, 0xFE,
            0x50, 0xFE,
            0x70, 0xFE,
            0x90, 0x00,
            0xB0, 0x02,
            0xD0, 0xFA,
            0xF0, 0xFC,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // BRK (BReaK)
    // MODE           SYNTAX       HEX LEN TIM
    // Implied       BRK           $00  1   7
    // BRK causes a non-maskable interrupt and increments the program counter by one. 
    it('should compile BRK opcode', () => {
        const code = `
        BRK
        `
        const expected = new Uint8Array([
            0x00,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // CMP (CoMPare accumulator)
    // MODE           SYNTAX       HEX LEN TIM
    // Immediate     CMP #$44      $C9  2   2
    // Zero Page     CMP $44       $C5  2   3
    // Zero Page,X   CMP $44,X     $D5  2   4
    // Absolute      CMP $4400     $CD  3   4
    // Absolute,X    CMP $4400,X   $DD  3   4+
    // Absolute,Y    CMP $4400,Y   $D9  3   4+
    // Indirect,X    CMP ($44,X)   $C1  2   6
    // Indirect,Y    CMP ($44),Y   $D1  2   5+
    it('should compile CMP opcodes', () => {
        const code = `
        CMP #$44
        CMP $44
        CMP $44,X
        CMP $4400
        CMP $4400,X
        CMP $4400,Y
        CMP ($44,X)
        CMP ($44),Y
        CMP 123
        CMP 9876
        `
        const expected = new Uint8Array([
            0xC9, 0x44,
            0xC5, 0x44,
            0xD5, 0x44,
            0xCD, 0x00, 0x44,
            0xDD, 0x00, 0x44,
            0xD9, 0x00, 0x44,
            0xC1, 0x44,
            0xD1, 0x44,
            0xC5, 123,
            0xCD, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // CPX (ComPare X register)
    // MODE           SYNTAX       HEX LEN TIM
    // Immediate     CPX #$44      $E0  2   2
    // Zero Page     CPX $44       $E4  2   3
    // Absolute      CPX $4400     $EC  3   4
    it('should compile CPX opcodes', () => {
        const code = `
        CPX #$44
        CPX $44
        CPX $4400
        CPX #123
        CPX 123
        CPX 9876
        `
        const expected = new Uint8Array([
            0xE0, 0x44,
            0xE4, 0x44,
            0xEC, 0x00, 0x44,
            0xE0, 123,
            0xE4, 123,
            0xEC, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // CPY (ComPare Y register)
    // MODE           SYNTAX       HEX LEN TIM
    // Immediate     CPY #$44      $C0  2   2
    // Zero Page     CPY $44       $C4  2   3
    // Absolute      CPY $4400     $CC  3   4
    it('should compile CPY opcodes', () => {
        const code = `
        CPY #$44
        CPY $44
        CPY $4400
        CPY #123
        CPY 123
        CPY 9876
        `
        const expected = new Uint8Array([
            0xC0, 0x44,
            0xC4, 0x44,
            0xCC, 0x00, 0x44,
            0xC0, 123,
            0xC4, 123,
            0xCC, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // DEC (DECrement memory)
    // MODE           SYNTAX       HEX LEN TIM
    // Zero Page     DEC $44       $C6  2   5
    // Zero Page,X   DEC $44,X     $D6  2   6
    // Absolute      DEC $4400     $CE  3   6
    // Absolute,X    DEC $4400,X   $DE  3   7
    it('should compile DEC opcodes', () => {
        const code = `
        DEC $44
        DEC $44,X
        DEC $4400
        DEC $4400,X
        DEC 123
        DEC 9876
        `
        const expected = new Uint8Array([
            0xC6, 0x44,
            0xD6, 0x44,
            0xCE, 0x00, 0x44,
            0xDE, 0x00, 0x44,
            0xC6, 123,
            0xCE, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // EOR (bitwise Exclusive OR)
    // MODE           SYNTAX       HEX LEN TIM
    // Immediate     EOR #$44      $49  2   2
    // Zero Page     EOR $44       $45  2   3
    // Zero Page,X   EOR $44,X     $55  2   4
    // Absolute      EOR $4400     $4D  3   4
    // Absolute,X    EOR $4400,X   $5D  3   4+
    // Absolute,Y    EOR $4400,Y   $59  3   4+
    // Indirect,X    EOR ($44,X)   $41  2   6
    // Indirect,Y    EOR ($44),Y   $51  2   5+
    it('should compile EOR opcodes', () => {
        const code = `
        EOR #$44
        EOR $44
        EOR $44,X
        EOR $4400
        EOR $4400,X
        EOR $4400,Y
        EOR ($44,X)
        EOR ($44),Y
        EOR 123
        EOR 9876
        `
        const expected = new Uint8Array([
            0x49, 0x44,
            0x45, 0x44,
            0x55, 0x44,
            0x4D, 0x00, 0x44,
            0x5D, 0x00, 0x44,
            0x59, 0x00, 0x44,
            0x41, 0x44,
            0x51, 0x44,
            0x45, 123,
            0x4D, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // Flag (Processor Status) Instructions
    // MNEMONIC                       HEX
    // CLC (CLear Carry)              $18
    // SEC (SEt Carry)                $38
    // CLI (CLear Interrupt)          $58
    // SEI (SEt Interrupt)            $78
    // CLV (CLear oVerflow)           $B8
    // CLD (CLear Decimal)            $D8
    // SED (SEt Decimal)              $F8
    it('should compile flags opcodes', () => {
        const code = `
        CLC
        SEC
        CLI
        SEI
        CLV
        CLD
        SED
        `
        const expected = new Uint8Array([
            0x18, 
            0x38, 
            0x58, 
            0x78, 
            0xB8, 
            0xD8, 
            0xF8, 
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // INC (INCrement memory)
    // MODE           SYNTAX       HEX LEN TIM
    // Zero Page     INC $44       $E6  2   5
    // Zero Page,X   INC $44,X     $F6  2   6
    // Absolute      INC $4400     $EE  3   6
    // Absolute,X    INC $4400,X   $FE  3   7
    it('should compile INC opcodes', () => {
        const code = `
        INC $44
        INC $44,X
        INC $4400
        INC $4400,X
        INC 123
        INC 9876
        `
        const expected = new Uint8Array([
            0xE6, 0x44,
            0xF6, 0x44,
            0xEE, 0x00, 0x44,
            0xFE, 0x00, 0x44,
            0xE6, 123,
            0xEE, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // JMP (JuMP)
    // MODE           SYNTAX       HEX LEN TIM
    // Absolute      JMP $5597     $4C  3   3
    // Indirect      JMP ($5597)   $6C  3   5
    it('should compile JMP opcodes', () => {
        const code = `
        JMP $5597
        JMP ($5597)
        JMP 123
        JMP 9876
        JMP ($0000)
        `
        const expected = new Uint8Array([
            0x4c, 0x97, 0x55,
            0x6c, 0x97, 0x55,
            0x4c, 123, 0,
            0x4c, 0x94, 0x26,
            0x6c, 0x00, 0x00,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // JSR (Jump to SubRoutine)
    // MODE           SYNTAX       HEX LEN TIM
    // Absolute      JSR $5597     $20  3   6
    it('should compile JSR opcodes', () => {
        const code = `
        JSR $5597
        JSR 123
        JSR 9876
        `
        const expected = new Uint8Array([
            0x20, 0x97, 0x55,
            0x20, 123, 0,
            0x20, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // LDA (LoaD Accumulator)
    // MODE           SYNTAX       HEX LEN TIM
    // Immediate     LDA #$44      $A9  2   2
    // Zero Page     LDA $44       $A5  2   3
    // Zero Page,X   LDA $44,X     $B5  2   4
    // Absolute      LDA $4400     $AD  3   4
    // Absolute,X    LDA $4400,X   $BD  3   4+
    // Absolute,Y    LDA $4400,Y   $B9  3   4+
    // Indirect,X    LDA ($44,X)   $A1  2   6
    // Indirect,Y    LDA ($44),Y   $B1  2   5+
    it('should compile LDA opcodes', () => {
        const code = `
        LDA #$44
        LDA $44
        LDA $44,X
        LDA $4400
        LDA $4400,X
        LDA $4400,Y
        LDA ($44,X)
        LDA ($44),Y
        LDA 123
        LDA 9876
        LDA #%01011010
        `
        const expected = new Uint8Array([
            0xA9, 0x44,
            0xA5, 0x44,
            0xB5, 0x44,
            0xAD, 0x00, 0x44,
            0xBD, 0x00, 0x44,
            0xB9, 0x00, 0x44,
            0xA1, 0x44,
            0xB1, 0x44,
            0xA5, 123,
            0xAD, 0x94, 0x26,
            0xA9, 0x5A,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // LDX (LoaD X register)
    // MODE           SYNTAX       HEX LEN TIM
    // Immediate     LDX #$44      $A2  2   2
    // Zero Page     LDX $44       $A6  2   3
    // Zero Page,Y   LDX $44,Y     $B6  2   4
    // Absolute      LDX $4400     $AE  3   4
    // Absolute,Y    LDX $4400,Y   $BE  3   4+
    it('should compile LDX opcodes', () => {
        const code = `
        LDX #$44
        LDX $44
        LDX $44,Y
        LDX $4400
        LDX $4400,Y
        LDX 123
        LDX 9876
        `
        const expected = new Uint8Array([
            0xA2, 0x44,
            0xA6, 0x44,
            0xB6, 0x44,
            0xAE, 0x00, 0x44,
            0xBE, 0x00, 0x44,
            0xA6, 123,
            0xAE, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // LDY (LoaD Y register)
    // MODE           SYNTAX       HEX LEN TIM
    // Immediate     LDY #$44      $A0  2   2
    // Zero Page     LDY $44       $A4  2   3
    // Zero Page,X   LDY $44,X     $B4  2   4
    // Absolute      LDY $4400     $AC  3   4
    // Absolute,X    LDY $4400,X   $BC  3   4+
    it('should compile LDY opcodes', () => {
        const code = `
        LDY #$44
        LDY $44
        LDY $44,X
        LDY $4400
        LDY $4400,X
        LDY 123
        LDY 9876
        `
        const expected = new Uint8Array([
            0xA0, 0x44,
            0xA4, 0x44,
            0xB4, 0x44,
            0xAC, 0x00, 0x44,
            0xBC, 0x00, 0x44,
            0xA4, 123,
            0xAC, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // LSR (Logical Shift Right)
    // MODE           SYNTAX       HEX LEN TIM
    // Accumulator   LSR A         $4A  1   2
    // Zero Page     LSR $44       $46  2   5
    // Zero Page,X   LSR $44,X     $56  2   6
    // Absolute      LSR $4400     $4E  3   6
    // Absolute,X    LSR $4400,X   $5E  3   7
    it('should compile LSR opcodes', () => {
        const code = `
        LSR A
        LSR $44
        LSR $44,X
        LSR $4400
        LSR $4400,X
        LSR 123
        LSR 9876
        `
        const expected = new Uint8Array([
            0x4A,
            0x46, 0x44,
            0x56, 0x44,
            0x4E, 0x00, 0x44,
            0x5E, 0x00, 0x44,
            0x46, 123,
            0x4E, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // NOP (No OPeration)
    // MODE           SYNTAX       HEX LEN TIM
    // Implied       NOP           $EA  1   2
    it('should compile NOP opcode', () => {
        const code = `
        NOP
        `
        const expected = new Uint8Array([
            0xEA,
            0x00
        ])
        check(code, expected)
    })
    
    /**************************************************************************/
    // ORA (bitwise OR with Accumulator)
    // MODE           SYNTAX       HEX LEN TIM
    // Immediate     ORA #$44      $09  2   2
    // Zero Page     ORA $44       $05  2   3
    // Zero Page,X   ORA $44,X     $15  2   4
    // Absolute      ORA $4400     $0D  3   4
    // Absolute,X    ORA $4400,X   $1D  3   4+
    // Absolute,Y    ORA $4400,Y   $19  3   4+
    // Indirect,X    ORA ($44,X)   $01  2   6
    // Indirect,Y    ORA ($44),Y   $11  2   5+
    it('should compile ORA opcodes', () => {
        const code = `
        ORA #$44
        ORA $44
        ORA $44,X
        ORA $4400
        ORA $4400,X
        ORA $4400,Y
        ORA ($44,X)
        ORA ($44),Y
        ORA #123
        ORA 123
        ORA 9876
        `
        const expected = new Uint8Array([
            0x09, 0x44,
            0x05, 0x44,
            0x15, 0x44,
            0x0D, 0x00, 0x44,
            0x1D, 0x00, 0x44,
            0x19, 0x00, 0x44,
            0x01, 0x44,
            0x11, 0x44,
            0x09, 123,
            0x05, 123,
            0x0D, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // Register Instructions
    // MNEMONIC                 HEX
    // TAX (Transfer A to X)    $AA
    // TXA (Transfer X to A)    $8A
    // DEX (DEcrement X)        $CA
    // INX (INcrement X)        $E8
    // TAY (Transfer A to Y)    $A8
    // TYA (Transfer Y to A)    $98
    // DEY (DEcrement Y)        $88
    // INY (INcrement Y)        $C8
    it('should compile Register opcodes', () => {
        const code = `
        TAX
        TXA
        DEX
        INX
        TAY
        TYA
        DEY
        INY
        `
        const expected = new Uint8Array([
            0xAA, 
            0x8A, 
            0xCA, 
            0xE8, 
            0xA8, 
            0x98, 
            0x88, 
            0xC8,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // ROL (ROtate Left)
    // MODE           SYNTAX       HEX LEN TIM
    // Accumulator   ROL A         $2A  1   2
    // Zero Page     ROL $44       $26  2   5
    // Zero Page,X   ROL $44,X     $36  2   6
    // Absolute      ROL $4400     $2E  3   6
    // Absolute,X    ROL $4400,X   $3E  3   7
    it('should compile ROL opcodes', () => {
        const code = `
        ROL A
        ROL $44
        ROL $44,X
        ROL $4400
        ROL $4400,X
        ROL 123
        ROL 9876
        `
        const expected = new Uint8Array([
            0x2A,
            0x26, 0x44,
            0x36, 0x44,
            0x2E, 0x00, 0x44,
            0x3E, 0x00, 0x44,
            0x26, 123,
            0x2E, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // ROR (ROtate Right)
    // MODE           SYNTAX       HEX LEN TIM
    // Accumulator   ROR A         $6A  1   2
    // Zero Page     ROR $44       $66  2   5
    // Zero Page,X   ROR $44,X     $76  2   6
    // Absolute      ROR $4400     $6E  3   6
    // Absolute,X    ROR $4400,X   $7E  3   7
    it('should compile ROR opcodes', () => {
        const code = `
        ROR A
        ROR $44
        ROR $44,X
        ROR $4400
        ROR $4400,X
        ROR 123
        ROR 9876
        `
        const expected = new Uint8Array([
            0x6A,
            0x66, 0x44,
            0x76, 0x44,
            0x6E, 0x00, 0x44,
            0x7E, 0x00, 0x44,
            0x66, 123,
            0x6E, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // RTI (ReTurn from Interrupt)
    // MODE           SYNTAX       HEX LEN TIM
    // Implied       RTI           $40  1   6
    it('should compile RTI opcode', () => {
        const code = `
        RTI
        `
        const expected = new Uint8Array([
            0x40,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // RTS (ReTurn from Subroutine)
    // MODE           SYNTAX       HEX LEN TIM
    // Implied       RTS           $60  1   6
    it('should compile RTS opcode', () => {
        const code = `
        RTS
        `
        const expected = new Uint8Array([
            0x60,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // SBC (SuBtract with Carry)
    // MODE           SYNTAX       HEX LEN TIM
    // Immediate     SBC #$44      $E9  2   2
    // Zero Page     SBC $44       $E5  2   3
    // Zero Page,X   SBC $44,X     $F5  2   4
    // Absolute      SBC $4400     $ED  3   4
    // Absolute,X    SBC $4400,X   $FD  3   4+
    // Absolute,Y    SBC $4400,Y   $F9  3   4+
    // Indirect,X    SBC ($44,X)   $E1  2   6
    // Indirect,Y    SBC ($44),Y   $F1  2   5+
    it('should compile SBC opcodes', () => {
        const code = `
        SBC #$44
        SBC $44
        SBC $44,X
        SBC $4400
        SBC $4400,X
        SBC $4400,Y
        SBC ($44,X)
        SBC ($44),Y
        SBC #123
        SBC 123
        SBC 9876
        `
        const expected = new Uint8Array([
            0xE9, 0x44,
            0xE5, 0x44,
            0xF5, 0x44,
            0xED, 0x00, 0x44,
            0xFD, 0x00, 0x44,
            0xF9, 0x00, 0x44,
            0xE1, 0x44,
            0xF1, 0x44,
            0xE9, 123,
            0xE5, 123,
            0xED, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // STA (STore Accumulator)
    // MODE           SYNTAX       HEX LEN TIM
    // Zero Page     STA $44       $85  2   3
    // Zero Page,X   STA $44,X     $95  2   4
    // Absolute      STA $4400     $8D  3   4
    // Absolute,X    STA $4400,X   $9D  3   5
    // Absolute,Y    STA $4400,Y   $99  3   5
    // Indirect,X    STA ($44,X)   $81  2   6
    // Indirect,Y    STA ($44),Y   $91  2   6
    it('should compile STA opcodes', () => {
        const code = `
        STA $44
        STA $44,X
        STA $4400
        STA $4400,X
        STA $4400,Y
        STA ($44,X)
        STA ($44),Y
        STA 123
        STA 9876
        `
        const expected = new Uint8Array([
            0x85, 0x44,
            0x95, 0x44,
            0x8D, 0x00, 0x44,
            0x9D, 0x00, 0x44,
            0x99, 0x00, 0x44,
            0x81, 0x44,
            0x91, 0x44,
            0x85, 123,
            0x8D, 0x94, 0x26,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // STX (STore X register)
    // MODE           SYNTAX       HEX LEN TIM
    // Zero Page     STX $44       $86  2   3
    // Zero Page,Y   STX $44,Y     $96  2   4
    // Absolute      STX $4400     $8E  3   4
    it('should compile STX opcodes', () => {
        const code = `
        STX $44
        STX $44,Y
        STX $4400
        STX 123
        STX 9876
        STX 123,Y
        `
        const expected = new Uint8Array([
            0x86, 0x44,
            0x96, 0x44,
            0x8E, 0x00, 0x44,
            0x86, 123,
            0x8E, 0x94, 0x26,
            0x96, 123,
            0x00
        ])
        check(code, expected)
    })

     
    /**************************************************************************/    
    // STY (STore Y register)
    // MODE           SYNTAX       HEX LEN TIM
    // Zero Page     STY $44       $84  2   3
    // Zero Page,X   STY $44,X     $94  2   4
    // Absolute      STY $4400     $8C  3   4
    it('should compile STY opcodes', () => {
        const code = `
        STY $44
        STY $44,X
        STY $4400
        STY 123
        STY 9876
        STY 123,X
        `
        const expected = new Uint8Array([
            0x84, 0x44,
            0x94, 0x44,
            0x8C, 0x00, 0x44,
            0x84, 123,
            0x8C, 0x94, 0x26,
            0x94, 123,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // Stack Instructions
    // MNEMONIC                        HEX TIM
    // TXS (Transfer X to Stack ptr)   $9A  2
    // TSX (Transfer Stack ptr to X)   $BA  2
    // PHA (PusH Accumulator)          $48  3
    // PLA (PuLl Accumulator)          $68  4
    // PHP (PusH Processor status)     $08  3
    // PLP (PuLl Processor status)     $28  4
    it('should compile Stack opcodes', () => {
        const code = `
        TXS
        TSX
        PHA
        PLA
        PHP
        PLP
        `
        const expected = new Uint8Array([
            0x9A,
            0xBA,
            0x48,
            0x68,
            0x08,
            0x28,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // DCB instruction
    it('should compile DCB instruction', () => {
        const code = `DCB 1, 2, $AA, $5A, 123`
        const expected = new Uint8Array([
            1, 2, 0xAA, 0x5A, 123,
            0x00
        ])
        check(code, expected)
    })

    /**************************************************************************/
    // EQU instruction
    it('should compile EQU instruction', () => {
        const code = `
        *=$100
        DCB $AA, $55
        `
        const expected = new Uint8Array([
            0xAA, 0x55,
            0x00
        ])
        expect(assembler.assembleCode(code)).toBe(true)
        const received = assembler.mMemory.slice(0x100, 0x100 + assembler.mCodeLen)
        expect(received).toEqual(expected)
    })

    /**************************************************************************/
    // Labels
    it('should compile opcodes using labels', () => {
        const code = `
        LDA label
        LDA label,X
        LDA label,Y
        label:
        `
        const expected = new Uint8Array([
            0xAD, 0x09, 0x03,
            0xBD, 0x09, 0x03,
            0xB9, 0x09, 0x03,
            0x00
        ])
        check(code, expected)
    })

    it('should compile opcodes using Lo/Hi labels', () => {
        const code = `
        LDA label
        LDX #>label
        LDY #<label
        label:
        `
        const expected = new Uint8Array([
            0xAD, 0x07, 0x03,
            0xA2, 0x03,
            0xA0, 0x07,
            0x00
        ])
        check(code, expected)
    })


    /**************************************************************************/
    /**************************************************************************/
    // Invalid opcodes/address modes/etc
    it('should not compile invalid opcodes', () => {
        const code = `INVALID`
        expect(assembler.assembleCode(code)).toBe(false)
    })

    it('should not compile invalid address mode', () => {
        let code = `STA #$00`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `ADC $11,Y`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `ASL #$AA`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `BPL $AA,X`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `BPL $AA,Y`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `BPL $AAAA,X`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `BPL $AAAA,Y`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `BPL ($AAAA)`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `BPL ($AA),X`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `BPL ($AA,Y)`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `EOR`
        expect(assembler.assembleCode(code)).toBe(false)
    })

    it('should not compile invalid address', () => {
        let code = `LDA 99999`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `LDA 99999,X`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `LDA 99999,Y`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `BPL 99999`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `BPL #FFFFF`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `LDA %11111111`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `STY 999,X`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `STX 999,Y`
        expect(assembler.assembleCode(code)).toBe(false)
    })

    it('should not compile invalid label', () => {
        let code = `STA invalidlabel`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `STA invalidlabel,X`
        expect(assembler.assembleCode(code)).toBe(false)
        code = `STA invalidlabel,Y`
        expect(assembler.assembleCode(code)).toBe(false)
    })

    it('should not compile with duplicate label', () => {
        let code = `
        LDA duplicateLabel
        duplicateLabel:
        CLD
        duplicateLabel:
        CLI
        `
        expect(assembler.assembleCode(code)).toBe(false)
    })

    it('should not compile DCB without data', () => {
        const code = `DCB `
        expect(assembler.assembleCode(code)).toBe(false)
    })

    it('should not compile DCB with invalid data', () => {
        const code = `DCB invalid`
        expect(assembler.assembleCode(code)).toBe(false)
    })

    it('should not compile invalid origin address', () => {
        const code = `*=99999`
        expect(assembler.assembleCode(code)).toBe(false)
    })


})
