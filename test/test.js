'use strict'

import test from 'ava'
import Emitter from '../src'

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
  await e.emit('foo', 'bar')
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
  await e.emit('foo', 'bar')
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
  await e.emit('foo', 'bar')
  t.is(count, 1)
})

test('event with no listener', async t => {
  const e = new Emitter()
  await e.emit('foo', 'bar')
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
  await e.emit('foo', 'bar')
  t.is(count, 1)
})

test('off via returned function', async t => {
  const e = new Emitter()
  let count = 0
  const off = e.on('foo', () => count++)
  await e.emit('foo')
  t.is(count, 1)
  off()
  await e.emit('foo')
  t.is(count, 1)
})

test('off via method', async t => {
  const e = new Emitter()
  let count = 0
  const handler = () => count++
  e.on('foo', handler)
  await e.emit('foo')
  t.is(count, 1)
  e.off('foo', handler)
  await e.emit('foo')
  t.is(count, 1)
})

test('off when not on', async t => {
  const e = new Emitter()
  let count = 0
  e.off('foo', () => count++)
  await e.emit('foo')
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
  await e.emit('foo', 'baz')
  const e = new Emitter()
  let count = 0
})
