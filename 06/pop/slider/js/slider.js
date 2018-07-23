$(document).ready(function() {
  _this = this;

  $('.slideWrap').slick({
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    adaptiveHeight: true
  });

    if($('.slideWrap').slick('getSlick').slideCount == 1){
      $('.arrowWrap').hide();
      endVideo();
    }
    else $('.tot_slide').text($('.slideWrap').slick('getSlick').slideCount);
    $('.slideWrap').on('afterChange', function(event, slick, currentSlide){
      if(currentSlide == slick.slideCount - 1) {
        $('.next_arrow').hide(1);
      }
      else $('.next_arrow').show(1);

      if(currentSlide == 0){$('.prev_arrow').hide(1);}
      else $('.prev_arrow').show(1);

      $('.cur_slide').text(currentSlide+1)
    });
    $('.prev_arrow').on("click",function(){ $('.slideWrap').slick('slickPrev'); });
    $('.next_arrow').on("click",function(){ $('.slideWrap').slick('slickNext'); });



});
