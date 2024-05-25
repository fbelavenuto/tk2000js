import { CNotifier } from "../utils/Notifier.js";

// Adapted from https://github.com/inindev/apple2e/blob/master/display_hires.js
//
//  apple2e hires display emulation
//
//  Copyright 2018, John Clark
//
//  Released under the GNU General Public License
//  https://www.gnu.org/licenses/gpl.html
//

export class CVideo extends CNotifier {

    /*************************************************************************************************/
    constructor(mBus) {
        super()
        this.mBus = mBus;
        this.mVideoMono = false;
        this.mSecondPage = false;
        this.mMemoryLocs = {
            PAGEONE: 0x2000,
            PAGETWO: 0xA000
        };
        this.videoWidth = 280
        this.videoHeight = 192
        this._group1 = [];
        this._group2 = [];
        // color palette
        this._frameBuffer = new Array(284 * 192);
        mBus.addDevice('video', this);
        mBus.registerIntervalAddr("video", 0xC050, 0xC051);
        mBus.registerIntervalAddr("video", 0xC054, 0xC055);

        function get_color_fcn(rgb) {
            return (data, x) => {
                data[x] = rgb;
            };
        }

        const fgreen = get_color_fcn(0x20C000);
        const fblue = get_color_fcn(0x007FFF);
        const fcyan = get_color_fcn(0x20B0B0);
        const fred = get_color_fcn(0xF01000);
        const fblack = get_color_fcn(0x111111); // almost black
        const fwhite = get_color_fcn(0xeeeeee); // almost white
        // blue / green   000     001     010     011     100     101     110     111
        const group1e = [fblack, fblack, fblue, fwhite, fblack, fgreen, fwhite, fwhite];
        const group1o = [fblack, fblack, fgreen, fwhite, fblack, fblue, fwhite, fwhite];
        // red / cyan      000     001    010    011     100    101     110     111
        const group2e = [fblack, fblack, fred, fwhite, fblack, fcyan, fwhite, fwhite];
        const group2o = [fblack, fblack, fcyan, fwhite, fblack, fred, fwhite, fwhite];
        this._group1 = [group1e, group1o];
        this._group2 = [group2e, group2o];
    }

    /*************************************************************************************************/
    read(addr) {
        switch (addr & 0x00FF) {
            case 0x50:
                this.mVideoMono = false;
                break;

            case 0x51:
                this.mVideoMono = true;
                break;

            case 0x54:
                this.mSecondPage = false;
                break;

            case 0x55:
                this.mSecondPage = true;
                break;
        }
        return 0xFF;
    }

    /*************************************************************************************************/
    write(addr, data) {
        this.read(addr);
    }

    /*************************************************************************************************/
    reset() {
        this.mSecondPage = false;
        this.mVideoMono = false;
    }

    /*************************************************************************************************/
    update() {
        if (this.mVideoMono) {
            this.drawMono()
        } else {
            this.drawColor()
        }
        this.notifyObservers({msg: 'newFrame', data: this._frameBuffer})
    }

    /*************************************************************************************************/
    drawMono() {
        let memAddr = (this.mSecondPage ? this.mMemoryLocs.PAGETWO : this.mMemoryLocs.PAGEONE);
        let index = 0;
        for (let y = 0; y < this.videoHeight; y++) {
            let offset = ((y & 7) << 10) + ((y & 0x38) << 4) + (y >> 6) * 40;
            this._frameBuffer[index++] = 0
            this._frameBuffer[index++] = 0
            for (let x = 0; x < this.videoWidth; x += 7) {
                let v = this.mBus.readByte(memAddr + offset++)
                for (let b = 0; b < 7; b++) {
                    if (v & (1 << b)) {
                        this._frameBuffer[index++] = 0xFFFFFF
                    } else {
                        this._frameBuffer[index++] = 0
                    }
                }

            }
            this._frameBuffer[index++] = 0
            this._frameBuffer[index++] = 0
        }
    }

