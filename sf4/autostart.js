import { targets } from "/lib/constants";

/** @param {NS} ns */
export async function main(ns) {
    // ns.disableLog("ALL");

    // reset data files? server size = 4, spider_state.txt = ""

    // SF4 - study computer science at university
    if (!ns.singularity.isBusy()) {
        ns.singularity.universityCourse("rothman university", "Computer Science", false)
    }

    // run spider.js, hack what we can. May start with 3 exploits.
    // var spiderPid = ns.run("/spider.js", 1, "1");
    // give it a second
    // await ns.sleep(2*1000);
    
    if (!ns.scriptRunning("/smart/smart_meta_loop.js", "home")){
        ns.print("hack not running, starting");
        ns.run("/smart/smart_meta_loop.js", 1, "--breached", "--home", "--target", "n00dles");
    } else {
        ns.print("hack already running");
    }

    ns.run("/sf4/darkweb.js", 1)
    // upgrade home server where possible
    // check if > SOMEVALUE, then upgrade from there?
    // var ramUpgraded = ns.singularity.upgradeHomeRam();

    // run purchase servers
    // run upgrade servers
    // run faction script
}
