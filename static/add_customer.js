
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
  return (result);
}


$(document).ready(function () {

		$("#reg").change(function() {
			if ($(this).val()==0) {
				$("#GSTN").attr("disabled", true)
			}
			if ($(this).val()==1) {
				$("#GSTN").removeAttr("disabled")
			}
		});

		
		

		$("#form").submit(function(e){
			e.preventDefault();
			// $("#submit").button("loading");
			$("#err").addClass("hid");
			$("#err").html("");
			var x = $(this).serialize();
			data = {};
			data.q = queryStringToJSON(x);
			data.q = JSON.stringify(data.q)
			console.log(data);
			$.ajax({
				type: "POST",
				url: "/add_customer/",
				data: data,
				success: function(result){
					console.log(result);
					$("#submit").button("reset");
					if (result == 1) {
						$("#err").removeClass("hid alert-danger").addClass("alert-success");
						$("#err").html("Customer added successfully! You can continue adding more.");
						$("#form")[0].reset()
						$('html,body').scrollTop(0);
					}
					if (result == 0) {	
						$("#err").removeClass("hid alert-success").addClass("alert-danger");
						$("#err").html("This customer already exist.");
						$('html,body').scrollTop(0);
					}
				}
			});
		});
});