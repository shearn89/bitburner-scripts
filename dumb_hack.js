var target = "crush-fitness";

/** @param {NS} ns */
export async function main(ns) {
	// Infinite loop that continously hacks/grows/weakens the target server
	while(true) {
		var growTime = ns.getGrowTime(target);
		ns.exec("run-script.js", "/v3/grow.js", target)
		await ns.sleep(growTime+10000);

		var weakenTime = ns.getWeakenTime(target);
		ns.exec("run-script.js", "/v3/weaken.js", target)
		await ns.sleep(weakenTime+10000);

		var hackTime = ns.getHackTime(target);
		ns.exec("run-script.js", "/v3/hack.js", target)
		await ns.sleep(hackTime+10000);
	}
}