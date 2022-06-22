import { get_flags } from "/lib/constants";

/** @param {NS} ns */
export async function batch_run(ns, target, scripts, counts, delays, batchTag=0) {
    var iterator = 0;
    var running = 0;

    const flags = get_flags(ns);

    var workers = [];
    if (flags['home']) {
        ns.print("home flag set, including home in workers");
        workers = workers.concat("home");
    }
    workers = workers.concat(ns.getPurchasedServers());
    if (flags['breached']) {
        ns.print("breached flag set, including breached nodes from spider_state");
        var breached = ns.read("/data/spider_state.txt").split("\n");
        workers = workers.concat(breached)
    }
    if (workers.length < 1) {
        workers = ["home"];
    }

    var worker = workers.pop();

    // ns.print("starting loop");
    var start = Date.now();
    while(worker) {
        if (iterator >= scripts.length) {
            break;
        }
        if (!ns.fileExists(scripts[iterator], worker)) {
            await ns.scp(scripts[iterator], worker);
        }

        // ns.print(`we are running ${running} instances of ${scripts[iterator]}, we need ${counts[iterator]}`)
        var freeRam = ns.getServerMaxRam(worker)-ns.getServerUsedRam(worker);
        // ns.print(`server ${worker} has ${freeRam} RAM free`);
        var serverBatches = Math.floor(freeRam/ns.getScriptRam(scripts[iterator]));
        // ns.print(`we can run ${serverBatches} of ${scripts[iterator]} on ${worker}`);
        
        var remainingBatches = counts[iterator]-running;
        // ns.print(`we need to run ${remainingBatches} more of ${scripts[iterator]}`);
        if (serverBatches == 0) {
            // ns.print(`server ${worker} is full, moving to next`);
            worker = workers.pop()
            continue;
        }
        if (remainingBatches == 0){
            // ns.print(`now running all batches, breaking`);
            return;
        }
        if (serverBatches > remainingBatches) {
            // can run more than required, run what's left
            // ns.print(`running remaining ${remainingBatches} threads`);
            ns.exec(scripts[iterator], worker, remainingBatches, target, delays[iterator], batchTag);
            iterator += 1;
            running = 0;
        } else {
            // not enough, run the max we can and move to next worker
            // ns.print(`running max ${serverBatches} threads`);
            ns.exec(scripts[iterator], worker, serverBatches, target, delays[iterator], batchTag);
            running += serverBatches;
            worker = workers.pop()
        }
    }
    var end = Date.now();
    ns.print(`took ${end-start} ms to launch batch`);
}