import { Assembler6502 } from './assembler6502';

export default (code) => {
    const assembler = new Assembler6502(false)
    const result = new Uint8Array([])

    if (assembler.assembleCode(code)) {
        return {
            lines: assembler.mLinesOfCode,
            code: assembler.mMemory.slice(0x300, 0x300+assembler.mCodeLen-1)
        }
    }
    return {
        lines: 0,
        code: result
    }
}
