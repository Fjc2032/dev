public class MineFly extends JavaPlugin implements Listener {

    @Override
    public void onEnable() {
        saveDefaultConfig();
        // This line will register events, probably
        getServer().getPluginManager().registerEvents(this, this);
    }

    @EventHandler
    public void onPlayerToggleFlight(PlayerToggleFlightEvent event) {
        Player player = event.getPlayer();
        if (event.isFlying()) {
            // When a player starts flying, these events are called
            double flyingSpeed = getConfig().getDouble("set-atk-speed.flying", 20.0);
            player.getAttribute(Attribute.GENERIC_ATTACK_SPEED).setBaseValue(flyingSpeed); // Is 20 too much?
            if(getConfig().getString("set-atk-speed") ==null
        } else {
            // When a player stops flying, these events are called
            double notFlyingSpeed = getConfig().getDouble("set-atk-speed.not-flying", 4.0);
            player.getAttribute(Attribute.GENERIC_ATTACK_SPEED).setBaseValue(notFlyingSpeed); // Default speed of 4
        }

        if(getConfig().getString("set-atk-speed.flying") ==null {
           getConfig().getString("set-atk-speed.flying") = 20.0
            getConfig().getString("set-atk-speed.not-flying") = 4.0

    }
}
