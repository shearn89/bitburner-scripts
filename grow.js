var target = "silver-helix";

/** @param {NS} ns */
export async function main(ns) {
	var moneyThresh = ns.getServerMaxMoney(target) * 0.90;
    var money = ns.getServerMoneyAvailable(target);
	while(money < moneyThresh) {
        await ns.sleep(Math.random()*500 + 1000);
        await ns.grow(target);
	    moneyThresh = ns.getServerMaxMoney(target) * 0.90;
        money = ns.getServerMoneyAvailable(target);
    }
    ns.print("done");
}