    /*************************************************************************************************/
    drawColor() {
        let addr = (this.mSecondPage ? this.mMemoryLocs.PAGETWO : this.mMemoryLocs.PAGEONE);
        let prev = 0
        let actual = 0
        let next = 0
        for (let i = 0; i < 0x2000; i++) {
            // rows are 120 columns wide consuming 128 bytes (0-119)+8
            // every 40 columns rows wrap for a total of three wraps
            // 8 rows wrapping 3 times creates a total of 24 rows
            // bits 6,5 ($60) of columns 0,40,80 yield the wrap row 0,1,2
            // bits 9,8,7 yield the 0-7 relative row number
            //
            // hires graphics repeats the above pattern eight times:
            // $0000, $0400, $0800, $0c00, $1000, $1400, $1800, $1c00
            // bits 12-10 ($1c00) of the address are the repeat number 0-7
            const col = (addr & 0x7f) % 40; // column: 0-39
            const ac0 = addr - col; // col 0, 40, 80 address in bits 6,5
            const row = ((ac0 << 1) & 0xc0) | ((ac0 >> 4) & 0x38) | ((ac0 >> 10) & 0x07);
            //console.log(`col: ${col}, row: ${row}`)
            if (row < 192) {
                if (col == 0) {
                    prev = 0
                    actual = this.mBus.readByte(addr);
                    next = this.mBus.readByte(addr + 1);
                } else if (col < 39) {
                    prev = actual
                    actual = next
                    next = this.mBus.readByte(addr + 1);
                } else {
                    prev = actual
                    actual = next
                    next = 0
                }

                // https://archive.org/download/Apple-Orchard-v1n2-1980-Fall/Apple-Orchard-v1n2-1980-Fall.pdf
                // |<--------  base byte  -------->|  +1 ---- +2  ...  +37 --- +38 --- +39  |
                // |                               :                   5 5 5 5 5 5 5 5 5 5 5|
                // |                    1 1 1 1 1 1:1 1 1 1 2 2   ...  4 5 5 5 5 5 5 5 5 5 5|
                // |0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5:6 7 8 9 0 1        9 0 1 2 3 4 5 6 7 8 9|
                // | . . . . . . . . . . . . . . . : . . . . . .      . . . . . . . . . . . |
                // |v b g o|v b g o|v b g o|v b g o|v b g o|v b        b g o|v b g o|v b g o|
                // |   0   |   1   |   2   |   3   |   4   |   5  ...  137  |  138  |  139  |
                //
                // group 1                     v         v
                //   0) black1: 00 00 00 00 -> 0000:0000 0000:0000 -> 0+00000000000000
                //   1) green : 2a 55 2a 55 -> 0010:1010 0101:0101 -> 0+01010101010101
                //   2) purple: 55 2a 55 2a -> 0101:0101 0010:1010 -> 0+10101010101010
                //   3) white1: 7f 7f 7f 7f -> 0111:1111 0111:1111 -> 0+11111111111111
                //
                // group 2                     v         v
                //   4) black2: 80 80 80 80 -> 1000 0000 1000 0000 -> 1+00000000000000
                //   5) orange: aa d5 aa d5 -> 1010 1010 1101 0101 -> 1+01010101010101
                //   6) blue  : d5 aa d5 aa -> 1101 0101 1010 1010 -> 1+10101010101010
                //   7) white2: ff ff ff ff -> 1111 1111 1111 1111 -> 1+11111111111111
                const color_group = (actual & 0x80) ? this._group2 : this._group1;
                // one column is seven pixels but pixels 0 & 6 are dependent on the pixel values
                // in the adjacent columns requiring a full 9 pixel draw to prevent artifacting
                // pixels are evaluated in three bit groups, this requires evaluating a total of eleven
                // bits to produce nine pixels of output (one column with one pixel overlap each side)
                //          +v+  -> pix8 (+1)
                //  56012345601
                //         +v+   -> pix7
                //  56012345601
                //        +v+    -> pix6
                //  56012345601
                //       +v+     -> pix5
                //  56012345601
                //      +v+      -> pix4
                //  56012345601
                //     +v+       -> pix3
                //  56012345601
                //    +v+        -> pix2
                //  56012345601
                //   +v+         -> pix1
                //  56012345601
                //  +v+          -> pix0 (-1)
                //  56012345601
                //  ppcccccccnn

                //     <--- read ---
                // nnnnnnncccccccppppppp
                // 654321065432106543210
                //      ^^^^^^^^^^^
                let val = (next << 9) | ((actual << 2) & 0x1fc) | ((prev >> 5) & 0x03);
                // row: 0-191, col: 0-39
                const ox = (col * 7);
                const oy = (row);
                const lo = (ox + oy * 284);
                let oe = col & 0x01;
                for (let x = lo, xmax = lo + 9; x < xmax; x++) {
                    color_group[oe][val & 0x07](this._frameBuffer, x);
                    val >>= 1;
                    oe ^= 1;
                }
            }
            ++addr
        }
    }

}
