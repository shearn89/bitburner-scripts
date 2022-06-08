/** @param {NS} ns */
export async function main(ns) {
	var dataFile = "/data/best_target.txt"

    var weakenScript = "/v3/weaken.js";
    var growScript = "/v3/grow.js";
    var hackScript = "/v3/hack.js";
    var totalMemUsage = 6.95;

    var workers = ns.getPurchasedServers();

    var target = ns.read(dataFile);
    if ("" == target) {
        target = ns.args[0];
    }

    // while true?
    ns.tprint("launching workers");
    for (let worker of workers) {
        // FOR worker in workers...
        var weakTime = ns.getWeakenTime(target);
        var growTime = ns.getGrowTime(target);
        var hackTime = ns.getHackTime(target);

        // max random sleep
        var buffer = 100+50;
        var weakDelay = buffer*2;
        var growDelay = (weakTime+buffer)-growTime;
        var hackDelay = (weakTime-buffer)-hackTime;

        // var totalBatches = Math.floor(ns.getServerMaxRam(worker)/totalMemUsage);
        var freeRam = ns.getServerMaxRam(worker)-ns.getServerUsedRam(worker);
        var totalBatches = Math.floor(freeRam/totalMemUsage);
        ns.print("run time: ", (Math.ceil(weakTime)+buffer*2)/1000, "s");
        ns.tprint(`worker: ${worker}, batches: ${totalBatches}`);

        for (let i = 0; i<totalBatches; i++) {
            // ns.tprint("starting batch ", i);
            // TODO: Need to work out thread ratios!!!
            ns.exec(weakenScript, worker, 1, target, 0, i)
            ns.exec(weakenScript, worker, 1, target, weakDelay, i)
            ns.exec(growScript, worker, 1, target, growDelay, i)
            ns.exec(hackScript, worker, 1, target, hackDelay, i)
            await ns.sleep(200);
        }
        ns.print(`completed ${worker}`)
    }
    ns.print("launched");
}