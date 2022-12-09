const TIME_CODE = "GMT+7"

/* Spreadsheet */
const KVM_URL = "YOUR_KVM_URL"
const GO_URL = "YOUR_GO_URL"
const TEMPLATE_URL = "YOUR_TEMPLATE_URL"

/* Webhooks */
const DEV_URL = "YOUR_TEST_WEBHOOKURL"
const LOG_URL = true ? DEV_URL : "YOUR_MAIN_WEBHOOKURL"

/* Self */
const ROLE_ID = "YOUR_ROLE_ID"
const SERVER_ID = "YOUR_SERVER_ID"
const APP_ID = "YOUR_APP_ID"

const GUILD_API = "http://ngc.nvsgames.com/ngs/guild/api/v1/query/guild-info?login_type=passport&role_id="+ROLE_ID+"&server_id="+SERVER_ID+"&app_id="+APP_ID
const GO_API = "http://ngc.nvsgames.com/ngs/guild/api/v1/query/member?login_type=passport&role_id="+ROLE_ID+"&server_id="+SERVER_ID+"&app_id="+APP_ID+"&limit=100&offset=0&sort_by=0&order=0"
const KVM_API = "http://ngc.nvsgames.com/ngs/guild/api/v1/query/kvm-rank?login_type=passport&role_id="+ROLE_ID+"&server_id="+SERVER_ID+"&app_id="+APP_ID+"&limit=100&offset=0&sort_by=4&order=1"

/* HTTP Request Option */
const DATAOPT = {
    method: "GET",
    headers: {
        "Cookie": "YOUR_COOKIE_HERE"
    }
}

/* Get yesterday date */
function getYesterday() {
  const today = new Date();
  const yesterday = new Date(new Date().setDate(today.getDate() - 1));
  return yesterday;
}

/* Handle spreadsheet */
function handlingSheet(name, type) {
  var url = type == "kvm" ? KVM_URL : GO_URL
    var SS = SpreadsheetApp.openByUrl(url)
    const SHEET_NAME = name
    var SHEET = SS.getSheetByName(SHEET_NAME)
    if (SHEET != null) {
        Logger.log("Dupe sheet detected. Deleting old sheet...")
        SS.deleteSheet(SHEET)
    }
    Logger.log("Creating new sheet from template...")
    SHEET = SpreadsheetApp.openByUrl(TEMPLATE_URL).getSheetByName(type == "kvm" ? "TEMPLATEKVM" : "TEMPLATEGO").copyTo(SS).setName(name)
    return SHEET
}

