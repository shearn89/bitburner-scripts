/** @param {NS} ns */
export async function main(ns) {
    var script = ns.args[0];

	var targets = ns.getPurchasedServers();

	var rRam = ns.getScriptRam(script);
	ns.tprint("required: ", rRam);
	for (let target of targets) {
		ns.tprint("target is:", target);
		var sRam = ns.getServerMaxRam(target);
		ns.tprint("ram: ", sRam);

		if (sRam < rRam) {
			ns.tprint("deleting");
			ns.deleteServer(target);
		}
	}
}