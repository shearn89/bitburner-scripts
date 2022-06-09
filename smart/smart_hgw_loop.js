import { batch_run } from "/lib/batch_run";
import { get_grow_threads } from "/lib/analysis";
import { get_hack_threads } from "/lib/analysis";
import { get_delays } from "/lib/analysis";

import {
    scripts
} from "/lib/constants";

/** @param {NS} ns */
export async function main(ns) {
    var target = ns.args[0];
    var percentage = ns.args[1];
    var batchSet = ns.args[2];
    var setLimit = ns.args[3];
    if (!target) {
        ns.alert("must provide target");
    }
    if (!percentage) {
        ns.alert("must provide percentage");
    }
    if (!batchSet) {
        ns.alert("must provide batch size");
    }
    if (!setLimit) {
        setLimit = Infinity;
    }

    var setCount = 0;
    while(setLimit > setCount) {
        for (var i=0; i<batchSet; i++) {
            var {hackThreads, weakenHackThreads} = get_hack_threads(ns, target, percentage);
            var {growThreads, weakenGrowThreads} = get_grow_threads(ns, target, percentage);

            var weakenTime = ns.getWeakenTime(target);
            var counts = [weakenHackThreads, weakenGrowThreads, growThreads, hackThreads];
            var delays = get_delays(ns, target);

            await batch_run(ns, target, scripts, counts, delays, i);
            ns.print(`launched batch ${i}, will take ${Math.ceil(weakenTime/1000)}s`);
            await ns.sleep(250);
        }
        var sleepTime = ns.getWeakenTime(target)-(250*batchSet)+10000;
        ns.printf(`launched batchset, sleeping for ${Math.ceil(sleepTime/1000)}s`);
        setCount += 1;
        if (setCount != setLimit) {
            await ns.sleep(sleepTime);
        }
    }
}
