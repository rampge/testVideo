function setVideo(selector){
  this.$video = null;
  this.videoDOM = null;
  this.curTime = null;
  this.totTime = null;
  this.speed = 1;
  if(mobileOS) this.volume = 0.5;
  else if(document.cookie.length>0) this.volume = (getCookie("soundCookie")) ? getCookie("soundCookie") * 1 : 0.5;
  else this.volume = 0.5;
  this.movieName = strInitial + strChapter + "_" +  strPage +".mp4"; //영상 이름
  this.moviePath = "./mov/"+ this.movieName;  // 영상 위치


  this.fnInitialization(selector);
}

setVideo.prototype.fnInitialization = function(selector){
  var _this = this;
  this.$video = selector;
  this.videoDOM = this.$video.get(0);
  this.videoDOM.src = this.moviePath;
  this.videoDOM.load();
  //비디오 로딩완료 시점
  this.videoDOM.addEventListener('canplaythrough', function() {
    _this.totTime = _this.videoDOM.duration;
    _this.videoDOM.volume = _this.volume;
    $('.soundLine').slider('value',_this.videoDOM.volume * 100);
    _this.videoDOM.playbackRate = _this.speed;
    $('.totTime').html(clock(_this.totTime));
    _this.fnVideoTrigger(_this.$video); 
    this.play();
  }, false);
}

setVideo.prototype.fnVideoTrigger = function(selector){
  var _this = this;
  this.$video.on('timeupdate', function() {
    _this.fnTimeUpdate();
  });

  //영상 완료 시
  this.$video.on('ended',function(){
    _this.videoDOM.pause();
    if(itrBol){
      _this.$video.fadeOut(500);
      $('.interactive').fadeIn(1);
      return;
    }
    else if(pageInfo[curChapter].quiz == curPage){
      _this.$video.fadeOut(500);
      quiz.$quiz.fadeIn(800);
    }
    else if(pageInfo[curChapter].slider == curPage){
      _this.$video.fadeOut(500);
      //slider.js 함수 호출
      createSlider();
    }
    else if(curPage != totalPage)
    {
      endVideo();
    }
  });
  // 볼륨 변환 시
  this.$video.on('volumechange', function() {
    $('.soundLine').slider('value',_this.videoDOM.volume * 100);
    if(_this.videoDOM.volume == 0) {
      $('.sound').addClass('toggle');
      $('.sound').parent().find(".tooltips").text("소리 켬");
      $('.sound').attr("title", "소리 켬");
    }
    else{
      $('.sound').removeClass('toggle');
      $('.sound').parent().find(".tooltips").text("소리 끔");
      $('.sound').attr("title", "소리 끔");
    }
  });
  // 일시정지일 떄
  this.$video.on('pause', function() {
    $('.playPause').addClass('play');
    $('.playPause').removeClass('pause');
    if(_this.videoDOM.currentTime != _this.videoDOM.duration && mobileOS) $('.mobile_play_btn').show();
    else{
      $('.playPause').parent().find(".tooltips").text("재생");
      $('.playPause').attr("title", "재생");
    }
  });
  // 재생 중일 때
  this.$video.on('play', function() {
    $('.playPause').addClass('pause');
    $('.playPause').removeClass('play');

    _this.videoDOM.playbackRate = _this.speed;
    if(mobileOS) $('.mobile_play_btn').hide();
    else{
      $('.playPause').parent().find(".tooltips").text("일시정지");
      $('.playPause').attr("title", "일시정지");
    }
    playVideo();
  });

}

setVideo.prototype.fnTimeUpdate = function(){
  this.curTime = this.videoDOM.currentTime;
  $('.curTime').html(clock(this.curTime));
  var percent = this.curTime / this.totTime * 100;
  if(percent >= 100) percent = 100;
  percent = Math.floor(percent) + "%"
  $('.timeLine >.ui-slider-handle').css('left',percent);
  $('.timeLine >.ui-slider-range').width(percent);
}
