import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.plugin.java.JavaPlugin;

public class MineFly extends JavaPlugin {

    @Override
    public void onEnable() {
        // This line should register the commands, hopefully
        this.getCommand("minefly").setExecutor(new MineFlyCommandExecutor(this));
    }
}

class MineFlyCommandExecutor implements CommandExecutor {

    private final MineFly plugin;

    public MineFlyCommandExecutor(MineFly plugin) {
        this.plugin = plugin;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (label.equalsIgnoreCase("minefly")) {
            if (args.length == 0) {
                sender.sendMessage(ChatColor.RED + "Missing arguments");
            } else {
                if (args[0].equalsIgnoreCase("reload")) {
                    plugin.reloadConfig();
                    sender.sendMessage(ChatColor.GREEN + "MineFly was successfully reloaded");
                }
            }
            return true;
        }
        return false;
    }
} //I think I fixed the brackets. Hip hip horray
