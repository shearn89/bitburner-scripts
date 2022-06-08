/** @param {NS} ns */
export async function main(ns) {
	var nodeLimit = ns.hacknet.maxNumNodes();
	var nodes = ns.hacknet.numNodes();

	while (nodes < nodeLimit) {
		var nodeNumber = ns.hacknet.purchaseNode();
		if (nodeNumber < 0) {
			ns.tprint("couldn't purchase node");
			return;
		}

		var ok;
		ok = ns.hacknet.upgradeLevel(nodeNumber, 199);
		if (!ok) {
			ns.tprint("couldn't upgrade level");
			return;
		}
		ok = ns.hacknet.upgradeRam(nodeNumber, 6);
		if (!ok) {
			ns.tprint("couldn't upgrade ram");
			return;
		}
		ok = ns.hacknet.upgradeCore(nodeNumber, 15);
		if (!ok) {
			ns.tprint("couldn't upgrade core");
			return;
		}

		ns.tprint("bought and upgraded, trying again");
		nodes = ns.hacknet.numNodes();
	}
}