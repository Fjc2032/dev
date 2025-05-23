const { Client, Collection, Events, GatewayIntentBits, ButtonComponent, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, PermissionOverwrites, ChannelType, PermissionsBitField, TextChannel, GuildChannel, TimestampStyles, Message, Partials, AuditLogEvent, messageLink, hyperlink, Guild } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({ 
    intents: 
    [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
    partials:
    [Partials.Channel, Partials.GuildMember, Partials.Message],
 });

client.commands = new Collection();

const fs = require('node:fs');
const path = require('node:path');
const { error } = require("node:console");
const { channel } = require("node:diagnostics_channel");

const cmd = require("./commands/utility/cmd.js");
const ticketcmd = require("./commands/utility/ticketcmd.js");
const rules = require("./commands/utility/rules.js");
const suggestionbox = require("./commands/utility/suggestionbox.js");
const allowrename = require("./commands/utility/allowrename.js");
const handbook = require("./commands/utility/handbook.js");

client.login(token);

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');
const ticketdb = new sqlite3.Database('ticketdatabase.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS suggestions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT NOT NULL,
        title TEXT NOT NULL,
        suggestion TEXT NOT NULL,
        date TEXT NOT NULL,
        upvotes INTEGER DEFAULT 0,
        downvotes INTEGER DEFAULT 0,
        messageId TEXT
    )`);
})
ticketdb.serialize(() => {
    ticketdb.run(`CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT NOT NULL,
        bugtype TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL
        )`);
})

client.once('ready', async () => {
    console.log('Online!');
    await allowrename.register();
    await cmd.register();
    await ticketcmd.register();
    await handbook.register();
    await rules.register();
    await suggestionbox.register();
    await ticketcmd.register();
});

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[Warning]: Filepath ${filePath} is missing the data or execute property.`);
        }
    }
}

//let maxId = ticketdb.exec("SELECT MAX(id) FROM tickets");
//let tickerVar = maxId[0]['MAX(id'];
//if (tickerVar == 0 || tickerVar == null) {
//    tickerVar = 1;
//}


