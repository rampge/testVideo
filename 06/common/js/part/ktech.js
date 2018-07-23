function extractUrlParameterMap() {
    var url = window.location.search.substring(1);
    var idx = url.lastIndexOf('?');
    var queryString = (idx=== -1)?url:url.substring(idx+1);

    var queryParameter = {};
    if ( queryString === undefined || queryString.length === 0 )
        return queryParameter;

    var items = queryString.split('&');
    for (var i= 0, l=items.length; i<l; i++) {
        var pair = items[i].split('=');
        queryParameter[pair[0]] = pair[1];
    }

    return queryParameter
}

function getContentId() {
    var param = extractUrlParameterMap();
    return param['content_id'];
}

function ktechResize() {
    if(bolPorted){
      var param = extractUrlParameterMap();
      var contentId = param['content_id'];
      var matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/,
          matches = $('body').css('transform').match(/matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/);

      var height = $('body').height() * matches[1];
      window.parent.postMessage(contentId + '_' + height,'*');
    }
}
