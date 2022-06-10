import { set_run } from "/lib/set_run";

import {
    get_flags,
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
    var batchSet = flags['batchset'];
    const setLimit = flags['setlimit'];

    ns.tprint(`time: ${Math.ceil(ns.getWeakenTime(target) / 1000)}`);
    await set_run(ns, target, percentage, batchSet, setLimit);
}
