
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
			if ($(this).val()>0) {
				$("#GSTN").removeAttr("disabled")
			}
		});

		var items = [];
		var added = [];

		$("#item_name").autocomplete({
			source:function(request, response) {
				$.getJSON("/auto_item/",{
						q: request.term, // in flask, "q" will be the argument to look for using request.args
					}, function(data) {
						var mug=[];
						var sug = data.suggestions;
						for (i = 0; i < sug.length ; i++){
							var t = {};
							t.label = sug[i].label+","+sug[i].value;
							t.value = null;
							mug.push(t);
						}
						console.log(mug);
						response(mug); // suggestions from jsonify
					});
				},
				// appendTo: "#container",
				minLength: 1,
				select: function(event, ui) {
				// console.log(ui.item.value); // not in your question, but might help later
					item_id= ui.item.label.split(",")[1];
					item_name = ui.item.label.split(",")[0];
					itm = {}
					itm.id = item_id
					itm.name = item_name
					if (added.indexOf(itm.name)==-1) {
						items.push(itm);
						added.push(itm.name);
						$("#item_list").append('<tr class="row"> <td class="col-xs-6">'+item_name+'</td><td class="col-xs-6">'+item_id+'</td></tr>');
						console.log(items);
					}
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
			data.q.items = items
			data.q = JSON.stringify(data.q)
			console.log(data);
			$.ajax({
				type: "POST",
				url: "/edit_vendor/"+$("#id").text(),
				data: data,
				success: function(result){
					console.log(result);
					$("#submit").button("reset");
					if (result == 1) {
						$("#err").removeClass("hid alert-danger").addClass("alert-success");
						alert("Vendor updated successfully!");
						window.location = "/show_vendors";
					}
					if (result == 0) {  
						$("#err").removeClass("hid alert-success").addClass("alert-danger");
						$("#err").html("This vendor already exist.");
						$('html,body').scrollTop(0);
					}
				}
			});
		});
});