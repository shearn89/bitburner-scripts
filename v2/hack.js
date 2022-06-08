/** @param {NS} ns */
export async function main(ns) {
    await ns.sleep(Math.random()*100 + 50);
    await ns.hack(ns.args[0]);
}