const mapperFlags = [
    ['target', ""],
    ['quiet', false],
];

/** @param {NS} ns */
export async function main(ns) {
    var flags = ns.flags(mapperFlags);

    var servers = [];
    var scanner = true;
    if (flags['target'] != "") {
        var stack = [flags['target']]
        scanner = false;
    } else {
        var stack = [];
        stack = stack.concat(ns.scan("home"));
    }

    var seen = ["home", "darkweb"].concat(ns.getPurchasedServers());

    var longServer = "";
    var longCash = 0;
    while (stack.length > 0) {
        var target = stack.pop();

        if (seen.indexOf(target) != -1) {
            continue;
        }
        seen.push(target);

        var cash = ns.getServerMaxMoney(target);
        var level = ns.getServerRequiredHackingLevel(target);
        var ports = ns.getServerNumPortsRequired(target);
        var growth = ns.getServerGrowth(target);
        var hasRoot = ns.hasRootAccess(target);
        var securityLevel = Math.ceil(ns.getServerSecurityLevel(target));
        var minSecurityLevel = ns.getServerMinSecurityLevel(target);
        var currentCash = ns.getServerMoneyAvailable(target);
        var usedRam = ns.getServerUsedRam(target);
        var maxRam = ns.getServerMaxRam(target);
        servers.push({
            "server": target,
            "currentCash": currentCash,
            "cash": cash,
            "level": level,
            "secLevel": securityLevel,
            "minSecLevel": minSecurityLevel,
            "ports": ports,
            "growth": growth,
            "root": hasRoot,
            "usedRam": usedRam,
            "maxRam": maxRam,
        });

        if (scanner) {
            var newHosts = ns.scan(target);
            stack = stack.concat(newHosts);
        }
    }

    var running_targets = get_running_targets(ns)
    print_servers(ns, servers, running_targets) 
}

function getLongestString( a, b ) {
    return (a.length - b.length);
}

function print_servers(ns, servers, running_targets){
    servers.sort((a,b) => getLongestString(a.server, b.server));
    var longServer = servers.slice(-1)[0].server;
    servers.sort((a,b) => a.cash - b.cash)[-1];
    var longCash = servers.slice(-1)[0].cash;

    servers.sort((a,b) => a.level - b.level);

    var myLevel = ns.getHackingLevel();

    // TODO: print padding etc.
    ns.tprintf('OKAY |      SERVER        |           CASH        | +S | LVL  | P |   G  | ROOT  | RAM');
    ns.tprintf(`-----|--------------------|-----------------------|----|------|---|------|-------|-----`);
    for (let server of servers) {
        var serverName = server['server']
        var isTarget = running_targets.includes(serverName);
        print_server(ns, server, longServer, longCash, myLevel, isTarget);
    }
}

function get_running_targets(ns) {
    var scripts = ns.ps(ns.getHostname());
    var targets = [];
    for (let script of scripts) {
        for (var i=0; i<script['args'].length; i++){
            let arg = script['args'][i]
            if (arg == "--target") {
                targets.push(script['args'][i+1]);
                break;
            }
        }
    }
    return targets;
}

function print_server(ns, server, longServer, longCash, myLevel, isTarget){
    var flags = ns.flags(mapperFlags);

    var target = server['server'];
    var currentCash = server['currentCash'];
    var cash = server['cash'];
    var level = server['level'];
    var secLevel = server['secLevel'];
    var minSecLevel = server['minSecLevel'];
    var ports = server['ports'];
    var growth = server['growth'];
    var root = server['root'];
    var ram = server['maxRam'];

    var namePadding = longServer.length - target.length + 1;
    var cashPadding = String(longCash).length - String(cash).length+1;
    var prefix = "    ";
    if (isTarget) {
        prefix = "INFO";
    } else if ((level > myLevel/2) || (!root)) {
        if (flags['quiet']) {
            return;
        }
        prefix = "WARN"
    }
    ns.tprintf(`${prefix} | ${target}${" ".repeat(namePadding)}| ${" ".repeat(cashPadding)}${cash} (${String(Math.round(currentCash/cash*100) || 0).padStart(3, ' ')}%%) | ${String(secLevel-minSecLevel).padStart(2, ' ')} | ${String(level).padStart(4, ' ')} | ${ports} | ${String(growth).padStart(4, ' ')} | ${String(root).padStart(5, ' ')} | ${ram}`)
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
