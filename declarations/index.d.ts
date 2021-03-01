interface Wrappers {
    left: string;
    right: string;
}
export declare function isInjectableTemplate(target: any): boolean;
export declare function injectObject(injectables: any, subject: any, wrappers?: Wrappers): Promise<{}>;
export declare function withDefaultWrapper(left: string, right: string): (injectables: any, subject: any) => Promise<{}>;
export declare function setDefaultWrapper(left: string, right: string): void;
export default injectObject;
//# sourceMappingURL=index.d.ts.map