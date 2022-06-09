
/** @param {NS} ns */
export async function main(ns) {
    var target = ns.args[0];
    var cash = ns.getServerMaxMoney(target);
    var level = ns.getServerRequiredHackingLevel(target);
    var ports = ns.getServerNumPortsRequired(target);
    ns.tprint(`server: ${target}, cash: ${cash}, level: ${level}, ports: ${ports}`)
}