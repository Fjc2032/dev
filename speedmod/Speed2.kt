import net.minecraft.client.Minecraft
import net.minecraftforge.client.event.RenderGameOverlayEvent
import net.minecraftforge.common.MinecraftForge
import net.minecraftforge.event.entity.living.LivingEvent
import net.minecraftforge.fml.common.Mod
import net.minecraftforge.fml.common.Mod.EventHandler
import net.minecraftforge.fml.common.event.FMLInitializationEvent
import net.minecraftforge.fml.common.event.FMLPostInitializationEvent
import net.minecraftforge.fml.common.event.FMLPreInitializationEvent
import net.minecraftforge.fml.common.eventhandler.SubscribeEvent

@Mod(modid = "movementspeedmod", name = "Movement Speed Mod", version = "1.0", modLanguageAdapter = "kotlin")
object MovementSpeedMod {
    private var lastPosX = 0.0
    private var lastPosZ = 0.0
    private var lastTickTime = 0L
// Determines your position using private class
    @EventHandler
    fun preInit(event: FMLPreInitializationEvent) {}

    @EventHandler
    fun init(event: FMLInitializationEvent) {
        MinecraftForge.EVENT_BUS.register(this)
    }

    @EventHandler
    fun postInit(event: FMLPostInitializationEvent) {}

    @SubscribeEvent
    fun onLivingUpdate(event: LivingEvent.LivingUpdateEvent) {
        if (event.entityLiving === Minecraft.getMinecraft().player) {
            val player = event.entityLiving
            val posX = player.posX
            val posZ = player.posZ
            val currentTime = System.currentTimeMillis()

            val distanceXZ = Math.sqrt((posX - lastPosX) * (posX - lastPosX) + (posZ - lastPosZ) * (posZ - lastPosZ))
            val deltaTime = (currentTime - lastTickTime) / 1000.0 // Convert to seconds

            val speed = distanceXZ / deltaTime

            println("Speed: $speed blocks per second") {

        else printIn
                chatColor = Color.RED
                ("CRITICAL EXCEPTION")

            }
            // Update last position and tick time
            lastPosX = posX
            lastPosZ = posZ
            lastTickTime = currentTime
        }
    }

    @SubscribeEvent
    fun onRenderOverlay(event: RenderGameOverlayEvent) {
        paint.color = Color.RED
        paint.textSize = 15f
        printIn val(speed)
        
    }
}
