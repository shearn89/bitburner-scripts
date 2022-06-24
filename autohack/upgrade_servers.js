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
					ns.print("server is running scripts, skipping");
					continue;
				}
				var ram = ns.getServerMaxRam(server);

				ns.print(`server: ${server}, ram: ${ram}, smallest: ${smallest}, smallestRam: ${smallestRam}`);
				if (ram < smallestRam) {
					smallest = server;
					smallestRam = ram;
				}
			}

			// we have the smallest server
			var smallestFactor = Math.log2(smallestRam)+4;
			if (smallestFactor > 21) {
				smallestFactor = Math.log2(smallestRam)+1;
			}
			if (factor > 20) {
				factor = 20;
			}
			if (smallestFactor > 20) {
				ns.print("no more to upgrade");
				return;
			}
			ns.print(`found smallest server ${smallest}, with ${smallestRam} RAM (2^${Math.log2(smallestRam)}), factor is ${factor}, smallestFactor is ${smallestFactor}`);
			if (ns.ps(smallest).length > 0) {
				ns.print("server is running scripts, skipping");
			} else {
				ns.print("deleting server");
				var cash = ns.getServerMoneyAvailable("home");
				var ram = Math.pow(2, factor);
				var purchaseCost = ns.getPurchasedServerCost(ram);
				if (purchaseCost <= cash) {
					ns.deleteServer(smallest);
				} else {
					ns.print("won't be able to afford, breaking");
					break;
				}
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
				ns.print("can't afford, exiting");
				return;
			}
			servers = ns.getPurchasedServers();
			await ns.sleep(100);
		}
		await ns.sleep(100);
	}
}