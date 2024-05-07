public class MineFly extends JavaPlugin implements Listener {

@Override
  public void onEnable() {
    if (alias.equalsIgnoreCase("MineFly")){
      if (args.length == 0){ //If there are no args, do this:
      sender.sendMessage(ChatColor.RED + "Missing arguments");
      } else {
        if (args [0].equalsIgnoreCase("reload")){ //If argument "reload" is present, do this:
          reloadConfig();
          sender.sendMessage(ChatColor.GREEN + "MineFly was successfully reloaded");
        }
      }
    }
  }
} //Did I use too many brackets
