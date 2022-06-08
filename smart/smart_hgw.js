import { batch_run } from "/lib/batch_run";
import { get_grow_threads } from "/lib/analysis";
import { get_hack_threads } from "/lib/analysis";

import {
    weakenScript,
    growScript,
    hackScript,
    buffer
} from "/lib/constants";

/** @param {NS} ns */
export async function main(ns) {
    var target = ns.args[0];
    var percentage = ns.args[1];
    if (!target) {
        ns.toast("must provide target");
    }
    if (!percentage) {
        ns.toast("must provide percentage");
    }

    var {hackThreads, weakenHackThreads} = get_hack_threads(ns, target, percentage);
    ns.tprint(`hackThreads: ${hackThreads}`)
    ns.tprint(`weaken hackThreads: ${weakenHackThreads}`)

    var {growThreads, weakenGrowThreads} = get_grow_threads(ns, target, percentage);
    ns.tprint(`growThreads: ${growThreads}`)
    ns.tprint(`weaken grow threads: ${weakenGrowThreads}`);

    var weakenTime = ns.getWeakenTime(target);
    var weakenDelay = 0;
    var weakenGrowDelay = (buffer*2);

    var growTime = ns.getGrowTime(target);
    var growDelay = (weakenTime+buffer)-growTime;

    var hackTime = ns.getHackTime(target);
    var hackDelay = (weakenTime-buffer)-hackTime;

    var scripts = [weakenScript, weakenScript, growScript, hackScript];
    var counts = [weakenHackThreads, weakenGrowThreads, growThreads, hackThreads];
    var delays = [weakenDelay, weakenGrowDelay, growDelay, hackDelay];

    ns.tprint(`starting batch_run, need ${Math.ceil(weakenTime/1000)} seconds.`);
    await batch_run(ns, target, scripts, counts, delays);
    ns.toast("launched smart_hgw");
}
