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

    // TODO run grow/weaken to up this
    // var cash = Math.floor(ns.getServerMoneyAvailable(target));
    // var securityLevel = ns.getServerSecurityLevel(target);

    const {hackThreads, weakenHackThreads} = get_hack_threads(ns, target, percentage);
    const {growThreads, weakenGrowThreads} = get_grow_threads(ns, target, percentage);

    const totalThreads = weakenHackThreads+weakenGrowThreads+growThreads+hackThreads;
    // var runtime = Math.ceil(ns.getWeakenTime(target)/1000)

    const {maxThreads, batchSet} = get_runnable_batches(ns, flags, scriptSize, totalThreads);
    ns.print(`capacity: ${maxThreads}, would run ${batchSet} batches`);

    var setCount = 0;
    while(setLimit > setCount) {
        for (var i=0; i<batchSet; i++) {
            var weakenTime = ns.getWeakenTime(target);
            var counts = [weakenHackThreads, weakenGrowThreads, growThreads, hackThreads];
            var delays = get_delays(ns, target);

            await batch_run(ns, target, scripts, counts, delays, i);
            ns.print(`launched batch ${i}, will take ${Math.ceil(weakenTime/1000)}s`);
            await ns.sleep(250);
        }
        var sleepTime = ns.getWeakenTime(target)-(250*batchSet)+10000;
        ns.printf(`launched batchset ${setCount}, sleeping for ${Math.ceil(sleepTime/1000)}s`);
        setCount += 1;
        if (setCount != setLimit) {
            await ns.sleep(sleepTime);
        }
    }
    ns.tprint(`launched ${batchSet} batches against ${target}`);
}
