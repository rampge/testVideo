function learningMap(){
  for(var i=1; i<chapterInfo.length; i++){
    var section = $('.map_middle_section').eq(Math.floor(i/9));
    var part = $('<div class="map_part"><span class="map_part_num">'+itostr(i)+'</span><span class="map_part_text">'+chapterInfo[i]+'</span></div>')
    section.append(part);
  }
  for(var i=0; i<=totalPage-1; i++){
    if($('.map_middle_section > .map_part').eq(i).find('.map_part_num').text() == strChapter){
      $('.map_middle_section > .map_part').eq(i).addClass("toggle");
      $('.map_middle_section > .map_part').eq(i).find('.map_part_num').addClass("toggle");
    }
  }
  fnSetSubButton($('.map_close'),'러닝맵 닫기',this.tabIndex++, function() {
    $('.map_wrap').fadeOut(400);
    if($('.curTime').text() != $('.totTime').text()) mainVideo.videoDOM.play();
  });
}
