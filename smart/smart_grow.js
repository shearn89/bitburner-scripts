import { batch_run } from "/lib/batch_run";
import { get_grow_threads } from "/lib/analysis";

import {
    weakenScript,
    growScript,
    buffer
} from "/lib/constants";

/** @param {NS} ns */
export async function main(ns) {
    var target = ns.args[0];
    if (!target) {
        ns.toast("must provide target");
    }

    var {growThreads, weakenGrowThreads} = get_grow_threads(ns, target);

    var weakenTime = ns.getWeakenTime(target);
    var growTime = ns.getGrowTime(target);
    var delay = weakenTime-growTime-buffer;

    var scripts = [weakenScript, growScript];
    var counts = [weakenGrowThreads, growThreads];
    var delays = [0, delay];

    ns.tprint("starting batch_run");
    await batch_run(ns, target, scripts, counts, delays);
    ns.toast("launched smart_grow");
}
