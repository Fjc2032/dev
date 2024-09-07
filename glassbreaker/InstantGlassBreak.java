package me.Fjc.instantglassbreak;


import org.bukkit.enchantments.EnchantmentWrapper;
import org.bukkit.event.Listener;
import org.bukkit.persistence.PersistentDataContainer;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.Material;
import org.bukkit.enchantments.Enchantment;
import org.bukkit.enchantments.EnchantmentTarget;
import org.bukkit.event.EventHandler;
import org.bukkit.event.block.BlockBreakEvent;
import org.bukkit.inventory.ItemStack;

import java.lang.reflect.Field;
import java.time.Instant;

public class InstantGlassBreak extends JavaPlugin implements Listener {
    public static final Enchantment GLASS_BREAKER = new InstantGlassBreakEnchantment("glassbreaker");

    @Override
    public void onEnable() {
        try {
            Field f = Enchantment.class.getDeclaredField("acceptingNew");
            f.setAccessible(true);
            f.set(null, true);
        } catch (Exception e) {
            e.printStackTrace();

        }

    }

    @Override
    public void onDisable() {
       getLogger().info("Plugin disabled I guess");
    }

    @EventHandler
    public void onBlockBreak(BlockBreakEvent event) {
        Material blockType = event.getBlock().getType();
        Material itemType = event.getPlayer().getInventory().getItemInMainHand().getType();

        Material[] glassTypes = {
                Material.GLASS,
                Material.GLASS_PANE,
                Material.TINTED_GLASS,
                Material.WHITE_STAINED_GLASS,
                Material.WHITE_STAINED_GLASS_PANE,
                Material.ORANGE_STAINED_GLASS,
                Material.ORANGE_STAINED_GLASS_PANE,
                Material.MAGENTA_STAINED_GLASS,
                Material.MAGENTA_STAINED_GLASS_PANE,
                Material.LIGHT_BLUE_STAINED_GLASS,
                Material.LIGHT_BLUE_STAINED_GLASS_PANE,
                Material.YELLOW_STAINED_GLASS,
                Material.YELLOW_STAINED_GLASS_PANE,
                Material.LIME_STAINED_GLASS,
                Material.LIME_STAINED_GLASS_PANE,
                Material.PINK_STAINED_GLASS,
                Material.PINK_STAINED_GLASS_PANE,
                Material.GRAY_STAINED_GLASS,
                Material.GRAY_STAINED_GLASS_PANE,
                Material.LIGHT_GRAY_STAINED_GLASS,
                Material.LIGHT_GRAY_STAINED_GLASS_PANE,
                Material.CYAN_STAINED_GLASS,
                Material.CYAN_STAINED_GLASS_PANE,
                Material.PURPLE_STAINED_GLASS,
                Material.PURPLE_STAINED_GLASS_PANE,
                Material.BLUE_STAINED_GLASS,
                Material.BLUE_STAINED_GLASS_PANE,
                Material.BROWN_STAINED_GLASS,
                Material.BROWN_STAINED_GLASS_PANE,
                Material.GREEN_STAINED_GLASS,
                Material.GREEN_STAINED_GLASS_PANE,
                Material.RED_STAINED_GLASS,
                Material.RED_STAINED_GLASS_PANE,
                Material.BLACK_STAINED_GLASS,
                Material.BLACK_STAINED_GLASS_PANE
        };

        boolean isGlass = false;
        for (Material glass : glassTypes) {
            if (blockType == glass) {
                isGlass = true;
                break;
            }
        }
        if (isGlass) {
            Material[] pickaxeTypes = {
                    //Array of pickaxes will go under here
                    Material.WOODEN_PICKAXE,
                    Material.STONE_PICKAXE,
                    Material.GOLDEN_PICKAXE,
                    Material.IRON_PICKAXE,
                    Material.DIAMOND_PICKAXE,
                    Material.NETHERITE_PICKAXE
            };

            boolean isPickaxe = false;
            for (Material pickaxe : pickaxeTypes) {
                if (itemType == pickaxe) {
                    isPickaxe = true;
                    break;
                }
            }
            if (isPickaxe && event.getPlayer().getInventory().getItemInMainHand().containsEnchantment(InstantGlassBreak.GLASS_BREAKER)) {
                int level = event.getPlayer().getInventory().getItemInMainHand().getEnchantmentLevel(InstantGlassBreak.GLASS_BREAKER);
                float effMultiplier = 1 + 0.2f * level; //Enchant multiplier
                event.getBlock().setType(Material.AIR);
            }
        }
    }
}
