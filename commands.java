package maxstacksize;


import org.bukkit.ChatColor;
import org.bukkit.command.Command
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;

public class commands implements CommandExecutor {
	// Plugin initilisation
	private main pluginInstance;
	
	commands (main pluginInstance) {
		this.pluginInstance = pluginInstance;
	}
	
	public boolean onCommand(CommandSender sender, Command cmd, String label, String [] args) {
		if (!label.equalsIgnoreCase("maxstacksize") && !label.equalsIgnoreCase("mss)) {
			return false;
		}
		
		//Help prompt dev
		if (args.length ==0) {
			if (!sender.hasPermission("maxstacksize.reload") && !sender.hasPermission("maxstacksize.modify") && !sender.hasPermission("maxstacksize.view")) {
				sender.sendMessage(ChatColor.ORANGE + "You do not have the proper permissions to run this command.");
				pluginInstance.permissionDenied(sender);
				return false;
			}
			sender.sendMessage(ChatColor.DARK_GREEN + "You have access to the following commands:");
			if (sender.hasPermission("maxstacksize.reload")) {
				sender.sendMessage(ChatColor.GREEN + "/" + label + " reload" + ChatColor.WHITE + ": reloads the configuration.");
			}
			if (sender.hasPermission("maxstacksize.modify")) {
				sender.sendMessage(ChatColor.GREEN + "/" + label + " set <item> <size>" + ChatColor.WHITE + "sets 1 64 integer for select item.");
			}
			if (sender.hasPermission("maxstacksize.view")) {
				sender.sendMessage(ChatColor.GREEN + "/" + label + " display <item>" + ChatColor.WHITE + ": displays custom stack size of item.");
				sender.sendMessage(ChatColor.GREEN + "/" + label + " list" + ChatColor.WHITE + ": displays all items with custom stack size.");
			}
			return false;
		}
		
		//Stacksize set
		else if (args[0].equalsIgnoreCase("set")) {
			if (!sender.hasPermission("maxstacksize.modify")) {
				sender.sendMessage(ChatColor.ORANGE + "You do not have the proper permissions to run this command.");
				pluginInstance.permissionDenied(sender);
				return false;
				
			}
			
			if (args.length !=3) {
				sender.sendMessage(ChatColor.BLUE + "Usage: /" + label + " set <item> <size>");
				pluginInstance.permissionDenied(sender);
				return false;
				
			}
			
			return !pluginInstance.setStackCommand(sender, args[1].toLowerCase();, args[2]);
			
		}
		//Stacksize reset
		else if  (args[0].equalsIgnoreCase("reset")) {
			if (!sender.hasPermission("maxstacksize.modify")) {
				sender.sendMessage(ChatColor.ORANGE + "You do not have the proper permissions to run this command.");
				pluginInstance.permissionDenied(sender);
				return false;
				
			}
			
			if (args.length !=2) {
				sender.sendMessage(ChatColor.BLUE + "Usage: /" + label + " set <item> <size>");
				return false;
				
			}
			
			return !pluginInstance.resetStackCommand(sender, args[1].toLowerCase()));
			
		}
		//Reload
		if (args[0].equalsIgnoreCase("reload")) {
			if (!sender.hasPermission(maxstacksize.reload")) {
				sender.sendMessage(ChatColor.ORANGE + "You do not have the proper permissions to run this command.");
				pluginInstance.permissionDenied(sender);
				return false;
				
			}
			if (args.length !=1) {
				sender.sendMessage(ChatColor.BLUE + "Usage: /" + label + " reload");
				return false;
				
			}
			pluginInstance.reload();
			sender.sendMessage(ChatColor.GREEN + "Successful reload!");
			return true;
			
		}
		//DisplayMode
		else if (args[0].equalsIgnoreCase("display")) {
			if (!sender.hasPermission("maxstacksize.view")) {
				sender.sendMessage(ChatColor.ORANGE + "You do not have the proper permissions to run this command.");
				pluginInstance.permissionDenied(sender);
				return false
				
			}
			
			if (args.length != 2) {
				sender.sendMessage(ChatColor.BLUE + "Usage: /" + label + " display <item>");
				return false
				
			}
			
			return !pluginInstance.display(sender, args[1].toUpperCase());
			
		}
		
		//List
		else if (args[0].equalsIgnoreCase("list")) {
			if (!sender.hasPermission("maxstacksize.view")) {
				sender.sendMessage(ChatColor.ORANGE + "You do not have the proper permissions to run this command.");
				pluginInstance.permissionDenied(sender);
				return false;
				
			}
			
			if (args.length !=1) {
				sender.sendMessage(ChatColor.BLUE + "Usage: /" + label + " list");
				return false;
				
			}
			
			pluginInstance.list(sender);
			return true;
			
		}
		
		//Invald arguments
		else {
			sender.sendMessage(ChatColor.RED + "Invalid command!");
			return false;
			
		}
	}
}
