import { get_flags } from "/lib/constants";

/** @param {NS} ns */
export async function main(ns) {
	var dataFile = "spider_state.txt"
	var workers = ns.read(dataFile).split("\n");
	// targets = targets.concat(ns.getPurchasedServers());

    const flags = get_flags(ns);

	workers = ns.getPurchasedServers();
	if (workers.length < 1) {
		workers = ["home"];
    } else {
        if (flags['home']) {
            ns.print("home flag set, including home in workers");
            workers = workers.concat("home");
        }
    }

	var script = ns.args[0];
	var value = ns.args[1];
	var total = 0;
	for (let worker of workers) {
		ns.print("target is:", worker);
		if ((ns.hasRootAccess(worker)) && (worker != "darkweb")) {
			var threads = Math.floor(ns.getServerMaxRam(worker)/script);
			ns.print(threads);
			total += threads;
		}
	}
	ns.tprint("total threads: ", total);
	ns.tprint(`can run ${Math.floor(total/value)} batches`);
}