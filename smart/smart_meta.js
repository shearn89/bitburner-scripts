import {
    flagSet,
    get_flags,
    batchInterval,
} from "/lib/constants";

import { set_run } from "/lib/set_run";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    const flags = get_flags(ns);
    if (!flags) {
        ns.tprint("failed to get flags");
        return;
    }
    const target = flags['target'];
    const percentage = flags['percentage'];
    const setLimit = flags['setlimit'];

    // check server is prepped
    var weakenTime = ns.getWeakenTime(target);
    var cash = Math.floor(ns.getServerMoneyAvailable(target));
    var securityLevel = ns.getServerSecurityLevel(target);
    var sleeper = false;
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
        ns.print("done");
    }

    var sleeper = ns.getWeakenTime(target);
    await set_run(ns, target, percentage, 0, setLimit);
    ns.print("sleeping til end of batch");
    await ns.sleep(sleeper+5*1000)
    ns.print("done");
}

export function autocomplete(data, args) {
    data.flags(flagSet)
    const options = {
        'target': [...data.servers]
    }
    for(let arg of ns.args.slice(-2)){
        if(arg.startsWith('--')){
            return options[arg.slice(2)]||[]
        }
    }
    return []
}