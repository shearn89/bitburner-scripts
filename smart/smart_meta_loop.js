import {
    get_flags,
    batchInterval,
    buffer,
} from "/lib/constants";

import { set_run } from "/lib/set_run";

/** @param {NS} ns */
export async function main(ns) {
    const scriptSize = 1.75;

    const flags = get_flags(ns);
    if (!flags) {
        ns.tprint("failed to get flags");
        return;
    }
    const target = flags['target'];
    const percentage = flags['percentage'];
    const setLimit = flags['setlimit'];

    // check server is prepped
    while (true) {
        var weakenTime = ns.getWeakenTime(target);
        var cash = Math.floor(ns.getServerMoneyAvailable(target));
        var securityLevel = ns.getServerSecurityLevel(target);
        var sleeper = false;
        if (securityLevel > ns.getServerMinSecurityLevel(target)) {
            await ns.run("/smart/smart_weaken.js", 1, "--target", target, "--batchtag", 0);
            sleeper = true;
            await ns.sleep(batchInterval);
        }
        if (cash < ns.getServerMaxMoney(target)) {
            await ns.run("/smart/smart_grow.js", 1, "--target", target, "--batchtag", 1);
            sleeper = true;
        }
        if (sleeper) {
            var prepSleepTime = weakenTime + 1000 * 10;
            ns.print(`had to prep server, sleeping til done (${Math.ceil(prepSleepTime / 1000)}s)`);
            await ns.sleep(prepSleepTime);
            ns.print("done");
        }

        await set_run(ns, target, percentage, 0, setLimit);
        // just launched a set (last batch), so wait a whole weakenTime + 2 buffers + headroom
        var sleepTime = ns.getWeakenTime(target) + buffer*2 + 5000;
        await ns.sleep(sleepTime);
    }
}
