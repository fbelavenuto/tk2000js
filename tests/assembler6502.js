/* Adapted from:
 * 
 *  6502 assembler and simulator in Javascript
 *  (C)2006-2010 Stian Soreng - www.6502asm.com
 *
 *  Adapted by Nick Morgan
 *  https://github.com/skilldrick/6502js
 *
 *  Released under the GNU General License
 *  see http://gnu.org/licenses/gpl.html
 */

export class Assembler6502 {

    constructor(verbose) {
        this.mOpcodes = [
            /* Name, Imm,  ZP,   ZPX,  ZPY,  ABS, ABSX, ABSY,  IND, INDX, INDY, SNGL, BRA */
            ["ADC", 0x69, 0x65, 0x75, null, 0x6d, 0x7d, 0x79, null, 0x61, 0x71, null, null],
            ["AND", 0x29, 0x25, 0x35, null, 0x2d, 0x3d, 0x39, null, 0x21, 0x31, null, null],
            ["ASL", null, 0x06, 0x16, null, 0x0e, 0x1e, null, null, null, null, 0x0a, null],
            ["BIT", null, 0x24, null, null, 0x2c, null, null, null, null, null, null, null],
            ["BPL", null, null, null, null, null, null, null, null, null, null, null, 0x10],
            ["BMI", null, null, null, null, null, null, null, null, null, null, null, 0x30],
            ["BVC", null, null, null, null, null, null, null, null, null, null, null, 0x50],
            ["BVS", null, null, null, null, null, null, null, null, null, null, null, 0x70],
            ["BCC", null, null, null, null, null, null, null, null, null, null, null, 0x90],
            ["BCS", null, null, null, null, null, null, null, null, null, null, null, 0xb0],
            ["BNE", null, null, null, null, null, null, null, null, null, null, null, 0xd0],
            ["BEQ", null, null, null, null, null, null, null, null, null, null, null, 0xf0],
            ["BRK", null, null, null, null, null, null, null, null, null, null, 0x00, null],
            ["CMP", 0xc9, 0xc5, 0xd5, null, 0xcd, 0xdd, 0xd9, null, 0xc1, 0xd1, null, null],
            ["CPX", 0xe0, 0xe4, null, null, 0xec, null, null, null, null, null, null, null],
            ["CPY", 0xc0, 0xc4, null, null, 0xcc, null, null, null, null, null, null, null],
            ["DEC", null, 0xc6, 0xd6, null, 0xce, 0xde, null, null, null, null, null, null],
            ["EOR", 0x49, 0x45, 0x55, null, 0x4d, 0x5d, 0x59, null, 0x41, 0x51, null, null],
            ["CLC", null, null, null, null, null, null, null, null, null, null, 0x18, null],
            ["SEC", null, null, null, null, null, null, null, null, null, null, 0x38, null],
            ["CLI", null, null, null, null, null, null, null, null, null, null, 0x58, null],
            ["SEI", null, null, null, null, null, null, null, null, null, null, 0x78, null],
            ["CLV", null, null, null, null, null, null, null, null, null, null, 0xb8, null],
            ["CLD", null, null, null, null, null, null, null, null, null, null, 0xd8, null],
            ["SED", null, null, null, null, null, null, null, null, null, null, 0xf8, null],
            ["INC", null, 0xe6, 0xf6, null, 0xee, 0xfe, null, null, null, null, null, null],
            ["JMP", null, null, null, null, 0x4c, null, null, 0x6c, null, null, null, null],
            ["JSR", null, null, null, null, 0x20, null, null, null, null, null, null, null],
            ["LDA", 0xa9, 0xa5, 0xb5, null, 0xad, 0xbd, 0xb9, null, 0xa1, 0xb1, null, null],
            ["LDX", 0xa2, 0xa6, null, 0xb6, 0xae, null, 0xbe, null, null, null, null, null],
            ["LDY", 0xa0, 0xa4, 0xb4, null, 0xac, 0xbc, null, null, null, null, null, null],
            ["LSR", null, 0x46, 0x56, null, 0x4e, 0x5e, null, null, null, null, 0x4a, null],
            ["NOP", null, null, null, null, null, null, null, null, null, null, 0xea, null],
            ["ORA", 0x09, 0x05, 0x15, null, 0x0d, 0x1d, 0x19, null, 0x01, 0x11, null, null],
            ["TAX", null, null, null, null, null, null, null, null, null, null, 0xaa, null],
            ["TXA", null, null, null, null, null, null, null, null, null, null, 0x8a, null],
            ["DEX", null, null, null, null, null, null, null, null, null, null, 0xca, null],
            ["INX", null, null, null, null, null, null, null, null, null, null, 0xe8, null],
            ["TAY", null, null, null, null, null, null, null, null, null, null, 0xa8, null],
            ["TYA", null, null, null, null, null, null, null, null, null, null, 0x98, null],
            ["DEY", null, null, null, null, null, null, null, null, null, null, 0x88, null],
            ["INY", null, null, null, null, null, null, null, null, null, null, 0xc8, null],
            ["ROR", null, 0x66, 0x76, null, 0x6e, 0x7e, null, null, null, null, 0x6a, null],
            ["ROL", null, 0x26, 0x36, null, 0x2e, 0x3e, null, null, null, null, 0x2a, null],
            ["RTI", null, null, null, null, null, null, null, null, null, null, 0x40, null],
            ["RTS", null, null, null, null, null, null, null, null, null, null, 0x60, null],
            ["SBC", 0xe9, 0xe5, 0xf5, null, 0xed, 0xfd, 0xf9, null, 0xe1, 0xf1, null, null],
            ["STA", null, 0x85, 0x95, null, 0x8d, 0x9d, 0x99, null, 0x81, 0x91, null, null],
            ["TXS", null, null, null, null, null, null, null, null, null, null, 0x9a, null],
            ["TSX", null, null, null, null, null, null, null, null, null, null, 0xba, null],
            ["PHA", null, null, null, null, null, null, null, null, null, null, 0x48, null],
            ["PLA", null, null, null, null, null, null, null, null, null, null, 0x68, null],
            ["PHP", null, null, null, null, null, null, null, null, null, null, 0x08, null],
            ["PLP", null, null, null, null, null, null, null, null, null, null, 0x28, null],
            ["STX", null, 0x86, null, 0x96, 0x8e, null, null, null, null, null, null, null],
            ["STY", null, 0x84, 0x94, null, 0x8c, null, null, null, null, null, null, null],
            ["---", null, null, null, null, null, null, null, null, null, null, null, null]
        ];
        this.mSecondPass = false
        this.mCodePC = 0
        this.mLabels = new Labels(this)
        this.mVerbose = verbose
        this.mMemory = new Uint8Array(0x1000)
        this.mLinesOfCode = 0;
        this.mCodeLen = 0;

    }

