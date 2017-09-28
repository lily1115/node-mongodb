var request = require('request');

// request.post({
  // url: "http://127.0.0.1:3000",
  // json: {"owner": "bottle00", "type": "male", "content": "content00"}
// });
var json =  { owner: "bottle00", type: "male", content: "content00"}
var json1 = {"owner": "bottle", "type": "male", "content": "content"}
// request.post({url:'http://127.0.0.1:3000?owner=lily&&type=male&&content=mycontent'}, function (err, httpResponse, body) {
request.post({url:'http://127.0.0.1:3000', form: json}, function (err, httpResponse, body) {
  if (err) {
    return console.error('upload failed:', err);
  }
  console.log('Upload successful!  Server responded with:', body, httpResponse);
});
// for (var i = 1; i <= 5; i++) {
//   (function(i) {
//     request.post({
//       url: "http://127.0.0.1:3000",
//       json: {"owner": "bottle" + i, "type": "male", "content": "content" + i}
//     });
//   })(i);
// }

// for (var i = 6; i <= 10; i++) {
//   (function(i) {
//     request.post({
//       url: "http://127.0.0.1:3000",
//       json: {"owner": "bottle" + i, "type": "female", "content": "content" + i}
//     });
//   })(i);
// }