let emails = `
jcp-eic@aip.org
frdhm672@gmail.com
naturaone@gmail.com
`.trim().split('\n');
let SIId = 1161302;

let baseUrl = `https://susy.mdpi.com/guest_editor/add_paper_invitation/${SIId}/to_be_contacted/1?email=`;
emails.forEach(function(email, index) {
  let url = baseUrl + encodeURIComponent(email);
  setTimeout(function() {
    $.get(url).done(function() {}).fail(function(err) {
        console.error("Failed for:", email);
      });
  }, index * 50); // 每50毫秒请求一个
});