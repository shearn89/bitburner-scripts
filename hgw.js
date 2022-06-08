/** @param {NS} ns */
export async function main(ns) {
    ns.tprint(">>> starting smart HGW batch");
    var target = ns.args[0];
    var targetAmount = ns.args[1];

    if (!target) {
        target = "crush-fitness";
    }
    if (!targetAmount) {
        targetAmount = 10;
    }

    var growIncrease = 0.004;
    var hackIncrease = 0.002;
    var weakenDecrease = 0.05;

    var max = ns.getServerMaxMoney(target);

    var moneyPerThread = ns.hackAnalyze(target);
    var hackThreads = Math.floor(targetAmount/moneyPerThread);

    var growChange = (100-targetAmount)/100
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
    ns.tprint(`${targetAmount}% hack threads: ${hackThreads}`);

    var totalThreads = weakenHackThreads+weakenGrowThreads+growThreads+hackThreads;
    ns.tprint(`total threads: ${totalThreads}`);

    var weakenScript = "/v3/weaken.js";
    var growScript = "/v3/grow.js";
    var hackScript = "/v3/hack.js";

    var workers = ns.getPurchasedServers();

    var target = ns.args[0];

    ns.tprint(">>> launching workers");
    var weakTime = ns.getWeakenTime(target);
    var growTime = ns.getGrowTime(target);
    var hackTime = ns.getHackTime(target);
    var buffer = 100+50;
    var weakDelay = buffer*2;
    var growDelay = (weakTime+buffer)-growTime;
    var hackDelay = (weakTime-buffer)-hackTime;

    var scripts = [weakenScript, weakenScript, growScript, hackScript];
    var counts = [weakenHackThreads, weakenGrowThreads, growThreads, hackThreads];
    var delays = [0, weakDelay, growDelay, hackDelay];
    var iterator = 0;
    var running = 0;

    var worker = workers.pop();
    ns.tprint("starting loop");
    while(worker) {
        if (iterator >= scripts.length) {
            break;
        }
        if (!ns.fileExists(scripts[iterator], worker)) {
            await ns.scp(scripts[iterator], worker);
        }

        var freeRam = ns.getServerMaxRam(worker)-ns.getServerUsedRam(worker);
        ns.tprint(`server ${worker} has ${freeRam} RAM free`);
        var serverBatches = Math.floor(freeRam/ns.getScriptRam(scripts[iterator]));
        ns.tprint(`we can run ${serverBatches} of ${scripts[iterator]} on ${worker}`);
        
        var thisBatches = counts[iterator]-running-serverBatches;
        ns.tprint(`we need to run ${thisBatches} more of ${scripts[iterator]}`);
        if (thisBatches < 0) {
            // can run more than required, run what's left
            ns.tprint(`running remaining ${counts[iterator]-running} threads`);
            ns.exec(scripts[iterator], worker, counts[iterator]-running, target, delays[iterator]);
            iterator += 1;
            running = 0;
        } else {
            // not enough, run the max we can and move to next worker
            ns.tprint(`running max ${serverBatches} threads`);
            ns.exec(scripts[iterator], worker, serverBatches, target, delays[iterator]);
            running += serverBatches;
            worker = workers.pop()
        }
    }
    ns.tprint("launched");
}
