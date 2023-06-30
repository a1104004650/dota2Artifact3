var HERO_SELECT_SCREEN_TEXT = "[hero_select_screen]";
var playerInfo = {};
var countDownTime;
var heroNum = 3;
var heroSelectionReady = false;
// 倒计时
var countdownTimer;
// 阵营分配监听
GameEvents.Subscribe( "player_camp_info", OnPlayerCampInfoUpdate );
// TODO 阵营数量信息 这个其实没有用，后期可以跟上面那个事件合并
GameEvents.Subscribe( "game_camp_info", OnPlayerGameCampInfoUpdate );
// 监听倒计时
CustomNetTables.SubscribeNetTableListener("heroSelectionPipe", function(tableName, key, data) {
    if (key === "countdown") {
        OnTimeUpdate(data);
    }
});

function initData() { 

    $.Msg( " FUNCTION " + HERO_SELECT_SCREEN_TEXT + "START");
    // 通知服务端玩家已经准备就绪
    initPlayerInfo();
    $.Msg( " FUNCTION " + HERO_SELECT_SCREEN_TEXT + "END");

}


function initPlayerInfo() {

    $.Msg( "通知服务端玩家已经准备好了" );
    // 通知服务端玩家已经准备就绪( 传哪个玩家准备好了，总共有多少玩家。 )
    $SYSTEM.API.SERVICE.sendEventToServer("hero_selection_player_init", {
        "localPlayerId": $SYSTEM.API.PLAYER.getLocalPlayerID(),
        // "players": $SYSTEM.API.PLAYER.getAllPlayerIDs(),
        "players": [ 0 , 1 , 2 , 3 ], // TODO 测试使用
        "playerInfo": $SYSTEM.API.PLAYER.GetLocalPlayerInfo()
    });

    mock(); // TODO 测试使用
}

// 测试模拟使用
function mock() {
    // 通知服务端玩家已经准备就绪( 传哪个玩家准备好了，总共有多少玩家。 )
    $SYSTEM.API.SERVICE.sendEventToServer("hero_selection_player_init", {
        "localPlayerId": 1,
        "players": [ 0 , 1 , 2 , 3 ],
        "playerInfo": $SYSTEM.API.PLAYER.GetLocalPlayerInfo()
    });

    // 通知服务端玩家已经准备就绪( 传哪个玩家准备好了，总共有多少玩家。 )
    $SYSTEM.API.SERVICE.sendEventToServer("hero_selection_player_init", {
        "localPlayerId": 2,
        "players": [ 0 , 1 , 2 , 3 ],
        "playerInfo": $SYSTEM.API.PLAYER.GetLocalPlayerInfo()
    });

    // 通知服务端玩家已经准备就绪( 传哪个玩家准备好了，总共有多少玩家。 )
    $SYSTEM.API.SERVICE.sendEventToServer("hero_selection_player_init", {
        "localPlayerId": 3,
        "players": [ 0 , 1 , 2 , 3 ],
        "playerInfo": $SYSTEM.API.PLAYER.GetLocalPlayerInfo()
    });
}

// 测试模拟使用
function mock2() {
    // 通知服务端玩家已经准备就绪( 传哪个玩家准备好了，总共有多少玩家。 )
    $SYSTEM.API.SERVICE.sendEventToServer("hero_selection_player_ready", {
        "localPlayerId": 1,
        "heroId": "H10004"
    });

    // 通知服务端玩家已经准备就绪( 传哪个玩家准备好了，总共有多少玩家。 )
    $SYSTEM.API.SERVICE.sendEventToServer("hero_selection_player_ready", {
        "localPlayerId": 2,
        "heroId": "H10000"
    });

    // 通知服务端玩家已经准备就绪( 传哪个玩家准备好了，总共有多少玩家。 )
    $SYSTEM.API.SERVICE.sendEventToServer("hero_selection_player_ready", {
        "localPlayerId": 3,
        "heroId": "H10007"
    });
}

// 服务端触发事件更新事件
function OnTimeUpdate( data ) {
    $.Msg( "收到服务端通知 OnTimeUpdate" );
    countDownTime = data.time;
    // $.Schedule( TIME_UPDATE_INTERVAL , updateTime);
    var soundId;

    var countdownInfo = CustomNetTables.GetTableValue("heroSelectionPipe", "countdown");
    if (countdownInfo) {
        var timeLeft = countdownInfo.timeLeft - 1;
        if (timeLeft < 0) {
            // 倒计时结束后执行的逻辑
            clearTimeout(countdownTimer);

            if( heroSelectionReady == false ) {
                var heroId = $( "#ChooseHeroInfo1" ).GetAttributeString( "HeroId" , heroId );
                for( var i = 0; i < heroNum ; i++) {
                    if($( "#ChooseHeroInfo" + (i+1) ).GetParent().BHasClass( "PlayerCardsSelected" )) {
                        heroId = $( "#ChooseHeroInfo" + (i+1) ).GetAttributeString( "HeroId" , heroId );
                    }
                }
                sendPlayerSelectHeroReadyToServer( heroId );
            }

            return;
        }

        countdownInfo.timeLeft = timeLeft;
        // TODO: 更新UI显示倒计时信息
        $("#TimeInt").text = timeLeft;
        if(timeLeft <= 10) {
            soundId = Game.EmitSound("BUTTON_CLICK_MINOR");
        }

        // 每秒更新一次倒计时
        countdownTimer = setTimeout(function() {
            OnCountdownUpdate(keys);
        }, 1000);
    }

}

