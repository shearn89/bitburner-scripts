import { batch_run } from "/lib/batch_run";
import { get_weaken_threads } from "/lib/analysis";
import {
    weakenScript,
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

    var weakenThreads = get_weaken_threads(ns, target);
    var scripts = [weakenScript];
    var counts = [weakenThreads];
    var delays = [0];
    var weakenTime = ns.getWeakenTime(target);

    ns.tprint(`starting batch_run, need ${Math.ceil(weakenTime/1000)} seconds.`);
    await batch_run(ns, target, scripts, counts, delays, batchTag);
    ns.toast("launched smart_weaken");
}
