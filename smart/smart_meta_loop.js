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
        var looper = true
        while (looper) {
            var weakenTime = ns.getWeakenTime(target);
            var cash = Math.floor(ns.getServerMoneyAvailable(target));
            var securityLevel = ns.getServerSecurityLevel(target);
            var sleeper = false;
            ns.print(`new looper, sleeper is ${sleeper}`);
            if (securityLevel > ns.getServerMinSecurityLevel(target)) {
                ns.print(`seclevel is ${securityLevel}, greater than min`);
                await ns.run(
                    "/smart/smart_weaken.js", 1, "--target", target, "--batchtag", 0, 
                    flags['breached'] ? "--breached" : "", 
                    flags['home'] ? "--home" : "",
                );
                sleeper = true;
                await ns.sleep(batchInterval);
            }
            if (cash < ns.getServerMaxMoney(target)) {
                ns.print(`cash is ${cash}, less than max`);
                await ns.run(
                    "/smart/smart_grow.js", 1, "--target", target, "--batchtag", 1, 
                    flags['breached'] ? "--breached" : "",
                    flags['home'] ? "--home" : "",
                );
                sleeper = true;
            }
            ns.print(`checking sleeper, sleeper is ${sleeper}`);
            if (sleeper) {
                var prepSleepTime = weakenTime + 1000 * 10;
                ns.print(`had to prep server, sleeping til done (${Math.ceil(prepSleepTime / 1000)}s)`);
                await ns.sleep(prepSleepTime);
                ns.print("done");
            } else {
                // done prepping, bail out
                ns.print('server is ready, continuing');
                looper = false
            }
        }
        // ns.print("starting set run");
        await set_run(ns, target, percentage, 0, setLimit);
        // just launched a set (last batch), so wait a whole weakenTime + 2 buffers + headroom
        var sleepTime = ns.getWeakenTime(target)*1.05 + buffer*2;
        ns.print(`sleeping in smart_meta_loop for ${sleepTime}`);
        await ns.sleep(sleepTime);
        var max = ns.getServerMaxMoney(target);
        var cash = ns.getServerMoneyAvailable(target);
        var securityLevel = Math.ceil(ns.getServerSecurityLevel(target));
        var minSecurityLevel = ns.getServerMinSecurityLevel(target);
        ns.printf(`${target} --- cash: ${Math.floor((cash / max) * 100)}%%, sec level: ${securityLevel}/${minSecurityLevel}`);
    }
}
