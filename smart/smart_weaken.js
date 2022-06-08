
/** @param {NS} ns */
export async function main(ns) {
    var weakenScript = "/v3/weaken.js";
    var growScript = "/v3/grow.js";
    var hackScript = "/v3/hack.js";

    var target = ns.args[0];

	var moneyThresh = ns.getServerMaxMoney(target) * 0.90;
	var securityThresh = ns.getServerMinSecurityLevel(target) + 2;
	
    var money = ns.getServerMoneyAvailable(target);
    var security = ns.getServerSecurityLevel(target);

    var weakenFactor = ns.weakenAnalyze(1, 1);

    if (security>securityThresh) {
        var weakenThreads = Math.ceil((security-securityThresh)/weakenFactor);
        ns.tprint(`weakenThreads: ${weakenThreads}`)
        await ns.exec(weakenScript, "icarus-1", weakenThreads, target, 0);
    }
}
