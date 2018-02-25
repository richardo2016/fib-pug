#!/usr/bin/env fibjs

var test = require('test');
test.setup();

const fs = require('fs')
const path = require('path')

const pug = require('../')

describe('测试 pug.compile', () => {
  it('测试一段 raw text', () => {
    const pugRaw = 'div'
    const html = pug.compile(pugRaw)()
    assert.equal('<div></div>', html);
  })

  it('测试一段带变量的 raw text', () => {
    const pugRaw = 'div\n\t!= testVar'
    const locals = { testVar: '测试变量' }
    const html = pug.compile(pugRaw)(locals)
    assert.equal('<div>测试变量</div>', html);
  })

  it('测试另一段从文件里读取的 raw text', () => {
    const pugRaw = fs.readTextFile(path.join(__dirname, './fib-pug.1.pug'))
    const html = pug.compile(pugRaw)()
    assert.equal('<div>我是一个 pug 文件, 在 fibjs 的驱动下跑 pug 包.</div>', html);
  })
})

describe('测试 pug.render', () => {
  it('测试一段 raw text', () => {
    const pugRaw = 'div'
    const html = pug.render(pugRaw)
    assert.equal('<div></div>', html);
  })

  it('测试另一段从文件里读取的 raw text', () => {
    const pugRaw = fs.readTextFile(path.join(__dirname, './fib-pug.1.pug'))
    const html = pug.render(pugRaw)
    assert.equal('<div>我是一个 pug 文件, 在 fibjs 的驱动下跑 pug 包.</div>', html);
  })
})

describe('测试 pug.renderFile', () => {
  it('basic', () => {
    const html = pug.renderFile(path.join(__dirname, './fib-pug.1.pug'))
    assert.equal('<div>我是一个 pug 文件, 在 fibjs 的驱动下跑 pug 包.</div>', html);
  })
})
// all sub-test must be placed before `test.run()`
require('./filters/index.spec')

test.run()

