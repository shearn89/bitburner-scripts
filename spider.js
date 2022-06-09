/** @param {NS} ns */
export async function main(ns) {
	var dataFile = "/data/spider_state.txt"
	var targetFile = "/data/best_target.txt"
	var bestTarget = "the-hub"
	var bestTargetLevel = 300

	while (true) {
		ns.tprint("waking");
		var stack = [];
		stack = stack.concat(ns.scan("home"));
	
		var seen = ["home", "darkweb"].concat(ns.getPurchasedServers());
		var hacked = ns.read(dataFile).split("\n");
		// dedupe
		hacked = [...new Set(hacked)]
		if (hacked.length == 1 && hacked[0] === "") hacked = ["darkweb"];

		ns.tprint("stack length:", stack.length);
	
		while (stack.length > 0){
			var target = stack.pop();
			// ns.tprint("popped ", target);
	
			if (seen.indexOf(target) != -1) {
				// seen is a superset of hacked
				// ns.tprint("already seen, skipping this loop");
				continue;
			}
			seen.push(target);
			var newHosts = ns.scan(target);
			stack = stack.concat(newHosts);
			ns.tprint(`scanned ${target}, new length ${stack.length}`);

			if (ns.hasRootAccess(target)) {
				hacked.push(target);
			}
			if (!ns.hasRootAccess(target)) {
				ns.tprint("no root access on ", target, ", attempting breach");
				var reqPorts = ns.getServerNumPortsRequired(target);
				var ports = 0;
				if (ns.fileExists("BruteSSH.exe", "home")) {
					ns.brutessh(target);
					ports++;
				}
				if (ns.fileExists("FTPCrack.exe", "home")) {
					ns.ftpcrack(target);
					ports++;
				}
				if (ns.fileExists("relaySMTP.exe", "home")) {
					ns.relaysmtp(target);
					ports++;
				}
				if (ns.fileExists("HTTPWorm.exe", "home")) {
					ns.httpworm(target);
					ports++;
				}
				if (ns.fileExists("SQLInject.exe", "home")) {
					ns.sqlinject(target);
					ports++;
				}

				if (ports >= reqPorts) {
					ns.nuke(target);
					// if (!target.backdoorInstalled) {
					// 	ns.installBackdoor();
					// }
					hacked.push(target);
					ns.tprint("BREACHED");
				} else {
					ns.tprint("can't open enough ports");
					continue
				}
			}
	
			if (ns.getHackingLevel() > ns.getServerRequiredHackingLevel(target)) {
				if (ns.getServerRequiredHackingLevel(target) > bestTargetLevel){
					bestTarget = target
				}
			}
	
		}
		ns.tprint("saving data");
		hacked = [...new Set(hacked)]
		await ns.write(dataFile, hacked.join("\n"), "w");
		await ns.write(targetFile, bestTarget, "w");
		return;
		await ns.sleep(1000*10*60);
	}
}