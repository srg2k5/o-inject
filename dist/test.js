"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = __importDefault(require("./index"));
chai_1.use(require('chai-as-promised'));
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
(async () => {
    const injected = await index_1.default(injectables, {
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
    });
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
    // Don't Allow Requires
    chai_1.expect(index_1.default(injectables, {
        shouldError: `oi{{
      require('crypto')
    }}`
    })).to.eventually.rejected;
    const sampleString = "I am not encoded.";
    const convertString = (s) => Buffer.from(s, 'utf-8').toString('base64');
    const bufferResult = await index_1.default({
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
    });
    chai_1.expect(bufferResult).to.eql({
        base64_a: "SSBhbSBub3QgZW5jb2RlZC4=",
        base64_b: "SSBhbSBub3QgZW5jb2RlZC4=",
    });
    console.log("All Test Complete.");
})();
//# sourceMappingURL=test.js.map