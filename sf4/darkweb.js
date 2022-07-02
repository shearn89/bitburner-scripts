import { targets } from "/lib/constants";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");

    // SF4 - buy tor router, buy programs in order.
    var torPurchased = false
    while (!torPurchased) {
        torPurchased = ns.singularity.purchaseTor();
        if (!torPurchased) {
            ns.print("couldn't purchase tor router, sleeping...");
            await ns.sleep(1000 * 60 * 1);
        } else {
            ns.print("tor router acquired");
        }
    }
    // purchase servers?

    // SF4 - purchase darkweb programs when we can, in a particular order
    for (let program of darkwebPrograms) {
        if (ns.fileExists(program)){
                ns.print(`${program} already purchased`);
            continue;
        }
        var purchased = false;
        while (!purchased) {
            var purchased = ns.singularity.purchaseProgram(program);
            if (!purchased) {
                ns.print(`couldn't purchase ${program}, sleeping...`);
                await ns.sleep(1000 * 60 * 1);
            } else {
                ns.print(`${program} purchased`);
            }
        }
    }
    ns.print("all done, exiting");
}

// reverse order because pop
const darkwebPrograms = [
    "BruteSSH.exe",
    "Autolink.exe",
    "FTPCrack.exe",
    "relaySMTP.exe",
    "DeepscanV2.exe",
    "HTTPWorm.exe",
    "SQLInject.exe",
    "ServerProfiler.exe",
    "DeepscanV1.exe",
];