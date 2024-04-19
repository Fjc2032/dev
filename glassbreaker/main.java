import org.bukkit.Material;
import org.bukkit.enchantments.Enchantment;
import org.bukkit.enchantments.EnchantmentTarget;
import org.bukkit.enchantments.EnchantmentWrapper;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.block.BlockBreakEvent;
import org.bukkit.inventory.ItemStack;
import org.bukkit.plugin.java.JavaPlugin;

public class GlassbreakerPlugin extends JavaPlugin implements Listener {
    
    @Override
    public void onEnable() {
        // Register events
        getServer().getPluginManager().registerEvents(this, this);
        
        // Register the Glassbreaker enchantment
        Enchantment.registerEnchantment(new GlassbreakerEnchantment());
    }
    
    @EventHandler
    public void onBlockBreak(BlockBreakEvent event) {
        Player player = event.getPlayer();
        ItemStack item = player.getInventory().getItemInMainHand();
        
        // Check if the player's held item has the Glassbreaker enchantment
        if (item.containsEnchantment(Enchantment.getByKey(GlassbreakerEnchantment.KEY))) {
            if (event.getBlock().getType() == Material.GLASS) {
                event.setCancelled(true); // Cancel the normal block break event
                event.getBlock().breakNaturally(item); // Break the glass block instantly
            }
        }
    }
}

class GlassbreakerEnchantment extends EnchantmentWrapper {
    
    public static final String KEY = "glassbreaker";
    
    public GlassbreakerEnchantment() {
        super(KEY);
    }
    
    @Override
    public String getName() {
        return "Glassbreaker";
    }
    
    @Override
    public int getMaxLevel() {
        return 1;
    }
    
    @Override
    public EnchantmentTarget getItemTarget() {
        return EnchantmentTarget.TOOL; // Can only be applied to tools
    }
    
    @Override
    public boolean canEnchantItem(ItemStack item) {
        // Allow enchantment on tools
        return item.getType().toString().endsWith("_PICKAXE"); // Allow only pickaxes, add more if needed
    }
}
