/** @param {NS} ns */
export async function main(ns) {
	var dataFile = "spider_state.txt"
	var targets = ns.read(dataFile).split("\n");
	targets = targets.concat(ns.getPurchasedServers());

	for (let target of targets) {
		ns.tprint("target is:", target);
		if ((ns.hasRootAccess(target)) && (target != "darkweb")) {
			ns.tprint("copying script");
			await ns.scp(script, target);
			ns.killall(target);

			var threads = Math.floor(ns.getServerMaxRam(target)/ns.getScriptRam(script));
			
			if (threads > 0) {
				ns.tprint("running script on ", target);
				ns.exec(script, target, threads);
			} else {
				ns.tprint("not enough ram: ", ns.getServerMaxRam(target));
			}

		}
	}
}