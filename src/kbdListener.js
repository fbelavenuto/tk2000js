import { CNotifier } from "./utils/Notifier.js";

export class CKeyboardListener extends CNotifier {
    constructor() {
        super()
        const self = this
        function keyevent(e) {
            const repeat = e.repeat
            const key = e.key
            const keyCode = e.keyCode
            const shiftKey = e.shiftKey
            const down = e.type == 'keydown' ? true : false
            //console.log(e);
            if (key == 'F12') {
                e.preventDefault()
            }
            if (!repeat) {
                self.notifyObservers({
                    msg: 'key',
                    down: down,
                    key: key,
                    keyCode: keyCode,
                    shiftKey: shiftKey
                })
            }
        }
        document.addEventListener('keydown', keyevent)
        document.addEventListener('keyup', keyevent)
    }

}