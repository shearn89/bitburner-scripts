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
				if (ns.ps(server).length > 0) {
					ns.tprint("server is running scripts, skipping");
					continue;
				}
				var ram = ns.getServerMaxRam(server);

				// ns.tprint(`server: ${server}, ram: ${ram}, smallest: ${smallest}, smallestRam: ${smallestRam}`);
				if (ram < smallestRam) {
					smallest = server;
					smallestRam = ram;
				}
			}

			// we have the smallest server
			var smallestFactor = Math.log2(smallestRam)+1;
			ns.tprint(`found smallest server ${smallest}, with ${smallestRam} RAM (2^${Math.log2(smallestRam)}), replacing at factor ${smallestFactor}`);
			if (ns.ps(smallest).length > 0) {
				ns.tprint("server is running scripts, skipping");
			} else {
				ns.tprint("deleting server");
				ns.deleteServer(smallest);
			}
			if (smallestFactor > factor) {
				factor = smallestFactor;
				await ns.write(dataFile, factor, "w");
			}
		}
		await ns.sleep(100);
		while (servers.length < limit) {
			var cash = ns.getServerMoneyAvailable("home");
			var ram = Math.pow(2, factor);
			var purchaseCost = ns.getPurchasedServerCost(ram);
			if (purchaseCost <= cash) {
				ns.purchaseServer(serverPrefix, ram);
			} else {
				ns.tprint("can't afford, exiting");
				return;
			}
			servers = ns.getPurchasedServers();
			await ns.sleep(100);
		}
		await ns.sleep(100);
	}
}