const time = new Date().toString();

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand() && !interaction.isModalSubmit() && !interaction.isButton()) return;


    try {
        if (interaction.isCommand()) {
            console.log(interaction);
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            if (interaction.commandName === 'suggest') {
                const newModal = new ModalBuilder()
                    .setCustomId('suggestions')
                    .setTitle('Suggestions');
                const textTitle = new TextInputBuilder()
                    .setLabel("Name of Suggestion")
                    .setCustomId("suggestion_title")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Suggestion name')
                    .setMinLength(0)
                    .setMaxLength(40)
                    .setRequired(true);

                const textBody = new TextInputBuilder()
                    .setCustomId('suggestion_body')
                    .setLabel('Describe.')
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder('All rules apply.')
                    .setMinLength(0)
                    .setMaxLength(500)
                    .setRequired(true);

                const newRow = new ActionRowBuilder().addComponents(textTitle);
                const newRow1 = new ActionRowBuilder().addComponents(textBody);
                newModal.addComponents(newRow, newRow1);

                await interaction.showModal(newModal);
            }

            if (interaction.commandName === 'generateticketembed') {
                if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) return;
                const ticketEmbedHelp = new EmbedBuilder()
                    .setColor('ffffff')
                    .setTitle('**Tickets**')
                    .setDescription('To open a ticket, click one of the buttons below that match with what you want.\n\nOnce you open your ticket, a moderator or developer will come to your assistance when they have time.\nStaff are not always online, so we appreciate your patience.')
                    .setFooter({ text: 'Imperium Tickets, built by Fjc' });

                const bugReportButton = new ButtonBuilder()
                    .setCustomId('bugreportbutton')
                    .setLabel('Bug Report')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🔧');
                const playerReportButton = new ButtonBuilder()
                    .setCustomId('playerreportbutton')
                    .setLabel('Player Report')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🔨');
                const banAppealButton = new ButtonBuilder()
                    .setCustomId('banappealbutton')
                    .setLabel('Ban Appeal')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('📝');
                const otherSupportButton = new ButtonBuilder()
                    .setCustomId('othersupportbutton')
                    .setLabel('Other')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🎟️');

                const generateEmbed = new ActionRowBuilder().addComponents(bugReportButton, playerReportButton, banAppealButton, otherSupportButton);
                await interaction.channel.send({ embeds: [ticketEmbedHelp], components: [generateEmbed] });
            }
            if (interaction.commandName === 'exportrules') {
                if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) return;
                const rulesEmbed = new EmbedBuilder()
                    .setColor('ffffff')
                    .setTitle('Rules')
                    .addFields(
                        {name: 'Be Respectful', value: 'Address everyone in a friendly and respectful manner. Don\'t be rude, discriminate,\nor engage in any damaging or hurtful behavior.'},
                        {name: 'Be Appropriate', value: 'Interact in ways that do not damage the experience of others. Avoid bad language,\nspam, or any inappropriate behavior or topic, regardless if its towards another\nuser or not.'},
                        {name: 'Keep It English', value: 'Only communicate in English so that our staff members can\n moderate the chat and help guarantee a fun and safe environment for everyone.'},
                        {name: 'No Advertisement', value: 'Advertisement or promoting of any kind is not allowed.'},
                        {name: 'Listen to Staff', value: 'Staff have full discretion in the interpretation and enforcement of the rules.\nPlease do not argue with staff and be considerate of their time.\nStaff will assist you as soon as they\'re ready.'},
                        {name: 'Imperium Server Policies & Guidelines', value: 'https://docs.google.com/document/d/1RrVFlsro43ga00CsyqZFp3yLt7TQawAHbpsy0cVpGTI/edit?usp=sharing'},
                        {name: 'Discord\'s Terms of Service', value: 'https://discord.com/terms'}
                    );
                await interaction.channel.send({embeds: [rulesEmbed]});
            }
            if (interaction.commandName === 'generatesuggestionbox') {
                if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) return;
                const suggestionEmbed = new EmbedBuilder()
                .setColor('ffffff')
                .setTitle('Suggestions')
                .setDescription('Have a suggestion? Let us know.')
                .addFields(
                    {name: '', value: 'We value your input. We will always try to consider every suggestion, but\nkeep in mind that we cannot guarantee every suggestion will be implemented.'},
                    {name: 'Rules Apply', value: 'Follow the general guidelines when making a suggestion.\nTroll suggestions will likely be ignored.'},
                    {name: 'Feedback', value: 'Usually, a developer will make a response/decision for each suggestion, in order.\nYou can look in the <#1213868063900962836> channel to see our feedback.\nPlease, do not pressure devs about a suggestion. We do see them but are not always able to respond immediately.'},
                    {name: '', value: 'You can still use the /suggest command to make a suggestion.'}
                );
                const suggestionButton = new ButtonBuilder()
                .setCustomId('suggestionbox')
                .setLabel('New Suggestion')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('💡');
                const generateBox = new ActionRowBuilder().addComponents(suggestionButton);
                await interaction.channel.send({embeds: [suggestionEmbed], components: [generateBox]});
            }
            if (interaction.commandName === 'exporthandbook') {
                if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) return;
                const handbookEmbed = new EmbedBuilder()
                .setColor('ffffff')
                .setTitle('Guidelines')
                .setDescription('Guidelines that staff should adhere by.')
                .addFields(
                    {name: 'Staff Guidelines', value: 'https://docs.google.com/document/d/1CBuYg0yEd-EOhNej3_iqbUrl6zSpJOV2lDC34bwOQEM/edit'},
                    {name: 'Punishment Guidelines', value: 'https://docs.google.com/document/d/1-kE1IEUPkuOlUmaTmN0_u4JDVVz9bmuLHZHKkOitjfc/edit'}
                );
                await interaction.channel.send({embeds: [handbookEmbed]});
            }
            if (interaction.commandName === 'ip') {
                await interaction.reply({content: '185.249.196.226', ephemeral: true});
            }
            if (interaction.commandName === 'rename') {
                //let value = allowrename.data.addStringOption(option => option.setName('rename_value'));
                let scope = await interaction.options.getString('rename_value');
                let target = interaction.channel;
                let categoryID = '1193580226266013738';
                let category = interaction.guild.channels.cache.get(categoryID);

                if (!category) {
                    category = await interaction.guild.channels.fetch(categoryID);
                }

                if (!category) {
                    await interaction.reply({content: 'Category not found, or does not exist.', ephemeral: true});
                    return;
                }

                if (target.parentId !== category.id) {
                    await interaction.reply({content: 'This command can only be used for tickets.', ephemeral: true});
                    return;
                }

                if (scope === '') {
                    await interaction.reply({content: 'The scope cannot be empty, silly.', ephemeral: true});
                    return;
                }

                console.log(`Value: ${scope}`);

                try {
                await target.setName(scope);
                await interaction.reply({content: `Successfully renamed the channel to ${scope}`, ephemeral: true});
                } catch (error) {
                    console.log(error);
                    await interaction.reply({content: 'It appears something has went wrong! Contact a developer.', ephemeral: true});
                }

            }
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'suggestions') {
                const suggestionMessage = interaction.fields.getTextInputValue('suggestion_body');
                const suggestionTitle = interaction.fields.getTextInputValue('suggestion_title');

                db.run(`INSERT INTO suggestions (user, title, suggestion, date) VALUES (?, ?, ?, ?)`,
                 [interaction.user.username, suggestionTitle, suggestionMessage, new Date().toLocaleString()],
                 function(err) {
                    if (err) {
                        return console.error(err.message);
                    }
                    const suggestionId = this.lastID;
                 }   
                )
                const suggestionChannel = interaction.guild.channels.cache.find(ch => ch.name === 'suggestions');
                const suggestions = JSON.parse(fs.readFileSync('suggestions.json', 'utf-8'));

                suggestions.push({
                    user: interaction.user.username,
                    title: suggestionTitle,
                    suggestion: suggestionMessage,
                    date: new Date(),
                    upvotes: 0,
                    downvotes: 0,
                    messageId: ''
                });

                fs.writeFileSync('suggestions.json', JSON.stringify(suggestions, null, 2));

                if (suggestionChannel) {
                    const embedMessage = new EmbedBuilder()
                        .setColor('#ffffff')
                        .setTitle(`**${suggestionTitle}**`)
                        .setDescription(suggestionMessage)
                        .addFields(
                            { name: 'Submitted by', value: interaction.user.username, inline: true },
                            { name: 'Upvotes', value: '0', inline: true },
                            { name: 'Downvotes', value: '0', inline: true }
                        )
                        .setFooter({ text: new Date().toLocaleString() })
                        .setThumbnail(interaction.user.displayAvatarURL({ size: 128 }));

                    const upvoteButton = new ButtonBuilder()
                        .setCustomId('upvote')
                        .setLabel('Upvote')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji("<icons_Correct:1068604820354764841>");
                    const downvoteButton = new ButtonBuilder()
                        .setCustomId('downvote')
                        .setLabel('Downvote')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji("<icons_Wrong:1068604823450165329>");
                    const buttonRow = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton);

                    suggestionChannel.send({ embeds: [embedMessage], components: [buttonRow] })
                        .then(sentMessage => {
                            const suggestion = suggestions.find(s => s.title === suggestionTitle && s.suggestion === suggestionMessage);

                            if (suggestion) {
                                suggestion.messageId = sentMessage.id;
                                fs.writeFileSync('suggestions.json', JSON.stringify(suggestions, null, 2));
                            } else {
                                console.error('Suggestion not found to update messageId');
                            }
                        });
                        db.run(`UPDATE suggestions SET messageId = ? WHERE id = ?`, [sentMessage.id, suggestionId], (err) => {
                            if (err) return console.error(err.message)
                        });
                } else {
                    await interaction.followUp('No suggestions channel found! You should make one.');
                }
                await interaction.reply('You have successfully submitted a new suggestion.');
            }
            if (interaction.customId === 'bugreport') {
                const categoryId = '1193580226266013738';
                const category = interaction.guild.channels.cache.get(categoryId);
                if (!category) return console.error('Category not found.');


                const channelName = ('ticket-bugreport-' + interaction.user.username);

                const getIGN = interaction.fields.getTextInputValue('bug-playername');
                const bugReportTitle = interaction.fields.getTextInputValue('bugreporttitle');
                const bugReportBody = interaction.fields.getTextInputValue('bugreportbody');

                const bugReportEmbed = new EmbedBuilder()
                        .setColor('ffffff')
                        .setTitle(`Bug Report`)
                        .setDescription('Thank you for submitting a bug report.\nA developer will be with you shortly.\nThanks for your patience.')
                        .addFields(
                            {name: `IGN`, value: `${getIGN}`},
                            {name: `Support needed`, value: `${bugReportTitle}`},
                            {name: `Details`, value: `${bugReportBody}`}
                        )
                        .setTimestamp()
                        .setFooter({text: 'Imperium Tickets, built by Fjc'});
                const closeButton = new ButtonBuilder()
                        .setCustomId('close-bug')
                        .setLabel('Close')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');
                const closeReasonButton = new ButtonBuilder()
                        .setCustomId('closeWithReason-bug')
                        .setLabel('Close With Reason')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔏');
                const closeSetBug = new ActionRowBuilder().addComponents(closeButton, closeReasonButton);

                let reason = interaction.fields.getTextInputValue("closeWithReason-bug");
                console.log(`Bug report closed with reason: ${reason}`)
                const newChannel = await category.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                
                        },
                        {
                            id: '1198731482684989652', //Senior Developer
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        },
                        {
                            id: '1192146668641079416', //Developer
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        },
                    ],
                });
                console.log(`Created channel ${channelName} in ${category.name}`);
                
                newChannel.send({embeds: [bugReportEmbed], components: [closeSetBug]});

                await interaction.reply({content: 'Bug report submitted successfully. A developer will be with you shortly.', ephemeral: true});

                
                ticketdb.run(`INSERT INTO tickets (user, bugtype, title, description) VALUES (?, ?, ?, ?)`,
                    [interaction.user.username, bugReportEmbed.data.title, `${bugReportTitle}`, `${bugReportBody}`],
                    function(err) {
                        if (err) {
                            return console.error(err.message);
                        }
                    });
            
                
                }
                if (interaction.customId === 'playerreport') {
                    const categoryId = '1193580226266013738';
                    const category = interaction.guild.channels.cache.get(categoryId);
                    if (!category) return console.error('Category not found.');
    
                    const channelName = ('ticket-playerreport-' + interaction.user.username);
    
                    const getIGN = interaction.fields.getTextInputValue('playerreport-playername');
                    const playerReportTitle = interaction.fields.getTextInputValue('playerreporttitle');
                    const playerReportBody = interaction.fields.getTextInputValue('playerreportbody');
                    const playerOfInterest = interaction.fields.getTextInputValue('player');
    
                    const playerReportEmbed = new EmbedBuilder()
                            .setColor('ffffff')
                            .setTitle('Player Report')
                            .setDescription('Thank you for submitting a player report. A staff member will be with you shortly.\nThanks for your patience.\n\nBe aware that falsely reporting a player can result in consequences.')
                            .addFields(
                                {name: `IGN`, value: `${getIGN}`},
                                {name: `Player of Interest`, value: `${playerOfInterest}`},
                                {name: `Report`, value: `${playerReportTitle}`},
                                {name: `Reason`, value: `${playerReportBody}`}
                            )
                            .setTimestamp()
                            .setFooter({text: 'Imperium Tickets, built by Fjc'});
                    const closeButton = new ButtonBuilder()
                            .setCustomId('close-report')
                            .setLabel('Close')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('🔒');
                    const closeButtonReason = new ButtonBuilder()
                            .setCustomId('closeWithReason-report')
                            .setLabel('Close With Reason')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('🔏');
                    const closeSetReport = new ActionRowBuilder().addComponents(closeButton, closeButtonReason);

                    let reason = interaction.fields.getTextInputValue("closeWtihReason-report");
                    console.log(`Player report closed with reason: ${reason}`);
    
                    const newChannel = await category.guild.channels.create({
                        name: channelName,
                        type: ChannelType.GuildText,
                        parent: category,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    
                            },
                            {
                                id: '1198731482684989652', //Senior Developer
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                            },
                            {
                                id: '1192171607486115880', //Senior Moderator
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                            },
                            {
                                id: '1192199600363290655', //Moderator
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                            },
                        ],
                    })
                    .then(console.log(`Created channel ${channelName} in ${category.name}`))
                    
                    newChannel.send({embeds: [playerReportEmbed], components: [closeSetReport]});
    
                    await interaction.reply({content: 'Player report submitted successfully. A staff member will be with you shortly.', ephemeral: true});

                    ticketdb.run(`INSERT INTO tickets (user, bugtype, title, description) VALUES (?, ?, ?, ?)`,
                        [interaction.user.username, playerReportEmbed.data.title, playerReportTitle, playerReportBody],
                        function(err) {
                            if (err) {
                                return console.error(err.message);
                            }
                        }
                    )
                        
                    
                    
                    
                }
                if (interaction.customId === 'banappeal') {
                    const categoryId = '1193580226266013738';
                    const category = interaction.guild.channels.cache.get(categoryId);
                    if (!category) return console.error('Category not found.');
    
                    const channelName = ('ticket-banappeal-' + interaction.user.username);
    
                    const banAppealtTitle = interaction.fields.getTextInputValue('banreason');
                    const banappealBody = interaction.fields.getTextInputValue('banreasonbody');
                    const playerOfInterest = interaction.fields.getTextInputValue('player');
    
                    const playerReportEmbed = new EmbedBuilder()
                            .setColor('ffffff')
                            .setTitle('Ban Appeal')
                            .setDescription('You have submitted a ban appeal. A moderator will be with you shortly.\nSubmitting a ban appeal does not guarantee your unban.\nClearly defend your position on why you should be unbanned,\nusing additional evidence if necessary.')
                            .addFields(
                                {name: 'IGN', value: `${playerOfInterest}`},
                                {name: `Ban Reason`, value: `${banAppealtTitle}`},
                                {name: `Reason(s) for wanting an unban`, value: `${banappealBody}`}
                            )
                            .setTimestamp()
                            .setFooter({text: 'Imperium Tickets, built by Fjc'});
                    const closeButton = new ButtonBuilder()
                            .setCustomId('close-appeal')
                            .setLabel('Close')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('🔒');
                    const closeButtonReason = new ButtonBuilder()
                            .setCustomId('closeWithReason-appeal')
                            .setLabel('Close With Reason')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('🔏');
                    const closeSetAppeal = new ActionRowBuilder().addComponents(closeButton, closeButtonReason);

                    let reason = interaction.fields.getTextInputValue("closeWtihReason-appeal");
                    console.log(`Player appeal closed with reason: ${reason}`);
    
                    const newChannel = await category.guild.channels.create({
                        name: channelName,
                        type: ChannelType.GuildText,
                        parent: category,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    
                            },
                            {
                                id: '1192171607486115880', //Senior Moderator
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                            },
                            {
                                id: '1192199600363290655', //Moderator
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                            },
                        ],
                    })
                    .then(console.log(`Created channel ${channelName} in ${category.name}`))
                    
                    newChannel.send({embeds: [playerReportEmbed], components: [closeSetAppeal]});
    
                    await interaction.reply({content: 'You have successfully requested a ban appeal. A moderator will be with you shortly.', ephemeral: true});
                                        
                    ticketdb.run(`INSERT INTO tickets (user, bugtype, title, description) VALUES (?, ?, ?, ?)`,
                        [interaction.user.username, `banappeal`, banAppealtTitle, banappealBody],
                        function(err) {
                            if (err) return console.error(err.message);
                        }
                    )
                }
                if (interaction.customId === 'othersupport') {
                    const categoryId = '1193580226266013738';
                    const category = interaction.guild.channels.cache.get(categoryId);
                    if (!category) return console.error('Category not found.');
    
                    const channelName = ('ticket-other-' + interaction.user.username);
    
                    const otherSupportTitle = interaction.fields.getTextInputValue('othersupporttitle');
                    const otherSupportBody = interaction.fields.getTextInputValue('othersupportbody');
                    const otherSupportPlayer = interaction.fields.getTextInputValue('othersupportplayer');
                    //const playerOfInterest = interaction.fields.getTextInputValue('player');
    
                    const otherSupportEmbed = new EmbedBuilder()
                            .setColor('ffffff')
                            .setTitle('Other')
                            .setDescription(`Thank you for submitting a ticket. A staff member will be with you shortly.`)
                            .addFields(
                                {name: 'IGN', value: `${otherSupportPlayer}`},
                                {name: `Type of Support`, value: `${otherSupportTitle}`},
                                {name: `Details`, value: `${otherSupportBody}`}
                            )
                            .setTimestamp()
                            .setFooter({text: 'Imperium Tickets, built by Fjc'});
                    const closeButton = new ButtonBuilder()
                            .setCustomId('close-other')
                            .setLabel('Close')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('🔒');
                    const closeButtonReason = new ButtonBuilder()
                            .setCustomId('closeWithReason-other')
                            .setLabel('Close With Reason')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('🔏');
                    const closeSetOther = new ActionRowBuilder().addComponents(closeButton, closeButtonReason);
    
                    let reason = interaction.fields.getTextInputValue("closeWithReason-other");
                    console.log(`Ticket closed with reason: ${reason}`);

                    const newChannel = await category.guild.channels.create({
                        name: channelName,
                        type: ChannelType.GuildText,
                        parent: category,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    
                            },
                            {
                                id: '1192171607486115880', //Senior Moderator
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                            },
                            {
                                id: '1192199600363290655', //Moderator
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                            },
                            {
                                id: '1198731482684989652', //Senior Developer
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                            },
                            {
                                id: '1192146668641079416', //Developer
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                            },
                        ],
                    })
                    .then(console.log(`Created channel ${channelName} in ${category.name}`))
                    
                    newChannel.send({embeds: [otherSupportEmbed], components: [closeSetOther]});
    
                    await interaction.reply({content: 'You have successfully created a ticket. Someone will be with you shortly.', ephemeral: true});
                                     
                    ticketdb.run(`INSERT INTO tickets (user, bugtype, title, description) VALUES (?, ?, ?, ?)`,
                        [interaction.user.username, `other`, otherSupportTitle, otherSupportBody],
                        function(err) {
                            if (err) return console.error(err.message);
                        }
                    )
                }

            }
            if (interaction.customId === 'closeReasonBug') {
                const channelTarget = interaction.channel;
                let messages = [];
                let lastMsgId;
                const messageArray = await channelTarget.messages.fetch({limit: 100});
                if (messageArray.size === 0) return;
                messages.push(...messageArray.map(msg => `[${msg.createdAt.toISOString()}] ${msg.author.tag}: ${msg.content}`));
                lastMsgId = messageArray.last().id;

                if (channelTarget) {
                    try {
                        let output = path.join(__dirname, 'ticket-archive', channelTarget.name + '.txt');
                        fs.mkdirSync(path.dirname(output), {recursive: true});
                        fs.writeFileSync(output, messages.reverse().join('\n'), 'utf-8');
                    } catch (error) {
                        console.warn('Something went wrong while attemping to write to the file!');
                        console.error(error);
                    }
                    console.log(`Selected channel ${channelTarget} for deletion.`);
                    channelTarget.delete();
                    console.log('Channel deleted.');
                }
            }
            if (interaction.customId === 'closeReasonReport') {
                const channelTarget = interaction.channel;
                let messages = [];
                let lastMsgId;
                const messageArray = await channelTarget.messages.fetch({limit: 100});
                if (messageArray.size === 0) return;
                messages.push(...messageArray.map(msg => `[${msg.createdAt.toISOString()}] ${msg.author.tag}: ${msg.content}`));
                lastMsgId = messageArray.last().id;

                if (channelTarget) {
                    try {
                        let output = path.join(__dirname, 'ticket-archive', channelTarget.name + '.txt');
                        fs.mkdirSync(path.dirname(output), {recursive: true});
                        fs.writeFileSync(output, messages.reverse().join('\n'), 'utf-8');
                    } catch (error) {
                        console.warn('Something went wrong while attemping to write to the file!');
                        console.error(error);
                    }
                    console.log(`Selected channel ${channelTarget} for deletion.`)
                    channelTarget.delete();
                    console.log('Channel deleted.');
                }
            }
            if (interaction.customId === 'closeReasonAppeal') {
                const channelTarget = interaction.channel;
                let messages = [];
                let lastMsgId;
                const messageArray = await channelTarget.messages.fetch({limit: 100});
                if (messageArray.size === 0) return;
                messages.push(...messageArray.map(msg => `[${msg.createdAt.toISOString()}] ${msg.author.tag}: ${msg.content}`));
                lastMsgId = messageArray.last().id;

                if (channelTarget) {
                    try {
                        let output = path.join(__dirname, 'ticket-archive', channelTarget.name + '.txt');
                        fs.mkdirSync(path.dirname(output), {recursive: true});
                        fs.writeFileSync(output, messages.reverse().join('\n'), 'utf-8');
                    } catch (error) {
                        console.warn('Something went wrong while attemping to write to the file!');
                        console.error(error);
                    }
                    console.log(`Selected channel ${channelTarget} for deletion.`)
                    channelTarget.delete();
                    console.log('Channel deleted.');
                }
            }
            if (interaction.customId === 'closeReasonOther') {
                const channelTarget = interaction.channel;
                let messages = [];
                let lastMsgId;
                const messageArray = await channelTarget.messages.fetch({limit: 100});
                if (messageArray.size === 0) return;
                messages.push(...messageArray.map(msg => `[${msg.createdAt.toISOString()}] ${msg.author.tag}: ${msg.content}`));
                lastMsgId = messageArray.last().id;

                if (channelTarget) {
                    try {
                        let output = path.join(__dirname, 'ticket-archive', channelTarget.name + '.txt');
                        fs.mkdirSync(path.dirname(output), {recursive: true});
                        fs.writeFileSync(output, messages.reverse().join('\n'), 'utf-8');
                    } catch (error) {
                        console.warn('Something went wrong while attemping to write to the file!');
                        console.error(error);
                    }
                    console.log(`Selected channel ${channelTarget} for deletion.`)
                    channelTarget.delete();
                    console.log('Channel deleted.');
                }
            }

        if (interaction.isButton()) {
            if (interaction.customId === 'bugreportbutton') {
                const bugTicketModalBuilder = new ModalBuilder()
                    .setCustomId('bugreport')
                    .setTitle('Ticket - Bug Report');
    
                const username = new TextInputBuilder()
                    .setCustomId('bug-playername')
                    .setLabel('Your IGN')
                    .setStyle(TextInputStyle.Short)
                    .setMinLength(0)
                    .setMaxLength(30)
                    .setRequired(true);

                const textTitle = new TextInputBuilder()
                    .setCustomId('bugreporttitle')
                    .setLabel("Title")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Title of your bug report")
                    .setMinLength(0)
                    .setMaxLength(50)
                    .setRequired(true);
    
                const textBody = new TextInputBuilder()
                    .setCustomId("bugreportbody")
                    .setLabel("Description")
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder("Describe the issue in detail.")
                    .setMinLength(0)
                    .setMaxLength(600)
                    .setRequired(true);
    
                const usernameComponent = new ActionRowBuilder().addComponents(username);
                const component1 = new ActionRowBuilder().addComponents(textTitle);
                const component2 = new ActionRowBuilder().addComponents(textBody);
                bugTicketModalBuilder.addComponents(usernameComponent, component1, component2);
    
                await interaction.showModal(bugTicketModalBuilder);
            }
    
            if (interaction.customId === 'playerreportbutton') {
                const playerReportModalBuilder = new ModalBuilder()
                    .setCustomId('playerreport')
                    .setTitle('Ticket - Player Report');
                
                const username = new TextInputBuilder()
                    .setCustomId('playerreport-playername')
                    .setLabel('Your IGN')
                    .setStyle(TextInputStyle.Short)
                    .setMinLength(0)
                    .setMaxLength(30)
                    .setRequired(true);

                const textTitle = new TextInputBuilder()
                    .setCustomId('playerreporttitle')
                    .setLabel('Title of your report')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Keep it short.')
                    .setMinLength(0)
                    .setMaxLength(30)
                    .setRequired(true);
    
                const textPlayer = new TextInputBuilder()
                    .setCustomId('player')
                    .setLabel('Player of interest')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Player IGN')
                    .setMinLength(0)
                    .setMaxLength(16)
                    .setRequired(true);
    
                const textBody = new TextInputBuilder()
                    .setCustomId('playerreportbody')
                    .setLabel('Description of the issue')
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder('Describe what the player is doing. Falsely reporting a player can result in a punishment!')
                    .setMinLength(0)
                    .setMaxLength(600)
                    .setRequired(true);
    
                const usernameComponent = new ActionRowBuilder().addComponents(username);
                const component1 = new ActionRowBuilder().addComponents(textTitle);
                const component2 = new ActionRowBuilder().addComponents(textPlayer);
                const component3 = new ActionRowBuilder().addComponents(textBody);
                playerReportModalBuilder.addComponents(usernameComponent, component1, component2, component3);
    
                await interaction.showModal(playerReportModalBuilder);
            }
            if (interaction.customId === 'banappealbutton') {
                const banAppealModal = new ModalBuilder()
                    .setCustomId('banappeal')
                    .setTitle('Ticket - Ban Appeal');
                const textTitle = new TextInputBuilder()
                    .setCustomId('player')
                    .setLabel('Username')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Enter your in-game IGN')
                    .setMinLength(0)
                    .setMaxLength(16)
                    .setRequired(true);
                const textReason = new TextInputBuilder()
                    .setCustomId('banreason')
                    .setLabel('Reason')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Why were you banned? Keep it short.')
                    .setMinLength(0)
                    .setMaxLength(30)
                    .setRequired(true);
                const textReason1 = new TextInputBuilder()
                    .setCustomId('banreasonbody')
                    .setLabel('Unban Reason')
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder('Why should you be unbanned? Defend your position.')
                    .setMinLength(0)
                    .setMaxLength(600)
                    .setRequired(true);
                
                const component1 = new ActionRowBuilder().addComponents(textTitle);
                const component2 = new ActionRowBuilder().addComponents(textReason);
                const component3 = new ActionRowBuilder().addComponents(textReason1);
                banAppealModal.addComponents(component1, component2, component3);

                await interaction.showModal(banAppealModal);
            }
            if (interaction.customId === 'othersupportbutton') {
                const otherSupportModal = new ModalBuilder()
                    .setCustomId('othersupport')
                    .setTitle('Ticket - Other');
                const player = new TextInputBuilder()
                    .setCustomId('othersupportplayer')
                    .setLabel('Your IGN')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Enter your in-game name.')
                    .setMinLength(0)
                    .setMaxLength(30)
                    .setRequired(true);
                const textTitle = new TextInputBuilder()
                    .setCustomId('othersupporttitle')
                    .setLabel('Title')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Keep it short.')
                    .setMinLength(0)
                    .setMaxLength(30)
                    .setRequired(true);
                const textBody = new TextInputBuilder()
                    .setCustomId('othersupportbody')
                    .setLabel('Description')
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder('Be precise, and only use this if the other three ticket options don\'t fit what you need.')
                    .setMinLength(0)
                    .setMaxLength(600)
                    .setRequired(true);
                
                const component1 = new ActionRowBuilder().addComponents(textTitle);
                const component2 = new ActionRowBuilder().addComponents(textBody);
                const playerComponent = new ActionRowBuilder().addComponents(player)
                otherSupportModal.addComponents(playerComponent, component1, component2);

                await interaction.showModal(otherSupportModal);
            }
            if (interaction.customId === 'close-bug') {
                const channelTarget = interaction.channel;
                const type = 'bug';
                if (channelTarget) {
                    try {
                        const messages = await channelTarget.messages.fetch({cache: true, limit: 100});
                        const messageContent = messages.map(msg => msg.content).join(`\n`);
                        await fs.promises.writeFile("./ticketData.txt", messageContent);
                        console.log('File write successful.')
                    } catch (error) {
                        console.error('Something weng wrong while trying to write to the file.', error)
                    }
                    await channelTarget.delete()
                        .then(() => console.log('Deletion successful.'))
                        .catch(error => console.error('Failed to delete channel', error));
                }
            }
            if (interaction.customId === 'close-report') {
                const channelTarget = interaction.channel;
                const type = 'report';
                if (channelTarget) {
                    try {
                        const messages = await channelTarget.messages.fetch({cache: true, limit: 100});
                        const messageContent = messages.map(msg => msg.content).join(`\n`);
                        await fs.promises.writeFile("./ticketData.txt", messageContent);
                        console.log('File write successful.')
                    } catch (error) {
                        console.error('Something weng wrong while trying to write to the file.', error)
                    }
                    await channelTarget.delete()
                        .then(() => console.log('Deletion successful.'))
                        .catch(error => console.error('Failed to delete channel', error));
                }
            }
            if (interaction.customId === 'close-appeal') {
                const channelTarget = interaction.channel;
                const type = 'appeal';
                if (channelTarget) {
                    try {
                        const messages = await channelTarget.messages.fetch({cache: true, limit: 100});
                        const messageContent = messages.map(msg => msg.content).join(`\n`);
                        await fs.promises.writeFile("./ticketData.txt", messageContent);
                        console.log('File write successful.')
                    } catch (error) {
                        console.error('Something weng wrong while trying to write to the file.', error)
                    }
                    await channelTarget.delete()
                        .then(() => console.log('Deletion successful.'))
                        .catch(error => console.error('Failed to delete channel', error));
                }
            }
            if (interaction.customId === 'closeWithReason-bug') {
                const closeReasonModal = new ModalBuilder()
                    .setCustomId('closeReasonBug')
                    .setTitle('Close With Reason');
                const textTitle = new TextInputBuilder()
                    .setCustomId('closeReason-bug-title')
                    .setLabel('Reason')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Enter your reason for closing this ticket (e.g. resolved).')
                    .setMinLength(0)
                    .setMaxLength(50);

                
                const row = new ActionRowBuilder().addComponents(textTitle);
                closeReasonModal.addComponents(row);

                await interaction.showModal(closeReasonModal);

            
            }
            if (interaction.customId === 'closeWithReason-report') {
                const closeReasonModal = new ModalBuilder()
                .setCustomId('closeReasonReport')
                .setTitle('Close With Reason');
                const textTitle = new TextInputBuilder()
                .setCustomId('closeReason-report-title')
                .setLabel('Reason')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Enter your reason for closing this ticket (e.g. resolved).')
                .setMinLength(0)
                .setMaxLength(50);

                const row = new ActionRowBuilder().addComponents(textTitle);
                closeReasonModal.addComponents(row);

                await interaction.showModal(closeReasonModal);
            }
            if (interaction.customId === 'closeWithReason-appeal') {
                const closeReasonModal = new ModalBuilder()
                .setCustomId('closeReasonAppeal')
                .setTitle('Close With Reason');
                const textTitle = new TextInputBuilder()
                .setCustomId('closeReason-appeal-title')
                .setLabel('Reason')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Enter your reason for closing this ticket (e.g. resolved).')
                .setMinLength(0)
                .setMaxLength(50);

                const row = new ActionRowBuilder().addComponents(textTitle);
                closeReasonModal.addComponents(row);

                await interaction.showModal(closeReasonModal);
            }
            if (interaction.customId === 'closeWithReason-other') {
                const closeReasonModal = new ModalBuilder()
                .setCustomId('closeReasonOther')
                .setTitle('Close With Reason');
                const textTitle = new TextInputBuilder()
                .setCustomId('closeReason-other-title')
                .setLabel('Reason')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Enter your reason for closing this ticket (e.g. resolved).')
                .setMinLength(0)
                .setMaxLength(50);

                const row = new ActionRowBuilder().addComponents(textTitle);
                closeReasonModal.addComponents(row);

                await interaction.showModal(closeReasonModal);
            }
            if (interaction.customId === 'suggestionbox') {
                const newModal = new ModalBuilder()
                .setCustomId('suggestions')
                .setTitle('Suggestions');
                const textTitle = new TextInputBuilder()
                .setLabel("Name of Suggestion")
                .setCustomId("suggestion_title")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Suggestion name')
                .setMinLength(0)
                .setMaxLength(40)
                .setRequired(true);

                const textBody = new TextInputBuilder()
                .setCustomId('suggestion_body')
                .setLabel('Describe.')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('All rules apply.')
                .setMinLength(0)
                .setMaxLength(500)
                .setRequired(true);

                const newRow = new ActionRowBuilder().addComponents(textTitle);
                const newRow1 = new ActionRowBuilder().addComponents(textBody);
                newModal.addComponents(newRow, newRow1);

                await interaction.showModal(newModal);
            }

            // Suggestion upvote/downvote components. Not touching it again cause I barely remember how it works
            const suggestionId = interaction.message.id;
            const suggestions = JSON.parse(fs.readFileSync('suggestions.json', 'utf-8'));
            const suggestion = suggestions.find(s => s.messageId === suggestionId);

            if (!suggestion) {
                console.error('An interaction occurred.');
                return;
            }

            const userId = interaction.user.id;
            if (!suggestion.votes) suggestion.votes = {};

            if (interaction.customId === 'upvote') {
                if (suggestion.votes[userId] === 'upvote') {
                    suggestion.upvotes -= 1;
                    delete suggestion.votes[userId];
                } else {
                    if (suggestion.votes[userId] === 'downvote') {
                        suggestion.downvotes -= 1;
                    }
                    suggestion.upvotes += 1;
                    suggestion.votes[userId] = 'upvote';
                }
            } else if (interaction.customId === 'downvote') {
                if (suggestion.votes[userId] === 'downvote') {
                    suggestion.downvotes -= 1;
                    delete suggestion.votes[userId];
                } else {
                    if (suggestion.votes[userId] === 'upvote') {
                        suggestion.upvotes -= 1;
                    }
                    suggestion.downvotes += 1;
                    suggestion.votes[userId] = 'downvote';
                }
            }

            fs.writeFileSync('suggestions.json', JSON.stringify(suggestions, null, 2));

            const upvoteButton = new ButtonBuilder()
                .setCustomId('upvote')
                .setLabel('Upvote')
                .setStyle(ButtonStyle.Success)
                .setEmoji("<icons_Correct:1068604820354764841>");
            const downvoteButton = new ButtonBuilder()
                .setCustomId('downvote')
                .setLabel('Downvote')
                .setStyle(ButtonStyle.Danger)
                .setEmoji("<icons_Wrong:1068604823450165329>");
            const buttonRow = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton);

            const updatedEmbed = new EmbedBuilder(interaction.message.embeds[0])
                .setFields([
                    { name: 'Submitted by', value: suggestion.user, inline: true },
                    { name: 'Upvotes', value: suggestion.upvotes.toString(), inline: true },
                    { name: 'Downvotes', value: suggestion.downvotes.toString(), inline: true }
                ]);

            await interaction.update({ embeds: [updatedEmbed], components: [buttonRow] });
        }
    } catch (error) {
        console.error('Error handling interaction:', error.message);
    }
});

