// 系统信息 基本信息
var SYS_GAME_INFO;
// 玩家自己的信息
var PLAYER_INFO;
// 本地玩家英雄信息
var SELF_HERO_INFO;
var ALL_PLAYER_INFO;

// custom_portal_windows.js 初始化时 使用 buildSelfInfo buildHeroPosition buildSysInfo buildOtherPlayer
// 断线重连后也获取这些固定信息 开始同步 英雄信息之类的。。 客户端 TO 服务端 TO 所有客户端
// 基本逻辑就是归谁的回合 谁就触发事件，阶段跳转事件 客户端 TO 所有客户端 出牌事件 客户端 TO 所有客户端
// 伤害计算，英雄信息同步事件 客户端 TO 服务端 TO 所有客户端
var CORE = {
    // 实时基础数据和英雄数据
    updateSystemInfo: function() {

        // 任何阶段，命令都需要调用该方法

    },
    // 渲染自身英雄信息
    buildSelfInfo: function() {
        $("#HeroImg").SetImage("file://{images}/custom_game/card/" + SELF_HERO_INFO.img);
        $("#HeroAtkValue").text =  SELF_HERO_INFO.attack;
        $("#HeroDefValue").text =  SELF_HERO_INFO.def;
        $("#HeroHealthValue").text =  SELF_HERO_INFO.health;
        $("#HeroHealthMaxValue").text =  SELF_HERO_INFO.maxHealth;
        $("#HeroAngerValue").text =  SELF_HERO_INFO.anger;
        $("#HeroAngerMaxValue").text =  SELF_HERO_INFO.maxAnger;
        $("#HeroCardNumValue").text =  SELF_HERO_INFO.cardNum ? SELF_HERO_INFO.cardNum : 0 ;
        $("#HeroCardNumMaxValue").text =  SELF_HERO_INFO.maxCardNum;
        $("#HeroGoldNumValue").text =  SELF_HERO_INFO.gold ? SELF_HERO_INFO.gold : 0 ;
        // 自己的阵营
        var campSrc = "file://{images}/custom_game/card/1009_psd.png";
        if("radiant" == PLAYER_INFO.campType){
            campSrc = "file://{images}/custom_game/card/1098_psd.png";
        }else if("dire" == PLAYER_INFO.campType){
            campSrc = "file://{images}/custom_game/card/1526_psd.png";
        }
        $( "#PlayerTeam" ).SetImage(campSrc);
    },
    // 渲染其它英雄的UI盒子
    buildHeroPosition: function( playerNum , localPlayerIndex ) {
         // 位置规则
        var positionRule = PLAYER_POSITION_RULE[playerNum][localPlayerIndex - 1];
        $.Msg( "当前本地玩家位置：" + localPlayerIndex + ";匹配到的UI规则:" +  JSON.stringify(positionRule));+
        $.Msg( "最大玩家数:" + playerNum );
        for( var i = 0; i < playerNum - 1 ; i++ ) {
            $("#Player" + positionRule[i]).RemoveClass("Hidden");
        }
    },
    buildSysInfo: function( data ) {
        // 中立任务
        $("#NeutralCampTaskText").text = NEUTRAL_TASK_TEXT.get(data["NeutralCampTask"]);

        $("#RadiantPlayerAliveNum").text = data["RadiantPlayerAliveNum"];
        $("#DirePlayerAliveNum").text = data["DirePlayerAliveNum"];
        $("#NeutralPlayerAliveNum").text = data["NeutralPlayerAliveNum"];
    },
    // 构建其它玩家信息
    buildOtherPlayer: function( allPlayerInfo ) {

        for(var key in allPlayerInfo)  {
            // 其它玩家的信息
            if(allPlayerInfo[key].localPlayerId != $SYSTEM.API.PLAYER.getLocalPlayerID()) {
                CORE.buildOtherHeroInfo( HERO_INFO[allPlayerInfo[key].heroId] , allPlayerInfo[key].index );
    
                $("#Player" + allPlayerInfo[key].index + "Name").text = allPlayerInfo[key].playerInfo.player_name;
            }
    
        }

    },
    buildOtherHeroInfo: function( heroInfo , index ) {
        $("#Player" + index + "HeroImg").SetImage("file://{images}/custom_game/card/" + heroInfo.img);
    }

}
