$(function() {
	var client = ZAFClient.init();
	client.invoke('resize', { width: '100%', height: '400px' });
	client.get('ticket.requester.id').then(
		function(data) {
	    var user_id = data['ticket.requester.id'];
			requestUserInfo(client, user_id);

	  }
	);
});

//

function requestUserInfo(client, id) {
  var settings = {
    url: '/api/v2/users/' + id + '.json',
    type:'GET',
    dataType: 'json',
  };

  client.request(settings).then(
    function(data) {

			getArticles(data);
    },
    function(response) {
      showError(response);
    }
  );

}

function getArticles(data){
	var split = data.user.email.split("@");
	data.user.domain = split[1];

	// now query Intranet
	$.get("https://team.10degrees.uk/wp-json/wp/v2/articles-api?filter[domain]="+split[1], function(response) {

		data.articles = response;
		console.log(data.articles);
		showInfo(data);

	});

}



function showInfo(data) {


	var requester_data = {
	 'name': data.user.name,
	 'domain': data.user.domain,
	 'articles': data.articles
 };

  var source = $("#requester-template").html();
  var template = Handlebars.compile(source);
  var html = template(requester_data);
  $("#content").html(html);
}

function formatDate(date) {
  var cdate = new Date(date);
  var options = {
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  date = cdate.toLocaleDateString("en-us", options);
  return date;
}


function showError(response) {
	var error_data = {
  'status': response.status,
  'statusText': response.statusText
};
  var source = $("#error-template").html();
  var template = Handlebars.compile(source);
  var html = template(error_data);
  $("#content").html(html);
}
