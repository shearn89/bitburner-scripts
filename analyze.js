/** @param {NS} ns */
export async function main(ns) {
    var target = ns.args[0];

    var targetAmount = 75;
    var growIncrease = 0.004;
    var hackIncrease = 0.002;
    var weakenDecrease = 0.05;

    ns.tprint("grow time: ", ns.getGrowTime(target)/1000);
    ns.tprint("weaken time: ", ns.getWeakenTime(target)/1000);
    ns.tprint("hack time: ", ns.getHackTime(target)/1000);

    var max = ns.getServerMaxMoney(target);
    var amount = ns.getServerMoneyAvailable(target);
    ns.tprint(`cash: ${amount}, max: ${max}`);
    var secLevel = ns.getServerSecurityLevel(target);
    ns.tprint(`security: ${secLevel}`);

    var moneyPerThread = ns.hackAnalyze(target);
    ns.tprint("% stolen per thread:", moneyPerThread);
    var hackThreads = Math.floor(targetAmount/moneyPerThread);

    // var growFactor = (ns.getServerGrowth(target)/100)+1;
    // ns.tprint("grow factor: ", growFactor);
    // // 2 = gf^x, so x=log_gf(2)
    // // log_gf(2) = log_n(2)/log_n(gf)
    // var growThreads = Math.ceil(Math.log(2)/Math.log(growFactor));

    var growChange = (100-targetAmount)/100
    var resultAmount = max/(max*growChange)
    var growThreads = Math.ceil(ns.growthAnalyze(target, resultAmount));

    // var growSecurity = ns.growthAnalyzeSecurity(growThreads, target, 1);
    var growSecurity = growThreads*growIncrease;
    ns.tprint("grow security: ", growSecurity);

    // var hackSecurity = ns.hackAnalyzeSecurity(hackThreads, target);
    var hackSecurity = hackThreads*hackIncrease;
    ns.tprint("hack security: ", hackSecurity);

    var weakenHackThreads = Math.ceil(hackSecurity/weakenDecrease);
    ns.tprint(`weaken 1 threads: ${weakenHackThreads}`);

    var weakenGrowThreads = Math.ceil(growSecurity/weakenDecrease);
    ns.tprint(`weaken 2 threads: ${weakenGrowThreads}`);

    ns.tprint("grow threads:", growThreads);
    ns.tprint(`${targetAmount}% hack threads: ${hackThreads}`);

    var totalThreads = weakenHackThreads+weakenGrowThreads+growThreads+hackThreads;
    ns.tprint(`total threads: ${totalThreads}`);
}