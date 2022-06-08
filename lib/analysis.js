import {
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
    ns.print(`returning: ${hackThreads}`);
    return hackThreads;
}