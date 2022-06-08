/** @param {NS} ns */
export async function main(ns) {
	var dataFile = "spider_state.txt"

    var stack = [];
    stack = stack.concat(ns.scan("home"));

    var seen = ["home", "darkweb"];
    var hacked = ns.read(dataFile).split("\n");
    if (hacked.length == 1 && hacked[0] === "") hacked = ["darkweb"];

    ns.tprint("stack length:", stack.length);

    while (stack.length > 0){
        var target = stack.pop();

        if (seen.indexOf(target) != -1) {
            // seen is a superset of hacked
            continue;
        }
        ns.tprint("scanning ", target);
        seen.push(target);
        var newHosts = ns.scan(target);
        stack = stack.concat(newHosts);
        ns.tprint("new length: ", stack.length);
        ns.tprint("killing");
        ns.killall(target);
    }
}
