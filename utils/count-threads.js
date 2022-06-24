import { get_flags } from "/lib/constants";

/** @param {NS} ns */
export async function main(ns) {
	var dataFile = "spider_state.txt"
	var workers = ns.read(dataFile).split("\n");
	// targets = targets.concat(ns.getPurchasedServers());

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

	var value = 1.75+1.75+1.75+1.70
	var total = 0;
	for (let worker of workers) {
		ns.print("target is:", worker);
		if ((ns.hasRootAccess(worker)) && (worker != "darkweb")) {
			var threads = Math.floor(ns.getServerMaxRam(worker)/value);
			ns.print(threads);
			total += threads;
		}
	}
	ns.tprint("total threads: ", total);
	ns.tprint(`can run ${Math.floor(total/value)} batches`);
}