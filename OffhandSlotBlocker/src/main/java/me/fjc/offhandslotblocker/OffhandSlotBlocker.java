package me.fjc.offhandslotblocker;

import org.bukkit.Bukkit;
import org.bukkit.event.Listener;
import org.bukkit.plugin.java.JavaPlugin;


public class OffhandSlotBlocker extends JavaPlugin implements Listener {

    public void onEnable() {
        if (getServer().getPluginManager().isPluginEnabled("MythicMobs")) {
            Bukkit.getLogger().info("Found MythicMobs!");
            getServer().getPluginManager().registerEvents(this, this);

        } else {
            Bukkit.getLogger().warning("Could not find MythicMobs! That could be a problem");
            Bukkit.getLogger().warning("Registering events anyway.");
            getServer().getPluginManager().registerEvents(this, this);
        }
        saveDefaultConfig();
        saveConfig();
        Bukkit.getLogger().info("Everything has loaded, probably.");
    }
    public void onDisable() {
        Bukkit.getLogger().info("Shutting down.");
        saveConfig();
    }
}
