import { targets } from "/lib/constants";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    for (let target of targets) {
        ns.run("/smart/smart_prep.js", 1, "--target", target);
    }
}