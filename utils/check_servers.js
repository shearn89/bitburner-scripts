/** @param {NS} ns */
export async function main(ns) {
    for (let i = 1; i<=20; i++) {
        var ram = Math.pow(2, i);
        var purchaseCost = ns.getPurchasedServerCost(ram);
        ns.tprint("factor: ", i, ", cost: ", purchaseCost, ", ram: ", ram);
    }

    var servers = ns.getPurchasedServers();
    for (let server of servers) {
        var sRam = ns.getServerMaxRam(server);
        ns.tprint("server: ", server, ", ram: ", sRam);

        if (sRam < 32) {
            ns.tprint("server too small, deleting");
            ns.killall(server);
			ns.deleteServer(server);
        }
    }
}
