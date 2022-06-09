import { batch_run } from "/lib/batch_run";
import { get_weaken_threads } from "/lib/analysis";
import {
    weakenScript
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

    var weakenThreads = get_weaken_threads(ns, target);
    var scripts = [weakenScript];
    var counts = [weakenThreads];
    var delays = [0];
    var weakenTime = ns.getWeakenTime(target);

    ns.tprint(`starting batch_run, need ${Math.ceil(weakenTime/1000)} seconds.`);
    await batch_run(ns, target, scripts, counts, delays, batchTag);
    ns.toast("launched smart_weaken");
}
