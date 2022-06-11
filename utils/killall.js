/** @param {NS} ns */
export async function main(ns) {
    ns.tprintf("killing all on purchased servers");
    for (let target of ns.getPurchasedServers()) {
        ns.killall(target);
    }
    ns.tprintf("done");
}
