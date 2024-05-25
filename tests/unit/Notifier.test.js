import { CNotifier } from "../../src/utils/Notifier";
import { CObserver } from "../../src/utils/Observer";

const notifier = new CNotifier();
jest.mock('../../src/utils/Observer')
const obs = new CObserver();

describe('Testing CNotifier', () => {
    it('should add one observer', () => {
        notifier.addObserver(obs)
        expect(notifier.observers.length).toBe(1)
    })

    it('should call observer', () => {
        notifier.notifyObservers({})
        expect(obs.notify).toBeCalled()
    })

    it('should not remove invalid observer', () => {
        notifier.removeObserver(null)
        expect(notifier.observers.length).toBe(1)
    })

    it('should remove one observer', () => {
        notifier.removeObserver(obs)
        expect(notifier.observers.length).toBe(0)
    })

})
