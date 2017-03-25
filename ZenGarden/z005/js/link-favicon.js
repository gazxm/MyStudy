// (function() {
//   var doc = document;
//   var link = document.createElement("link");
//   link.setAttribute("rel", "shortcut icon");
//   link.setAttribute("type", "image/x-icon");
//   link.setAttribute("href", "http://www.csszengarden.com/favicon.ico");
//   link.setAttribute("media", "screen");

//   var heads = doc.getElementsByTagName("head");
//   if (heads.length) {
//     heads[0].appendChild(link);
//   } else {
//     doc.appendChild(link);
//   }
// })();

!function() {
  var doc = document;
  var link = document.createElement("link");
  link.setAttribute("rel", "shortcut icon");
  link.setAttribute("type", "image/x-icon");
  link.setAttribute("href", "http://www.csszengarden.com/favicon.ico");
  link.setAttribute("media", "screen");

  var heads = doc.getElementsByTagName("head");
  if (heads.length) {
    heads[0].appendChild(link);
  } else {
    doc.appendChild(link);
  }
}()
