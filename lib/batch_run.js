/** @param {NS} ns */
export async function batch_run(ns, target, scripts, counts, delays, batchTag=0) {
    var iterator = 0;
    var running = 0;

    var workers = ns.getPurchasedServers();
    if (workers.length < 1) {
        workers = ["home"];
    }
    var worker = workers.pop();

    ns.print("starting loop");
    while(worker) {
        if (iterator >= scripts.length) {
            break;
        }
        if (!ns.fileExists(scripts[iterator], worker)) {
            await ns.scp(scripts[iterator], worker);
        }

        ns.print(`we are running ${running} instances of ${scripts[iterator]}, we need ${counts[iterator]}`)
        var freeRam = ns.getServerMaxRam(worker)-ns.getServerUsedRam(worker);
        ns.print(`server ${worker} has ${freeRam} RAM free`);
        var serverBatches = Math.floor(freeRam/ns.getScriptRam(scripts[iterator]));
        ns.print(`we can run ${serverBatches} of ${scripts[iterator]} on ${worker}`);
        
        var remainingBatches = counts[iterator]-running;
        ns.print(`we need to run ${remainingBatches} more of ${scripts[iterator]}`);
        if (serverBatches == 0) {
            ns.print(`server ${worker} is full, moving to next`);
            worker = workers.pop()
            continue;
        }
        if (serverBatches > remainingBatches) {
            // can run more than required, run what's left
            ns.print(`running remaining ${remainingBatches} threads`);
            ns.exec(scripts[iterator], worker, remainingBatches, target, delays[iterator], batchTag);
            iterator += 1;
            running = 0;
        } else {
            // not enough, run the max we can and move to next worker
            ns.print(`running max ${serverBatches} threads`);
            ns.exec(scripts[iterator], worker, serverBatches, target, delays[iterator], batchTag);
            running += serverBatches;
            worker = workers.pop()
        }
    }
}