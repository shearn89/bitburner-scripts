
/** @param {NS} ns */
export async function main(ns) {
	var workers = ns.getPurchasedServers();

    var process = ns.args[0];
    var target = ns.args[1];

    ns.tprint("deploying to workers");
	for (let worker of workers) {
        await ns.scp(process, worker);

        var freeRam = ns.getServerMaxRam(worker)-ns.getServerUsedRam(worker);
        var threads = Math.floor(freeRam/ns.getScriptRam(process));
        if (threads <= 0) {
            continue;
        }
        ns.exec(process, worker, threads, target);
	}
    ns.tprint("deployment done");
}