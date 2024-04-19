package maxstacksize;

import net.minecraft.server.v1_16_R1.*; // need to make adaptable
import org.bukkit.ChatColor;
import org.bukkit.GameMode;
import org.bukkit.Material;
import org.bukkit.Statistic;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.EntityType;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.block.BlockDropItemEvent;
import org.bukkit.event.entity.EntityDropItemEvent;
import org.bukkit.event.inventory.*;
import org.bukkit.event.player.PlayerBucketEmptyEvent;
import org.bukkit.event.player.PlayerDropItemEvent;
import org.bukkit.event.player.PlayerItemConsumeEvent;
import org.bukkit.inventory.BrewerInventory;
import org.bukkit.inventory.ItemStack;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.potion.PotionEffect;
import org.bukkit.scheduler.BukkitScheduler;

import java.lang.reflect.Field;
import java.util.*;
import java.util.logging.Logger;

public class main extends JavaPlugin implements Listener {
	private Logger log;
	private Map<Material, Integer> originalStackSizes = new HashMap<>();;
	
	
	//Initilisation
	java.lang.Override
	public void onEnable() {
		this.log = this.getLogger();
		this.log.info("Maxstacksize plugin is being initialised");
		this.saveDefaultConfig();
		this.getServer().getPluginManager().registerEvents(this, this);
		this.setupAllStackSizes();
		this.getCommand("maxstacksize").setExecutor(new commands(this));
		this.getCommand("maxstacksize").setTabCompleter(new tabcomplete(this));
	}
	
	//Plugin reload
	public void reload() {
		this.resetAllStackSizes ();
		this.reloadConfig();
		this.setupAllStackSizes();
		this.getCommand("maxstacksize").setExecutor(new commands(this));
		this.getCommand("maxstacksize").setTabCompleter(new tabcomplete(this));
	}

	//Stop script
	@java.lang.Override
	public void onDisable() {
		this.resetAllStackSizes();
		this.log.info("Maxstacksize successfully disabled.");
	}
	
	//Perm denied console
	public void permissionDenied(CommandSender sender) {
		this.log.info(ChatColor.RED + "" + sender.getName() + " was denied access.");
		
	}
