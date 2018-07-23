function setQuiz(_xml)
{
    this.xml = null;
    this._try = 0;                      // 도전한 횟수
    this._chance = 2;                   // 기회
    this._totalPage = 0;                // 퀴즈 수
    this._correct = 0;                  // 맞춘 횟수
    this._answer = new Array();	        // 정답
    this._userAnswer = new Array(); 	  // 사용자가 선택한 답
    this._quizIndex = 50;               // 퀴즈 시작 뎁스
    this.fnAjaxToEventXml();
    this.pageShow = true;
    this.explan = false;
    this.correctFlag = [0,0,0];
    this._color = "#f7b66a";
    this.$quiz = null;

}

setQuiz.prototype.quizRefresh = function(){
  this.$quiz.remove();
  this.againQuiz();
}

setQuiz.prototype.fnAjaxToEventXml = function(){
  var _this = this;
  $.ajax({
    url : "./xml/event.xml",
    type : "POST",
    success : function(xml){
      $(xml).find("quiz").each(function() {
        if(pageInfo[curChapter].quiz == curPage) {
          quizPage = true;
          _this.initQuiz(xml);
        }
      });
    }
  });
}

setQuiz.prototype.initQuiz = function(_xml){
  this.$quiz = $('<div class="quiz"><div class="wrong_answer"></div><div class="none_check"></div>\
                    <div class="relativeWrap"><iframe src="" class="relative_pop" /><button class="pop_close"></button></div>\
                    <div class="rightHelper">\
                      <div class="right_q right_q1"><div class="right_symbol"></div></div>\
                      <div class="right_q right_q2"><div class="right_symbol"></div></div>\
                      <div class="right_q right_q3"><div class="right_symbol"></div></div>\
                    </div>\
                  </div>');





  var _this = this;
  _this.xml = _xml;

  fnSetSubButton(_this.$quiz.find('.relativeWrap > .pop_close'),'닫기',_this._quizIndex++, function() {
    _this.$quiz.find('.relativeWrap').fadeOut(100);
  });


  $(_xml).find("quiz").each(function() {
    if($(this).attr("flag") == curPage)
    {
      var totalPage = $(this).find("page").length;
      $(this).find("page").each(function(){
        var pageNum = $(this).attr("num") * 1;
        var pageType = $(this).attr("type");
        _this._answer[pageNum] = $(this).attr("answer");
        var quest = $(
         '<div class="page flag_' + pageNum + '">\
           <div class="question">\
           <div class=symbol><div class="symbol_'+pageNum+'"></div>\
           <div class=o_symbol></div>\
           <div class=x_symbol></div>\
           </div>\
           <div class=text>' + $(this).find('question > text').text() + '<div class=quest_line></div></div>\
           </div>\
           <div class="direction"><div class=text></div></div>\
           <div class="example"><div class="bg"></div></div>\
           <div class="feedback"></div>\
         </div>'
        );
        fnsetSubTitle(quest.find(".question"),$(this).find("question > alternate").text(),_this._quizIndex++);
        if($(this).find('direction> text').text()!="")
        {
          quest.find(".direction > .text").html($(this).find('direction > text').text());
          fnsetSubTitle(quest.find(".direction"),$(this).find("direction > alternate").text(),_this._quizIndex++);
          quest.find(".direction").show();
          quest.find(".example").addClass("half");
        }

        $(this).find("example").each(function(){
          var examNum = $(this).attr("num");
          var exam = $('');
          if(pageType=="half") //보기가 2개인 경우
          {
            // exam = $('<button class="'+pageType +' '+ pageType + '_' + examNum + '">\
            //                 <div class="symbol">v</div><span class="text">' + $(this).find("text").text() + '</span></button>');
            exam = $('<li class="'+pageType +' '+ pageType + '_' + examNum + '"><div class="btn btn'+$(this).attr("num")+'"></div>\
                            <span class="text">' + $(this).find("text") .text() + '</span></li>');
          }
          else if(pageType=="multiple") // 보기가 여러개일 경우
          {
            exam = $('<li class="'+pageType +' '+ pageType + '_' + examNum + '"><div class="btn btn'+$(this).attr("num")+'"></div>\
                            <span class="text">' + $(this).find("text").text() + '</span></li>');
          }
          quest.find(".example").append(exam);
          fnsetSubTitle(exam,$(this).find("alternate").text(),_this._quizIndex++);
          exam.on('click keydown', function(e) {
            if(e.type=="keydown" && e.key!="Enter") return;
            _this._userAnswer[pageNum] = examNum;
            $(this).find("div").addClass("toggle");
            $(this).closest(".example").find('div').not($(this).find("div")).removeClass("toggle");
            $(this).closest(".example").find('.'+pageType).not($(this)).css("color","#ffffff");
            $(this).css("color",_this._color);
            qiizCheck();
          });
          exam.on('mouseover', function() {$(this).css("color",_this._color);});
          exam.on('mouseleave', function() {$(this).css("color","#ffffff");});
        });
        quest.find(".feedback").append($('<div class="answer">\
                                            <div class="symbol">' + $(this).find("feedback > answer > symbol").text() + '</div>\
                                            <span class="text text_'+ $(this).find("feedback > answer > text").text() +'"></span></div>\
                                          <div class="explain"><span class=text>' + $(this).find("feedback > explain > text").text() + '</span></div>'));
        quest.find(".feedback").css("display","none");
        if(pageNum == totalPage) quest.find(".feedback").append($('<button class="result_btn"></button>'));
        else if(_this.explan ){
          quest.find(".feedback").append($('<button class="next_btn"></button>'));
        }
        else if(pageNum==1 && _this.correctFlag[pageNum]==1 && _this.correctFlag[pageNum+1]==1) {
          quest.find(".feedback").append($('<button class="result_btn"></button>'));
        }
        else if(pageNum==2 && _this.correctFlag[pageNum]==1 ) quest.find(".feedback").append($('<button class="result_btn"></button>'));
        else{  quest.find(".feedback").append($('<button class="next_btn"></button>'));}
        quest.find(".feedback").append($('<button class="relative_btn"></button>'));
         quest.find(".feedback").append($('<button class="relative_btn"></button>'));

        fnsetSubTitle(quest.find(".feedback"),$(this).find("feedback > alternate").text(),_this._quizIndex++);


        _this.$quiz.append(quest);

        //확인하기 버튼 처리
        function qiizCheck() {
          if(_this._userAnswer[pageNum]=="" || _this._userAnswer[pageNum]==undefined) //체크 안했을떄
          {
            _this.$quiz.find(".none_check").fadeIn(300).delay(500).fadeOut(300);
            return;
          }
          _this._try++;
          if(_this._userAnswer[pageNum]==_this._answer[pageNum]) // 정답일떄
          {
            _this.correctFlag[pageNum-1] = 1;
            setAudio('o_sound');
            quest.find(".feedback").show(100);
            _this.$quiz.find(".flag_"+ pageNum +" > .question > .symbol > .o_symbol").css("display","block");
            if(pageType=="multiple")   _this.$quiz.find(".flag_"+ pageNum +" > .example > .multiple").off();
            else _this.$quiz.find(".flag_"+ pageNum +" > .example > .half").off();
            _this.$quiz.find(".flag_"+ pageNum +" > .example > .multiple_"+_this._answer[pageNum]).css("color",_this._color);

            $('.rightHelper > .right_q'+pageNum + "> .right_symbol").removeClass("x_mark");
            $('.rightHelper > .right_q'+pageNum + "> .right_symbol").addClass("o_mark");
          }
          else if(_this._try < _this._chance && pageType=="multiple")
          {
            setAudio('x_sound');
            _this.$quiz.find(".wrong_answer").fadeIn(300).delay(500).fadeOut(300); //오답이지만 기회 남았을떄
            _this._userAnswer[pageNum]="";
            _this.$quiz.find(".flag_"+ pageNum +" > .example > .multiple  > .toggle").removeClass("toggle");
          }
          else //최종 오답
          {
            _this.correctFlag[pageNum-1] = 0;
            setAudio('x_sound');
            quest.find(".feedback").show(100);
            _this.$quiz.find(".flag_"+ pageNum +" > .question > .symbol > .x_symbol").css("display","block");
            $('.rightHelper > .right_q'+pageNum + "> .right_symbol").addClass("x_mark");
            if(pageType=="multiple"){
              _this.$quiz.find(".flag_"+ pageNum +" > .example > .multiple  > .btn"+_this._answer[pageNum]).addClass("correct");
              _this.$quiz.find(".flag_"+ pageNum +" > .example > .multiple_"+_this._answer[pageNum]).css("color",_this._color);
              _this.$quiz.find(".flag_"+ pageNum +" > .example > .multiple_"+_this._userAnswer[pageNum]).css("color","#fff");
              _this.$quiz.find(".flag_"+ pageNum +" > .example > .multiple").off();
            }
            else{
              _this.$quiz.find(".flag_"+ pageNum +" > .example > .half_"+_this._answer[pageNum] + "> .btn").addClass("correct");
              _this.$quiz.find(".flag_"+ pageNum +" > .example > .half_"+_this._userAnswer[pageNum] + "> .btn").addClass("toggle");
              _this.$quiz.find(".flag_"+ pageNum +" > .example > .half").off();
            }
          }
        }
        //다음 문제 버튼
        fnSetSubButton(quest.find(".feedback > .next_btn"),'다음 문제 풀기',_this._quizIndex++, function() {
          var nextPageNum = pageNum * 1 + 1;
          if(_this.correctFlag[nextPageNum-1]==1 && !_this.explan){
            nextPageNum = nextPageNum +1;
          }
          _this.$quiz.find(".flag_"+pageNum).hide(10);
          _this.$quiz.find(".flag_"+nextPageNum).show(10);
          _this._try = 0;

          $('.right_q').removeClass("toggle");
          $('.right_q'+nextPageNum).addClass("toggle");
        });
        //결과 보기 버튼
        fnSetSubButton(quest.find(".feedback > .result_btn"),'결과 보기',_this._quizIndex++, function() {
          _this.$quiz.find(".flag_"+pageNum).hide(10);
          _this.showBoard(totalPage);
          $('.rightHelper').hide();
        });
        //관련학습보기 버튼
        fnSetSubButton(quest.find(".feedback > .relative_btn"),'관련 학습 보기',_this._quizIndex++, function() {
          $('.relativeWrap > .relative_pop').get(0).src = "./pop/relative_"+pageNum+".html"
          $('.relativeWrap').fadeIn(200);
        });
        if(_this.correctFlag[pageNum-1]==0 && _this.pageShow){
          quest.css("display","block");
          _this.$quiz.find('.right_q'+pageNum).addClass("toggle");
          _this.pageShow = false;
        }
        else{
          quest.css("display","none");
        }
        if(_this.correctFlag[pageNum-1]==1){
          _this.correctFlag[pageNum-1] = 1;
          quest.find(".feedback").show(100);
          _this.$quiz.find('.rightHelper > .right_q'+pageNum + "> .right_symbol").addClass("o_mark");
          _this.$quiz.find(".flag_"+ pageNum +" > .question > .symbol > .o_symbol").css("display","block");
          _this.$quiz.find(".flag_"+ pageNum +" > .example > .multiple").off();
          _this.$quiz.find(".flag_"+ pageNum +" > .example > .half").off();
          _this.$quiz.find(".flag_"+ pageNum +" > .example > .multiple_"+_this._answer[pageNum]).css("color",_this._color);
        }
      });
    }
  });
  $('.contents').append(this.$quiz);


}



