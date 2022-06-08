/** @param {NS} ns */
export async function main(ns) {
	var dataFile = "/data/spider_state.txt"
	var targetFile = "/data/best_target.txt"
	var bestTarget = "the-hub"
	var bestTargetLevel = 300

	while (true) {
		ns.print("waking");
		var stack = [];
		stack = stack.concat(ns.scan("home"));
	
		var seen = ["home", "darkweb"].concat(ns.getPurchasedServers());
		var hacked = ns.read(dataFile).split("\n");
		if (hacked.length == 1 && hacked[0] === "") hacked = ["darkweb"];

		ns.print("stack length:", stack.length);
	
		while (stack.length > 0){
			var target = stack.pop();
			// ns.print("popped ", target);
	
			if (seen.indexOf(target) != -1) {
				// seen is a superset of hacked
				// ns.print("already seen, skipping this loop");
				continue;
			}
			ns.print("scanning ", target);
			seen.push(target);
			var newHosts = ns.scan(target);
			stack = stack.concat(newHosts);
			ns.print("new length: ", stack.length);
	
			if (ns.getHackingLevel() > ns.getServerRequiredHackingLevel(target)) {
				if (ns.getServerRequiredHackingLevel(target) > bestTargetLevel){
					bestTarget = target
				}

				if (!ns.hasRootAccess(target)) {
					ns.print("no root access on ", target, ", and can hack");
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
					} else {
						ns.print("can't open enough ports");
						continue
					}
				}
			}
	
			ns.print("saving data");
			await ns.write(dataFile, hacked.join("\n"), "w");
			await ns.write(targetFile, bestTarget, "w");
			ns.print("sleeping...")
		}
		await ns.sleep(1000*10*60);
	}
}