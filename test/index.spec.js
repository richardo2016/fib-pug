#!/usr/bin/env fibjs

var test = require('test');
test.setup();

const fs = require('fs')
const path = require('path')

const Ts = require('typescript')
const filterTs = require('jstransformer-typescript')

const pug = require('../')

describe('测试 pug.compile', () => {
  it('测试一段 raw text', () => {
    const pugRaw = 'div'
    const html = pug.compile(pugRaw)()
    assert.equal('<div></div>', html);
  })

  it('测试一段带变量的 raw text', () => {
    const pugRaw = 'div\n\t!= testVar'
    const locals = {testVar: '测试变量'}
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

describe('测试 filter 特性', () => {
  it('typescript', () => {
    const options = {
      filters: {
        typescript: filterTs.render
      }
    }
    const testFileName = 'typescript'
    const pugRaw = fs.readTextFile(path.join(__dirname, `./filters/${testFileName}.pug`))
    const html = pug.compile(pugRaw, options)()
    assert.equal(`<div>测试 typescrpit filter</div><script>var testVar = 'typescript';
console.log('typescript');
</script>`, html)
    fs.writeTextFile(path.join(__dirname, `./filters/${testFileName}.html`), html)
  })

  it('[custom:typescript]', () => {
    const options = {
      filters: {
        typescript: function (string, options, locals) {
          const result = Ts.transpile(string, Object.assign({}, {module: Ts.ModuleKind.CommonJS}, options, locals))
          return `\n${result}`
        }
      }
    }

    const testFileName = 'typescript'
    const pugRaw = fs.readTextFile(path.join(__dirname, `./filters/${testFileName}.pug`))
    const html = pug.compile(pugRaw, options)()
    assert.equal(`<div>测试 typescrpit filter</div><script>\nvar testVar = 'typescript';
console.log('typescript');
</script>`, html)
    fs.writeTextFile(path.join(__dirname, `./filters/${testFileName}-custom.html`), html)
  })

  it('[custom:typescript] browser built-in', () => {
    const options = {
      filters: {
        typescript: function (string, options, locals) {
          const result = Ts.transpile(string, Object.assign({}, {module: Ts.ModuleKind.CommonJS}, options, locals))
          return `\n${result}`
        }
      }
    }
    const testFileName = 'typescript.browser'
    const pugRaw = fs.readTextFile(path.join(__dirname, `./filters/${testFileName}.pug`))
    const html = pug.compile(pugRaw, options)()
    assert.equal(`<div>测试 typescrpit filter</div><script>
console.log('typescript', window);
</script>`, html)
    fs.writeTextFile(path.join(__dirname, `./filters/${testFileName}.html`), html)
  })
})

test.run()
