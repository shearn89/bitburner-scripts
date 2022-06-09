/** @param {NS} ns */
export async function main(ns) {
	var dataFile = "/data/server_size.txt"
	var limit = ns.getPurchasedServerLimit();
	var serverPrefix = "icarus"

	while (true) {
		var servers = ns.getPurchasedServers();

		var factor = ns.read(dataFile);
		if ("" == factor) {
			// 2^12 = 4096 GB, 225M
			// 2^13 = 8192 GB, 450M
			// 2^14 = 16384 GB, 901M
			// this should stay equal to home server (or close to)
			factor = 14;
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