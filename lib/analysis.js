import {
    growIncrease,
    growIncrease,
    weakenDecrease
} from "/lib/constants";

/** @param {NS} ns */
export function get_grow_threads(ns, target) {
    ns.print(`getting grow threads for ${target}`)
    var max = ns.getServerMaxMoney(target);
    var currentCash = Math.max(ns.getServerMoneyAvailable(target), 1);
    var resultAmount = max/currentCash;
    var growThreads = Math.ceil(ns.growthAnalyze(target, resultAmount));
    var growSecurity = growThreads*growIncrease;
    var weakenGrowThreads = Math.ceil(growSecurity/weakenDecrease);
    ns.print(`returning: ${growThreads}, ${weakenGrowThreads}`);
    return { growThreads, weakenGrowThreads };
}

/** @param {NS} ns */
export function get_hack_threads(ns, target, percentage) {
    ns.print(`getting hack threads for ${target}`)
    var percentPerThread = ns.hackAnalyze(target);
    var hackThreads = Math.floor(percentage/percentPerThread);
    var hackSecurity = hackThreads*hackIncrease;
    var weakenHackThreads = Math.ceil(hackSecurity/weakenDecrease);
    ns.print(`returning: ${hackThreads}, ${weakenHackThreads}`);
    return { hackThreads, weakenHackThreads };
}

/** @param {NS} ns */
export function get_weaken_threads(ns, target) {
    ns.print(`getting weaken threads for ${target}`)
    var security = ns.getServerSecurityLevel(target);
    var minSecurity = ns.getServerMinSecurityLevel(target);
    var weakenThreads = Math.ceil((security-minSecurity)/weakenDecrease);
    ns.print(`returning: ${weakenThreads}`);
    return weakenThreads;
}