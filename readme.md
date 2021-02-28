Javascript Functional Templates
----

Purpose:   Provide a scoped Javascript Object with functions, and promise resolution for maximum flexibility and try to preserve expected output typing.

----

```javascript
import oInject from 'o-inject'


const testInjectables = {
  string: 123,
  promise: Promise.resolve(123),
  func: () => Promise.resolve(1234),
  func2: (passthrough: string) => passthrough
}

const testSubject = {
  field1: 123,
  field2: `oi{{
    promise
  }}`,
  array1: [
    123,
    `oi{{
      func()
    }}`,
    `oi{{
      func2("something else")
    }}`,
  ]
}

oInject(testInjectables, testSubject)
  .then(console.log, console.error)
```

Output: 

```javascript

{ field1: 123, field2: 123, array1: [ 123, 1234, 'something else' ] }

```