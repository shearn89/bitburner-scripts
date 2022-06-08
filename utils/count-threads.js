/** @param {NS} ns */
export async function main(ns) {
	var dataFile = "spider_state.txt"
	var targets = ns.read(dataFile).split("\n");
	// targets = targets.concat(ns.getPurchasedServers());
	targets = ns.getPurchasedServers();

	var script = ns.args[0];
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
}