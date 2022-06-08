/** @param {NS} ns */
export async function main(ns) {
    var target = ns.args[0];
    ns.tprint("grow time: ", ns.getGrowTime(target)/1000);
    ns.tprint("weaken time: ", ns.getWeakenTime(target)/1000);
    ns.tprint("hack time: ", ns.getHackTime(target)/1000);

    var max = ns.getServerMaxMoney(target);
    var amount = ns.getServerMoneyAvailable(target);
    ns.tprint("cash: ", amount);

    var moneyPerThread = ns.hackAnalyze(target);
    ns.tprint("% stolen per thread:", moneyPerThread);
    var hackThreads = Math.floor(50/moneyPerThread);
    ns.tprint("50% hack threads: ", hackThreads);

    // var growFactor = (ns.getServerGrowth(target)/100)+1;
    // ns.tprint("grow factor: ", growFactor);
    // // 2 = gf^x, so x=log_gf(2)
    // // log_gf(2) = log_n(2)/log_n(gf)
    // var growThreads = Math.ceil(Math.log(2)/Math.log(growFactor));

    var growThreads = Math.ceil(ns.growthAnalyze(target, max/amount));
    ns.tprint("grow threads:", growThreads);

    var growSecurity = ns.growthAnalyzeSecurity(growThreads, target, 1);
    ns.tprint("grow sec: ", growSecurity);

    var hackSecurity = ns.hackAnalyzeSecurity(hackThreads, target);
    ns.tprint("hack sec: ", hackSecurity);
}