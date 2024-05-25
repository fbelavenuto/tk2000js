import { CObserver } from "../../src/utils/Observer";

const obs = new CObserver();

describe('Testing CObserver', () => {
    it('should call notify() throw exception', () => {        
        expect(() => {
            obs.notify(undefined)
        }).toThrowError("You need to overwrite notify")
    });

});
