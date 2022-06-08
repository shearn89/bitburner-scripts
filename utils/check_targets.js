/** @param {NS} ns */
export async function main(ns) {
    var targets = [
        "silver-helix",
        "omega-net",
        "crush-fitness",
        "johnson-ortho",
        "the-hub"
    ]

    for (let target of targets) {
        ns.tprint(`>>> ${target} <<<`)
        
        var max = ns.getServerMaxMoney(target);
        var cash = ns.getServerMoneyAvailable(target);

        ns.tprint(`cash: ${Math.floor((cash/max)*100)}%`);

        var securityLevel = Math.ceil(ns.getServerSecurityLevel(target));
        var minSecurityLevel = ns.getServerMinSecurityLevel(target);
        ns.tprint(`sec level: ${securityLevel}/${minSecurityLevel}/+${Math.ceil(securityLevel-minSecurityLevel)}`);
    }
}