// 阵营分配监听 localPlayerId 本地玩家ID campType 阵营类型（radiant，dire，neutral，#AI） index 顺序 nextPlayerCampInfo 下家的信息 allPlayerCampInfo所有玩家的信息
function OnPlayerCampInfoUpdate( data ) {
    $.Msg( "收到服务端通知 OnPlayerCampInfoUpdate" );
    // 找到自己的数据
    for(var key in data)  {
        if(data[key].localPlayerId != $SYSTEM.API.PLAYER.getLocalPlayerID()) {
            continue;
        }

        $.Msg($SYSTEM.API.PLAYER.getLocalPlayerID() +  JSON.stringify(data[key]));
        var playerInfo = data[key];
        initCampElement( playerInfo.campType , playerInfo.nextPlayerInfo.campType );
        initHeroElement( playerInfo.heroInfo );
    };
}

function OnPlayerGameCampInfoUpdate( data ) {

    $( '#RadiantPlayerNum' ).text = "x" + data["RadiantPlayerNum"];
    $( '#DirePlayerNum' ).text = "x" + data["DirePlayerNum"];
    if(data["NeutralPlayerNum"]) {
        $( '#NeutralPlayerNum' ).text = "x" + data["NeutralPlayerNum"];
    }else {
        $( '#NeutralPlayerNum' ).text = "x0";
    }

    $( '#NeutralTaskText' ).text = NEUTRAL_TASK_TEXT.get(data["NeutralCampTask"]);
}

// 渲染
function initCampElement( campType , nextPlayerCampType ) {
    var campSrc = "file://{images}/custom_game/card/1009_psd.png";
    if("radiant" == campType){
        campSrc = "file://{images}/custom_game/card/1098_psd.png";
    }else if("dire" == campType){
        campSrc = "file://{images}/custom_game/card/1526_psd.png";
    }

    $( "#HeroSelectPlayerTeam" ).SetImage(campSrc);
    
    campSrc = "file://{images}/custom_game/card/1009_psd.png";
    if("radiant" == nextPlayerCampType){
        campSrc = "file://{images}/custom_game/card/1098_psd.png";
    }else if("dire" == nextPlayerCampType){
        campSrc = "file://{images}/custom_game/card/1526_psd.png";
    }

    $( "#HeroSelectNextPlayerTeam" ).SetImage(campSrc);

}

function initHeroElement( heroInfo ) {
    if(heroInfo) {
        var i = 1;
        for(var key in heroInfo)  {
            $( "#ChooseHeroInfo" + i ).SetImage("file://{images}/custom_game/card/" + HERO_INFO[heroInfo[key]].img);
            $( "#ChooseHeroInfo" + i ).SetAttributeString( "HeroId", heroInfo[key]);
            i++;
        }
    }
}

function selectHero( id ) {
    if(!heroSelectionReady) {
        // TODO 待优化
        for( var i = 0; i < heroNum ; i++) {
            $( "#ChooseHeroInfo" + (i+1) ).GetParent().RemoveClass( "PlayerCardsSelected" );
        }
        $( "#ChooseHeroInfo" + id ).GetParent().AddClass( "PlayerCardsSelected" );

        // TODO 非动态渲染
        $( "#HeroInfoSkill1").text = "";
        $( "#HeroInfoSkill2").text = "";
        $( "#HeroInfoSkill3").text = "";
        var heroId = $( "#ChooseHeroInfo" + id ).GetAttributeString( "HeroId" , heroId );
        $( "#HeroName" ).text = HERO_INFO[heroId].name + " - " + HERO_INFO[heroId].reputation;
        $( "#HeroAtk" ).text = HERO_INFO[heroId].attack;
        $( "#HeroDef" ).text = HERO_INFO[heroId].def;
        $( "#HeroHealth" ).text = HERO_INFO[heroId].maxHealth;
        $( "#HeroAnger" ).text = HERO_INFO[heroId].maxAnger;
        $( "#HeroCamp" ).text = $.Localize("#HERO_CAMP_TEXT") + " : " + HERO_INFO[heroId].campText;
        var skillIndex = 1;
        if( HERO_INFO[heroId].ability && HERO_INFO[heroId].ability.length > 0) {
            for(var i = 0 ; i < HERO_INFO[heroId].ability.length ; i++ ){
                if(HERO_INFO[heroId].ability[i].isUse == true) {
                    $( "#HeroInfoSkill" + skillIndex ).text = "【" + HERO_INFO[heroId].ability[i].skillName + "】:" + HERO_INFO[heroId].ability[i].desc;
                    skillIndex++;
                }
            }
        }

    }
}

// 玩家准备就绪并且发送消息到服务端（如果超时未选择英雄也会激活这个方法）
function selectHeroAndReadyToServer() {
    $.Msg( "selectHeroAndReadyToServer" );
    for( var i = 0; i < heroNum ; i++) {
        if($( "#ChooseHeroInfo" + (i+1) ).GetParent().BHasClass( "PlayerCardsSelected" )) {
            var heroId = $( "#ChooseHeroInfo" + (i+1) ).GetAttributeString( "HeroId" , heroId );
            sendPlayerSelectHeroReadyToServer( heroId );
        }
    }
}

function sendPlayerSelectHeroReadyToServer( heroId ) {
    $.Msg( "通知服务端玩家已经选择好了英雄" + heroId);
    $SYSTEM.API.SERVICE.sendEventToServer("hero_selection_player_ready", {
        "localPlayerId": $SYSTEM.API.PLAYER.getLocalPlayerID(),
        "heroId": heroId
    });
    heroSelectionReady = true;

    // mock2(); // TODO 测试使用
}