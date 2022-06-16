/** @param {NS} ns */
export async function main(ns) {
    ns.tprintf("killing all on purchased servers");
    for (let target of ns.getPurchasedServers()) {
        ns.killall(target);
    }
    ns.tprintf("killing all on others servers");
    var breached = ns.read("/data/spider_state.txt").split("\n");
    for (let target of breached){
        ns.killall(target);
    }
    ns.tprintf("done");
}
