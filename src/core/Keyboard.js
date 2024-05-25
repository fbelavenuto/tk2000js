import { CObserver } from '../utils/Observer.js';

/*
 *   TK2000 Keyboard Matrix
 *   ======================
 *
 *                         KBIN
 *             0    1    2    3    4    5
 *           -----------------------------
 *         0| SHFT  B    V    C    X    Z
 *     K   1|  ?    G    F    D    S    A
 *     B   2| " "   T    R    E    W    Q
 *     O   3| LFT   5%   4$   3#   2"   1!
 *     U   4| RGT   6&   7'   8(   9)   0*
 *     T   5| DWN   Y    U    I-   O=   P+
 *         6| UP    H    J    K^   L@   :;
 *         7| RTN   N    M    ,<   .>   ?/
 */
//

export class CKeyboard extends CObserver {

    /*************************************************************************************************/
    constructor(mBus) {
        super();
        this.mBus = mBus;
        mBus.addDevice('keyboard', this);
        mBus.registerIntervalAddr('keyboard', 0xC000, 0xC01F);
        mBus.registerIntervalAddr('keyboard', 0xC05E, 0xC05F);
        this.mMatrix = [0, 0, 0, 0, 0, 0, 0, 0];
        this.mCtrl = false;
        this.mKbOut = 0;
        this.mKbOutCtrl = false;
    }

    /*************************************************************************************************/
    read(addr) {
        let result = ((this.mKbOutCtrl && this.mCtrl) ? 1 : 0);
        for (let l = 0; l < 8; l++) {
            if (this.mKbOut & (1 << l)) {
                result |= this.mMatrix[l];
            }
        }
        return result;
    }

    /*************************************************************************************************/
    write(addr, data) {
        if (addr == 0xC05E) {
            this.mKbOutCtrl = false;
            return;
        } else if (addr == 0xC05F) {
            this.mKbOutCtrl = true;
            return;
        }
        if ((addr & 0xF0) == 0x00) {    // 0xC000-0xC00F? TODO
            this.mKbOut = data;
        }
    }

    /*************************************************************************************************/
    reset() {
        for (let i = 0; i < 8; i++) {
            this.mMatrix[i] = 0;
        }
        this.mCtrl = false;
        this.mKbOutCtrl = false;
        this.mKbOut = 0;
    }

    /*************************************************************************************************/
    update() {

    }

