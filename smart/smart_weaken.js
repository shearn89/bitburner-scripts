import { batch_run } from "/lib/batch_run";
import { get_weaken_threads } from "/lib/analysis";
import {
    weakenScript
} from "/lib/constants";

/** @param {NS} ns */
export async function main(ns) {
    var target = ns.args[0];
    if (!target) {
        ns.toast("must provide target");
    }

    var weakenThreads = get_weaken_threads
    var scripts = [weakenScript];
    var counts = [weakenThreads];
    var delays = [0];

    ns.tprint("starting batch_run");
    await batch_run(ns, target, scripts, counts, delays);
    ns.toast("launched smart_weaken");
}
