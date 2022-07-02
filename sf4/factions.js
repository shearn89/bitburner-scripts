
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    while (true) {
        var faction_invites = ns.singularity.checkFactionInvitations();
        for (let faction of faction_invites) {
            // check if not sector-12?
            ns.singularity.joinFaction(faction);
        }
        for (let faction of ns.getPlayer().factions){
            // ns.print(faction);
            var augments = ns.singularity.getAugmentationsFromFaction(faction);
            // ns.print(augments);
            for (let augment of augments) {
                if (augment == "NeuroFlux Governor") {
                    continue;
                }
                var ok = ns.singularity.purchaseAugmentation(faction, augment);
                ns.printf(`purchase attempt: ${faction}, ${augment}, ${ok}`);
            }
            ns.printf(`done with ${faction}`)
        }
        await ns.sleep(1000 * 60 * 5);
    }
}
