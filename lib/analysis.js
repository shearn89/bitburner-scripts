import {
    growIncrease,
    hackIncrease,
    weakenDecrease,
    buffer
} from "/lib/constants";

/** @param {NS} ns */
export function get_grow_threads(ns, target, percentage = 1) {
    ns.print(`getting grow threads for ${target} at ${percentage*100}%`)
    var max = ns.getServerMaxMoney(target);

    var currentCash = Math.max(ns.getServerMoneyAvailable(target), 1);
    var resultAmount = max/currentCash;
    if (percentage != 1) {
        resultAmount = max/(max*(1-percentage));
    }
    var growThreads = Math.ceil(ns.growthAnalyze(target, resultAmount));

    var growSecurity = growThreads*growIncrease;
    var weakenGrowThreads = Math.ceil(growSecurity/weakenDecrease);
    ns.print(`returning: ${growThreads}, ${weakenGrowThreads}`);
    return { growThreads, weakenGrowThreads };
}

/** @param {NS} ns */
export function get_hack_threads(ns, target, percentage = 0.1) {
    ns.print(`getting hack threads for ${target} at ${percentage*100}%`)
    var percentPerThread = ns.hackAnalyze(target);
    ns.print(`percentPerThread: ${percentPerThread}`);
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


/** @param {NS} ns */
export function get_delays(ns, target) {
    var weakenTime = ns.getWeakenTime(target);
    var weakenDelay = 0;
    var weakenGrowDelay = (buffer*2);

    var growTime = ns.getGrowTime(target);
    var growDelay = (weakenTime+buffer)-growTime;

    var hackTime = ns.getHackTime(target);
    var hackDelay = (weakenTime-buffer)-hackTime;
    var delays = [weakenDelay, weakenGrowDelay, growDelay, hackDelay];
    
    return delays;
}

/** @param {NS} ns */
export function get_runnable_batches(ns, flags, script, value = 1) {
	var workers = ns.getPurchasedServers();
	if (workers.length < 1) {
		workers = ["home"];
    } else {
        if (flags['home']) {
            ns.print("home flag set, including home in workers");
            workers = workers.concat("home");
        }
    }

	var maxThreads = 0;
	for (let worker of workers) {
        var freeRam = ns.getServerMaxRam(worker)-ns.getServerUsedRam(worker);
		var threads = Math.floor(freeRam/script);
		maxThreads += threads;
	}

    // buffer to allow for miscalculation and allow some unused capacity
    var headroom = 0.1;
    var batchSet = Math.floor(maxThreads/(value*(1-headroom)));
    ns.print(`total: ${maxThreads}, batches: ${batchSet}`);
    return { maxThreads, batchSet };
}