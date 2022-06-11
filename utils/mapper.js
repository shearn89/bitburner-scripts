/** @param {NS} ns */
export async function main(ns) {
    var servers = [];

    var stack = [];
    stack = stack.concat(ns.scan("home"));

    var seen = ["home", "darkweb"].concat(ns.getPurchasedServers());

    var longServer = "";
    var longCash = 0;
    while (stack.length > 0) {
        var target = stack.pop();

        if (seen.indexOf(target) != -1) {
            continue;
        }
        seen.push(target);

        if (target.length > longServer.length) {
            longServer = target;
        }

        var cash = ns.getServerMaxMoney(target);
        if (cash > longCash) {
            longCash = cash;
        }
        var level = ns.getServerRequiredHackingLevel(target);
        var ports = ns.getServerNumPortsRequired(target);
        servers.push({"server": target, "cash": cash, "level": level, "ports": ports})

        var newHosts = ns.scan(target);
        stack = stack.concat(newHosts);
    }
    ns.tprintf(`longServer: ${longServer}, longCash: ${longCash}`)

    // objs.sort((a,b) => a.last_nom - b.last_nom);
    servers.sort((a,b) => a.level - b.level);
    
    for (let server of servers) {
        print_server(ns, server, longServer, longCash);
    }
}

function print_server(ns, server, longServer, longCash){
    var target = server['server'];
    var cash = server['cash'];
    var level = server['level'];
    var ports = server['ports'];

    var namePadding = longServer.length - target.length + 1;
    var cashPadding = String(longCash).length - String(cash).length+1;
    ns.tprintf(`${target}${" ".repeat(namePadding)}| ${" ".repeat(cashPadding)}${cash} | ${String(level).padStart(4, ' ')} | ${ports}`)
}

export function count_exploits(ns) {
    var ports = 0;
    if (ns.fileExists("BruteSSH.exe", "home")) {
        ports++;
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
        ports++;
    }
    if (ns.fileExists("relaySMTP.exe", "home")) {
        ports++;
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
        ports++;
    }
    if (ns.fileExists("SQLInject.exe", "home")) {
        ports++;
    }
    return ports;
}
