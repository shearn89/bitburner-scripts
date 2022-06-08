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
