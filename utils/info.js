
/** @param {NS} ns */
export async function main(ns) {
	var nodeLimit = ns.hacknet.maxNumNodes();
    ns.tprint(nodeLimit);
}