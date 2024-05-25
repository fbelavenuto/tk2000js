import { CObserver } from "./utils/Observer.js";

export class CRenderCanvas extends CObserver {

    constructor(canvas) {
        super()
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.imgData = this.ctx.createImageData(564, 384)
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    notify(msg) {
        if (msg.msg == 'newFrame') {
            const frameBuffer = msg.data
            this.imgData.data.fill(255)
            let offset = 0;
            const data = this.imgData.data
            for(let y = 0; y < 192; y++) {
                offset = y * 564 * 4 * 2
                for(let x = 0; x < 282; x++) {
                    const fbOff = 1+x + y*284;
                    const r = frameBuffer[fbOff] >> 16;
                    const g = (frameBuffer[fbOff] >> 8) & 0xFF;
                    const b = frameBuffer[fbOff] & 0xFF
                    data[offset + 0] = data[offset + 4] = r
                    data[offset + 1] = data[offset + 5] = g
                    data[offset + 2] = data[offset + 6] = b
                    data[offset + 2256] = data[offset + 2260] = 0;
                    data[offset + 2257] = data[offset + 2261] = 0;
                    data[offset + 2258] = data[offset + 2262] = 0;
                    offset += 8
                }
            }
            this.ctx.putImageData(this.imgData, 0, 0)
        }
    }
}
