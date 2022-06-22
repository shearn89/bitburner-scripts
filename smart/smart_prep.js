import {
    get_flags
} from "/lib/constants";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    const flags = get_flags(ns);
    if (!flags) {
        ns.tprint("failed to get flags");
        return;
    }
    const target = flags['target'];

    await ns.run("/smart/smart_weaken.js", 1, "--target", target, "--batchtag", 0, flags['breached'] ? "--breached" : "");
    await ns.sleep(250);
    await ns.run("/smart/smart_grow.js", 1, "--target", target, "--batchtag", 1, flags['breached'] ? "--breached" : "");
}