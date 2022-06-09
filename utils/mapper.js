/** @param {NS} ns */
export async function main(ns) {
    var servers = [];

    var stack = [];
    stack = stack.concat(ns.scan("home"));

    var seen = ["home", "darkweb"].concat(ns.getPurchasedServers());

    var maxPorts = 3;
    var maxCash = 0;
    var highest = "";
    // dedupe
    while (stack.length > 0) {
        var target = stack.pop();

        if (seen.indexOf(target) != -1) {
            // seen is a superset of hacked
            // ns.tprint("already seen, skipping this loop");
            continue;
        }
        seen.push(target);

        var cash = ns.getServerMaxMoney(target);
        var level = ns.getServerRequiredHackingLevel(target);
        var ports = ns.getServerNumPortsRequired(target);
        servers.push({"server": target, "cash": cash, "level": level, "ports": ports})

        ns.tprintf(`${target}: cash ${cash}, level ${level}, ports: ${ports}`);
        if (level <= ns.getHackingLevel()) {
            if (ports <= maxPorts){
                if (cash > maxCash) {
                    maxCash = cash;
                    highest = target;
                }
            }
        }
        var newHosts = ns.scan(target);
        stack = stack.concat(newHosts);
    }
    ns.tprint(`richest target is ${highest}, with ${maxCash}`);
	// await ns.write(dataFile, hacked.join("\n"), "w");

    for (let server of servers) {
        if (server.ports == 3) {
            ns.tprint(server);
        }
    }
}
