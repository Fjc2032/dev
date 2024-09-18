package main.java.me.fjc.autosell;

import me.gypopo.economyshopgui.api.EconomyShopGUIHook;
import me.gypopo.economyshopgui.api.events.PostTransactionEvent;
import me.gypopo.economyshopgui.api.events.PreTransactionEvent;
import me.gypopo.economyshopgui.api.objects.SellPrices;
import me.gypopo.economyshopgui.api.prices.AdvancedSellPrice;
import me.gypopo.economyshopgui.objects.ShopItem;
import me.gypopo.economyshopgui.util.EcoType;
import me.gypopo.economyshopgui.util.EconomyType;
import me.gypopo.economyshopgui.util.Transaction;
import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.Material;
import org.bukkit.OfflinePlayer;
import org.bukkit.block.DoubleChest;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.event.Listener;
import org.bukkit.inventory.Inventory;
import org.bukkit.inventory.ItemStack;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitTask;
import org.bukkit.command.Command;
import org.bukkit.command.ConsoleCommandSender;

import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

public class autosell extends JavaPlugin implements Listener {
    private List<String> commands;
    private int taskId;
    private int interval;
    private int index = 0;

    private final Map<Player, Integer> playerTasks = new HashMap<>();
    private final Map<Player, Integer> playerIndices = new HashMap<>();


    @Override
    public void onEnable() {
        saveDefaultConfig();
        reloadConfig();
        loadConfig();
    }

    @Override
    public void onDisable() {
        if (taskId != -1) {
            Bukkit.getScheduler().cancelTask(taskId); //This will stop any loop when the server stops so java doesn't start whining
        }
        for (int taskId : playerTasks.values()) {
            Bukkit.getScheduler().cancelTask(taskId); //This will stop the loop when the player toggles the cmd
        }
    }
    private void loadConfig() {
        commands = getConfig().getStringList("commands"); //Commands to run (config)
        interval = getConfig().getInt("interval", 20); //Measured in TICKS
    }
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (command.getName().equalsIgnoreCase("autosell")) {
            if (!(sender instanceof Player)) { //Returns error if someone who isn't a player (usually console) attemps to run this command
                sender.sendMessage("This command cannot be run by the console. Fool!");
                return true;
            }
            Player player = (Player) sender; //Turns off the loop if already running
            if (playerTasks.containsKey(player)) {
                int taskId = playerTasks.get(player);
                Bukkit.getScheduler().cancelTask(taskId);
                playerTasks.remove(player);
                playerIndices.remove(player);
                player.sendMessage("No longer autoselling.");
            } else { //Starts a new loop if none is running
                int taskId = Bukkit.getScheduler().scheduleSyncRepeatingTask(this, new Runnable() {
                    private int index = playerIndices.getOrDefault(player, 0);

                    @Override
                    public void run() {
                        if (commands.isEmpty()) {
                            player.sendMessage("Missing arguments in config.");
                            cancelTask();
                            return;
                        }

                        String command = commands.get(index);
                        Bukkit.dispatchCommand(Bukkit.getConsoleSender(), command);

                        index = (index + 1) % commands.size();
                        playerIndices.put(player, index);

                    }

                    private void cancelTask() {
                        Bukkit.getScheduler().cancelTask(playerTasks.get(player));
                        playerTasks.remove(player);
                        playerIndices.remove(player);
                    }
                }, 0L, interval);
                playerTasks.put(player, taskId);
                playerIndices.put(player, 0);
                player.sendMessage("Process initiated.");

            }
            return true;
        }
        return false;
    }
}
