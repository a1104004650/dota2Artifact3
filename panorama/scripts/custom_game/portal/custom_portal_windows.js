// 阵营分配监听
GameEvents.Subscribe( "player_info", OnPlayerInfoUpdate );

GameEvents.Subscribe( "game_sys_info", OnGameSysInfoUpdate );

var positionRule;

function initData(){ 
    $.Msg("FUNCTION custom_portal_windows init" + Game.GetState());
    // 通知后台玩家已经进入
    sendGameProgressReadyToServer();
}

// 根据人数来渲染多少人
function initElement( playerInfo ) {
    for(var key in playerInfo)  {
        // 自己的信息
        if(playerInfo[key].localPlayerId == $SYSTEM.API.PLAYER.getLocalPlayerID()) {
            PLAYER_INFO = playerInfo[key];
            SELF_HERO_INFO = HERO_INFO[playerInfo[key].heroId]
            // 渲染自己的信息
            CORE.buildSelfInfo();
            // 渲染UI信息
            CORE.buildHeroPosition( Object.getOwnPropertyNames(playerInfo).length , playerInfo[key].index );

            CORE.buildOtherPlayer( playerInfo );
            break;
        }
    }

    sendBeginGameToServer();
}

function OnPlayerInfoUpdate( data ) {
    // 初始化模式和UI
    initElement( data );
}

function OnGameSysInfoUpdate( data ) {
    CORE.buildSysInfo( data );
}

// 通知后台玩家已经进入
function sendGameProgressReadyToServer() {
    $.Msg( "通知服务端玩家已经进入GameProgress" );
    $SYSTEM.API.SERVICE.sendEventToServer("game_progress_ready", {
        "localPlayerId": $SYSTEM.API.PLAYER.getLocalPlayerID()
    });
    // TODO MOCK
    mock();
}

function mock() {

    $SYSTEM.API.SERVICE.sendEventToServer("game_progress_ready", {
        "localPlayerId": 1
    });
    $SYSTEM.API.SERVICE.sendEventToServer("game_progress_ready", {
        "localPlayerId": 2
    });
    $SYSTEM.API.SERVICE.sendEventToServer("game_progress_ready", {
        "localPlayerId": 3
    });
}

function sendBeginGameToServer() {
    
}

function toggleClass( id , style ) {
    if($("#"+id).BHasClass(style)){
        $("#"+id).RemoveClass(style);
    }else{
        $("#"+id).AddClass(style);
    }
}