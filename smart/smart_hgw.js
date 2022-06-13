import { batch_run } from "/lib/batch_run";
import { get_grow_threads } from "/lib/analysis";
import { get_hack_threads } from "/lib/analysis";
import { get_delays } from "/lib/analysis";

import {
    scripts,
    get_flags
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
    const batchTag = flags['batchtag'];

    var {hackThreads, weakenHackThreads} = get_hack_threads(ns, target, percentage);
    var {growThreads, weakenGrowThreads} = get_grow_threads(ns, target, percentage);

    var weakenTime = ns.getWeakenTime(target);
    var counts = [weakenHackThreads, weakenGrowThreads, growThreads, hackThreads];
    var delays = get_delays(ns, target);

    var time = Math.ceil(weakenTime/1000);
    ns.print(`starting batch_run, need ${time} seconds.`);
    await batch_run(ns, target, scripts, counts, delays, batchTag);
    ns.toast(`launched smart_hgw on ${target} (${time}s)`);
}
