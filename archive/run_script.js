
/** @param {NS} ns */
export async function main(ns) {
	var workers = ns.getPurchasedServers();

    var process = ns.args[0];
    var target = ns.args[1];

    ns.tprint("deploying to workers");
	for (let worker of workers) {
        await ns.scp(process, worker);
        var totalMemUsage = ns.getScriptRam(process);
        var freeRam = ns.getServerMaxRam(worker)-ns.getServerUsedRam(worker);
        var threads = Math.floor(freeRam/totalMemUsage);

        var delay = Math.random()*500+1000
        ns.exec(process, worker, threads, target, delay);
	}
    ns.tprint("deployment done");
}