    // pushByte() - Push byte to memory
    pushByte(value) {
        this.mMemory[this.mCodePC++] = value & 0xff;
        this.mCodeLen++;
    }

    // pushWord() - Push a word using pushByte twice
    pushWord(value) {
        this.pushByte(value & 0xff);
        this.pushByte((value >> 8) & 0xff);
    }

    DCB(param) {
        let values, number, str, ch;
        values = param.split(",");
        /* istanbul ignore next */
        if (values.length === 0) {
            return false;
        }
        for (let v = 0; v < values.length; v++) {
            str = values[v];
            if (str) {
                ch = str.substring(0, 1);
                if (ch === "$") {
                    number = parseInt(str.replace(/^\$/, ""), 16);
                    this.pushByte(number);
                } else if (ch >= "0" && ch <= "9") {
                    number = parseInt(str, 10);
                    this.pushByte(number);
                } else {
                    return false;
                }
            }
        }
        return true;
    }

    // checkBranch() - Commom branch function for all branches (BCC, BCS, BEQ, BNE..)
    checkBranch(param, opcode) {
        if (opcode === null) {
            return false;
        }
        let addr = -1;

        if (param.match(/^\$[0-9a-f]{1,4}$/i)) {        // literal hexa
            addr = parseInt(param.replace(/^\$/, ""), 16);
            /* istanbul ignore next */
            if (addr < 0 || addr > 0xffff) {
                return false;
            }
        } else if (param.match(/^[0-9]{1,5}$/i)) {      // literal decimal
            addr = parseInt(param, 10);
            if (addr < 0 || addr > 0xffff) {
                return false;
            }
        } else if (param.match(/\w+/)) {  // label
            addr = this.mLabels.getPC(param);
        }
        if (addr === -1) {
            this.pushWord(0x00);
            return false;
        }
        this.pushByte(opcode);
        if (addr < this.mCodePC) {  // Backwards?
            this.pushByte((0xff - (this.mCodePC - addr)) & 0xff);
            return true;
        }
        this.pushByte((addr - this.mCodePC - 1) & 0xff);
        return true;
    }

