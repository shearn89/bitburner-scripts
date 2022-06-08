
/** @param {NS} ns */
export async function main(ns) {
	var workers = ns.getPurchasedServers();

    var process = ns.args[0];
    var target = ns.args[1];

    ns.tprint("deploying to workers");
	for (let worker of workers) {
        await ns.killall(worker);
    }
    await ns.sleep(5000);
	for (let worker of workers) {
        await ns.rm(process, worker);
        await ns.scp(process, worker);
        
        var threads = Math.floor(ns.getServerMaxRam(worker)/ns.getScriptRam(process));
        var delay = Math.random()*500+1000
        ns.exec(process, worker, threads, target, delay);
	}
    ns.tprint("deployment done");
}