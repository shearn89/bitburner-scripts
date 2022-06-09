/** @param {NS} ns */
export async function main(ns) {
    var targets = [
        "foodnstuff", // 0
        "joesguns", // 0
        "harakiri-sushi", // 0
        "iron-gym", // 1
        "silver-helix", // 2
        "omega-net", // 2
        "crush-fitness", // 2
        "johnson-ortho", // 2
        "the-hub", // 2
        "computek", // 3
        "catalyst", // 3
        "netlink", // 3
        "rothman-uni", // 3
        "summit-uni", // 3
        "rho-construction", // 3
        "millenium-fitness", // 3
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
        var spacer = longest+1-target.length;
        ns.tprint(`${target}${" ".repeat(spacer)}--- ports: ${ns.getServerNumPortsRequired(target)}, level: ${ns.getServerRequiredHackingLevel(target)}, cash: ${Math.floor((cash/max)*100)}%, sec level: ${securityLevel}/${minSecurityLevel}/+${Math.ceil(securityLevel-minSecurityLevel)}`)
    }
}