    // checkImmediate() - Check if param is immediate and push value
    checkImmediate(param, opcode) {
        let addr, value
        let label, hilo
        if (opcode === null) {
            return false;
        }
        if (param.match(/^#\$[0-9a-f]{1,2}$/i)) {
            this.pushByte(opcode);
            value = parseInt(param.replace(/^#\$/, ""), 16);
            /* istanbul ignore next */
            if (value < 0 || value > 255) { return false; }
            this.pushByte(value);
            return true;
        }
        if (param.match(/^#\%[0-1]{1,8}$/i)) {
            this.pushByte(opcode);
            value = parseInt(param.replace(/^#\%/, ""), 2);
            /* istanbul ignore next */
            if (value < 0 || value > 255) { return false; }
            this.pushByte(value);
            return true;
        }
        if (param.match(/^#[0-9]{1,3}$/i)) {
            this.pushByte(opcode);
            value = parseInt(param.replace(/^#/, ""), 10);
            /* istanbul ignore next */
            if (value < 0 || value > 255) { return false; }
            this.pushByte(value);
            return true;
        }
        // Label lo/hi
        if (param.match(/^#[<>]\w+$/)) {
            label = param.replace(/^#[<>](\w+)$/, "$1");
            hilo = param.replace(/^#([<>]).*$/, "$1");
            this.pushByte(opcode);
            if (this.mLabels.find(label)) {
                addr = this.mLabels.getPC(label);
                switch (hilo) {
                    case ">":
                        this.pushByte((addr >> 8) & 0xff);
                        return true;
                    case "<":
                        this.pushByte(addr & 0xff);
                        return true;
                    /* istanbul ignore next */
                    default:
                        return false;
                }
            } else {
                this.pushByte(0x00);
                return true;
            }
        }
        return false;
    }

    // checkIndirect() - Check if param is indirect and push value
    checkIndirect(param, opcode) {
        if (opcode === null) {
            return false;
        }
        if (param.match(/^\(\$[0-9a-f]{4}\)$/i)) {
            this.pushByte(opcode);
            let value = parseInt(param.replace(/^\(\$([0-9a-f]{4}).*$/i, "$1"), 16);
            /* istanbul ignore next */
            if (value < 0 || value > 0xffff) {
                return false;
            }
            this.pushWord(value);
            return true;
        }
        return false;
    }

    // checkIndirectX() - Check if param is indirect X and push value
    checkIndirectX(param, opcode) {
        if (opcode === null) {
            return false;
        }
        if (param.match(/^\(\$[0-9a-f]{1,2},X\)$/i)) {
            this.pushByte(opcode);
            let value = parseInt(param.replace(/^\(\$([0-9a-f]{1,2}).*$/i, "$1"), 16);
            /* istanbul ignore next */
            if (value < 0 || value > 255) {
                return false;
            }
            this.pushByte(value);
            return true;
        }
        return false;
    }

    // checkIndirectY() - Check if param is indirect Y and push value
    checkIndirectY(param, opcode) {
        if (opcode === null) {
            return false;
        }
        if (param.match(/^\(\$[0-9a-f]{1,2}\),Y$/i)) {
            this.pushByte(opcode);
            let value = parseInt(param.replace(/^\([\$]([0-9a-f]{1,2}).*$/i, "$1"), 16);
            /* istanbul ignore next */
            if (value < 0 || value > 255) {
                return false;
            }
            this.pushByte(value);
            return true;
        }
        return false;
    }

    // checkSingle() - Single-byte opcodes
    checkSingle(param, opcode) {
        if (opcode === null) {
            return false;
        }
        // Accumulator instructions are counted as single-byte opcodes
        if (param !== "" && param !== "A") {
            return false;
        }
        this.pushByte(opcode);
        return true;
    }

    // checkZeroPage() - Check if param is ZP and push value
    checkZeroPage(param, opcode) {
        if (opcode === null) {
            return false;
        }
        let value;
        if (param.match(/^\$[0-9a-f]{1,2}$/i)) {
            this.pushByte(opcode);
            value = parseInt(param.replace(/^\$/, ""), 16);
            /* istanbul ignore next */
            if (value < 0 || value > 255) {
                return false;
            }
            this.pushByte(value);
            return true;
        }
        if (param.match(/^[0-9]{1,3}$/i)) {
            value = parseInt(param, 10);
            /* istanbul ignore next */
            if (value < 0 || value > 255) {
                return false;
            }
            this.pushByte(opcode);
            this.pushByte(value);
            return true;
        }
        return false;
    }

    // checkAbsoluteX() - Check if param is ABSX and push value
    checkAbsoluteX(param, opcode) {
        if (opcode === null) {
            return false;
        }
        if (param.match(/^\$[0-9a-f]{3,4},X$/i)) {
            this.pushByte(opcode);
            let number = param.replace(/^\$([0-9a-f]*),X/i, "$1");
            let value = parseInt(number, 16);
            /* istanbul ignore next */
            if (value < 0 || value > 0xffff) {
                return false;
            }
            this.pushWord(value);
            return true;
        }

        if (param.match(/^\w+,X$/i)) {
            param = param.replace(/,X$/i, "");
            this.pushByte(opcode);
            if (this.mLabels.find(param)) {
                let addr = this.mLabels.getPC(param);
                /* istanbul ignore next */
                if (addr < 0 || addr > 0xffff) {
                    return false;
                }
                this.pushWord(addr);
                return true;
            } else {
                if (this.mSecondPass) {
                    return false;
                }
                this.pushWord(0);  // Label not found
                return true;
            }
        }

        return false;
    }

    // checkAbsoluteY() - Check if param is ABSY and push value
    checkAbsoluteY(param, opcode) {
        if (opcode === null) {
            return false;
        }
        if (param.match(/^\$[0-9a-f]{3,4},Y$/i)) {
            this.pushByte(opcode);
            let number = param.replace(/^\$([0-9a-f]*),Y/i, "$1");
            let value = parseInt(number, 16);
            /* istanbul ignore next */
            if (value < 0 || value > 0xffff) {
                return false;
            }
            this.pushWord(value);
            return true;
        }

        // it could be a label too..

        if (param.match(/^\w+,Y$/i)) {
            param = param.replace(/,Y$/i, "");
            this.pushByte(opcode);
            if (this.mLabels.find(param)) {
                let addr = this.mLabels.getPC(param);
                /* istanbul ignore next */
                if (addr < 0 || addr > 0xffff) {
                    return false;
                }
                this.pushWord(addr);
                return true;
            } else {
                if (this.mSecondPass) {
                    return false;
                }
                this.pushWord(0);  // Label not found
                return true;
            }
        }
        return false;
    }

    // checkZeroPageX() - Check if param is ZPX and push value
    checkZeroPageX(param, opcode) {
        if (opcode === null) {
            return false;
        }
        if (param.match(/^\$[0-9a-f]{1,2},X/i)) {
            this.pushByte(opcode);
            let number = param.replace(/^\$([0-9a-f]{1,2}),X/i, "$1");
            let value = parseInt(number, 16);
            /* istanbul ignore next */
            if (value < 0 || value > 255) {
                return false;
            }
            this.pushByte(value);
            return true;
        }
        if (param.match(/^[0-9]{1,3},X/i)) {
            this.pushByte(opcode);
            let number = param.replace(/^([0-9]{1,3}),X/i, "$1");
            let value = parseInt(number, 10);
            if (value < 0 || value > 255) {
                return false;
            }
            this.pushByte(value);
            return true;
        }
        return false;
    }

    checkZeroPageY(param, opcode) {
        if (opcode === null) {
            return false;
        }
        if (param.match(/^\$[0-9a-f]{1,2},Y/i)) {
            this.pushByte(opcode);
            let number = param.replace(/^\$([0-9a-f]{1,2}),Y/i, "$1");
            let value = parseInt(number, 16);
            /* istanbul ignore next */
            if (value < 0 || value > 255) {
                return false;
            }
            this.pushByte(value);
            return true;
        }
        if (param.match(/^[0-9]{1,3},Y/i)) {
            this.pushByte(opcode);
            let number = param.replace(/^([0-9]{1,3}),Y/i, "$1");
            let value = parseInt(number, 10);
            if (value < 0 || value > 255) {
                return false;
            }
            this.pushByte(value);
            return true;
        }
        return false;
    }

    // checkAbsolute() - Check if param is ABS and push value
    checkAbsolute(param, opcode) {
        if (opcode === null) {
            return false;
        }
        this.pushByte(opcode);
        if (param.match(/^\$[0-9a-f]{3,4}$/i)) {
            let value = parseInt(param.replace(/^\$/, ""), 16);
            /* istanbul ignore next */
            if (value < 0 || value > 0xffff) {
                return false;
            }
            this.pushWord(value);
            return true;
        }
        if (param.match(/^[0-9]{1,5}$/i)) {  // Thanks, Matt!
            let value = parseInt(param, 10);
            if (value < 0 || value > 0xffff) {
                return false;
            }
            this.pushWord(value);
            return (true);
        }
        // it could be a label too..
        if (param.match(/^\w+$/)) {
            if (this.mLabels.find(param)) {
                let addr = (this.mLabels.getPC(param));
                /* istanbul ignore next */
                if (addr < 0 || addr > 0xffff) {
                    return false;
                }
                this.pushWord(addr);
                return true;
            } else {
                if (this.mSecondPass) {
                    return false;
                }
                this.pushWord(0);  // Label not found
                return true;
            }
        }
        return false;
    }

    getCurrentPC() {
        return this.mCodePC;
    }

    // assembleCode()
    // "assembles" the code into memory
    assembleCode(code) {
        let codeAssembledOK = true;

        this.mLabels.reset();
        this.mCodePC = 0x300;   // default ORG
        const lines = code.split('\n');
        /* istanbul ignore next */
        if (this.mVerbose) {
            myLog("Indexing labels..");
        }
        this.mSecondPass = false;
        if (!this.mLabels.indexLines(lines)) {
            return false;
        }
        /* istanbul ignore next */
        if (this.mVerbose) {
            this.mLabels.displayMessage();
        }
        this.mCodePC = 0x300;   // default ORG
        /* istanbul ignore next */
        if (this.mVerbose) {
            myLog("Assembling code ...");
        }
        this.mCodeLen = 0;
        this.mLinesOfCode = 0;
        this.mSecondPass = true;
        for (var i = 0; i < lines.length; i++) {
            if (!this.assembleLine(lines[i])) {
                codeAssembledOK = false;
                break;
            }
        }

        if (this.mCodeLen === 0) {
            codeAssembledOK = false;
            /* istanbul ignore next */
            if (this.mVerbose) {
                myLog("No code to run.");
            }
            return false;
        }

        if (codeAssembledOK) {
            this.pushByte(0x00); //set a null byte at the end of the code
            /* istanbul ignore next */
            if (this.mVerbose) {
                myLog(`Code assembled successfully, ${this.mCodeLen} bytes.`);
            }
            return true;
        }
        /* istanbul ignore next */
        if (this.mVerbose) {
            myLog(`** Syntax error line ${i + 1}: ${lines[i]} **`);
        }
        return false;
    }


    // assembleLine()
    //
    // assembles one line of code.  Returns true if it assembled successfully,
    // false otherwise.
    assembleLine(input) {
        let label, command
        let param, addr;

        // remove comments
        input = input.replace(/^(.*?);.*/, "$1");

        // trim line
        input = input.replace(/^\s+/, "");
        input = input.replace(/\s+$/, "");

        // Find command or label
        if (input.match(/^\w+:/)) {
            label = input.replace(/(^\w+):.*$/, "$1");
            if (input.match(/^\w+:[\s]*\w+.*$/)) {
                input = input.replace(/^\w+:[\s]*(.*)$/, "$1");
                command = input.replace(/^(\w+).*$/, "$1");
            } else {
                command = "";
            }
        } else {
            command = input.replace(/^(\w+).*$/, "$1");
        }

        // Blank line?  Return.
        if (command === "") {
            return true;
        }

        command = command.toUpperCase();

        // equ spotted
        if (input.match(/^\*\s*=\s*\$?[0-9a-f]*$/)) {
            param = input.replace(/^\s*\*\s*=\s*/, "");
            if (param[0] === "$") {
                param = param.replace(/^\$/, "");
                addr = parseInt(param, 16);
            } else {
                addr = parseInt(param, 10);
            }
            if ((addr < 0) || (addr > 0xffff)) {
                /* istanbul ignore next */
                if (this.mVerbose) {
                    myLog("Unable to relocate code outside 64k memory");
                }
                return false;
            }
            this.mCodePC = addr;
            return true;
        }

        // check param
        if (input.match(/^\w+\s+.*?$/)) {
            param = input.replace(/^\w+\s+(.*?)/, "$1");
        } else {
            /* istanbul ignore else */ 
            if (input.match(/^\w+$/)) {
                param = "";
            } else {
                return false;
            }
        }

        param = param.replace(/[ ]/g, "");

        if (command === "DCB") {
            return this.DCB(param);
        }

        ++this.mLinesOfCode
    
        for (let o = 0; o < this.mOpcodes.length; o++) {
            if (this.mOpcodes[o][0] === command) {
                if (this.checkImmediate(param, this.mOpcodes[o][1])) { return true; }
                if (this.checkSingle(param, this.mOpcodes[o][11])) { return true; }
                if (this.checkZeroPage(param, this.mOpcodes[o][2])) { return true; }
                if (this.checkZeroPageX(param, this.mOpcodes[o][3])) { return true; }
                if (this.checkZeroPageY(param, this.mOpcodes[o][4])) { return true; }
                if (this.checkAbsoluteX(param, this.mOpcodes[o][6])) { return true; }
                if (this.checkAbsoluteY(param, this.mOpcodes[o][7])) { return true; }
                if (this.checkIndirect(param, this.mOpcodes[o][8])) { return true; }
                if (this.checkIndirectX(param, this.mOpcodes[o][9])) { return true; }
                if (this.checkIndirectY(param, this.mOpcodes[o][10])) { return true; }
                if (this.checkAbsolute(param, this.mOpcodes[o][5])) { return true; }
                if (this.checkBranch(param, this.mOpcodes[o][12])) { return true; }
            }
        }
        return false; // Unknown opcode
    }
}

class Labels {

    // indexLine(line) - extract label if line contains one and calculate position in memory.
    // Return false if label alread exists.
    indexLine(input) {
        // remove comments
        input = input.replace(/^(.*?);.*/, "$1");

        // trim line
        input = input.replace(/^\s+/, "");
        input = input.replace(/\s+$/, "");

        // Figure out how many bytes this instruction takes
        let currentPC = this.assembler.getCurrentPC();
        this.assembler.assembleLine(input)

        // Find command or label
        if (input.match(/^\w+:/)) {
            let label = input.replace(/(^\w+):.*$/, "$1");
            return this.push(label, currentPC);
        }
        return true;
    }

    // push() - Push label to array. Return false if label already exists.
    push(name, addr) {
        if (this.find(name)) {
            return false;
        }
        this.labelIndex.push(name + "|" + addr);
        return true;
    }

    constructor(assembler) {
        this.assembler = assembler;
        this.labelIndex = [];
     }

    indexLines(lines) {
        for (var i = 0; i < lines.length; i++) {
            if (!this.indexLine(lines[i])) {
                /* istanbul ignore next */
                if (this.assembler.mVerbose) {
                    myLog("**Label already defined at line " + (i + 1) + ":** " + lines[i]);
                }
                return false;
            }
        }
        return true;
    }

    // find() - Returns true if label exists.
    find(name) {
        for (var i = 0; i < this.labelIndex.length; i++) {
            let nameAndAddr = this.labelIndex[i].split("|");
            if (name === nameAndAddr[0]) {
                return true;
            }
        }
        return false;
    }

    // getPC() - Get address associated with label
    getPC(name) {
        for (var i = 0; i < this.labelIndex.length; i++) {
            let nameAndAddr = this.labelIndex[i].split("|");
            if (name === nameAndAddr[0]) {
                return parseInt(nameAndAddr[1]);
            }
        }
        return -1;
    }

    /* istanbul ignore next */
    displayMessage() {
        var str = "Found " + this.labelIndex.length + " label";
        if (this.labelIndex.length !== 1) {
            str += "s";
        }
        myLog(str + ".");
    }

    reset() {
        this.labelIndex = [];
    }

}

/* istanbul ignore next */
function myLog(msg) {
    console.log(msg)
}