function GetJsonFromFile(filepath, callbackFn) {
  var client = new XMLHttpRequest();
  client.open('GET', filepath);
  client.onreadystatechange = function() {
    if (client.readyState == 4) {
      var data = JSON.parse(client.responseText);
      callbackFn(data);
    }
  }
  client.send();
}

function getCookie() {
  var json_cookie = {};
  var cookies_str = document.cookie;
  cookies_str = cookies_str.split("; ");
  // iterate over cookie pairs
  for (var c in cookies_str) {
    c = cookies_str[c].split("=");
    var pair = [];
    for (var i in c) {
      if (c[i] != "" && !c[i].includes("=")) {
        c[i] = c[i].replace('"', '');
        c[i] = c[i].replace('"', '');
        c[i] = decodeURI(c[i]);
        pair.push(c[i]);
      }
    }
    if (pair.length == 2) {
      json_cookie[pair[0]] = pair[1];
    } else {
      console.log("Illegal cookie format...");
      return null;
    }
  }
  return json_cookie;
}

function setCookie(json_cookie, days) {

  // Vanilla JS Method
  // var expiration = new Date();
  // expiration.setDate(expiration.getDate()+days);
  //
  // for (var key in json_cookie) {
  //   key = encodeURI(key);
  //   var value = encodeURI(json_cookie[key]);
  //   document.cookie =  `"${key}" = "${value}"; expires=${expiration.toUTCString()}`;
  // }

  // JQuery Method
  for (var key in json_cookie) {
    key = key;
    var value = json_cookie[key];
    $.cookie(key, value, { expires: days, path: '/' });
  }
}

function deleteCookie(json_cookie) {
  setCookie(json_cookie, -1);
}
