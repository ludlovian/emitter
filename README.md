# emitter
Simple sync/async emitter

## Why?

This differs from the built-in `events` emitter because:
- quick and simple - only one data item passed with message
- no special-case logic for `error`
- can have async emits, allowing the emitter to `await` the processing

It's only for me. Don't use it.

## API

### Emitter

Subclass from this, or create a new one

### .on(event, handler)

Adds a handler for the event type. Returns a function to remove.

### .off(event, handler)

Removes the handler for this event type.

### .once(event)

Returns a promise which resolves the first time this event is called

### .emit(event, data)

Emits the event to all handlers, which are run synchronously.

### .emitAsync(event, data)

Emits the event to all handlers, resolving when they have all completed.

## Finally

That's it. It's simple. Don't use it.
