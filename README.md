# guildTasksLogAutomation
A helper on Ragnarok X: Next Generation for guild task management purposes. Using [Google Apps Script](https://script.google.com/).

## Logged Task
- [x] KVM
- [x] Guild Contribution
- [ ] GVG

Logged automatically everydays between 4:00 am - 05:00 am (a hour before reset).

## Previews
### Data Stored
Data automatically stored in to Google Spreadsheet.

<img src="https://user-images.githubusercontent.com/11014424/205511299-35e0fb4b-5055-4c3c-99bd-e2045d02959e.png" width="256">

### Webhook Log
Send a message to a discord channel using webhook once it triggered.

<img src="https://user-images.githubusercontent.com/11014424/205511515-ecf33c43-1c0e-4d3e-bb7f-97b191a45a1f.png" width="256">

## Requirements
- Some parameters & cookies from [Guild Panel](http://ngc.nvsgames.com/ngc/login).
- [Google Spreadsheet](https://docs.google.com/spreadsheet/).
- [Discord Webhook](https://discord.com/developers/docs/resources/webhook)

## How to

### Scripts
1. Open [Google Apps Script](https://script.google.com/).
2. Create to file named **main.gs** and **driver.gs**. Paste code from this github.

Next, ignore the *driver.gs* just focus to *main.gs*.

### Spreadsheet
1. Create template for GO and KVM in different sheet in a doc or you can [copy mine](https://docs.google.com/spreadsheets/d/158t4-42ph2VFiA_dLLvl_b8N6e2M3v46bVaxyppFPBQ/copy).
2. Insert into `TEMPLATE_URL`.
3. Create two more documents for GO and KVM, then put it on both `GO_URL` and `KVM_URL`. **Dont forget to change the permission**.

### Webhook
Create and copy discord webhook url to `LOG_URL`. You can [read this](https://progr.interplanety.org/en/how-to-get-the-discord-channel-webhook-url/). You do not need to set the bot profile, it will changed automatically on the script.

### Cookies
<img src="https://cdn.discordapp.com/attachments/831620169011953714/1050869089234587809/GuildAutomation.png" width="512">

1. Get guild panel ***cookies*** by Inspect Element on Network tab.
2. Put it on `"YOUR_COOKIE_HERE"` _(line 25)_.

### Get ROLE\_ID, SERVER\_ID, APP\_ID
You know where to get this if u can get the *cookies*.

#### Testing
After filling all required data, test the code by clicking **Run** on toolbar, dont forget to change the function *(beside debug)* to **getDailyGO** or **getDailyKVM**.

#### Notes:

- `DEV_URL` is discord webhook url for testing. Change the ***FALSE*** statement on `LOG_URL` to ***TRUE*** to switch to testing webhook url.
- Change `TIME_CODE` to our location. Mine was UTC+8.


## Automation
Ignore this if u want to run code manually.

1. Go to **Triggers** tab on left sidebar google script.
2. Press **+ Add Trigger** button on right-bottom side of the page.
3. Setting what ever u want.

### Here's mine.

**a trigger for daily GO**
Triggered on next day like a hours before reset.

<img src="https://cdn.discordapp.com/attachments/831620169011953714/1050886099347714168/Group_1.png" width="200">

**three triggers for every KVM day**
Triggered like a hour after KVM ends.

<img src="https://cdn.discordapp.com/attachments/831620169011953714/1050886772046966885/Group_2.png" width="200">

## Any Question ?
Feel free to contact me. You can find my social media on my github profile.

[![HitCount](http://hits.dwyl.com/farizrifqi/guildTasksLogAutomation.svg)](https://github.com/farizrifqi/guildTasksLogAutomation) [![Stars](https://img.shields.io/github/stars/farizrifqi/guildTasksLogAutomation?style=flat-square)](https://github.com/farizrifqi/guildTasksLogAutomation/stargazers)
