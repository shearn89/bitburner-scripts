
/** @param {NS} ns */
export async function main(ns) {
    var target = ns.args[0];
	var moneyThresh = ns.getServerMaxMoney(target) * 0.90;
	var securityThresh = ns.getServerMinSecurityLevel(target) + 2;
	
    var money = ns.getServerMoneyAvailable(target);
    var security = ns.getServerSecurityLevel(target);
    while (security > securityThresh) {
        await ns.sleep(Math.random()*500 + 1000);
        await ns.weaken(target);
        security = ns.getServerSecurityLevel(target);
	}

	while(money < moneyThresh) {
        await ns.sleep(Math.random()*500 + 1000);
        await ns.grow(target);
        money = ns.getServerMoneyAvailable(target);
        await ns.sleep(Math.random()*500 + 1000);
        await ns.weaken(target);
        security = ns.getServerSecurityLevel(target);
    }

    while (security > securityThresh) {
        await ns.sleep(Math.random()*500 + 1000);
        await ns.weaken(target);
        security = ns.getServerSecurityLevel(target);
	}
}
