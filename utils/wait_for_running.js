/** @param {NS} ns */
export async function main(ns) {

    var servers = ns.getPurchasedServers();
    for (let server of servers) {
        var processes = ns.ps(server);
    }
}