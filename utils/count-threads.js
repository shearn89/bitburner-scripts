/** @param {NS} ns */
export async function main(ns) {
	var dataFile = "spider_state.txt"
	var targets = ns.read(dataFile).split("\n");
	// targets = targets.concat(ns.getPurchasedServers());
	targets = ns.getPurchasedServers();
	if (targets.length < 1) {
		targets = ["home"];
	}

	var script = ns.args[0];
	var value = ns.args[1];
	var total = 0;
	for (let target of targets) {
		ns.print("target is:", target);
		if ((ns.hasRootAccess(target)) && (target != "darkweb")) {
			var threads = Math.floor(ns.getServerMaxRam(target)/script);
			ns.print(threads);
			total += threads;
		}
	}
	ns.tprint("total threads: ", total);
	ns.tprint(`can run ${Math.floor(total/value)} batches`);
}