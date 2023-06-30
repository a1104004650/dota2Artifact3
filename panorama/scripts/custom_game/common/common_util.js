var $SYSTEM = {};
$SYSTEM.env = 'dev';
$SYSTEM.author = "StromT1King";
$SYSTEM.group = "Zibaicai";
$SYSTEM.version = "0.0.1";

$SYSTEM.CONSTANTS = {
    dev: {
        apiUrl: 'https://dev.storm.cn/api/',
        resourceUrl: 'https://dev.storm.cn/resource/'
    },
    dat: {
        apiUrl: 'https://dat.storm.cn/api/',
        resourceUrl: 'https://dat.storm.cn/resource/'
    },
    prd: {
        apiUrl: 'https://prd.storm.cn/api/',
        resourceUrl: 'https://prd.storm.cn/resource/'
    }
};

$SYSTEM.API = {
        APP: {
            /*
            * 获取APPID
            */
            getAPPID: function() {
                return SteamUtils.GetAppID();
            },
            /*
             * 获取应用信息，如版本，游戏模式
             */
            getAppInfo: function() {
                return null;
            }
        },
        PLAYER: {
            /*
            * 获取最大活跃用户数量
            */
            getMaxPlayers: function() {
                return Players.GetMaxPlayers();
            },
            /*
            * 获取本地玩家ID
            */
            getLocalPlayer: function() {
                return Players.GetLocalPlayer();
            },
            /*
            * 索引位玩家是否有效
            */
            isValidPlayerID: function(iPlayerID) {
                return Players.IsValidPlayerID(iPlayerID);
            },
            /*
            * 获取索引玩家名字
            */
            getPlayerName: function(iPlayerID) {
                return Players.GetPlayerName(iPlayerID);
            },
            /*
            * 获取玩家协助次数
            */
            getAssists: function(iPlayerID) {
                return Players.GetAssists(iPlayerID);
            },
            /*
            * 获取玩家金币
            */
            getGold: function(iPlayerID) {
                return Players.GetGold(iPlayerID);
            },
            /*
            * 获取玩家击杀数
            */
            getKills: function(iPlayerID) {
                return Players.GetKills(iPlayerID);
            },
            /*
            * 获取该玩家所在的团队
            */
            getTeam: function(iPlayerID) {
                return Players.GetTeam(iPlayerID);
            },
            /*
            * 索引位玩家是否是旁观者
            */
            isSpectator: function(iPlayerID) {
                return Players.IsSpectator(iPlayerID);
            },
            /*
            * 获取本地玩家ID
            */
            getLocalPlayerID: function() {
                return Game.GetLocalPlayerID();
            },
            /*
            * 获取所有玩家ID
            */
            getAllPlayerIDs: function() {
                return Game.GetAllPlayerIDs();
            },
            /*
            * 获取玩家SteamID
            */
            getPlayerSteamID: function() {
                return Game.GetLocalPlayerInfo().player_steamid;
            },
            /*
            * 获取玩家用户名
            */
            getPlayerSteamName: function() {
                return Game.GetLocalPlayerInfo().player_name;
            },
            getPlayerInfo: function(playerId) {
                return $SYSTEM.API.SERVICE.setPlayerJoinTeam();
            },
            GetLocalPlayerInfo: function() {
                return Game.GetLocalPlayerInfo();
            }
        },
        TEAM: {
            /*
            * 将本地玩家分配到某个指定的team
            */
            setPlayerJoinTeam: function(nTeamID) {
                return Game.PlayerJoinTeam(nTeamID);
            },
            /*
            * 获取所有团队 ID
            */
            getAllTeamIDs: function() {
                return Game.GetAllTeamIDs();
            }
        },
        SERVICE: {
            /*
            * 发送一个HTTP请求
            */
            setPlayerJoinTeam: function(url ,params) {
                return $.AsyncWebRequest(CONSTANTS[env].apiUrl + url , params);
            },
            /*
            * 向服务端发送一个自定义事件
            */
            sendEventToServer: function(pEventName ,object) {
                return GameEvents.SendCustomGameEventToServer(pEventName, object);
            },
            /*
            * 向所有客户端发送自定义事件
            */
            sendEventToAllClients: function(pEventName ,object) {
                return GameEvents.SendCustomGameEventToAllClients(pEventName, object);
            },
            /*
            * 向服务端发送一个事件，服务端将它给某一个用户
            */
            sendEventToOneClients: function(pEventName , playerIndex, object) {
                return GameEvents.SendCustomGameEventToClient(pEventName, playerIndex, object);
            },
            /*
            * 订阅一个事件
            */
            subscribe: function(pEventName, funcVal) {
                return GameEvents.Subscribe( pEventName, funcVal );
            }

        },
        TIME: {
            /*
            * 获取时间
            */
            getTime: function() {
                return Game.Time();
            },
            /*
            * 获取游戏时间
            */
            getGameTime: function() {
                return Game.GetGameTime();
            }
        },
        SYSTEM: {
            /*
            * 获取屏幕宽度
            */
            getScreenWidth: function() {
                return Game.GetScreenWidth();
            },
            /*
            * 获取屏幕高度
            */
            getScreenHeight: function() {
                return Game.GetScreenHeight();
            },
            /*
            * 获取当前语言
            */
            getLocalLanguage: function() {
                return $.Language();
            },
            /*
            * 是否游戏暂停
            */
            isGamePaused: function() {
                return Game.IsGamePaused();
            },
            /*
            * 创建一个新的键绑定。
            */
            createCustomKeyBind: function(pszKey , pszCommand) {
                return Game.CreateCustomKeyBind(pszKey , pszCommand);
            },
            sleep: function( time ) {
                var start = new Date().getTime();
                while (true) {
                    if (new Date().getTime() - start > time) {
                        break;
                    }
                }
            }
        },
        HERO: {
            /*
            * 获取所有英雄 TODO 需要同步到服务端
            */
            qryActiveHero: function() {
                return null;
            }
        },
        Localization: {
            /*
            * 这个方法很有意思，我会将需要赋值的本地化内容，赋值到某个元素中。当然如果有动态变量的话还需要 paramList 参数支持。 paramList是一个数组，需要传递key和value
            * elmId 元素ID
            * localizationId 本地化ID
            * paramList 本地化动态参数 key value
            */
            setTextLocalization: function(elmId, localizationId, paramList) {
                
                $( elmId ).text = $.Localize(localizationId);
                if(paramList && paramList.length > 0) {
                    for(var i = 0 ; i < paramList.length ; i++) {
                        $.Msg(paramList[i].key + paramList[i].value);
                        $( elmId ).SetDialogVariable( paramList[i].key , paramList[i].value );
                    }
                }

            }
        }
};

$SYSTEM.GAME_FUNCTION  = {
    /*
     *  通过玩家索引获取玩家英雄信息
     */
    getPlayerHero: function(index) {
        return null;
    },
    /*
     *  通过玩家索引获取玩家英雄信息
     */
    isDead: function(index) {
        return null;
    },
    skipGameStata: function() {
        $.Msg( "跳过该阶段" +  Game.GetState() );
        Game.SetRemainingSetupTime( 1 );
    }
};