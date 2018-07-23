//config
var pageInfo	= new Array();  // 페이지 정보
pageInfo[6]	= {tPage:9, interactive:"",quiz:7,slider:8}; // interactive: 상호작용페이지 ex) interactive:"7,9,10"

var chapterInfo	= new Array();
chapterInfo[1] = "아키텍처 설계 프로세스";
chapterInfo[2] = "아키텍처 종류";
chapterInfo[3] = "아키텍처 구조화 패턴";
chapterInfo[4] = "아키텍처 동적 패턴";
chapterInfo[5] = "UI 스토리보드 작성";
chapterInfo[6] = "Wireframe, Mockup을 이용한 UI 설계";
chapterInfo[7] = "UI와 UX";
chapterInfo[8] = "UI 네비게이션 디자인";
chapterInfo[9] = "UX와 감성공학";
chapterInfo[10] = "아키텍처 설계 확인 실습";
chapterInfo[11] = "UI 설계 확인 실습";
chapterInfo[12] = "프로토타입 확인 실습";

var bolPorted = false; // 포팅여부
var bolPLock = false; // 메뉴 잠금 여부
var bolTLock = false; // 제어바 잠금 여부
var strInitial = "HA";                // 과정 이니셜
var strYear = '2018';			         	// 제작 년도
var strMaking = 'TRIGIT';		      	// 제작회사
var strClient = 'koreaTech';		    // 발주처
var menuType  = "page"  // 메뉴타입 ("page : 페이지이동  time : 시간이동")
var scriptVersion = "scroll"  // 자막 버전 ("scroll : 스크롤 자막  twoLine : 두줄 자막")
var scriptType = "jump"  // 자막 검색 타입 ("jump : 화면이동  search : 자막검색")
var strChapter = getURL(0).split("_")[0]; // 현재 차시(문자)
var strPage = getURL(0).split("_")[1];    // 현재 페이지(문자);
var osType = getOSType();                 // 사용 os
var browserType =  getBrowserType();      // 사용 browser
var mobileOS = (osType == "iPhone OS" || osType =="Android OS");
var curChapter = parseInt(strChapter); // 현재 차시(정수)
var curPage = parseInt(strPage);    // 현재 페이지(정수)
var totalPage = pageInfo[curChapter].tPage; //전체 페이지 수
var mediaSpd = 1;         // 비디오 초기 속도
var lastIndex = 200;      // 탭 시작 번호
var contentScale = 1;     // 콘텐츠 스케일 최대 1
var quizPage = false;     // 현재 페이지가 퀴즈(상호작용)페이지인지 체크
var itrArr = pageInfo[curChapter].interactive.split(","); // 상호작용 페이지
var itrBol = false; //상호작용 페이지 여부
for(var i=0; i<= itrArr.length; i++){
  var tmpItr = itrArr[i] * 1;
  if(tmpItr == curPage) itrBol = true;
}
