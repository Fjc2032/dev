package me.Fjc.MineFly;

import org.bukkit.attribute.Attribute;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerToggleFlightEvent;
import org.bukkit.plugin.java.JavaPlugin;

public class MineFly extends JavaPlugin implements Listener {

    private static final double DEFAULT_FLYING_SPEED = 20.0;
    private static final double DEFAULT_NOT_FLYING_SPEED = 4.0;

    @Override
    public void onEnable() {
        saveDefaultConfig();
        // This line will register events, probably
        getServer().getPluginManager().registerEvents(this, this);
        initializeConfig();
    }

    public void onDisable() {
        saveConfig();
        this.getLogger();
        this.getLogger().info("Plugin was successfully disabled.");
    }

    @EventHandler
    public void onPlayerToggleFlight(PlayerToggleFlightEvent event) {
        Player player = event.getPlayer();
        ConfigurationSection configSection = getConfig().getConfigurationSection("set-atk-speed");

        if (configSection != null) {
            double flyingSpeed = configSection.getDouble("flying", DEFAULT_FLYING_SPEED);
            double notFlyingSpeed = configSection.getDouble("not-flying", DEFAULT_NOT_FLYING_SPEED);

            if (event.isFlying()) {
                player.getAttribute(Attribute.GENERIC_ATTACK_SPEED).setBaseValue(flyingSpeed);
            } else {
                player.getAttribute(Attribute.GENERIC_ATTACK_SPEED).setBaseValue(notFlyingSpeed);
            }
        }
    }

    private void initializeConfig() {
        ConfigurationSection configSection = getConfig().getConfigurationSection("set-atk-speed");

        if (configSection == null) {
            getConfig().createSection("set-atk-speed");
            configSection = getConfig().getConfigurationSection("set-atk-speed");
                    configSection.set("flying", DEFAULT_FLYING_SPEED);
            configSection.set("not-flying", DEFAULT_NOT_FLYING_SPEED);
            saveConfig();
        }
    }
}
