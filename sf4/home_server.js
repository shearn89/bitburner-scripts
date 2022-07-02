

/** @param {NS} ns */
export async function main(ns) {
    while (true) {
        var price = ns.singularity.getUpgradeHomeRamCost()
		var cash = ns.getServerMoneyAvailable("home");
        ns.print(`cash: ${cash}, price: ${price}`);
        if (cash >= price) {
            ns.singularity.upgradeHomeRam();
        } else {
            await ns.sleep(1000 * 60 * 5);
        }
    }
}
