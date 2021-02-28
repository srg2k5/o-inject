import { expect, use } from 'chai'

import oInject from './index'

use(require('chai-as-promised'))

function resolvedOneSecond() {
  return new Promise ((resolve, reject) => {
    setTimeout(() => {
      resolve("One second resolved promise")
    }, 1000)
  })
}

// The answer to Everything
const someNumber = 43

function basicFunction(int: number) {
  // The answer to everything, plus whatever you passed.

  return int + someNumber
}

const injectables = {
  resolvedOneSecond,
  someNumber,
  basicFunction
}

;(async () => {
  const injected = await oInject(injectables, {
    untouched: 500,
    myScore: `oi{{
      someNumber
    }}`,
    otherScore: `oi{{
      basicFunction(34)
    }}`,
    gameMessages: `oi{{
      Promise.all([
        resolvedOneSecond(),
        resolvedOneSecond(),
        resolvedOneSecond()
      ])
    }}`
  })

  expect(injected).to.eql({
    untouched: 500,
    myScore: 43,
    otherScore: 77,
    gameMessages: [
      "One second resolved promise",
      "One second resolved promise",
      "One second resolved promise"
    ]
  })

  // Don't Allow Requires

  expect(oInject(injectables, {
    shouldError: `oi{{
      require('crypto')
    }}`
  })).to.eventually.rejected

  const sampleString = "I am not encoded."
  const convertString = (s: string) => Buffer.from(s, 'utf-8').toString('base64')

  const bufferResult = await oInject({
    sampleString,
    convertString,
    Buffer,
  }, {
    base64_a: `oi{{
      Buffer.from("I am not encoded.", 'utf-8').toString("base64")
    }}`,
    base64_b: `oi{{
      convertString(sampleString)
    }}`
  })
  
  expect(bufferResult).to.eql({
    base64_a: "SSBhbSBub3QgZW5jb2RlZC4=",
    base64_b: "SSBhbSBub3QgZW5jb2RlZC4=",
  })

  console.log("All Test Complete.")
  
})()
