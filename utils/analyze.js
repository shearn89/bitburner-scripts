/** @param {NS} ns */
export async function main(ns) {
    var target = ns.args[0];

    var targetAmount = ns.args[1];
    var growIncrease = 0.004;
    var hackIncrease = 0.002;
    var weakenDecrease = 0.05;

    if (!targetAmount) {
        targetAmount = 0.5;
    }

    var max = ns.getServerMaxMoney(target);
    var cash = Math.floor(ns.getServerMoneyAvailable(target));
    ns.tprint(`cash: ${cash}, max: ${max}, delta: ${max-cash}`)
    var securityLevel = ns.getServerSecurityLevel(target);
    ns.tprint(`sec level: ${securityLevel}`);

    var moneyPerThread = ns.hackAnalyze(target);
    var hackThreads = Math.floor(targetAmount/moneyPerThread);

    var growChange = 1-targetAmount
    var resultAmount = max/(max*growChange)
    var growThreads = Math.ceil(ns.growthAnalyze(target, resultAmount));

    // var growSecurity = ns.growthAnalyzeSecurity(growThreads, target, 1);
    var growSecurity = growThreads*growIncrease;

    // var hackSecurity = ns.hackAnalyzeSecurity(hackThreads, target);
    var hackSecurity = hackThreads*hackIncrease;

    var weakenHackThreads = Math.ceil(hackSecurity/weakenDecrease);
    ns.tprint(`weaken hack threads: ${weakenHackThreads}`);

    var weakenGrowThreads = Math.ceil(growSecurity/weakenDecrease);
    ns.tprint(`weaken grow threads: ${weakenGrowThreads}`);

    ns.tprint("grow threads:", growThreads);
    ns.tprint(`${targetAmount*100}% hack threads: ${hackThreads}`);

    var totalThreads = weakenHackThreads+weakenGrowThreads+growThreads+hackThreads;
    ns.tprint(`total threads: ${totalThreads}`);
    ns.tprint(`runtime: ${Math.ceil(ns.getWeakenTime(target)/1000)}s`);
}