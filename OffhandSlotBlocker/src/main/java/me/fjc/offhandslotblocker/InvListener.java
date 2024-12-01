package me.fjc.offhandslotblocker;

import io.lumine.mythic.bukkit.MythicBukkit;
import org.bukkit.Bukkit;
import org.bukkit.Material;
import org.bukkit.entity.Entity;
import org.bukkit.entity.EntityType;
import org.bukkit.entity.Player;
import org.bukkit.event.Event;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.CreatureSpawnEvent;
import org.bukkit.event.inventory.InventoryClickEvent;
import org.bukkit.event.inventory.InventoryType;

public abstract class InvListener extends Event implements Listener {

    @EventHandler(priority = EventPriority.HIGHEST)
    //Method 1: Cancelling the click event entirely. This will block ALL pig spawn eggs,
    //regardless if it is MythicMobs or not
    public void onClick(InventoryClickEvent event) {
        //Check if the slot being clicked is the offhand slot. If not, exit.
        if (!event.getInventory().getType().equals(InventoryType.CRAFTING) && event.getRawSlot() == 45) {
            return;
        } else {
            //Declare Bukkit Player as event.getWhoClicked();
            Player player = (Player) event.getWhoClicked();

            //Checks if the current item is a pig spawn egg and if the target is a player
            if (event.getCurrentItem().equals(Material.PIG_SPAWN_EGG) && event.getWhoClicked().equals(player)) {
                event.setCancelled(true);
                player.sendMessage("Don't put this into your offhand!");
            }


        }

    }
    @EventHandler(priority = EventPriority.HIGH)
    //Method 2: Check if the mob is a mythic mob first, then cancel the spawn event if there
    //is an egg in the offhand slot. Pretty hacky.
    public void onSpawn(CreatureSpawnEvent event) {
        //Declares bukkitEntity
        Entity bukkitEntity = event.getEntity();

        //Checks if the mob is a MythicMob
        boolean isMythicMob = MythicBukkit.inst().getMobManager().isMythicMob(bukkitEntity);
        if(isMythicMob) {

            //Checks if the mob in question was spawned by MythicMobs
            if (event.getSpawnReason().equals(CreatureSpawnEvent.SpawnReason.CUSTOM) && event.getEntityType().equals(EntityType.PIG)) {
                event.setCancelled(true);

                //Send a warning message to the player (this might not work since getEntityType() will never equal PLAYER)
                if (event.getEntityType().equals(EntityType.PLAYER)) {
                    Player player = Bukkit.getPlayerExact(Bukkit.getName());
                    assert player != null;
                    player.sendMessage("Don't spawn this with your offhand!");
                }
            }

        }
    }



}
