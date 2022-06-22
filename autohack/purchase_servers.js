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
		if (servers.length >= limit) {
			ns.print("reached limit of purchaseable servers, exiting");
			break;
		}
		if (ns.args[0]) {
			ns.print("breaker flag set, exiting");
			break;
		}
		await ns.sleep(1000*60*3);
	}
}