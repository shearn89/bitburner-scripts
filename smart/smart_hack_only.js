import { batch_run } from "/lib/batch_run";
import { get_hack_threads } from "/lib/analysis";

import {
    hackScript,
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

    var scripts = [hackScript];
    var counts = [hackThreads];
    var delays = [0];

    ns.tprint("starting batch_run");
    await batch_run(ns, target, scripts, counts, delays);
    ns.toast("launched");
}
