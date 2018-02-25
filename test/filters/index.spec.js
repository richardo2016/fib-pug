#!/usr/bin/env fibjs

const fs = require('fs')
const path = require('path')

const Ts = require('typescript')
const filterTs = require('jstransformer-typescript')

const stylus = require('stylus')
const jstStylus = require('jstransformer-stylus')

const pug = require('../../')

describe('测试 filter 特性', () => {
  it('[jstransformer:typescript]', () => {
    const options = {
      filters: {
        typescript: filterTs.render
      }
    }
    const testFileName = 'typescript'
    const pugRaw = fs.readTextFile(path.join(__dirname, `./${testFileName}.pug`))
    const html = pug.compile(pugRaw, options)()
    assert.equal(`<div>测试 typescrpit filter</div><script>var testVar = 'typescript';
console.log('typescript');
</script>`, html)
    fs.writeTextFile(path.join(__dirname, `./${testFileName}.html`), html)
  })

  it('[custom:typescript]', () => {
    const options = {
      filters: {
        typescript: function (string, options, locals) {
          const result = Ts.transpile(string, Object.assign({}, { module: Ts.ModuleKind.CommonJS }, options, locals))
          return `\n${result}`
        }
      }
    }

    const testFileName = 'typescript'
    const pugRaw = fs.readTextFile(path.join(__dirname, `./${testFileName}.pug`))
    const html = pug.compile(pugRaw, options)()
    assert.equal(`<div>测试 typescrpit filter</div><script>\nvar testVar = 'typescript';
console.log('typescript');
</script>`, html)
    fs.writeTextFile(path.join(__dirname, `./${testFileName}-custom.html`), html)
  })

  it('[custom:typescript] browser built-in', () => {
    const options = {
      filters: {
        typescript: function (string, options, locals) {
          const result = Ts.transpile(string, Object.assign({}, { module: Ts.ModuleKind.CommonJS }, options, locals))
          return `\n${result}`
        }
      }
    }
    const testFileName = 'typescript.browser'
    const pugRaw = fs.readTextFile(path.join(__dirname, `./${testFileName}.pug`))
    const html = pug.compile(pugRaw, options)()
    assert.equal(`<div>测试 typescrpit filter</div><script>
console.log('typescript', window);
</script>`, html)
    fs.writeTextFile(path.join(__dirname, `./${testFileName}.html`), html)
  })

  it('[jstransformer:stylus]', () => {
    const options = {
      filters: {
        stylus: jstStylus.render
      }
    }
    const testFileName = 'stylus'
    const pugRaw = fs.readTextFile(path.join(__dirname, `./${testFileName}.pug`))
    const html = pug.compile(pugRaw, options)()
    assert.equal(`<div>测试 stylus filter</div><style>button {
  border: 1px solid #f00;
}
</style>`, html)
    fs.writeTextFile(path.join(__dirname, `./${testFileName}.html`), html)
  })
})
