package dev.Fjc.minecartCollider;

import org.bukkit.entity.Entity;
import org.bukkit.entity.Minecart;
import org.bukkit.entity.Vehicle;
import org.bukkit.entity.minecart.RideableMinecart;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.vehicle.VehicleEntityCollisionEvent;
import org.bukkit.plugin.java.JavaPlugin;

import java.util.List;

public final class MinecartCollider extends JavaPlugin implements Listener {

    @Override
    public void onEnable() {
        getServer().getPluginManager().registerEvents(this, this);

    }

    @Override
    public void onDisable() {
        // I'll fill this later
    }

    //Returns null if the cart is empty, or if the passenger is not a player
    public static RideableMinecart getCartWithPlayer(Vehicle vehicle) {
        RideableMinecart cart = getRidableMinecart(vehicle);
        if (cart == null || cart.isEmpty())
            return null;
        Entity passenger = GetPassenger((Minecart)cart);
        if (passenger == null || !(passenger instanceof org.bukkit.entity.Player))
            return null;
        return cart;
    }

    //Returns null if the cart cannot be ridden (maybe it's a chest minecart or smth)
    public static RideableMinecart getRidableMinecart(Vehicle vehicle) {
        RideableMinecart cart = null;
        if (!(vehicle instanceof RideableMinecart))
            return null;
        cart = (RideableMinecart)vehicle;
        return cart;
    }

    //Lists all entities in minecart, and returns null if the list is empty. This check is kind of redundant.
    public static Entity GetPassenger(Minecart toCart) {
        List<Entity> passengers = toCart.getPassengers();
        if (passengers.isEmpty())
            return null;
        return passengers.getFirst();
    }

    //Cancels collision event if "cart" variable is null.
    @EventHandler(priority = EventPriority.HIGHEST, ignoreCancelled = true)
    public void onCollision(VehicleEntityCollisionEvent event) {
        RideableMinecart cart = MinecartCollider.getCartWithPlayer(event.getVehicle());
        if (cart == null) {
            event.setCancelled(true);
            event.setCollisionCancelled(true); //This won't work in the next API version, but for now it's fine
            event.setPickupCancelled(true);
        }

    }
}
