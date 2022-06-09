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

const usage = `
Usage:
    --target        the name of the target
    --percentage    0-1, amount to steal
    --batchset      number of batches
    --setlimit      number of sets of batches
    --batchtag      manual tag to allow grow/weaken against same target
    --home          include home in worker list
`;

/** @param {NS} ns */
export function get_flags(ns) {
    const flags = ns.flags([
        ['help', false],
        ['target'],
        ['percentage', 0.5],
        ['batchset', 1],
        ['setlimit', 1],
        ['batchtag', 0],
        ['home', false],
    ]);
    if (flags['help']){
        ns.alert(usage);
        return false;
    }
    if (!flags['target']) {
        ns.alert("must provide target");
        return false;
    }
    return flags;
}