    /*************************************************************************************************/
    notify(msg) {
        if (msg.msg == 'key') {
            const key = msg.key.toLowerCase();
            const keyCode = msg.keyCode
            const down = msg.down;
            const shiftKey = msg.shiftKey
            let shift = false
            let row = undefined, col = undefined
            //console.log(`key: ${key}, down: ${down}`);

            switch (key) {

                // special case // TODO: fix
                case 'dead':
                    if (keyCode == 222) {
                        if (shiftKey) {
                            row = 3
                            col = 4
                            shift = true
                        } else {
                            row = 4
                            col = 2
                            shift = true
                        }
                    }
                    break;

                case 'control':
                    this.mCtrl = down;
                    break;

                case 'shift':
                    row = 0
                    col = 0
                    shift = false
                    break;

                case 'a':
                    row = 1
                    col = 5
                    shift = false
                    break;

                case 'b':
                    row = 0
                    col = 1
                    shift = false
                    break;

                case 'c':
                    row = 0
                    col = 3
                    shift = false
                    break;

                case 'd':
                    row = 1
                    col = 3
                    shift = false
                    break;

                case 'e':
                    row = 2
                    col = 3
                    shift = false
                    break;

                case 'f':
                    row = 1
                    col = 2
                    shift = false
                    break;

                case 'g':
                    row = 1
                    col = 1
                    shift = false
                    break;

                case 'h':
                    row = 6
                    col = 1
                    shift = false
                    break;

                case 'i':
                    row = 5
                    col = 3
                    shift = false
                    break;

                case 'j':
                    row = 6
                    col = 2
                    shift = false
                    break;

                case 'k':
                    row = 6
                    col = 3
                    shift = false
                    break;

                case 'l':
                    row = 6
                    col = 4
                    shift = false
                    break;

                case 'm':
                    row = 7
                    col = 2
                    shift = false
                    break;

                case 'n':
                    row = 7
                    col = 1
                    shift = false
                    break;

                case 'o':
                    row = 5
                    col = 4
                    shift = false
                    break;

                case 'p':
                    row = 5
                    col = 5
                    shift = false
                    break;

                case 'q':
                    row = 2
                    col = 5
                    shift = false
                    break;

                case 'r':
                    row = 2
                    col = 2
                    shift = false
                    break;

                case 's':
                    row = 1
                    col = 4
                    shift = false
                    break;

                case 't':
                    row = 2
                    col = 1
                    shift = false
                    break;

                case 'u':
                    row = 5
                    col = 2
                    shift = false
                    break;

                case 'v':
                    row = 0
                    col = 2
                    shift = false
                    break;

                case 'w':
                    row = 2
                    col = 4
                    shift = false
                    break;

                case 'x':
                    row = 0
                    col = 4
                    shift = false
                    break;

                case 'y':
                    row = 5
                    col = 1
                    shift = false
                    break;

                case 'z':
                    row = 0
                    col = 5
                    shift = false
                    break;

                case '1':
                    row = 3
                    col = 5
                    shift = false
                    break;

                case '2':
                    row = 3
                    col = 4
                    shift = false
                    break;

                case '3':
                    row = 3
                    col = 3
                    shift = false
                    break;

                case '4':
                    row = 3
                    col = 2
                    shift = false
                    break;

                case '5':
                    row = 3
                    col = 1
                    shift = false
                    break;

                case '6':
                    row = 4
                    col = 1
                    shift = false
                    break;

                case '7':
                    row = 4
                    col = 2
                    shift = false
                    break;

                case '8':
                    row = 4
                    col = 3
                    shift = false
                    break;

                case '9':
                    row = 4
                    col = 4
                    shift = false
                    break;

                case '0':
                    row = 4
                    col = 5
                    shift = false
                    break;

                case ',':
                    row = 7
                    col = 3
                    shift = false
                    break;

                case ',':
                    row = 7
                    col = 3
                    shift = false
                    break;

                case '<':
                    row = 7
                    col = 3
                    shift = true
                    break;

                case '.':
                    row = 7
                    col = 4
                    shift = false
                    break;

                case '>':
                    row = 7
                    col = 4
                    shift = true
                    break;

                case ',':
                    row = 6
                    col = 5
                    shift = false
                    break;

                case '?':
                    row = 7
                    col = 5
                    shift = false
                    break;

                case '!':
                    row = 3
                    col = 5
                    shift = true
                    break;

                case ';':
                    row = 6
                    col = 5
                    shift = true
                    break;

                case ':':
                    row = 6
                    col = 5
                    shift = false
                    break;

                    case "'":
                    row = 4
                    col = 2
                    shift = true
                    break;

                case '"':
                    row = 3
                    col = 4
                    shift = true
                    break;

                case '#':
                    row = 3
                    col = 3
                    shift = true
                    break;

                case '$':
                    row = 3
                    col = 2
                    shift = true
                    break;

                case '%':
                    row = 3
                    col = 1
                    shift = true
                    break;

                case '&':
                    row = 4
                    col = 1
                    shift = true
                    break;

                case '(':
                    row = 4
                    col = 3
                    shift = true
                    break;

                case ')':
                    row = 4
                    col = 4
                    shift = true
                    break;

                case '/':
                    row = 7
                    col = 5
                    shift = true
                    break;

                case '=':
                    row = 5
                    col = 4
                    shift = true
                    break;

                case '-':
                    row = 5
                    col = 3
                    shift = true
                    break;

                case '+':
                    row = 5
                    col = 5
                    shift = true
                    break;

                case '*':
                    row = 4
                    col = 5
                    shift = true
                    break;

                case '^':
                    row = 6
                    col = 3
                    shift = true
                    break;

                case '@':
                    row = 6
                    col = 4
                    shift = true
                    break;

                case 'arrowup':
                    row = 6
                    col = 0
                    shift = false
                    break;

                case 'arrowdown':
                    row = 5
                    col = 0
                    shift = false
                    break;

                case 'arrowleft':
                case 'backspace':
                    row = 3
                    col = 0
                    shift = false
                    break;

                case 'arrowright':
                    row = 4
                    col = 0
                    shift = false
                    break;

                case 'enter':
                    row = 7
                    col = 0
                    shift = false
                    break;

                case ' ':
                    row = 2
                    col = 0
                    shift = false
                    break;
            }
            //console.log(`row: ${row}, col: ${col}, shift: ${shift}`);
            if(row != undefined && col != undefined) {
                if (down) {
                    this.mMatrix[row] |= 1 << col;
                } else {
                    this.mMatrix[row] &= ~(1 << col);
                }
            }
            if (shift != undefined) {
                if (shift) {
                    this.mMatrix[0] |= 1 << 0;
                } else {
                    this.mMatrix[0] &= ~(1 << 0);
                }
            }
        }
    }
}
