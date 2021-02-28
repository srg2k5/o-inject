import { expect } from 'chai'

import oInject from './index'

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

const subject = {
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
}

;(async () => {
  const injected = await oInject(injectables, subject)

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
  
  console.log("All Test Complete.")
  
})()
