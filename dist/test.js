"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = __importDefault(require("./index"));
function resolvedOneSecond() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("One second resolved promise");
        }, 1000);
    });
}
// The answer to Everything
const someNumber = 43;
function basicFunction(int) {
    // The answer to everything, plus whatever you passed.
    return int + someNumber;
}
const injectables = {
    resolvedOneSecond,
    someNumber,
    basicFunction
};
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
};
(async () => {
    const injected = await index_1.default(injectables, subject);
    chai_1.expect(injected).to.eql({
        untouched: 500,
        myScore: 43,
        otherScore: 77,
        gameMessages: [
            "One second resolved promise",
            "One second resolved promise",
            "One second resolved promise"
        ]
    });
    console.log("All Test Complete.");
})();
//# sourceMappingURL=test.js.map