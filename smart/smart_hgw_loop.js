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
    if (!target) {
        ns.alert("must provide target");
    }
    if (!percentage) {
        ns.alert("must provide percentage");
    }
    if (!batchSet) {
        ns.alert("must provide batch size");
    }

    while(true) {
        for (var i=0; i<batchSet; i++) {
            var {hackThreads, weakenHackThreads} = get_hack_threads(ns, target, percentage);
            var {growThreads, weakenGrowThreads} = get_grow_threads(ns, target, percentage);

            var weakenTime = ns.getWeakenTime(target);
            var counts = [weakenHackThreads, weakenGrowThreads, growThreads, hackThreads];
            var delays = get_delays(ns, target);

            await batch_run(ns, target, scripts, counts, delays, i);
            var sleepTime = weakenTime/batchSet;
            ns.print(`launched batch ${i}, will take ${Math.ceil(weakenTime/1000)}s, sleep time: ${sleepTime}`);
            await ns.sleep(sleepTime);
        }
        ns.tprint("launched batchset");
        await ns.sleep(2000);
        break;
    }
}
