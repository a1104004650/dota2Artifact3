function initLoading(){
    getGuideTxt();
}

function clickZhiyin(){
    $.Msg("click here")
}

function getGuideTxt(){
    $.Msg("FUNCTION getGuideTxt START");
    var guideMsg = [
        $.Localize("#GAME_MSG_GUIDE_TXT1"),
        $.Localize("#GAME_MSG_GUIDE_TXT2")
    ]
    var index = getRandomNumberByRange(0, guideMsg.length);
    $.Msg(index + guideMsg[index]);
    $.Msg("FUNCTION getGuideTxt END");
    $( "#grideText" ).text = guideMsg[index];
}

function getRandomNumberByRange(startIndex, endIndex){
    return Math.floor(Math.random() * (endIndex - startIndex) + startIndex);
}