# Changelog

## V2.2.0

### Code stability update

Improved overall code.

## V2.1.9

### Small fix

Corrected files spelling mistakes.

### Updated /me and /stats

Improved command speed and layout.

### Update cron

Updated cron V2.4.4 -> V3.1.8

### Changed embed color picker

Now uses autofill and supports all know discord colors including hex.

## V2.1.8

### Bug fix

Removed DM permissions for the settings commands.

## V2.1.7

### Improved activity of the client

Better speeds.

### Improved the SKU's for premium users

Removed subscription based models.

### Overall better quality and readability of code

Made minor changes to code for better speeds and readability.

### Updated error handling

Improved error handling.

## V2.1.6

### Updated settings embed color

Added custom colors as well as new basic colors.

### Overall better quality and readability of code

Made minor changes to code for better speeds and readability.

### Fixed loadout.js

Added new weapons.

### Fixed invite.js

Fixed the outdated DM Permissions.

### Fixed info.js

Fixed the oudated DM permissions.

### Updated map.js

Improved code.

## V2.1.5

### Fix crash on DM

Fixed the issue.

### Update firebase

Updated firebase V10.14.1 -> V11.0.1

## V2.1.4

### Update firebase

Updated Firebase V10.14.0 -> V10.14.1

### Update eslint

Updated eslint V9.11.1 -> V9.13.0

### Update .setDMPermission() (outdated)

Updated all command to follow the new syntax.

### Added Team command

Added Team command to get a team to use.

### Updated Crafting command

Update with new season added the permanent item and removed the weekly/daily.

## V2.1.3

### Update discord.js

Updated Discord.js V14.16.2 -> V14.16.3

### Update firebase

Updated Firebase v10.13.2 -> V10.14.0

## V2.1.2

### Update discord.js

Updated Discord.js V14.16.1 -> V14.16.2

### Update eslint

Updated eslint V9.9.1 -> V9.11.1

### Update firebase

Updated firebase V10.13.1 -> V10.13.2

## V2.1.1

### Heatbeat error fix

Because the firebase package has had an update the heartbeat error is now fixed. Previously the package was downgraded to mitigate this issue.

### Update Discord.js

Updated Discord.js V14.15.3 -> V14.16.1

### Update Firebase

Updated Firebase V10.12.5 -> V10.13.1

## V2.1.0

### Changed Bot.js

Removed auto updating commands on every startup.

### Downgraded Firebase

Downgraded Firebase  V10.13.0 -> V10.12.5
This is because a heartbeats console.log error. This will be removed in the next firebase update this thursday (29-08-2024).

### Updated Eslint

Updated Eslint V9.9.0 -> V9.9.1

### Update Firebase

Updated firebase V10.12.5 -> V10.13.0

## V2.0.9

### New Season

Fixed commands to work for the new season.

### Edited files

Edited multiple files to be more compact.

### Season Bug Fix

Removed Image causing error.

### NPM Update

Upgraded from 9.8.1 -> 10.8.2

### Eslint Update

Upgraded from 9.5.0 -> 9.9.0

### Firebase Update

Upgraded from 10.12.2 -> 10.12.5

## V2.0.8

### Updated CRON

Updated to latest version.

### Removed package MS

removed it. Was not used.

### Change @types/node to dev

Changed to dev.

### Update firebase

Updated to latest firebase package for security reasons.

### Update ESLINT

New version.

### Bug Fix

On guildDelete there was a small error.

## V2.0.7

### Updated language

There was a small issue.

### Fix /news

Removed components and not change embed.

### Embed color green /link

From set color to green.

### Fixed /settings delete

Added auto delete message after 15sec of no interaction.

### Fixed images

Images got locked away not added a work around.

### Made Sucessfull embeds green

Embed like delete data are now green.

### Fixed /me and /stats

If person had rank "unranked" there would be not emoji and would state undefined. Now set to Rookie 4.

## V2.0.6

### Fixed glitch /me and /stats

Badges fix.

### Update News commands

From 3 pages to unlimited. Added a new button system. Auto removes buttons after 15sec of not using.

### Changed Privacy Policy

Check PRIVACY.md.

### Added visible messages

Choose if your message is visible or not.

### Added color embeds

Change the color of the embed.

### Moved some command to settings commands

Moved link, unlink, languages.

### Database resture

Restuctured database.

### New settings command

Added new settings command.

## V2.0.5

### Minor big fix

Removed tiny bugs.

### Moved some files

Moved guild files into guild folder.

### Improved Activity Type

Now added sleep of 500ms to fix an issue with API.

### New added Drop command

Random place to drop.

## V2.0.4

### Premium Vote glitch removed

When you voted you would not get access to the premium commands.

### Moved images

Moves images into image folder.

### Error handling improved

Added Lookup errors and overall beter handling.

### Minor Security Update

Made a token invisible. This token was not harmful but just to be safe.

## V2.0.3

### Added shard count for top.gg

Added shard count in the post request.

### Changed Activity Type

Custom activity. Removed Playing ...

### New added /invite

invite the bot to your server.

### Change /current -> /season

Change the name of the command.

### Multi languages Support

Added name localizations for Dutch.

## V2.0.2

### Updates to commands

Some minor bug fixes to some commands.

### New SUBSCRIPTIONS

Buy subscriptions for Apex Bot and get access to new features. Some commands need a subscriptions, some are free.
All premium command can be accessed for FREE if you vote on top.gg for Apex Bot. (This is not done to make money, I need to pay the host)

### New loadout command

New command

### Aplication name change

Ask discord dev to change the name of the app from "Apex" to "Apex Bot".

### Changed Banner and Profile Picture

Change bot's profile picture and banner.

### Updated ESLINT V9.3.0 -> V9.4.0

Updated Package

### Updated discord V14.15.1 -> V14.15.3

Updated package

## V2.0.1

### Added commands

Added: current, info

### Removed outdated commands

Removed: drop, heirloom, invite, loadout, rank (contex), shop, team, vote, help

### Updated commands

All commands got updated. Glitches got removed and overall better performance.

### Added Sharding

The new improved version support sharding.

### Updated outdated packages

Updated: firebase, node-fetch, cron, canvas

### Updated Discord.js to 14.14.1

Updated to the latest discord.js version.

### New NODE version 16.18.0 -> V20.14.0

New node version to support the new packages.

### Changed internalstructure of the bot

Put folders in commands. Data folder got created. src folder got created. Restructed the folders.

### Added eslint V9.3.0

From now we will be using a linter to keep our files organised.

### Added LICENCE and SECURITY.md

Here you can find the licence of the APEXBOT. SECURITY.md will show potential issues and what version of the ApexBot is supported.

### Added TOS and PRIVACY.md

Location changed to now be in the files of the ApexBot instead of external folders.
