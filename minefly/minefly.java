public class MineFly extends JavaPlugin implements Listener {

    @Override
    public void onEnable() {
        // This line will register events, probably
        getServer().getPluginManager().registerEvents(this, this);
    }

    config=getConfiguration.configuration((config.yml)); {
        var player.getAttribute(Attribute.GENERIC_ATTACK_SPEED).setBaseValue();
        str "flySpeed"=(var());
    }

    @EventHandler
    public void onPlayerToggleFlight(PlayerToggleFlightEvent event) {
        Player player = event.getPlayer();
        if (event.isFlying()) {
            // When a player starts flying, these events are called
            player.getAttribute(Attribute.GENERIC_ATTACK_SPEED).setBaseValue(20.0); // Is 20 too much?
        } else {
            // When a player stops flying, these events are called
            player.getAttribute(Attribute.GENERIC_ATTACK_SPEED).setBaseValue(4.0); // Default speed of 4
        }
    }
}
