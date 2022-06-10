import { batch_run } from "/lib/batch_run";
import { get_grow_threads } from "/lib/analysis";
import { get_hack_threads } from "/lib/analysis";
import { get_delays } from "/lib/analysis";

import {
    scripts,
    get_flags,
    buffer,
    batchInterval,
} from "/lib/constants";

/** @param {NS} ns */
export async function main(ns) {
    const flags = get_flags(ns);
    if (!flags) {
        ns.tprint("failed to get flags");
        return;
    }
    const target = flags['target'];
    const percentage = flags['percentage'];
    var batchSet = flags['batchset'];
    const setLimit = flags['setlimit'];

    var setCount = 0;
    ns.tprint(`time: ${Math.ceil(ns.getWeakenTime(target) / 1000)}`);
    while (setLimit > setCount) {
        var timeLimit = ns.getWeakenTime(target) + buffer;
        var batchLimit = Math.floor(timeLimit / batchInterval);
        ns.tprint(`could run ${batchLimit} batches, requested ${batchSet}, checking constraint`);
        if (batchSet > batchLimit) {
            ns.print("trying to run more than would complete in 1 loop");
            batchSet = batchLimit;
        }
        ns.tprint(`will run ${batchSet} batches`);

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
        var sleepTime = ns.getWeakenTime(target) - (batchInterval * batchSet) + 10000;
        ns.printf(`launched batchset ${setCount}, sleeping for ${Math.ceil(sleepTime / 1000)}s`);
        setCount += 1;
        if (setCount != setLimit) {
            await ns.sleep(sleepTime);
        }
    }
}
