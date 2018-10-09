
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
  return result;
}

$(document).ready(function () {

var items = [];
var curr_item = {};
var vendor = {}


        $("#vendor_name").autocomplete({
        source:function(request, response) {
            $.getJSON("/auto_vendor",{
                q: request.term, // in flask, "q" will be the argument to look for using request.args
            }, function(data) {
                var mug=[];
                var sug = data.suggestions;
                for (i = 0; i < sug.length ; i++){
                    var t = {};
                    t.label = sug[i].label+","+sug[i].value;
                    t.value = sug[i].label;
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
            vendor_id= ui.item.label.split(",")[1];
            $.get("/fetch_vendor/"+vendor_id,function(data){
                console.log("vendor data:"+(JSON.stringify(data)));
                vendor = data;
                $("#vendor_id").val(vendor.id);
                $.get("/session/",function(user){
                    if (vendor.state == user.state) {
                        $("#type_of_supply").val("0");
                    } else{
                        $("#type_of_supply").val("1");
                    }
                });
            });
            
        }
    });









        $("#item_name").autocomplete({
        source:function(request, response) {
            $.getJSON("/vendor_item/"+vendor._id,{
                q: request.term, // in flask, "q" will be the argument to look for using request.args
            }, function(data) {
                var mug=[];
                var sug = data.suggestions;
                for (i = 0; i < sug.length ; i++){
                    var t = {};
                    t.label = sug[i].label+","+sug[i].value;
                    t.value = sug[i].label;
                    mug.push(t);
                }
                console.log(mug);
                response(mug); // suggestions from jsonify
            });
        },
        // appendTo: "#container",
        minLength: 0,
        select: function(event, ui) {
            // console.log(ui.item.value); // not in your question, but might help later
            item_id= ui.item.label.split(",")[1];
            item = $.get("/fetch_item/"+item_id,function(data){
                console.log("item data:"+(JSON.stringify(data)));
                item = data;
                curr_item = item;
            });
            
        }
    });

        $("#add_item").click(function(){
            items.push(curr_item);
            console.log(items);
            $("#item_list").append('<tr class="row"> <td class="col-xs-2">'+curr_item.name+'</td> <td class="col-xs-2">'+curr_item.id+'</td><td class="col-xs-2">'+curr_item.HSN+'</td><td  class="col-xs-2">'+curr_item.description+'</td><td  class="col-xs-2">'+curr_item.tax+'%</td></tr>');
                
        });

        $(".calc").change(function(){
            x = $("#amount").val() * $("#tax_rate").val()/100;
            $("#tax").val(x);
        });

        $("#form").submit(function(e){
            e.preventDefault();
            $("#submit").button("loading");
            $("#err").addClass("hid");
            $("#err").html("");
            $(".disabled").each(function(i,obj){
                $(this).removeAttr("disabled");
            });
            var x = $(this).serialize();
            var data = queryStringToJSON(x);
            data.items = items;
            x = {};
            x.q = JSON.stringify(data);
            console.log(x);
            $(".disabled").each(function(i,obj){
                $(this).attr("disabled", true);
            });
            $.ajax({
                type: "POST",
                url: "/add_advance/",
                data: x,
                success: function(result){
                    console.log(result);
                    $("#submit").button("reset");
                    if (result == 1) {
                        $("#err").removeClass("hid alert-danger").addClass("alert-success");
                        $("#err").html("Advance added successfully! You can continue adding more.");
                        $("#form")[0].reset()
                        $('html,body').scrollTop(0);
                    }
                    if (result == 0) {  
                        $("#err").removeClass("hid alert-success").addClass("alert-danger");
                        $("#err").html("oops something went wrong!");
                        $('html,body').scrollTop(0);
                    }
                }
            });
        });
});