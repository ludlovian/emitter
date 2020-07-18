'use strict'

import test from 'ava'
import promiseGoodies from 'promise-goodies'
import Emitter from '../src'

promiseGoodies()

test('construction', async t => {
  const e = new Emitter()
  t.true(e instanceof Emitter)
})

test('basic emit', async t => {
  const e = new Emitter()
  let count = 0
  e.on('foo', data => {
    count++
    t.is(data, 'bar')
  })
  e.emit('foo', 'bar')
  t.is(count, 1)
})

test('multiple listeners', async t => {
  const e = new Emitter()
  let count = 0
  e.on('foo', data => {
    count++
    t.is(data, 'bar')
  })
  e.on('foo', data => count++)
  e.emit('foo', 'bar')
  t.is(count, 2)
})

test('same listener mutiply defined', async t => {
  const e = new Emitter()
  let count = 0
  async function handler (data) {
    count++
    t.is(data, 'bar')
  }
  e.on('foo', handler)
  e.on('foo', handler)
  e.emit('foo', 'bar')
  t.is(count, 1)
})

test('event with no listener', async t => {
  const e = new Emitter()
  e.emit('foo', 'bar')
  t.pass()
})

test('multiple events', async t => {
  const e = new Emitter()
  let count = 0
  e.on('foo', data => {
    count++
    t.is(data, 'bar')
  })
  e.on('quux', data => {
    count += 100
  })
  e.emit('foo', 'bar')
  t.is(count, 1)
})

test('off via returned function', async t => {
  const e = new Emitter()
  let count = 0
  const off = e.on('foo', () => count++)
  e.emit('foo')
  t.is(count, 1)
  off()
  e.emit('foo')
  t.is(count, 1)
})

test('off via method', async t => {
  const e = new Emitter()
  let count = 0
  const handler = () => count++
  e.on('foo', handler)
  e.emit('foo')
  t.is(count, 1)
  e.off('foo', handler)
  e.emit('foo')
  t.is(count, 1)
})

test('off when not on', async t => {
  const e = new Emitter()
  let count = 0
  e.off('foo', () => count++)
  e.emit('foo')
  t.is(count, 0)
})

test('once', async t => {
  const e = new Emitter()
  let count = 0
  const p = e.once('foo').then(data => {
    t.is(data, 'bar')
    count++
  })

  e.emit('foo', 'bar')
  await p
  t.is(count, 1)
  await e.emitAsync('foo', 'baz')
})

test('async emit', async t => {
  const e = new Emitter()
  const d = Promise.deferred()
  e.on('foo', data => d.then(() => t.is(data, 'bar')))
  const p = e.emitAsync('foo', 'bar')
  t.false(await p.isResolved())

  d.resolve()
  t.true(await p.isResolved())

  await e.emitAsync('bar', 'baz')
})
