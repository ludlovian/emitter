# emitter
Simple async emitter

## Why?

This differs from the built-in `events` emitter because:
- it allows the emitter to `await` the events being processed
- no special-case logic for `error`

It's only for me. Don't use it.

## API

### Emitter

Subclass from this, or create a new one

### .on(event, handler)

Adds an async hanlder for the event type. Returns a function to remove.

### .off(event, handler)

Removes the handler for this event type.

### .once(event)

Returns a promise which resolves the first time this event is called

### .emit(event, data)

Emits the event to all handlers, resolving when they have all completed.

## Finally

That's it. It's simple. Don't use it.
