const events = Symbol('events');
const noop = Promise.resolve();
class Emitter {
  constructor () {
    Object.defineProperty(this, events, {
      configurable: true,
      value: new Map()
    });
  }
  on (event, handler) {
    let handlers = this[events].get(event);
    if (!handlers) {
      handlers = new Set();
      this[events].set(event, handlers);
    }
    handlers.add(handler);
    return this.off.bind(this, event, handler)
  }
  off (event, handler) {
    const handlers = this[events].get(event);
    if (handlers) handlers.delete(handler);
  }
  once (event) {
    return new Promise(resolve => {
      const off = this.on(event, data => {
        off();
        resolve(data);
      });
    })
  }
  emit (event, data) {
    const handlers = this[events].get(event);
    if (!handlers) return
    ;[...handlers].map(h => h(data));
  }
  emitAsync (event, data) {
    const handlers = this[events].get(event);
    if (!handlers) return noop
    return Promise.all([...handlers].map(h => h(data)))
  }
}

export default Emitter;
