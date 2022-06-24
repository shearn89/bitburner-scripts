import { targets } from "/lib/constants";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");

    // SF4 - buy tor router, buy programs in order.

    // run spider.js, hack what we can. Should start with 3 exploits.
    var spiderPid = ns.run("/spider.js", 1);
    // give it a second
    await ns.sleep(2*1000);

    const maxRunning = 4;
    var running = 0;
    var runningPids = [];
    // copy array
    var targetList = [...targets].reverse();

    while(targetList) {
        // we'll break out when we're hacking megacorp.
        let target = targetList.pop();
        ns.print(`checking ${target}`);
        var myHackLevel = ns.getHackingLevel();
        var serverHackLevel = ns.getServerRequiredHackingLevel(target);
        var hasRoot = ns.hasRootAccess(target)

        // if we can hack it, hack it!
        if ((myHackLevel > (serverHackLevel/2) || serverHackLevel <= 1) && hasRoot && (runningPids.length < maxRunning)) {
            ns.print(`passed checks: ${runningPids.length} scripts running. running hack on ${target}`);
            running += 1;
            var pid = ns.run("/smart/smart_meta_loop.js", 1, "--target", target);
            // var pid = ns.run("/smart/smart_meta.js", 1, "--target", target);
            runningPids.push({"target": target, "pid": pid})
            ns.print(runningPids);
        } else if ((myHackLevel > (serverHackLevel/2)) && hasRoot && (runningPids.length >= maxRunning)) {
            // if the target is better, kill the earliest pid aka weakest target.
            ns.print(`${target} hack level (${serverHackLevel}) is better than our current, killing one script`);
            var pidToKill = runningPids[0]['pid']
            ns.kill(pidToKill, ns.getHostname())
            // so next time there'll be space
            targetList.push(target);
        } else {
            // return to the list, ready for retry
            targetList.push(target);
        }
        

        if ((runningPids.length < maxRunning) && hasRoot) {
            ns.print(`limit (${maxRunning}) not reached, looping`);
            await ns.sleep(1000);
        } else if (runningPids.length < maxRunning) {
            ns.print(`limit (${maxRunning}) not reached, but no better targets, sleeping...`);
            await ns.sleep(1000*60);
        } else {
            ns.print(`${maxRunning} hacks running, no better targets, sleeping...`);
            await ns.sleep(1000*60);
        }
    }
}