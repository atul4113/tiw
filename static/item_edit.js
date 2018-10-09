
var post_redirect = function(url,data){
	var form = document.createElement("form");
	form.method = 'post';
	form.action = url;
	var input = document.createElement('input');
	input.type = "text";
	input.name = "data";
	input.value = data;
	form.appendChild(input);
	document.body.appendChild(form);
	form.submit();
}

function queryStringToJSON(queryString) {
  if(queryString.indexOf('?') > -1){
    queryString = queryString.split('?')[1];
  }
  var pairs = queryString.split('&');
  var result = {};
  pairs.forEach(function(pair) {
    pair = pair.split('=');
    result[pair[0]] = decodeURIComponent(pair[1] || '');
  });
  return JSON.stringify(result);
}


$(document).ready(function () {

		$("#form").submit(function(e){
			e.preventDefault();
			$("#submit").button("loading");
			$("#err").addClass("hid");
			$("#err").html("");
			$(".disabled").each(function(i,obj){
				$(this).removeAttr("disabled");
			});
			var x = $(this).serialize();
			data = {};
			data.q = queryStringToJSON(x);
			console.log(data);
			$(".disabled").each(function(i,obj){
				$(this).attr("disabled", true);
			});
			$.ajax({
				type: "POST",
				url: "/edit_item/"+$("#id").text(),
				data: data,
				success: function(result){
					console.log(result);
					$("#submit").button("reset");
					if (result == 1) {
						$("#err").removeClass("hid alert-danger").addClass("alert-success");
						alert("Item updated successfully!");
						window.location = "/show_items"
					}
					if (result == 0) {	
						$("#err").removeClass("hid alert-success").addClass("alert-danger");
						$("#err").html("This item already exist.");
						$('html,body').scrollTop(0);
					}
				}
			});
		});
});