setQuiz.prototype.showBoard = function(_totPage){
  _this = this;


  _this._correct = 0;
  for(var i=0; i<_this.correctFlag.length; i++){
    if(_this.correctFlag[i]==1) _this._correct++;
  }
  _this.$quiz.css("background","url(./common/img/quiz/result_bg.png)");
  var resultBoard=$('<div class="board"><div class="top"><div class="symbol"></div><div class="totPage">'+_totPage+'</div>\
                    <div class="explain">'+_this._correct+'</div></div>\
                    <div class="middle"></div></div>');
  if(_this._correct == 3) resultBoard.append($('<button class="retry"></button><button class="explanation_btn"></button>'));
  else resultBoard.append($('<button class="wrong_retry"></button><button class="explanation_btn"></button>'));
  resultBoard.find('.top > .explain').addClass("explain_" + _this._correct);
  fnsetSubTitle(resultBoard.find('.top > .explain'),"총 " + _totPage +"문제 중 " +_this._correct+" 문제를 맞히셨습니다.",_this._quizIndex++);
  for(var i=1; i<=_totPage; i++)
  {
    var temp = $('<div class="result result_'+ i +'"><div class="symbol"></div><div class="checkSymbol"></div></div>');
    if(_this.correctFlag[i-1]==1) temp.find('.checkSymbol').addClass("o_symbol");
    else temp.find('.checkSymbol').addClass("x_symbol");

    resultBoard.find('.middle').append(temp);
  }
  fnSetSubButton(resultBoard.find('.retry'),'다시풀기',_this._quizIndex++, function() {
    _this.againQuiz();
  });
  fnSetSubButton(resultBoard.find('.wrong_retry'),'틀린 문제 다시 풀기',_this._quizIndex++, function() {
    _this.wrongRetry();
  });
  fnSetSubButton(resultBoard.find('.explanation_btn'),'정답 및 해설',_this._quizIndex++, function() {
    _this.$quiz.css("background","url(./common/img/quiz/background.png)");
    _this.explan = true;
    $('.rightHelper').show();
    resultBoard.fadeOut(100);
    $('.flag_1').fadeIn(100);
    $('.right_q').removeClass("toggle");
    $('.right_q1').addClass("toggle");
    $('.flag_1 > .feedback > .result_btn').remove();
    $('.flag_2 > .feedback > .result_btn').remove();
    $('.flag_1 > .feedback').append($('<button class="next_btn"></button>'));
    $('.flag_2 > .feedback').append($('<button class="next_btn"></button>'));
    $('.flag_1 > .feedback > .next_btn').attr("title","다음 문제 풀기");
    $('.flag_2 > .feedback > .next_btn').attr("title","다음 문제 풀기");
    $('.flag_1 > .feedback > .next_btn').on('click keydown', function(){
      _this.$quiz.find(".flag_1").hide(10);
      _this.$quiz.find(".flag_2").show(10);
      $('.right_q1').removeClass("toggle");
      $('.right_q2').addClass("toggle");
    });
    $('.flag_2 > .feedback > .next_btn').on('click keydown', function(){
      _this.$quiz.find(".flag_2").hide(10);
      _this.$quiz.find(".flag_3").show(10);
      $('.right_q2').removeClass("toggle");
      $('.right_q3').addClass("toggle");
    });
  });
  _this.$quiz.append(resultBoard);
  endVideo();
}

setQuiz.prototype.wrongRetry = function(){
  this.pageShow = true;
  this._try = 0;
  this._chance = 2;
  this._totalPage = 0;
  this.explan = false;
  this._userAnswer = [];
  this.$quiz.remove();
  this.initQuiz(this.xml);
  this.$quiz.fadeIn(1);
  playVideo();
  $('.rightHelper').show();
}

setQuiz.prototype.againQuiz = function(){
  this.pageShow = true;
  this.correctFlag = [0,0,0];
  this.explan = false;
  this._userAnswer = [];
  this._try = 0;
  this._chance = 2;
  this._totalPage = 0;
  this.$quiz.remove();
  this.initQuiz(this.xml);
  this.$quiz.fadeIn(1);
  playVideo();
  $('.rightHelper').show();
}
