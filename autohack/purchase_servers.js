/** @param {NS} ns */
export async function main(ns) {
	var limit = ns.getPurchasedServerLimit();
	var serverPrefix = "icarus"

	var dataFile = "/data/server_size.txt";
	var factor = ns.read(dataFile);
	if (!factor) {
		factor = 13;
	}

	while (true) {
		var servers = ns.getPurchasedServers();
		if (servers.length >= limit) {
			var smallest = "";
			var smallestRam = Infinity

			// find smallest server
			for (let server of servers) {
				var ram = ns.getServerMaxRam(server);
				// ns.tprint(`server: ${server}, ram: ${ram}, smallest: ${smallest}, smallestRam: ${smallestRam}`);
				if (ram < smallestRam) {
					smallest = server;
					smallestRam = ram;
				}
			}

			// we have the smallest server
			var newFactor = Math.log2(smallestRam)+1;
			ns.print(`found smallest server ${smallest}, with ${smallestRam} RAM (2^${Math.log2(smallestRam)}), replacing at factor ${newFactor}`);
			if (ns.ps(smallest).length > 0) {
				ns.print("server is running scripts, skipping");
			} else {
				ns.print("deleting server");
				ns.deleteServer(smallest);
			}
			factor = newFactor;
			await ns.write(dataFile, factor, "w");
		}

		while (servers.length < limit) {
			var cash = ns.getServerMoneyAvailable("home");
			var ram = Math.pow(2, factor);
			var purchaseCost = ns.getPurchasedServerCost(ram);
			if (purchaseCost <= cash) {
				ns.purchaseServer(serverPrefix, ram);
			} else {
				break;
			}
			servers = ns.getPurchasedServers();
			await ns.sleep(100);
		}
		await ns.sleep(1000*60*10);
	}
}