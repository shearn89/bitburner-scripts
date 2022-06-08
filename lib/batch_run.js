/** @param {NS} ns */
export async function batch_run(ns, target, scripts, counts, delays) {
    var iterator = 0;
    var running = 0;

    var workers = ns.getPurchasedServers();
    var worker = workers.pop();

    ns.print("starting loop");
    while(worker) {
        if (iterator >= scripts.length) {
            break;
        }
        if (!ns.fileExists(scripts[iterator], worker)) {
            await ns.scp(scripts[iterator], worker);
        }

        var freeRam = ns.getServerMaxRam(worker)-ns.getServerUsedRam(worker);
        ns.print(`server ${worker} has ${freeRam} RAM free`);
        var serverBatches = Math.floor(freeRam/ns.getScriptRam(scripts[iterator]));
        ns.print(`we can run ${serverBatches} of ${scripts[iterator]} on ${worker}`);
        
        var thisBatches = counts[iterator]-running-serverBatches;
        ns.print(`we need to run ${thisBatches} more of ${scripts[iterator]}`);
        if (serverBatches == 0) {
            ns.print(`server ${worker} is full, moving to next`);
            worker = workers.pop()
            continue;
        }
        if (thisBatches < 0) {
            // can run more than required, run what's left
            ns.print(`running remaining ${counts[iterator]-running} threads`);
            ns.exec(scripts[iterator], worker, counts[iterator]-running, target, delays[iterator]);
            iterator += 1;
            running = 0;
        } else {
            // not enough, run the max we can and move to next worker
            ns.print(`running max ${serverBatches} threads`);
            ns.exec(scripts[iterator], worker, serverBatches, target, delays[iterator]);
            running += serverBatches;
            worker = workers.pop()
        }
    }
}