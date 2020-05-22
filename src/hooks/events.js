const eventsInstance = { obj: null };

export default class Events {
  constructor() {
    this.events = {};
  }

  static instance(): Events {
    !eventsInstance.obj && (eventsInstance.obj = new this());
    return eventsInstance.obj;
  }

  static on(event: EventsTypeI, callback) {
    return this.instance().subscribe(event, callback);
  }

  static fire(event: EventsTypeI, param?: any) {
    this.instance().dispatch(event, param);
  }

  subscribe(event, fn) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(fn);
    return { remove: () => this.removeSubscription(event, fn) };
  }

  dispatch(event, param?) {
    if (this.events[event]) {
      this.events[event].forEach(fn => fn(param));
    }
  }

  removeSubscription(evt, fn) {
    if (this.events[evt]) {
      this.events[evt] = this.events[evt].filter(f => f !== fn);
    }
  }
}