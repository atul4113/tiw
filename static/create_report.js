$(document).ready(function () {

    // <td>{{pur.sale_size}}</td><td>{{pur.customer_name}}</td><td>{{pur.customer_id}}</td><td>{{pur.customer_address}}</td><td>{{pur.state_name}}</td> 
    //                 <td>{{pur.reg}}</td> <td>{{pur.GSTN}}</td> <td>{{item.name}}</td> <td>{{item.id}}</td> <td>{{item.HSN}}</td> <td>{{item.quantity}}</td>
    //                 <td>{{item.rate}}</td> <td>{{item.tax}}</td> <td>{{item.discount}}</td> <td>{{item.amount}}</td><td>{{item.CGST}}</td><td>{{item.SGST}}</td><td>{{item.IGST}}</td><td>{{pur.place_of_supply}}</td><td>{{pur.ebn}}</td> <td>{{pur.transportation_mode}}</td><td>{{pur.vehicle_no}}</td><td>{{pur.consignee_name}}</td><td>{{pur.consignee_address}}</td><td>{{pur.consignee_state_name}}</td><td>{{pur.consignee_reg}}</td>
    //                 <td>{{pur.consignee_GSTN}}</td><td>{{pur.frieght}}</td><td>{{pur.loading}}</td><td>{{pur.insurance}}</td><td>{{pur.other_charges}}</td>
    //                 <td>{{pur.tds1}}</td><td>{{pur.tds2}}</td><td>{{pur.tds2_text}}</td><td>{{pur.amount_payable}}</td><td>{{pur.advance}}</td

    var keep = {};
    keep.sale = {
        "invoice no":"id", "Sale size":"sale_size", "Customer Name":"customer_name","Customer Address":"customer_address",
        "Customer ID":"customer_id","State":"state_name","Reg Status":"reg","GSTN":"GSTN","Item Name":"name","Item ID":"item_id",
        "HSN":"HSN", "quantity":"quantity", "rate":"rate", "tax rate":"tax", "discount":"discount", "amount":"amount", "CGST":"CGST",
        "SGST":"SGST","IGST":"IGST","place of supply":"place_of_supply", "ebn":"ebn", "Transportation Mode":"transportation_mode"
        ,"Vehicle no":"vehicle_no", "consignee name":"consignee_name", "consignee Address":"consignee_address",
        " Consignee State":"consignee_state_name","Consignee Reg Status":"consignee_reg",
        "Consignee GSTN":"consignee_GSTN","frieght charges":"frieght","Loading charges":"loading", "insurance charges":"insurance",
        "other charges":"other_charges", "tds 1":"tds1", "tds 2":"tds2", "other details":"tds2_text", "amount payable":"amount_payable",
        "advance":"advance"
    }

    keep.purchase = {
        "invoice no":"id", "Sale size":"sale_size", "Vendor Name":"vendor_name","Vendor Address":"vendor_address",
        "Vendor ID":"vendor_id","State":"state_name","Reg Status":"reg","GSTN":"GSTN","Item Name":"name","Item ID":"item_id",
        "HSN":"HSN", "quantity":"quantity", "rate":"rate", "tax rate":"tax", "discount":"discount", "amount":"amount", "CGST":"CGST",
        "SGST":"SGST","IGST":"IGST","place of supply":"place_of_supply", "ebn":"ebn", "Transportation Mode":"transportation_mode"
        ,"Vehicle no":"vehicle_no", "frieght charges":"frieght","Loading charges":"loading", "insurance charges":"insurance",
        "other charges":"other_charges", "tds 1":"tds1", "tds 2":"tds2", "other details":"tds2_text", "amount payable":"amount_payable",
        "advance":"advance", "reverse charge":"reverse_charge", "paid":"paid","payment method":"payment_method","mismatch":"mismatch","blocked credit":"blocked_credit"
    }

    $("#collection").change(function(){
        $("#fields").html('<div class="col-sm-12"><label>Select fields</label></div>');
        for (var key in keep[$(this).val()]){
            $("#fields").append('<div class="col-xs-6"><input type="checkbox" value="'+key+'">'+key+'</div>');
        }

        // if ($(this).val()=="sale"){
        //     for (var key in sale){
        //         $("#fields").append('<div class="col-xs-6"><input type="checkbox" value="'+key+'">'+key+'</div>');
        //     }
        // }
        // if ($(this).val()=="purchase"){
        //     for (var key in purchase){
        //         $("#fields").append('<div class="col-xs-6"><input type="checkbox" value="'+key+'">'+key+'</div>');
        //     }
        // }
    });
    $("#form").submit(function(e){
        e.preventDefault();
        // $("#submit").button("loading");
        $("#err").addClass("hid");
        $("#err").html("");
        var attr = "";
        var table = "";
        var collection = $("#collection").val();
        var name = $("#name").val();
        $("#fields :input").each(function(){
            if($(this).is(":checked")){
                if (attr == ""){
                    attr = keep[collection][$(this).val()];
                } else{
                    attr = attr + "," + keep[collection][$(this).val()];
                }

                if (table == ""){
                    table = $(this).val();
                } else{
                    table = table + "," + $(this).val();
                }

            }
        });
        $.post("/create_report/"+name+"/"+collection+"/"+attr+"/"+table, function(result){
            if (result == 0) {
                $("#err").removeClass("hid alert-success").addClass("alert-danger");
                $("#err").html("Report with this name already exists.");
                $('html,body').scrollTop(0);
            }

            else {
                $("#err").removeClass("hid alert-danger").addClass("alert-success");
                $("#err").html("Report added successfully!");
                $("#form")[0].reset()
                $("#fields").html('<div class="col-sm-12"><label>Select fields</label></div>');
                $('html,body').scrollTop(0);
            }
        });
    });
});