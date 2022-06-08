var target = "silver-helix";

/** @param {NS} ns */
export async function main(ns) {
	var securityThresh = ns.getServerMinSecurityLevel(target) + 2;
    var security = ns.getServerSecurityLevel(target);
    while (security > securityThresh) {
        await ns.sleep(Math.random()*500 + 1000);
        await ns.weaken(target);
	    securityThresh = ns.getServerMinSecurityLevel(target) + 2;
        security = ns.getServerSecurityLevel(target);
	}
    ns.print("done");
}
