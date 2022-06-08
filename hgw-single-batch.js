/** @param {NS} ns */
export async function main(ns) {
    var weakenScript = "/v3/weaken.js";
    var growScript = "/v3/grow.js";
    var hackScript = "/v3/hack.js";

    var workers = ns.getPurchasedServers();

    var target = ns.args[0];

    var weakenHackThreads = 3242;
    var weakenGrowThreads = 159;
    var growThreads = 1985;
    var hackThreads = 81048;

    ns.tprint("launching workers");
    var weakTime = ns.getWeakenTime(target);
    var growTime = ns.getGrowTime(target);
    var hackTime = ns.getHackTime(target);
    var buffer = 100+50;
    var weakDelay = buffer*2;
    var growDelay = (weakTime+buffer)-growTime;
    var hackDelay = (weakTime-buffer)-hackTime;

    var processMap = {};

    var scripts = [weakenScript, weakenScript, growScript, hackScript];
    var counts = [weakenHackThreads, weakenGrowThreads, growThreads, hackThreads];
    var delays = [0, weakDelay, growDelay, hackDelay];
    var iterator = 0;
    var running = 0;

    var worker = workers.pop();
    ns.tprint("starting loop");
    while(worker) {
        if (iterator > scripts.length) {
            break;
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