import { CVideo } from '../../src/core/Video';
import { CBus } from '../../src/core/Bus';

let video = null

class CTestBus extends CBus {

    constructor() {
        super();
        this.addDeviceCalled = false;
        this.memory = new Uint8Array(0x10000);
    }

    readByte(addr) {
        return (addr == 0x2000) ? 0xAA : 0x55;
    }

    registerAddr = jest.fn();
    addDevice = jest.fn();
    registerIntervalAddr = jest.fn();
}


const bus = new CTestBus();

describe('Testing CVideo', () => {
    it('should make CVideo instance and call CBus methods', () => {
        video = new CVideo(bus);
        expect(video).not.toBeNull()
        expect(bus.addDevice).toBeCalled()
        expect(bus.registerAddr).toBeCalledTimes(0)
        expect(bus.registerIntervalAddr).toBeCalled()
    })

    it('should turn on and off VideoMono', () => {
        video.read(0xC051)
        expect(video.mVideoMono).toBeTruthy()
        video.write(0xC050, 0)
        expect(video.mVideoMono).toBeFalsy()
    })

    it('should turn on and off Second Page', () => {
        video.read(0xC055)
        expect(video.mSecondPage).toBeTruthy()
        video.write(0xC054, 0xff)
        expect(video.mSecondPage).toBeFalsy()
    })

    it('should call reset() reset flags', () => {
        video.mSecondPage = true;
        video.mVideoMono = true;
        video.reset();
        expect(video.mVideoMono).toBeFalsy()
        expect(video.mSecondPage).toBeFalsy()
    })

    it('should call update() method render screen', () => {
        video.mVideoMono = false;
        video._frameBuffer[0] = 0;
        video.update()
        expect(video._frameBuffer[0]).toBe(0x111111)
        video.mSecondPage = true;
        video.update()
        expect(video._frameBuffer[0]).toBe(0x111111)
        video.mVideoMono = true;
        video._frameBuffer[0] = 0xFF;
        video.mSecondPage = false;
        video.update()
        expect(video._frameBuffer[0]).toBe(0)
        video.mSecondPage = true;
        video.update()
        expect(video._frameBuffer[0]).toBe(0)
    })

})
