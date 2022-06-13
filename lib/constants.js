const hackIncrease = 0.002;
const growIncrease = 0.004;
const weakenDecrease = 0.05;
// buffer is the gap between h/w/g/w
const buffer = 100;
// batchInterval should be at least 4*buffer, is the interval between batches;
const batchInterval = 500;
const headroom = 0.1;

const weakenScript = "/v3/weaken.js";
const growScript = "/v3/grow.js";
const hackScript = "/v3/hack.js";

const scripts = [weakenScript, weakenScript, growScript, hackScript];

const targets = [
    "foodnstuff", // 0
    "harakiri-sushi", // 0
    "iron-gym", // 1
    "silver-helix", // 2
    "crush-fitness", // 2
    "omega-net", // 2
    "johnson-ortho", // 2
    "the-hub", // 2
    "catalyst", // 3
    "rho-construction", // 3
    "unitalife", // 4
    "applied-energetics", // 4
    "global-pharm", // 4
    "clarkinc", // 5
    "kuai-gong", // 5
    "blade", // 5
    "nwo", // 5
    "ecorp", // 5
    "megacorp", // 5
]

export {
    hackIncrease,
    growIncrease,
    weakenDecrease,
    weakenScript,
    growScript,
    hackScript,
    buffer,
    batchInterval,
    scripts,
    headroom,
    targets
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