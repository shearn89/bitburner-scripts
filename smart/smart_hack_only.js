import { batch_run } from "/lib/batch_run";
import { get_hack_threads } from "/lib/analysis";

import {
    hackScript,
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

    var {hackThreads, weakenHackThreads} = get_hack_threads(ns, target, percentage);

    var scripts = [hackScript];
    var counts = [hackThreads];
    var delays = [0];

    ns.tprint("starting batch_run");
    var weakenTime = ns.getWeakenTime(target);
    await batch_run(ns, target, scripts, counts, delays);
    ns.toast("launched");
    await ns.sleep(weakenTime);
}
