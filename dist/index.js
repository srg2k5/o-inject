"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eval_1 = __importDefault(require("eval"));
let leftWrapper = 'oi{{';
let rightWrapper = '}}';
function isObject(obj) {
    if (Array.isArray(obj))
        return false;
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}
;
function isInjectableTemplate(target) {
    return typeof target === 'string' && target.trimStart().startsWith(leftWrapper) && target.trimEnd().endsWith(rightWrapper);
}
exports.isInjectableTemplate = isInjectableTemplate;
function prepareString(target) {
    if (!isInjectableTemplate(target))
        throw new Error('Invalid O-Inject Template String');
    const forEval = target.trim().slice(leftWrapper.length, -(rightWrapper.length));
    return `module.exports = ${forEval}`;
}
async function inject(injectables, target) {
    return eval_1.default(prepareString(target), '', injectables, false);
}
async function checkEntry(injectables, entry, wrappers) {
    if (Array.isArray(entry))
        return injectArray(injectables, entry, wrappers);
    if (isObject(entry))
        return injectObject(injectables, entry);
    return (isInjectableTemplate(entry) && inject(injectables, entry)) || entry;
}
async function injectArray(injectables, subjects, wrappers) {
    return Promise.all(subjects.map(subject => checkEntry(injectables, subject, wrappers)));
}
async function injectObject(injectables, subject, wrappers = { left: leftWrapper, right: rightWrapper }) {
    const outputObject = {};
    for (const [key, entry] of Object.entries(subject)) {
        outputObject[key] = await checkEntry(injectables, entry, wrappers);
    }
    return outputObject;
}
exports.injectObject = injectObject;
function withDefaultWrapper(left, right) {
    return (injectables, subject) => injectObject(injectables, subject, { left, right });
}
exports.withDefaultWrapper = withDefaultWrapper;
function setDefaultWrapper(left, right) {
    leftWrapper = left;
    rightWrapper = right;
}
exports.setDefaultWrapper = setDefaultWrapper;
exports.default = injectObject;
//# sourceMappingURL=index.js.map