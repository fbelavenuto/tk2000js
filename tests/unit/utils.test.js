import assembler from '../utils'

describe('Testing utils', () => {
    it('should assembler compile a simple code', () => {
        const code='LDA #0'
        const expected = new Uint8Array([0xA9, 0x00])
        const obj = assembler(code)
        expect(obj.lines).toBe(1)
        expect(obj.code).toEqual(expected)
    })

    it('should assembler compile a long code', () => {
        const code = `
            LDA #$AA
            LDX #$55
            LDY #$5A
        `
        const expected = new Uint8Array([
                0xA9, 0xAA,
                0xA2, 0x55,
                0xA0, 0x5A
        ])
        const obj = assembler(code)
        expect(obj.lines).toBe(3)
        expect(obj.code).toEqual(expected)
    })

    it('should return empty data', () => {
        const code='invalid'
        const obj = assembler(code)
        expect(obj.lines).toBe(0)
        expect(obj.code).toEqual(new Uint8Array([]))
    })
})
