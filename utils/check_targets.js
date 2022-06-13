import { targets } from "/lib/constants";

/** @param {NS} ns */
export async function main(ns) {
    var longest = 0;
    for (let target of targets){ 
        if (target.length > longest) {
            longest = target.length;
        }
    }

    for (let target of targets) {
        var max = ns.getServerMaxMoney(target);
        var cash = ns.getServerMoneyAvailable(target);
        var securityLevel = Math.ceil(ns.getServerSecurityLevel(target));
        var minSecurityLevel = ns.getServerMinSecurityLevel(target);
        var ports = ns.getServerNumPortsRequired(target);
        var level = ns.getServerRequiredHackingLevel(target)
        var spacer = longest+1-target.length;
        // ns.tprintf(`${target}${" ".repeat(spacer)}--- ports: ${ports}, level: ${level}, cash: ${Math.floor((cash/max)*100)}%, sec level: ${securityLevel}/${minSecurityLevel}/+${Math.ceil(securityLevel-minSecurityLevel)}`)
        ns.tprintf(`${target}${" ".repeat(spacer)}--- ports: ${ports}, level: ${level}, cash: ${Math.floor((cash/max)*100)}%%, sec level: ${securityLevel}/${minSecurityLevel}/+${Math.ceil(securityLevel-minSecurityLevel)}`);
    }
}
