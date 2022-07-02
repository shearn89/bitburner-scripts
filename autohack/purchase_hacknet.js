/** @param {NS} ns */
export async function main(ns) {
	// var nodeLimit = ns.hacknet.maxNumNodes();
	var nodeLimit = 24;
	var nodeCount = ns.hacknet.numNodes();
	// TODO: improve this, check how long it takes to pay back.

	var ok;
	var upgradesNeeded = false;
	while (true) {
		ns.print("checking existing nodes");
		for (let i=0; i<nodeCount; i++) {
			var node = ns.hacknet.getNodeStats(i);
			ns.print(node);
			var nodeNumber = i;
			if (node['level'] < 200) {
				var levelUpgrade = 200-node['level']
				ok = ns.hacknet.upgradeLevel(nodeNumber, levelUpgrade);
				if (!ok) {
					ns.print("couldn't upgrade level to max");
					upgradesNeeded = true;
					continue;
				}
				upgradesNeeded = false;
				ns.print("maxed level");
			}
			
			if (node['ram'] < 64) {
				var ramUpgrade = Math.log2(64)-Math.log2(node['ram']);
				ok = ns.hacknet.upgradeRam(nodeNumber, ramUpgrade);
				if (!ok) {
					ns.print("couldn't upgrade ram to max");
					upgradesNeeded = true;
					continue;
				}
				upgradesNeeded = false;
				ns.print("maxed ram");
			}
			
			if (node['cores'] < 16) {
				var coreUpgrade = 16-node['cores']
				ns.print(`coreUpgrade: ${coreUpgrade}, numCores: ${node['cores']}`)
				ok = ns.hacknet.upgradeCore(nodeNumber, coreUpgrade);
				if (!ok) {
					ns.print("couldn't upgrade core to max");
					upgradesNeeded = true;
					continue;
				}
				upgradesNeeded = false;
				ns.print("maxed cores");
			}
		}

		ns.print("buying new nodes");
		while (nodeCount <= nodeLimit) {
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
		if ((ns.args[0]) || (!upgradesNeeded && (nodeCount >= nodeLimit))) {
			ns.tprint("exiting...");
			break;
		}
		await ns.sleep(1000*60*10);
	}
}

function calculateMoneyGainRate(level, ram, cores, mult) {
  const gainPerLevel = 1.5;

  const levelMult = level * gainPerLevel;
  const ramMult = Math.pow(1.035, ram - 1);
  const coresMult = (cores + 5) / 6;
  return levelMult * ramMult * coresMult * mult * BitNodeMultipliers.HacknetNodeMoney;
}