/** @param {NS} ns */
export async function main(ns) {
	var dataFile = "/data/server_size.txt"
	var limit = ns.getPurchasedServerLimit();
	var serverPrefix = "icarus"

	while (true) {
		var servers = ns.getPurchasedServers();
		var cash = ns.getServerMoneyAvailable("home");

		var factor = ns.read(dataFile);
		if ("" == factor) {
			// 2^13 = 8192 GB, 450M
			factor = 13;
		}

		while (servers.length < limit) {
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