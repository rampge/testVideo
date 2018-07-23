$(document).ready(function() {
  var _this = this;
  _this.$contents = $('.contents');
  controller = new setController($('.controller'));
  mainVideo = new setVideo($('.video1'));
  script = new setScript();
  menu = new setMenu()
  quiz = new setQuiz();

  if(bolPorted)
  {
    $('.menu').hide();
    $('.map').hide();
    $('.pageBox').hide();
    $('.movePage').hide();
  }

  if( mobileOS )
  {
    $('.down').hide();
    $('.mobile_play_btn').show();
    $('.sound').hide();
    $('.soundLineWrap').hide();
  }

  $( window ).resize(function() {
    scaleChange($('body'));
    ktechResize();
  });
  if(osType == "iPhone OS"){
    window.onorientationchange = function() {
      scaleChange($('body'));
      ktechResize();
    }
  }
  $(window).resize();

  $('.titleWrap > .text').html(chapterInfo[curChapter]);  // 타이틀 설정
  learningMap();                                      // 러닝맵 설정
});



$(document).keydown(function(keyEvent) {
      timeValue = 10;
      getKey = keyEvent.keyCode;
      switch (getKey) {

        case 37: //왼
          if(Number(mainVideo.videoDOM.currentTime) - timeValue <= 0) mainVideo.videoDOM.currentTime = 0;
          else mainVideo.videoDOM.currentTime = Number(mainVideo.videoDOM.currentTime) - timeValue;
          break;
        case 39: //오른
          if(Number(mainVideo.videoDOM.currentTime) + timeValue >= Number(mainVideo.videoDOM.duration)) mainVideo.videoDOM.currentTime = Number(mainVideo.videoDOM.duration);
          else mainVideo.videoDOM.currentTime = Number(mainVideo.videoDOM.currentTime) + timeValue;
          break;
      }
});
