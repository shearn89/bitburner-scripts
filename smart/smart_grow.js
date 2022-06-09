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
    var batchTag = ns.args[1];
    if (!target) {
        ns.toast("must provide target");
    }
    if (!batchTag){
        batchTag = 0;
    }

    var {growThreads, weakenGrowThreads} = get_grow_threads(ns, target);

    var weakenTime = ns.getWeakenTime(target);
    var growTime = ns.getGrowTime(target);
    var delay = weakenTime-growTime-buffer;

    var scripts = [weakenScript, growScript];
    var counts = [weakenGrowThreads, growThreads];
    var delays = [0, delay];

    ns.tprint(`starting batch_run, need ${Math.ceil(weakenTime/1000)} seconds.`);
    await batch_run(ns, target, scripts, counts, delays, batchTag);
    ns.toast("launched smart_grow");
}