client.on(Events.MessageDelete, async (message) => {
    try {
        let messageDeleted = message.content;
        let targetMessageId = message.id;
        let targetChannelId = message.channel.id;
        let messagehyperlink = messageLink(targetChannelId, targetMessageId);

        //Aurora bot whitelist
        if (message.author.id === '1246079113777647677') return;

        if (message.attachments.size > 0) return;

        const targetChannel = client.channels.cache.get('1193934914832310272');
            const logDeletionEmbed = new EmbedBuilder()
            .setColor('ea2e48')
            .setAuthor({
                iconURL: message.author.displayAvatarURL(),
                name: message.author.username
            })
            .setDescription(`**Message sent by <@${message.author.id}> deleted in ${`<#${targetChannelId}>`}**`)
            .addFields(
                {name: ``, value: `${messageDeleted}`},
                {name: '', value: `${messagehyperlink}`},
                {name: '', value: `Author ID: ${message.author.id}\nMessage ID: ${targetMessageId}`}
            )
            .setTimestamp()
            .setFooter({text: 'Imperium'});

            targetChannel.send({
                embeds: [logDeletionEmbed]
            });

            /*
            if (message.author.id === '548916320956317698') {
                try {
                    console.log('Person in question tried to hide the following message: ', message.content);
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log(`DEBUG: Message sent by ${message.author.username} deleted in ${targetChannel.name}: ${messageDeleted}`)
            }
            */
        } catch (error) {
            console.log("Something went wrong while attemping to parse a MessageDeleteEvent", error);
        }

        /*Elusive snipe
        try {
            if (message.author.id === '548916320956317698') {
                console.log('Anonymous tried hiding the following message: ');
                console.log(`${message.content}`);
            }
        } catch (error) {
            console.log('Something went wrong!', error);
        }
        */
});
client.on(Events.MessageDelete, async (message) => {
    if (message.attachments.size <= 0) return;
    const newAttachment = message.attachments.first();
    let messagehyperlink = messageLink(message.channel.id, message.id);
    const target = client.channels.cache.get('1193934914832310272');

    try {
        if (newAttachment.contentType?.startsWith('image/')) {
            const imageURL = newAttachment.url;
    
            const imageEmbedLog = new EmbedBuilder()
            .setColor('ea2e48')
            .setAuthor({iconURL: message.author.displayAvatarURL(), name: message.author.username})
            .setDescription(`**Image sent by <@${message.author.id} deleted in <#${message.channel.id}>**`)
            .setImage(imageURL)
            .addFields(
                {name: '', value: `${imageURL}`},
                {name: '', value: `${message.content}`},
                {name: '', value: `${messagehyperlink}`},
                {name: '', value: `Author ID: ${message.author.id}\nImage ID: ${newAttachment.id}\nMessage ID: ${message.id}`}
            )
            .setTimestamp()
            .setFooter({text: 'Imperium'});
    
            target.send(
                {embeds: [imageEmbedLog] }
            );
    
        }
    } catch (error) {
        console.log("Something went wrong while attemping to parse a MessageDeleteEvent (IMAGE)", error);
    }
});
/*
client.on(Events.MessageDelete, async (message) => {
    const logs = await message.guild.fetchAuditLogs({
        type: AuditLogEvent.MessageDelete,
        limit: 1,
    });

    const entry = logs.entries.first();
    const {executorId, target, targetId} = entry;

    const user = await client.users.fetch(executorId);

    if (targetId === executorId) return;

    if (target) {
        console.log(`A message sent by ${target.tag} was deleted by ${user.tag}`);
    } else {
        console.log(`Someone with id ${targetId} deleted a message sent by ${user.tag}`);
    }
});
*/

client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    if (!oldMessage || !newMessage) return;
    
    if (oldMessage.content === newMessage.content) return;


    try {
    const targetChannel = client.channels.cache.get('1193934914832310272');
    const author = newMessage.author;
    const messagehyperlink = messageLink(newMessage.channelId, newMessage.id);
    const jump = hyperlink("Jump to message", messagehyperlink);
    const logEditEmbed = new EmbedBuilder()
    .setColor('edeb0d')
    .setAuthor(
        {iconURL: author.displayAvatarURL(),
        name: author.username}
    )
    .setDescription(`**Message sent by <@${newMessage.author.id}> edited in <#${newMessage.channel.id}>**`)
    .addFields(
        {name: ``,value: `Before:\n${oldMessage.content}\n\nAfter:\n${newMessage.content}`},
        {name: '', value: `${jump}`},
        {name: '', value: `Author ID: ${newMessage.author.id}`}
    )
    .setTimestamp()
    .setFooter({text: 'Imperium'});

    targetChannel.send({
        embeds: [logEditEmbed]
    });
} catch (error) {
    console.log("Something went wrong while attemping to send a MessageUpdateEvent error", error);
}
});

