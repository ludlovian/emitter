'use strict'

import test from 'ava'
import Emitter from '../src'

const isResolved = (p, ms = 20) =>
  new Promise(resolve => {
    p.then(() => resolve(true))
    setTimeout(() => resolve(false), ms)
  })

const defer = () => {
  const d = {}
  d.promise = new Promise((resolve, reject) => {
    Object.assign(d, { resolve, reject })
  })
  return d
}

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
  const d = defer()
  e.on('foo', data => d.promise.then(() => t.is(data, 'bar')))
  const p = e.emitAsync('foo', 'bar')
  t.false(await isResolved(p))

  d.resolve()
  t.true(await isResolved(p))

  await e.emitAsync('bar', 'baz')
})
