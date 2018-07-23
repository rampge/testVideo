var indexArr = new Array();


indexArr[6]			= "Wireframe, Mockup을 이용한 UI 설계";

var totalChap = indexArr.length;

var curPage = 1;
var totalPage = 17;

function itostr(_num){
	return _num < 10 ? "0" + _num : _num;
}

var aColor = ["info", ""];
var nColorCount = 0;

var courseTitle = "한국기술교육대학교";
var subTitle = "화면 구현 part 1";
document.title = courseTitle;

$(document).ready(function($) {
	createTable();
	showPage(curPage);
	setPageNavi();
});


function createTable(){
	for(i=1; i<indexArr.length; i++){
		if(indexArr[i] != undefined && indexArr[i] != "" && indexArr[i].indexOf("0") == -1)
		{
			var title = '<tr class="'+aColor[nColorCount]+'"><td><span class="shuffle" id="list-'+i+'">' +i+". " + indexArr[i] + '</span></td>';
			var btn = '<td class="tac">';
			var clickBtn = '<a href="javascript:openPopupFromIndex('+i+');" onFocus="this.blur()" class="btn btn-success btn-xs">보기</a></td></tr>';
			var appendTag = title + btn + clickBtn;
			nColorCount++;
			if(nColorCount == 2) nColorCount = 0;
			$('.tableList').append(appendTag);
		}
	}

	//title
	$('.sp_title').text(courseTitle);
	$('.sub_title').text(subTitle);

	$('.shuffle').click(function(){
		var strId = $(this).attr("id");
		var curId = strId.split("list-")[1];
		openPopupFromIndex(curId);
	});

	$('.pop-modal-btn').show();
}

function alertMoveEnd(){
	$('#alert-message').animate({
		left:"80%"}, 300, alertHide
	);
}

function alertHide(){
	$('#alert-message').hide()
	$('#alert-message').css("left", "0px");
}

function OpenWindow(url, name, left, top, width, height, toolbar, menubar, location, status, scrollbars, resizable)
{
	toolbar_str = toolbar ? 'yes' : 'no';
	menubar_str = menubar ? 'yes' : 'no';
	location_str = location ? 'yes' : 'no';
	status_str = status ? 'yes' : 'no';
	scrollbars_str = scrollbars ? 'yes' : 'no';
	resizable_str = resizable ? 'yes' : 'no';
	window.open( url, name, 'left='+left+',top='+top+',width='+width+',height='+height+',toolbar='+toolbar_str+',menubar='+menubar_str+',location='+location_str+',status='+status_str+',scrollbars='+scrollbars_str+',resizable='+resizable_str);
}


function openPopupFromIndex(_url){
	var chapter = itostr(_url);
	var url = chapter + "/01.html";
	var wid = eval(screen.availWidth); // 모니터 가로
	var hig = eval(screen.availHeight); // 모니터 세로

	url = chapter + "/" + chapter + "_01.html";
	OpenWindow(url, "ko", 50, 50, 1000, 660, 0, 0, 0, 0, 0, 0);

}


function openHelp(url){
	OpenWindow(url, 'help', 50, 50, 600, 568, 0, 0, 0, 0, 0, 0);
}


function showPage(_page){
	for(var i = 1; i<=totalPage; i++){
		var page = $("#page"+i);
		var btnPage = $("#pagenum"+i);
		btnPage.parent().removeClass("disabled");
		page.hide();
	}

	curPage = _page;
	$("#pagenum"+_page).parent().removeClass("active");
	$("#pagenum"+_page).parent().addClass("disabled");
	$("#page"+_page).show();
}

function setPageNavi(){
	for(var i = 1; i<=totalPage; i++){
		var btnPage = $("#pagenum"+i);
		btnPage.click(function(e){
			e.preventDefault();
			var curId = $(this).attr("id");
			var movepage = curId.split("pagenum")[1];
			showPage(parseInt(movepage, 10));
		});
	}

	$("#prev").click(function(e){
		e.preventDefault();
		if(curPage > 1){
			showPage(curPage - 1);
		}else{
			//alert("첫 페이지 입니다.");
			$('#alert-message').show();
			$('.alert-box').text("첫 페이지 입니다.");
			$('#alert-message').animate({
													left:"44%"}, 600, alertMoveEnd
													).delay(1000);
		}
	});

	$("#next").click(function(e){
		e.preventDefault();
		if(curPage < totalPage){
			showPage(curPage + 1);
		}else{
			$('#alert-message').show();
			$('.alert-box').text("마지막 페이지 입니다.");
			$('#alert-message').animate({
													left:"44%"}, 600, alertMoveEnd
													).delay(1000);
		}
	});
}