client.on(Events.GuildAuditLogEntryCreate, async (entry, guild) => {
    if (!guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
        console.log('Missing permissions: Administrator');
        return;
    }
    console.log('**BEGIN LOG**');
    console.log(`An action was executed by ${entry.executor?.tag} affecting ${entry.target}.`);
    console.log(`Action in question: ${entry.action}, performed in guild ${guild.name}`);
    console.log(`Additional information: \nCreated on ${entry.createdAt}\nReason: ${entry.reason}`);
    console.log('**END LOG**');
});

client.on(Events.GuildMemberAdd, async (member) => {
    const target = client.channels.cache.get('1193934914832310272');
    const joinEventEmbed = new EmbedBuilder()
    .setColor('0a31a0')
    .setAuthor(
        {iconURL: member.displayAvatarURL(),
        name: member.user.username
        }
    )
    .setDescription(`**New member <@${member.id}> has joined.`)
    .addFields(
        {name: 'ID', value: member.id},
        {name: 'Join Date', value: member.joinedTimestamp.toLocaleString()}
    )
    .setFooter({text: 'Imperium'});

    target.send({
        embeds: [joinEventEmbed]
    });
});

client.on(Events.GuildMemberRemove, async (member) => {
    const target = client.channels.cache.get('1193934914832310272');
    const leaveEventEmbed = new EmbedBuilder()
    .setColor('ea2e48')
    .setAuthor(
        {iconURL: member.user.displayAvatarURL(),
        name: member.user.username
        }
    )
    .setDescription(`**Member <@${member.id}> has left.`)
    .addFields(
        {name: 'ID', value: member.id}
    )
    .setTimestamp()
    .setFooter({text: 'Imperium'});

    target.send({
        embeds: [leaveEventEmbed]
    });
});


client.on('exit', () => {
    db.close();
    ticketdb.close();
});



