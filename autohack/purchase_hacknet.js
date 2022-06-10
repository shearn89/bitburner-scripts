/** @param {NS} ns */
export async function main(ns) {
	var nodeLimit = ns.hacknet.maxNumNodes();
	var nodeCount = ns.hacknet.numNodes();

	var ok;
	while (true) {
		ns.print("checking existing nodes");
		for (let i=0; i<nodeCount; i++) {
			var node = ns.hacknet.getNodeStats(i);
			if (node['level'] < 200) {
				var levelUpgrade = 200-node['level']
				ok = ns.hacknet.upgradeLevel(nodeNumber, levelUpgrade);
				if (!ok) {
					ns.print("couldn't upgrade level to max");
					break;
				}
				ns.print("maxed level");
			}
			
			if (node['ram'] < 64) {
				var ramUpgrade = Math.log2(node['ram'])-Math.log2(64);
				ok = ns.hacknet.upgradeRam(nodeNumber, ramUpgrade);
				if (!ok) {
					ns.print("couldn't upgrade ram to max");
					break;
				}
				ns.print("maxed ram");
			}
			
			if (node['cores'] < 16) {
				var coreUpgrade = 16-node['cores']
				ok = ns.hacknet.upgradeCore(nodeNumber, coreUpgrade);
				if (!ok) {
					ns.print("couldn't upgrade core to max");
					break;
				}
				ns.print("maxed cores");
			}
		}

		ns.print("buying new nodes");
		while (true) {
			var purchaseCost = ns.hacknet.getPurchaseNodeCost();
			var cash = ns.getServerMoneyAvailable("home");

			if (purchaseCost > cash) {
				ns.print("not enough cash to purchase");
				break;
			}

			var nodeNumber = ns.hacknet.purchaseNode();
			if (nodeNumber < 0) {
				ns.print("couldn't purchase node");
				break;
			}

			ok = ns.hacknet.upgradeLevel(nodeNumber, 199);
			if (!ok) {
				ns.print("couldn't upgrade level to max");
				break;
			}
			ok = ns.hacknet.upgradeRam(nodeNumber, 6);
			if (!ok) {
				ns.print("couldn't upgrade ram to max");
				break;
			}
			ok = ns.hacknet.upgradeCore(nodeNumber, 15);
			if (!ok) {
				ns.print("couldn't upgrade core to max");
				break;
			}

			ns.print("bought and upgraded, trying again");
			nodeCount = ns.hacknet.numNodes();
		}
		if (ns.args[0]) {
			break;
		}
		await ns.sleep(1000*60*60);
	}
}