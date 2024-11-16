package dev.Fjc.minecartCollider;

import org.bukkit.ChatColor;
import org.bukkit.entity.Vehicle;
import org.bukkit.entity.minecart.RideableMinecart;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.vehicle.VehicleEntityCollisionEvent;
import org.bukkit.plugin.java.JavaPlugin;


public final class MinecartCollider extends JavaPlugin implements Listener {

    @Override
    public void onEnable() {
        getServer().getPluginManager().registerEvents(this, this);
        getLogger().info(ChatColor.GREEN + "Plugin loaded.");

    }

    @Override
    public void onDisable() {
        // I'll fill this later
    }


    public static RideableMinecart getCartWithPlayer(Vehicle vehicle) {

        //Declare "cart" as a RideableMinecart vehicle
        RideableMinecart cart = (RideableMinecart) vehicle;

        //If "cart" is not a vehicle, or if the vehicle is empty, return null
        if (cart == null || cart.isEmpty())
            return null;

        //If the cart is not empty, and the passenger is a player, return "cart". Otherwise, exit "null"
        if (!cart.isEmpty() && cart.getPassengers() instanceof org.bukkit.entity.Player)
            return cart;
        return null;
    }


    //If "cart" returns not null, cancel any collision event.
    @EventHandler(priority = EventPriority.HIGHEST, ignoreCancelled = true)
    public void onCollision(VehicleEntityCollisionEvent event) {
        RideableMinecart cart = MinecartCollider.getCartWithPlayer(event.getVehicle());
        if (cart != null) {
            event.setCancelled(true);
            event.setCollisionCancelled(true); //This won't work in the next API version, but for now it's fine
            event.setPickupCancelled(true);
        }

    }
}
