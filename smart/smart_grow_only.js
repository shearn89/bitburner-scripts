import { batch_run } from "/lib/batch_run";
import { get_grow_threads } from "/lib/analysis";

import {
    weakenScript,
    growScript,
    buffer,
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
    const batchTag = flags['batchtag'];

    var {growThreads, weakenGrowThreads} = get_grow_threads(ns, target);

    var growTime = ns.getGrowTime(target);

    var scripts = [growScript];
    var counts = [growThreads];
    var delays = [0];

    var time = Math.ceil(growTime/1000);
    ns.print(`starting batch_run, need ${time} seconds.`);
    await batch_run(ns, target, scripts, counts, delays, batchTag);
    ns.toast(`launched smart_grow on ${target} (${time}s)`);
}
