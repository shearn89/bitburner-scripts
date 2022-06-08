/** @param {NS} ns */
export async function main(ns) {
	var targets = ns.getPurchasedServers();

    var weakenScript = "/v3/weaken.js";
    var growScript = "/v3/grow.js";
    var hackScript = "/v3/hack.js";
	var scripts = [weakenScript, growScript, hackScript];

	for (let target of targets) {
		for (let script of scripts) {
			ns.tprint(`copying ${script} to ${target}`);
			await ns.scp(script, target);
		}
	}
}