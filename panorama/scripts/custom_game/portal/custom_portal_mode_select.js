var INIT_DATE_FUNCTION_NAME = "[custom_portal_mode_select initData]";
var ON_READY_NAME = "[on_Ready]";
var INIT_CUSTOMER_INFO_NAME = "[init_customer_info]";

// 获取当前玩家数量
var maxPlayers = $SYSTEM.API.PLAYER.getAllPlayerIDs();

function initData(){ 
    
    $.Msg( "FUNCTION " + INIT_DATE_FUNCTION_NAME + "START" );

    initGameSetting();
    
    initElement();
    // 不知道用户信息是否能全局共享，在游戏初始化的时候就把用户数据读到缓存中，在英雄选择阶段去取、
    initCustomerInfo();

    $.Msg( "FUNCTION " + INIT_DATE_FUNCTION_NAME + "END" );

}

function initGameSetting() {
    // 锁定团队选择 玩家洗牌 倒计时不开始
    Game.SetTeamSelectionLocked( true );
    Game.ShufflePlayerTeamAssignments();
    Game.SetRemainingSetupTime( -1 );
    $.Msg( INIT_DATE_FUNCTION_NAME + " 当前游戏状态" + Game.GetState() );
}

function initElement() {

    // 渲染给所有玩家看友好提示 
    $( "#PlayerNumLabel" ).SetDialogVariable( "playerNum" , maxPlayers.length );

}

function OnReady() {
    $.Msg( "FUNCTION " + ON_READY_NAME + "START" );
    Game.SetRemainingSetupTime(1);
    $.Msg( "FUNCTION " + ON_READY_NAME + "END" );
}

function initCustomerInfo() {
    $.Msg( "FUNCTION " + INIT_CUSTOMER_INFO_NAME + "START" );

    var loaclId = $SYSTEM.API.PLAYER.getLocalPlayerID();
    var info = $SYSTEM.API.PLAYER.GetLocalPlayerInfo();
    $.Msg( "玩家信息:" + JSON.stringify(info) );
    var steamId = $SYSTEM.API.PLAYER.getPlayerSteamID();
    $.Msg( "玩家SteamID是:" + steamId + ";localId是:" + loaclId );

    $.Msg( "FUNCTION " + INIT_CUSTOMER_INFO_NAME + "END" );
}