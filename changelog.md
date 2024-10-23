Changelog 6/13

- Ghast spawn rates increased
- Ghast quest nerfed
- RTP portal cooldown removed
- Fixed a bug where the RTP portal at spawn would teleport you to a fixed location
- Restored local chat (/local)
- Fixed an issue with claim block trading
- Removed armor stand cloning due to a dupe
- Fixed a bug that allowed you to bypass claims using armor stands
- Restored /xpbottle (Syntax: /xpbottle [amount])

Emperor prices were changed:
- 10 days - 400k --> 325k
- 30 days - unchanged
- 90 days - 2M --> 1.5M

Currently known bugs:
- Resetting quests doesn't respect balance. If someone has below the required balance, the command will still execute. Disabled for now.


Planned Changelog (deprecated):
- Allow greater stacking of ender pearls, signs, etc. [done]
- Prevent pets from stacking [fixed]
- Fix bug where quests don't give a reward after completion [fixed]
- Fix bug where resetting quests doesn't respect balance
- Allow faster break speed while flying [waiting on upgrade]
- Add artificial server stock to prevent easy price gouging. This will alow allow for more lenient prices.
- Allow for only end island resets, instead of the whole end [waiting on upgrade]
- Bring back HeadsPlus kill challenges [ongoing]
  - Includes better rewards for each rankup (maybe exp boost or sell multiplier? or something else? have not decided yet)
  - Bug that instantly ranked you up to max (i think is bedrock) is now gone [done, XP reqs raised]
  - Suffix for each select rank [ongoing]
  - New bosses that will accompany the tiering system and provide custom rewards (~~currently phantom and zombie is planned~~)(phantom is scrapped, zombie and ravager bosses are in preparation)
- New suffix for players marked afk [done, needs more testing]
- Add /online command for #aurora channel
- Add /dump command to dump inventory items into chests
- Move information slots in /quests to the middle of the GUI

Changelog 6/17
Imperium Combat Update (BETA)

New bosses and combat mechanics are now available
The following bosses are available:
Hasty Goblin (miniboss)
Strengthened Ravager (miniboss)
Terminator
Evolved Inferno
Vorpal Spirit Master
Elemental Water Fairy (advanced)
For now, spawning a boss requires you to complete a boss quest (they are in the bottom 2 tiles in /quests). You'll receive a spawn egg which allows you to spawn the boss anytime. More boss information also exists at the bottom of the GUI in /quests.
Some bosses are harder than others, and may not be beginner friendly. Don't expect all the bosses to be a cakewalk.
There are also new custom items that can be obtained from killing these bosses. Most notably, the Hasty Goblin Pickaxe, Bloodied Axe, and Sylvetta Longbow. These items have custom mechanics that allow for much greater damage distribution if used correctly. More detailed information on these items will be available soon.

Remember that this system is still in beta and may suddenly change
Some other changes:
- Totems, ender pearls, signs, and minecarts are now stackable (8, 32, 32, 16 respectively)
- Fixed a bug where some pets would itemstack on themselves
- Fixed an issue with quests that would prevent rewards
- AFK status is now shown as a suffix on tab
- Obsidian Trident chance in obsidian crate was reduced

Known Bugs:
- Some bosses may randomly disappear [mostly fixed, elemental water fairy may still do this since it's based on a passive mob]
- Boss egg is lost if inv is full
- Some players lose access to /god after killing a boss (usually happens when player abandons boss instead of killing)
- Players without Emperor gain access to /god after killing a boss [fixed]
- Quest resetting still not working
- Vorpal Spirit Master boss drains durability at an unreasonable rate
- Hasty Goblin fireball not working correctly
- Dragon pet is not working

Planned Changelog:
- Fix bug where resetting quests don't respect balance
- Allow faster break speed while mining [waitng on upgrade]
- Upgrade to EconomyShopGUI Premium for easier price control
- Allow for only main end island resets, instead of the whole end [waiting on upgrade]
- Add /dump command for inventory dumping into chests
- Balance certain bosses [done]
- Add proper rewards for tier upgrades [ongoing]
- Cooldown indicator for pets [ongoing, working with API]
- Significant reduction of lag (with the new hardware should be nonexistant)

Changelog 8/18:
- Fixed a bug where resetting quests would ignore balance (moved to /resetquests)
- Fixed a bug where Pioneer Pickaxe would destroy blocks in protected regions
- Antimatter Void Pickaxe custom durability was replaced with regular dura, lvl 300 requirement instead needed for use
- Some custom skills/gear no longer work (or only work partially) in the arena
- New Draconic Strongbow custom item is now available from Elemental Vex Fairy
- Molten Chestplate was nerfed
- Blackbelt was slightly nerfed
- Space Marine Boots were modified, and slow falling effect was removed
- Emperor expiration timer is now present both in tab and in /emperor (you need emperor rank to access either)
- Devoted Void Priest was slightly nerfed
- Netherite cost to craft Devoted Void Priest was reduced
- Some custom items can be previewed in /bosspreviews (not finished yet)
- Added raccoon pet
- Fixed dragon pet

Also, your data will be transferred to the new server hardware once the upgrade starts.

Current Changelog Priority:
- Fix claimblocks in /trade OR add another method of trading claimblocks
- Fix afk plugin
- Reintroduce fish pet
- More balancing on custom gear
- Inventory dump feature
- More additions to /bosspreview

Next planned updates (not final):
- Integrate EconomyShopGUI API into autosell [ongoing [Fj]]
- Integrate Headsplus API into autosell [ongoing [Fj]]
- Fix backend code for RocketPropelledMinecarts [done [Fj]]
- Fix bug with eggs on the offhand breaking the boss [ongoing [Fj]]
- Persistent invisible item frames [not started [Fj, Astra]]]
- More balancing on boss gear [mostly done. Gold/obby/bedrock gear now uses custom calc.]
- Fix Telepathy enchant breaking certain mechanics [ongoing [Fed]]]
- Add SQL integration for CoreProtect [ongoing [Fed, Jane]]
- More quest options [not available yet [Astra]]
- Fix damage indicator being stuck on screen [done [Rat]]
- Import new custom model data [ongoing [Rat]]
- Fix bug with armor stands spamming ticks on magma/fire [ongoing [Rat, Fj]]
- Claim flags [not started yet [Astra]]
- More homes [Astra]

Priority (in order):
- Autosell APIs
- SQL integration
- Persistent invis item frames
- Boss gear balancing
- Claim flags
- More quest options
- everything else
