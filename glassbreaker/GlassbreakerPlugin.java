package com.Fjc.InstantGlassBreak.InstantGlassBreak


import org.spigot.plugin.java.JavaPlugin;

public class GlassbreakerPlugin extends JavaPlugin implements Listener {
	//Startup
	@Override
	public void onEnable(){
		this.log = getLogger();
		this.log.info("Starting plugin!");
		
	}
	//Shutdown
	@Override
	public void onDisable(){
		this.log = this.getLogger();
		this.log.info("Plugin was successfully disabled")
		
	}
	
	
}
