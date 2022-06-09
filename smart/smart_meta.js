import { batch_run } from "/lib/batch_run";

import { 
    get_grow_threads,
    get_hack_threads,
    get_delays,
    get_runnable_batches,
} from "/lib/analysis";

import {
    scripts,
    get_flags,
    buffer,
    batchInterval,
} from "/lib/constants";

/** @param {NS} ns */
export async function main(ns) {
    const scriptSize = 1.75;

    const flags = get_flags(ns);
    if (!flags) {
        ns.tprint("failed to get flags");
        return;
    }
    const target = flags['target'];
    const percentage = flags['percentage'];
    const setLimit = flags['setlimit'];

    // check server is prepped
    var weakenTime = ns.getWeakenTime(target);
    var cash = Math.floor(ns.getServerMoneyAvailable(target));
    var securityLevel = ns.getServerSecurityLevel(target);
    var sleeper = false;
    if (securityLevel > ns.getServerMinSecurityLevel(target)) {
        await ns.run("/smart/smart_weaken.js", 1, "--target", target, "--batchtag", 0);
        sleeper = true;
        await ns.sleep(250);
    }
    if (cash < ns.getServerMaxMoney(target)) {
        await ns.run("/smart/smart_grow.js", 1, "--target", target, "--batchtag", 1);
        sleeper = true;
    }
    if (sleeper) {
        var prepSleepTime = weakenTime+1000*10;
        ns.print(`had to prep server, sleeping til done (${Math.ceil(prepSleepTime/1000)}s)`);
        await ns.sleep(prepSleepTime);
        ns.print("done");
    }

    const {hackThreads, weakenHackThreads} = get_hack_threads(ns, target, percentage);
    const {growThreads, weakenGrowThreads} = get_grow_threads(ns, target, percentage);

    const totalThreads = weakenHackThreads+weakenGrowThreads+growThreads+hackThreads;

    var setCount = 0;
    while(setLimit > setCount) {
        var {maxThreads, batchSet} = get_runnable_batches(ns, flags, scriptSize, totalThreads);
        ns.print(`capacity: ${maxThreads}, could run ${batchSet} batches`);

        var timeLimit = ns.getWeakenTime(target)+buffer;
        var batchLimit = Math.floor(timeLimit/batchInterval);
        if (batchSet > batchLimit) {
            ns.print("trying to run more than would complete in 1 loop");
            batchSet = batchLimit;
        }

        ns.tprint(`will run ${batchSet} batches`);

        for (var i=0; i<batchSet; i++) {
            weakenTime = ns.getWeakenTime(target);
            var counts = [weakenHackThreads, weakenGrowThreads, growThreads, hackThreads];
            var delays = get_delays(ns, target);

            await batch_run(ns, target, scripts, counts, delays, i);
            ns.print(`launched batch ${i}, will take ${Math.ceil(weakenTime/1000)}s`);
            await ns.sleep(batchInterval);
        }
        var sleepTime = ns.getWeakenTime(target)-(250*batchSet)+10000;
        ns.printf(`launched batchset ${setCount}, sleeping for ${Math.ceil(sleepTime/1000)}s`);
        setCount += 1;
        if (setCount != setLimit) {
            await ns.sleep(sleepTime);
        }
    }
}
