import _eval from 'eval'

let leftWrapper = 'oi{{'
let rightWrapper = '}}'

interface Wrappers {
  left: string
  right: string
}

function isObject (obj: any) {
  if (Array.isArray(obj)) return false

  var type = typeof obj

  return type === 'function' || type === 'object' && !!obj
};

export function isInjectableTemplate (target: any) {
  return typeof target === 'string' && target.trimStart().startsWith(leftWrapper) && target.trimEnd().endsWith(rightWrapper)
}

function prepareString (target: string) {
  if (!isInjectableTemplate(target))
    throw new Error('Invalid O-Inject Template String')
  
  const forEval = target.trim().slice(leftWrapper.length, -(rightWrapper.length))

  return `module.exports = ${forEval}`
}

async function inject (injectables: any, target: string) {
  return _eval(prepareString(target), '', injectables, false)
}

async function checkEntry (injectables: any, entry: any, wrappers: Wrappers) {
  if (Array.isArray(entry)) return injectArray(injectables, entry, wrappers)
  if (isObject(entry)) return injectObject(injectables, entry)

  return (isInjectableTemplate(entry) && inject(injectables, entry as string)) || entry
}

async function injectArray (injectables: any, subjects: any[], wrappers: Wrappers) {
  return Promise.all(subjects.map(subject => checkEntry(injectables, subject, wrappers)))
}

export async function injectObject (
  injectables: any,
  subject: any,
  wrappers: Wrappers = { left: leftWrapper, right: rightWrapper }
) {
  const outputObject: any = {}

  for (const [key, entry] of Object.entries(subject)) {
    outputObject[key] = await checkEntry(injectables, entry, wrappers)
  }

  return outputObject
}

export function withDefaultWrapper (left: string, right: string) {
  return (injectables: any, subject: any) => injectObject(injectables, subject, { left, right })
}

export function setDefaultWrapper(left: string, right: string) {
  leftWrapper = left
  rightWrapper = right
}

export default injectObject
