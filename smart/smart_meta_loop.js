import {
    get_flags,
    batchInterval,
    buffer,
} from "/lib/constants";

import { set_run } from "/lib/set_run";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
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
        var cash = Math.floor(ns.getServerMoneyAvailable(target));
        var securityLevel = ns.getServerSecurityLevel(target);
        var sleeper = false;
        var looper = true
        while (looper) {
            var weakenTime = ns.getWeakenTime(target);
            if (securityLevel > ns.getServerMinSecurityLevel(target)) {
                await ns.run(
                    "/smart/smart_weaken.js", 1, "--target", target, "--batchtag", 0, 
                    flags['breached'] ? "--breached" : "", 
                    flags['home'] ? "--home" : "",
                );
                sleeper = true;
                await ns.sleep(batchInterval);
            }
            if (cash < ns.getServerMaxMoney(target)) {
                await ns.run(
                    "/smart/smart_grow.js", 1, "--target", target, "--batchtag", 1, 
                    flags['breached'] ? "--breached" : "",
                    flags['home'] ? "--home" : "",
                );
                sleeper = true;
            }
            if (sleeper) {
                var prepSleepTime = weakenTime + 1000 * 10;
                ns.print(`had to prep server, sleeping til done (${Math.ceil(prepSleepTime / 1000)}s)`);
                await ns.sleep(prepSleepTime);
                sleeper = false;
                ns.print("done");
            } else {
                // done prepping, bail out
                ns.print('server is ready, continuing');
                looper = false
            }
        }

        await set_run(ns, target, percentage, 0, setLimit);
        // just launched a set (last batch), so wait a whole weakenTime + 2 buffers + headroom
        var sleepTime = ns.getWeakenTime(target) + buffer*2 + 5000;
        await ns.sleep(sleepTime);
    }
}
