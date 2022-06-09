const hackIncrease = 0.002;
const growIncrease = 0.004;
const weakenDecrease = 0.05;
const buffer = 200;

const weakenScript = "/v3/weaken.js";
const growScript = "/v3/grow.js";
const hackScript = "/v3/hack.js";

const scripts = [weakenScript, weakenScript, growScript, hackScript];

export {
    hackIncrease,
    growIncrease,
    weakenDecrease,
    weakenScript,
    growScript,
    hackScript,
    buffer,
    scripts
}

/** @param {NS} ns */
export function get_flags(ns) {
    const flags = ns.flags([
        ['target'],
        ['percentage', 0.1],
        ['batchset', 1],
        ['setlimit', Infinity],
        ['batchtag', 0],
    ]);
    if (!flags['target']) {
        ns.alert("must provide target");
        return false;
    }
    return flags;
}