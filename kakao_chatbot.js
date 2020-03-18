var keyword_music = ["노래", "음악"];
var keyword_greeting = ["ㅂㅇㄹ", "ㅎㅇ", "안녕"];
var keyword_myname = ["동건봇", "동건bot", "ㄷㄱ봇", "ㄷㄱbot", "동건", "ㄷㄱ", "더거덕", "더걱"];
var keyword_mybot = ["동건봇", "동건bot", "ㄷㄱ봇", "ㄷㄱbot"];
var keyword_slang = ["ㅄ", "ㅂㅅ", "ㅅㅂ", "병신", "시발", "ㅂ ㅅ", "쓰레기", "벌레"];
var keyword_WAYD = ["ㅁㅎ", "뭐해", "모함", "머함", "뭐함", "모해", 
"머해", "뭐행", "모행", "머행"];
var keyword_dust = ["미세먼지", "먼지", "ㅁㅅㅁㅈ", "미먼"];
var keyword_weather = ["날씨", "웨더", "weather", "비옴", "비 옴", "비와", "비 와"];

var response_greeting = ["ㅎㅇ", "ㅎㅇㅎㅇ", "안녕"];
var response_myname = ["ㅇㅇ?", "왜부름", "와이?"];
var response_WAYD = ["숨쉼", "카톡대기중", "눈깜빡거림", "그냥 있음", "비밀임",
"걍 있음", "암것도안함", "ㄴㄴ", "ㄴㄴㅁㅎ", "ㄲㄲ", "니생각"];
var response_slang = ["ㅁㅊ왜 욕해", "욕하지마셈", "왜욕함 ㅁㅊ", "왜 욕함 ㅁㅊ"];
var exclude_myname = ["이", "가", "이가", "이랑", "은", "말고"];
var exclude_request = ["않", "안", "없", "마"];

function isIncluded(text, keywords, exclude){
    var rtn = true;
    for(let i=0; i<keywords.length; i++){
        if(text.includes(keywords[i])){
            if(typeof exclude !== 'undefined'){
                for(let j=0; j<exclude.length; j++){
                    if(text.includes(keywords[i]+exclude[j])){
                        text = text.replace(keywords[i]+exclude[j], "").trim();
                        rtn = false;
                        break;
                    }
                }
            }   
            if(rtn){return text.replace(keywords[i], "").trim();}
        }
    }
    return false;
}

function random_response(responses){
    let random = Math.floor(Math.random()*responses.length);
    return responses[random];
}

function dust_emote(status){
    let emote;
    switch(status){
        case "좋음":
        emote = "(delighted)";
        break;
        case "보통":
        emote = "(beams)";
        break;
        case "나쁨":
        emote = "(tearing)";
        break;
        case "매우나쁨":
        emote = "(horrified)";
        break;

    }
    return emote;
}

function request_dust_info(){
    let html = Utils.getWebText("https://m.weather.naver.com/m/main.nhn?regionCode=02117101");
    let fdContext = html.split('<li class="finedust">')[1];
    let udContext = fdContext.split('</span>')[1];
    let fdLevel = fdContext.split('>',2)[1].split('<em')[0];
    let fdValue = fdContext.split('<em>')[1].split('</em>')[0];
    let udLevel = udContext.split('>',2)[1].split('<em')[0];
    let udValue = udContext.split('<em>')[1].split('</em>')[0];


    let result = "[동건bot]미세먼지 알림\n" + "*미세먼지 : " 
        + fdLevel + "(" + dust_emote(fdLevel) + ") - " + fdValue + "\n"
        + "*초미세먼지 : "
        + udLevel + "(" + dust_emote(udLevel) + ") - " + udValue;
    
    return result;
}

function request_weather_info(){
    let html = Utils.getWebText("https://m.weather.naver.com/m/main.nhn?regionCode=02117101");
    let dgContext = html.split('<div class="set set_text">')[1];
    let cdegree = dgContext.split('<em class="degree_code full">')[1].split('</em>')[0];
    let ldegree = dgContext.split('<span class="day_low">')[1].split('<em class="degree_code">')[1].split('</em>')[0];
    let hdegree = dgContext.split('<span class="day_high">')[1].split('<em class="degree_code">')[1].split('</em>')[0];
    let summary = dgContext.split('<div class="weather_set_summary">')[1].split('</div>')[0]
        .replace('<br>', "\n").replace('<em class="degree degree_code">', "").replace('</em>', "").trim();

    let result = "[동건bot]날씨 알림\n" + "*현재기온 : "
        + cdegree + "\n*최고기온 : " + hdegree + "\n*최저기온 : " + ldegree
        + "\n\n==>" + summary;
        
    return result;

}

function response(room, msg, sender, isGroupChat, replier, imageDB) {
    var reply_msg = "";
    var reply_condition = {
        call_myname: false,
        call_botname: false,
        call_greeting: false
    
    }

    //ㅂㅇㄹ
    if(isIncluded(msg, ["ㅂㅇㄹ"]) !== false){
        replier.reply(sender + " ㅂㅇㄹ");
    }
    
    //나를 불렀을 때 응답처리
    if(isIncluded(msg, keyword_myname, exclude_myname) !== false){
        reply_condition.call_myname = true;
        msg = isIncluded(msg, keyword_myname, exclude_myname);
        
        //인사하기
        if(isIncluded(msg, keyword_greeting) !== false){
            replier.reply(random_response(response_greeting));
            return;
        }

        //뭐하는지 묻기
        if(isIncluded(msg, keyword_WAYD) !== false){
            replier.reply(random_response(response_WAYD));
            return ;
        }
        //욕하기
        if(isIncluded(msg, keyword_slang) !== false){
            replier.reply(sender + " " + random_response(response_slang));
            return;
        }
        
        //미세먼지 요청
        if(isIncluded(msg, keyword_dust) !== false){
            if(isIncluded(msg, exclude_request) === false){
            
                replier.reply(request_dust_info());
                return;
            }else{
                replier.reply("오키");
                return;
            }
        }

        //날씨 요청
        if(isIncluded(msg, keyword_weather) !== false){
            if(isIncluded(msg, exclude_request) === false){
            
                replier.reply(request_weather_info());
                return;
            }else{
                replier.reply("오키");
                return;
            }
        }

        //Default응답
        if(msg === ""){
            replier.reply(sender + " " + random_response(response_myname));
        }
    }
    else if(isIncluded(msg, ["ㅋㅋ"]) !== false){
        if(Math.random()<0.3){return;}
        if(sender == "영근"){
            let random = Math.floor(Math.random()*4+4);
            replier.reply("ㅋ".repeat(random));
        }
        else{ 
            if(isIncluded(msg, ["ㅋㅋㅋ"]) !== false){
                replier
                let random = Math.floor(Math.random()*4+4);
                replier.reply("ㅋ".repeat(random));
            }
        }
    }
    
    if(msg.includes('/정보')){
      	replier.reply("방 이름 : " + room);
      	replier.reply("요청 : " + sender);
      	replier.reply("단톡 : " + isGroupChat);
    }
    

}

//이 아래 6가지 메소드는 스크립트 액티비티에서 사용하는 메소드들
function onCreate(savedInstanceState, activity) {}
function onStart(activity) {}
function onResume(activity) {}
function onPause(activity) {}
function onStop(activity) {}
function onDestroy(activity) {}