/* Main Functions */
function getGuildInfo(){
  var getGuild = UrlFetchApp.fetch(GUILD_API, DATAOPT);
    let parsedResponse = JSON.parse(getGuild.getContentText())
  return parsedResponse.data
}
function getDailyGO() {
    var kvmDaily = UrlFetchApp.fetch(GO_API, DATAOPT);
    let parsedResponse = JSON.parse(kvmDaily.getContentText())

    var SHEET = handlingSheet(Utilities.formatDate(getYesterday(), TIME_CODE, "dd/MM/yyyy"), "go")
    var GUILD = getGuildInfo()
    Logger.log("Setting up header")
    insert_value([
        "id", "avatar", "name", "level", "job", "weekly_go", "total_go"
    ], SHEET)

    Logger.log(`Inserting total of ${parsedResponse.data.list.length} member(s)`)
    parsedResponse.data.list.forEach(d => {
        var role_name = d.role_name
        var role_id = d.role_id
        var role_level = d.role_level
        var role_job = d.role_profession
        var point = d.integral
        var week = d.role_week_con
        var total = d.role_total_con
        var image = `=IMAGE("${d.role_photograph}")`
        insert_value([
            role_id,
            image,
            role_name,
            role_level,
            role_job,
            week,
            total
        ], SHEET)
    })
    const  range = SHEET.getRange("A:G");
    const  filter = range.createFilter();
    filter.sort(6, true);

    Logger.log("Sending log to discord...")
    var options = {
        contentType: "application/json",
        muteHttpExceptions: true,
        "method": "post",
        "payload": JSON.stringify({
            "username": GUILD.guild_name,
            "avatar_url": GUILD.guild_photograph,
            "embeds": [{
                "author": {
                    "name": `Daily GO Log!`
                },
                "title": Utilities.formatDate(getYesterday(), TIME_CODE, "dd/MM/yyyy"),
                "description": `_This is automatic message._`,
                                "url": `${GO_URL}#gid=${SHEET.getSheetId()}`,

                "color": 10944422,
                "fields": [{
                        "name": ":crossed_swords: KVM Rank",
                        "value": `#${GUILD.kvm_rank}`,
                        "inline": true
                    },
                    {
                        "name": ":shield: GVG Rank",
                        "value": `#${GUILD.gvg_rank}`,
                        "inline": true
                    },
                    {
                        "name": ":busts_in_silhouette:  Guild Member(s)",
                        "value": `${GUILD.total_member} players`,
                        "inline": false
                    },
                    {
                        "name": ":person_white_hair: Guild Leader",
                        "value": `${GUILD.guild_president_name}`,
                        "inline": true
                    },    
                ],
                "footer": {
                    "text": Utilities.formatDate(new Date(), "GMT+8", "dd/MM/yyyy hh:mm:ss")
                }
            }]
        }),
    };
    var response = UrlFetchApp.fetch(LOG_URL, options);
    Logger.log("Successfully.")
}
function getDailyKVM() {
    var kvmDaily = UrlFetchApp.fetch(KVM_API, DATAOPT);
    let parsedResponse = JSON.parse(kvmDaily.getContentText())

    var SHEET = handlingSheet(Utilities.formatDate(new Date(), "GMT+8", "dd/MM/yyyy"), "kvm")
    var GUILD = getGuildInfo()
    Logger.log("Setting up header")
    insert_value([
        "id", "avatar", "name", "level", "job", "weekly_point", "weekly_win", "weekly_match"
    ], SHEET)

    Logger.log(`Inserting total of ${parsedResponse.data.list.length} member(s)`)
    parsedResponse.data.list.forEach(d => {
        var role_name = d.role_name
        var role_id = d.role_id
        var role_level = d.role_level
        var role_job = d.role_profession
        var point = d.integral
        var win = d.win_match
        var total = d.total_match
        var image = `=IMAGE("${d.role_photograph}")`
        insert_value([
            role_id,
            image,
            role_name,
            role_level,
            role_job,
            point,
            win,
            total
        ], SHEET)
    })
 const  range = SHEET.getRange("A:H");
    const  filter = range.createFilter();
    filter.sort(8, true);
    Logger.log("Sending log to discord...")
    var options = {
        contentType: "application/json",
        muteHttpExceptions: true,
        "method": "post",
        "payload": JSON.stringify({
            "username": GUILD.guild_name,
            "avatar_url": GUILD.guild_photograph,
            "embeds": [{
                "author": {
                    "name": `Daily KVM Log!`
                },
                "title": Utilities.formatDate(new Date(), "GMT+8", "dd/MM/yyyy"),
                "url": `${KVM_URL}#gid=${SHEET.getSheetId()}`,
                "description": `_This is automatic message._`,
                "color": 15258703,
                "fields": [{
                        "name": ":crossed_swords: KVM Rank",
                        "value": `#${GUILD.kvm_rank}`,
                        "inline": true
                    },
                    {
                        "name": ":shield: GVG Rank",
                        "value": `#${GUILD.gvg_rank}`,
                        "inline": true
                    },
                    {
                        "name": ":busts_in_silhouette:  Guild Member(s)",
                        "value": `${GUILD.total_member} players`,
                        "inline": false
                    },
                    {
                        "name": ":person_white_hair: Guild Leader",
                        "value": `${GUILD.guild_president_name}`,
                        "inline": true
                    },    
                ],
                "footer": {
                    "text": Utilities.formatDate(new Date(), "GMT+8", "dd/MM/yyyy hh:mm:ss")
                },
                
            }]
        }),

    };
    var response = UrlFetchApp.fetch(LOG_URL, options);
    Logger.log("Successfully.")
}