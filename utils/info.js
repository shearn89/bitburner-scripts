
/** @param {NS} ns */
export async function main(ns) {
    var obj = test();
    var a = obj['foo'];
    var b = obj['bar'];
    ns.tprint(`a: ${a}, b: ${b}`);
}

export function test() {
    var foo = "foo";
    var bar = "bar";
    return { foo, bar };
}