import {
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

    await ns.run("/smart/smart_weaken.js", "--target", target, "--batchtag", 0);
    await ns.sleep(250);
    await ns.run("/smart/smart_grow.js", "--target", target, "--batchtag", 1);
}