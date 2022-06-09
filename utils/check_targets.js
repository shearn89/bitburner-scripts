/** @param {NS} ns */
export async function main(ns) {
    var targets = [
        // "foodnstuff",
        // "joesguns",
        // "harakiri-sushi", // 0
        "iron-gym", // 1
        "silver-helix", // 2
        "omega-net", // 2
        "crush-fitness", // 2
        "johnson-ortho", // 2
        "the-hub" // 2
    ]

    for (let target of targets) {
        ns.tprint(`>>> ${target} <<<`)
        ns.tprint(`ports: ${ns.getServerNumPortsRequired(target)}, level: ${ns.getServerRequiredHackingLevel(target)}`)
        
        var max = ns.getServerMaxMoney(target);
        var cash = ns.getServerMoneyAvailable(target);

        ns.tprint(`cash: ${Math.floor((cash/max)*100)}%`);

        var securityLevel = Math.ceil(ns.getServerSecurityLevel(target));
        var minSecurityLevel = ns.getServerMinSecurityLevel(target);
        ns.tprint(`sec level: ${securityLevel}/${minSecurityLevel}/+${Math.ceil(securityLevel-minSecurityLevel)}`);
    }
}
