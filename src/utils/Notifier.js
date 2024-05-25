
export class CNotifier {

  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(i => i !== observer);
  }

  notifyObservers(msg) {
    this.observers.forEach(observer => observer.notify(msg));
  }
}

