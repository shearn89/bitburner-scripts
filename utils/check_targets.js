/** @param {NS} ns */
export async function main(ns) {
    var targets = [
        "foodnstuff", // 0
        "harakiri-sushi", // 0
        "iron-gym", // 1
        "silver-helix", // 2
        "crush-fitness", // 2
        "omega-net", // 2
        "johnson-ortho", // 2
        "the-hub", // 2
        "catalyst", // 3
        "rho-construction", // 3
        "unitalife", // 4
        "applied-energetics", // 4
        "global-pharm", // 4
        "4sigma", // 5
        "nwo", // 5
        "ecorp", // 5
        "megacorp", // 5
    ]

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
