import {
    flagSet,
    get_flags,
    batchInterval,
} from "/lib/constants";

/** @param {NS} ns */
export async function main(ns) {
    var list = ns.getOwnedSourceFiles();
    ns.tprint(list);
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