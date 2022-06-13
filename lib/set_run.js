import { batch_run } from "/lib/batch_run";

import { 
    get_grow_threads,
    get_hack_threads,
    get_delays,
    get_runnable_batches,
    get_time_limit,
} from "/lib/analysis";

import {
    scripts,
    buffer,
    batchInterval,
} from "/lib/constants";

const scriptSize = 1.75;

export function count_batches(ns, target, percentage) {
    const {hackThreads, weakenHackThreads} = get_hack_threads(ns, target, percentage);
    const {growThreads, weakenGrowThreads} = get_grow_threads(ns, target, percentage);

    const totalThreads = weakenHackThreads+weakenGrowThreads+growThreads+hackThreads;
    return {hackThreads, weakenHackThreads, growThreads, weakenGrowThreads, totalThreads};
}

/** @param {NS} ns */
export async function set_run(ns, target, percentage, batchSet=0, setLimit) {
    var setCount = 0;
    if (batchSet == 0) {
        const {hackThreads, weakenHackThreads, growThreads, weakenGrowThreads, totalThreads} = 
            count_batches(ns, target, percentage);
        var {maxThreads, batchSet} = get_runnable_batches(ns, scriptSize, totalThreads);
        ns.print(`capacity: ${maxThreads}, could run ${batchSet} batches`);
    }

    while (setLimit > setCount) {
        // timeLimit is the 'collision time' from first batch to last.
        // don't want to be starting during other batches finishing.
        var timeLimit = get_time_limit(ns, target);
        // 0.8 - fudge factor to try and avoid collisions;
        // TODO - try -X ms?
        var batchLimit = Math.floor((timeLimit / batchInterval)*0.80);
        ns.print(`could run ${batchLimit} batches, requested ${batchSet}, checking constraint`);
        if (batchSet > batchLimit) {
            ns.print("trying to run more than would complete in 1 loop");
            batchSet = batchLimit;
        }
        ns.print(`will run ${batchSet} batches`);

        for (var i = 0; i < batchSet; i++) {
            var { hackThreads, weakenHackThreads } = get_hack_threads(ns, target, percentage);
            var { growThreads, weakenGrowThreads } = get_grow_threads(ns, target, percentage);

            var weakenTime = ns.getWeakenTime(target);
            var counts = [weakenHackThreads, weakenGrowThreads, growThreads, hackThreads];
            var delays = get_delays(ns, target);

            await batch_run(ns, target, scripts, counts, delays, i);
            ns.print(`launched batch ${i}, will take ${Math.ceil(weakenTime / 1000)}s`);
            await ns.sleep(batchInterval);
        }
        var sleepTime = (ns.getWeakenTime(target)-buffer) - (batchInterval * batchSet) + 10000;
        ns.printf(`launched batchset ${setCount}, sleeping for ${Math.ceil(sleepTime / 1000)}s`);
        setCount += 1;
        if (setCount != setLimit) {
            await ns.sleep(sleepTime);
        }
    }
}