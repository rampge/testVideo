function setController(_selector){

  this.tabIndex = 200;
  this.$controller = _selector; // 컨트롤 선택자
  this.fnConrollerInit(); // 컨트롤러 초기화 함수 호출
}

setController.prototype.fnConrollerInit = function(){
  var _this = this;

  // jquery-ui
  $('.timeLine').slider({
    range: "min",
    max: 100,
    create: function( event, ui ) {
      if(progressbarLock()) $( ".timeLine" ).slider( "disable" );
      else $( ".timeLine" ).slider( "enable" );
    },
    start: function( event, ui ) {
      mainVideo.videoDOM.pause();
    },
    stop: function( event, ui )
    {
      var persent = $('.timeLine').slider('value');
      var totTime = mainVideo.videoDOM.duration;
      mainVideo.videoDOM.currentTime = totTime * persent / 100;
      mainVideo.fnTimeUpdate();
      (mainVideo.videoDOM.currentTime != totTime) ? mainVideo.videoDOM.play() : mainVideo.videoDOM.pause();
    }
  });
  $('.soundLine').slider({
    range: "min",
    max: 100,
    value: 50,
    change: function( event, ui )
    {
      var persent = $('.soundLine').slider('value');
      mainVideo.videoDOM.volume = persent / 100;
      var soundCookie = mainVideo.videoDOM.volume;
      setCookie("soundCookie",soundCookie,10000);
    }
  });



  //버튼 객체 생성
  menu = new setButton($('.menu'), "목차", _this.tabIndex++, true);
  spd1 = new setButton($('.speed1'), "0.8배속", _this.tabIndex++, false);
  spd2 = new setButton($('.speed2'), "1.0배속", _this.tabIndex++, false);
  spd3 = new setButton($('.speed3'), "1.2배속", _this.tabIndex++, false);
  spd4 = new setButton($('.speed4'), "1.5배속", _this.tabIndex++, false);
  spd5 = new setButton($('.speed5'), "2.0배속", _this.tabIndex++, false);
  map = new setButton($('.map'), "러닝맵", _this.tabIndex++, false);
  down = new setButton($('.down'), "강의노트", _this.tabIndex++, false);
  playPause = new setButton($('.playPause'), "재생/일시정지", _this.tabIndex++, false);
  replay = new setButton($('.replay'), "다시보기", _this.tabIndex++, false);
  script = new setButton($('.script'), "자막", _this.tabIndex++, true);
  sound = new setButton($('.sound'), "소리", _this.tabIndex++, true);
  setUp = new setButton($('.setUp'), "배속", _this.tabIndex++, true);
  prevPage = new setButton($('.prevPage'), "이전페이지", _this.tabIndex++, true);
  nextPage = new setButton($('.nextPage'), "다음페이지", _this.tabIndex++, true);
  $('.curPage').html(strPage);
  $('.totPage').html(itostr(totalPage));

  this.fnSetComponent();
}

//버튼객체의 기능 정의
setController.prototype.fnSetComponent = function(){

  var _this = this;
  // 메뉴 펼치기
  menu.fnButtonOnClick(function(){
    var menuWidth = $('.indexMenu').css('width').split("px")[0] *1;
    if($('.indexMenu').css("display") == "none"){
      $('.indexMenu').fadeIn(100)
      $('.indexMenu').css("left","0px");
    }
    else {
      $('.indexMenu').fadeOut(100);
      $('.indexMenu').css("left", -menuWidth );
    }
  });

  // 러닝맵
  map.fnButtonOnClick(function(){
    if($('.map_wrap').css("display") == "none"){
      $('.map_wrap').fadeIn(400)
      mainVideo.videoDOM.pause();
    }
    else{
      $('.map_wrap').fadeOut(400);
      if($('.curTime').text() != $('.totTime').text()) mainVideo.videoDOM.play();
    }
  });
  // 다운로드
  down.fnButtonOnClick(function(){
    window.open("./common/down/"+ strChapter +".zip", "_down");
  });
  script.fnButtonOnClick(function(){
    ($('.scriptWrap').css("display") == "none") ? $('.scriptWrap').show() : $('.scriptWrap').hide();
  });
  // 속도 설정
  setUp.fnButtonOnClick(function(){
    ($('.speedWrap').css("display") == "none") ? $('.speedWrap').show() : $('.speedWrap').hide();
  });
  // 소리 설정
  sound.fnButtonOnClick(function(){
    (mainVideo.videoDOM.volume != 0)? $('.soundLine').slider('value', 0) : $('.soundLine').slider('value', 50);
  });


  //속도 설정
  spd1.fnButtonOnClick(function(){ _this.fnSetPlayBackRate(0.8, spd1.$target) });
  spd2.fnButtonOnClick(function(){ _this.fnSetPlayBackRate(1.0, spd2.$target) });
  spd3.fnButtonOnClick(function(){ _this.fnSetPlayBackRate(1.2, spd3.$target) });
  spd4.fnButtonOnClick(function(){ _this.fnSetPlayBackRate(1.5, spd4.$target) });
  spd5.fnButtonOnClick(function(){ _this.fnSetPlayBackRate(2.0, spd5.$target) });

  //재생,일시정지
  playPause.fnButtonOnClick(function(){
    (mainVideo.videoDOM.paused) ? mainVideo.videoDOM.play() : mainVideo.videoDOM.pause();
  });
  // 다시보기
  replay.fnButtonOnClick(function(){
    if(pageInfo[curChapter].quiz == curPage){
      mainVideo.$video.fadeIn(1);
      quiz.quizRefresh();
    }
    if(pageInfo[curChapter].slider == curPage){
      mainVideo.$video.fadeIn(1);
    }
    if(itrBol){
      mainVideo.$video.fadeIn(1);
    }
    mainVideo.videoDOM.currentTime = 0;
    mainVideo.videoDOM.play();

  });

  // 다음페이지
  nextPage.fnButtonOnClick(function(){
    var goPage = parseInt(curPage) + 1;
    if(goPage > totalPage ) alert("마지막 페이지 입니다.");
    else movePage(goPage, "next");
  });
  // 이전페이지
  prevPage.fnButtonOnClick(function(){
    var goPage = parseInt(curPage) - 1;
    if(goPage <= 0 ) alert("처음 페이지 입니다.");
    else movePage(goPage, "prev");
  });

  // 메뉴 닫기
  fnSetSubButton($('.closeMenu'),'메뉴닫기',_this.tabIndex++, function() {
    var menuWidth = $('.indexMenu').css('width').split("px")[0] *1;
    $('.indexMenu').fadeOut(100);
    $('.indexMenu').css("left", -menuWidth );
  });

  // 모바일 재생버튼
  fnSetSubButton($('.mobile_play_btn'),'재생',_this.tabIndex++, function() {
    mainVideo.videoDOM.play();
    $('.mobile_play_btn').hide();
  });


}


//배속기능
setController.prototype.fnSetPlayBackRate = function(_spd,_target){
  mainVideo.videoDOM.playbackRate = _spd;
  for(var i=1; i<=5; i++){
    var togleClear = $('.speed'+i);
    togleClear.removeClass("toggle");
  }
  _target.addClass("toggle");
  mainVideo.speed = _spd;
  $('.speedWrap').hide();
  $('.setUp').text("x"+_spd);
}
