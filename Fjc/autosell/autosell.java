package me.fjc.autosell;

import me.clip.placeholderapi.PlaceholderAPI;
import org.bukkit.Bukkit;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.command.Command;
import org.jetbrains.annotations.NotNull;

import java.util.*;
import java.util.List;

public class Autosell extends JavaPlugin implements Listener {
    private List<String> commands;
    private int taskId = -1;
    private int interval;
    private int index = 0;

    private final Map<Player, Integer> playerTasks = new HashMap<>();
    private final Map<Player, Integer> playerIndices = new HashMap<>();


    @Override
    public void onEnable() {
        saveDefaultConfig();
        reloadConfig();
        loadConfig();
        getServer().getPluginManager().registerEvents(this, this);

        if (getServer().getPluginManager().isPluginEnabled("PlaceholderAPI")) {
            getLogger().info("Successfully linked up with PAPI.");
        } else {
            getLogger().severe("Uh oh! Could not find PAPI! Disabling plugin for safety measures!");
            getServer().getPluginManager().disablePlugin(this); //Disables the plugin if PlaceholderAPI is not detected.
            return;
        }
        getLogger().info("Autosell fully loaded. Great job!");
    }

    @Override
    public void onDisable() {
        if (taskId != -1) {
            Bukkit.getScheduler().cancelTask(taskId); //This will stop any loop when the server stops so java doesn't start whining
        }
        for (int taskId : playerTasks.values()) {
            Bukkit.getScheduler().cancelTask(taskId); //This will stop the loop when the player toggles the cmd
        }
        getLogger().info("Disabling plugin Autosell... goodnight");
    }

    private void loadConfig() {
        commands = getConfig().getStringList("commands"); //Commands to run (config)
        interval = getConfig().getInt("interval", 20); //Measured in TICKS
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (command.getName().equalsIgnoreCase("autosell")) {
            /*if (!(sender instanceof Player)) { //Returns error if someone who isn't a player (usually console) attemps to run this command
                sender.sendMessage("This command cannot be run by the console. Fool!");
                return true;
                //Removed console check cause apparently im bad with coding (true statement)
            }*/
            Player player = (Player) sender; //Turns off the loop if already running
            if (!player.hasPermission("fjc.autosell")) {
                player.sendMessage("No permissions! Laughable!");
                return true;
            }
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
                        command = usePlaceholder(player, command);
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
        } else if (command.getName().equalsIgnoreCase("autosellreload")) {
            if (!(sender instanceof Player) || sender.hasPermission("fjc.autosell.reload")) {
                reloadConfig();
                loadConfig();
                sender.sendMessage("BOOM!! Successful reload!");
                return true;
            } else {
                sender.sendMessage("No perms! Loser!");
                return true;
            }
        }
        return false;
    }

    public String usePlaceholder(Player player, String placeholder) {
        String result = PlaceholderAPI.setPlaceholders(player, placeholder);
        return result != null ? result : "Placeholder was not found";
    }

    @EventHandler
    public void onPlayerQuit(PlayerQuitEvent event) {
        if (taskId != -1) {
            Player player = event.getPlayer();
            if (playerTasks.containsKey(player)) {
                int taskId = playerTasks.get(player);
                Bukkit.getScheduler().cancelTask(taskId);
                playerTasks.remove(player);
                playerIndices.remove(player);
                player.sendMessage("Autosell process was terminated due to logout.");
                return;
            }

        }
    }

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        if (taskId != -1) {
            Player player = event.getPlayer();
            if (playerTasks.containsKey(player)) {
                int taskId = playerTasks.get(player);
                Bukkit.getScheduler().cancelTask(taskId);
                playerTasks.remove(player);
                playerIndices.remove(player);
                player.sendMessage("Previous autosell process terminated to prevent double looping. Thank me later.");
                return;
            }
        }

    }
    public boolean Command() {
        return getCommand("autosell").getName().equalsIgnoreCase("autosell");
    }
}

