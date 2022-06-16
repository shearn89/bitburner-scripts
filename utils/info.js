import {
    flagSet,
    get_flags,
    batchInterval,
} from "/lib/constants";

/** @param {NS} ns */
export async function main(ns) {
    var flags = get_flags(ns);

    ns.tprint(flags['breached'] ? "hello" : null);
}