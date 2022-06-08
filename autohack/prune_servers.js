/** @param {NS} ns */
export async function main(ns) {
	var dataFile = "/data/server_size.txt"
	var factor = ns.read(dataFile);
    if ("" == factor) {
        factor = 10;
    }
    var servers = ns.getPurchasedServers();
    for (let server of servers) {
        var sRam = ns.getServerMaxRam(server);
        if (sRam < 2**factor) {
            ns.tprint(`server ${server} too small at ${sRam} GB, deleting`);
            ns.killall(server);
			ns.deleteServer(server);
        }
    }

	await ns.write(dataFile, factor, "w");
}
