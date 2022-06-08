/** @param {NS} ns */
export async function main(ns) {
	var servers = ns.getPurchasedServers();
	var limit = ns.getPurchasedServerLimit();

	var cash = ns.getServerMoneyAvailable("home");
	var serverPrefix = "icarus"

	ns.tprint("checking, have ", servers.length, " limit is ", limit);
	if (servers.length < limit) {
		ns.tprint("have space, checking cost")
		// 2^5 = 32GB
		for (let i = 5; i<=20; i++) {
			var ram = Math.pow(2, i);
			var purchaseCost = ns.getPurchasedServerCost(ram);
			ns.tprint("cost: ",purchaseCost);
			ns.tprint("cash: ",cash);
			if (purchaseCost > cash) {
				ns.tprint("reached limit, purchasing");
				ns.purchaseServer(serverPrefix, Math.pow(2, i-1))
				break;
			} else {
				ns.tprint("affordable, trying larger server");
			}
		}
		servers = ns.getPurchasedServers();
		await ns.sleep(100);
	}
}