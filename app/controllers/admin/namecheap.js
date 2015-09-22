//'use strict';
//var _ = require('lodash');
var domaindata = require('../../models/admin/mongodata.js');
var tld = require('../../models/admin/tldmodel.js');
//console.log(domaindata);
var request = require('request');
var parser = require('xml2json');

function namechape() {
    var ApiUser = "abhishek";
    var ApiKey = "c07cee52aa3d47918bc597efbcfca80f";
    var UserName = "abhishek";
    var ClientIp = "103.234.94.162"
    var requesturl = "https://api.sandbox.namecheap.com/xml.response?ApiUser=" + ApiUser + "&ApiKey=" + ApiKey + "&UserName=" + UserName + "&ClientIp=" + ClientIp;
    return requesturl;
}

exports.searchdomain = function (req, res) {
    var dom = req.body.name;
    console.log(dom);
    var domainBody = dom.split(".");

    var a = "com";
    var b = domainBody + ".com";
    if (domainBody[1]) {
        b = dom;
        a = domainBody[1];
    }

//    console.log(domainBody[1]);
    var body = domainBody[0];
    var domain1 = body + ".biz";
    var domain2 = body + ".bz";
    var domain3 = body + ".cc";
    var domain4 = body + ".co";
    var domain5 = body + ".in";
    var data2 = [a, "biz", "bz", "cc", "co", "in"];
//domainBody[1]
    //  console.log(data2);


    //console.log(domain);
    var domain = "&DomainList=" + b + ',' + domain1 + ',' + domain2 + ',' + domain3 + ',' + domain4 + ',' + domain5;




    var command = "&Command=namecheap.domains.check";

    var name = namechape() + command + domain;
    // res.send({data:name});

    //  console.log(name);

    request(name, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var xml = body;
            var json = parser.toJson(xml);
            console.log(json);
            domaindata.findOne({
                "data.UserGetPricingResult.ProductType.Name": "domains"
            }, function (err, data) {
                if (err)
                    return console.error(err);


                var tlds = data.data.UserGetPricingResult.ProductType.ProductCategory[1].Product;

                var retdata = domainDetails(tlds, data2);





                res.json({
                    data: JSON.parse(json),
                    domainInfo: retdata,
                    code: 200

                });
            });



            //  console.log(json);
        }
    })
    //console.log("hello");


};



exports.domainprice = function (req, res) {

    //console.log(domain);

    var command = "&Command=namecheap.users.getPricing&ProductType=DOMAIN";

    var name = namechape() + command;
    // res.send({data:name});

    request(name, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var xml = body;
            var json = parser.toJson(xml);
            var obj = JSON.parse(json);



            var data = obj.ApiResponse.CommandResponse;
            if (data) {
                //
                // var Data = new domaindata({
                //     //  data: data,
                //     data: data
                // });
                // Data.save(function(err, Data) {
                //     if (err)
                //         return console.error(err);
                //   //  console.log("saved to database");
                // });




                res.json({
                    Data: data,
                    code: 200
                }); // Get Pricee list of all domains
            }
        }
    })
    //console.log("hello");


};



exports.getTlds = function (req, res) {

    //console.log(domain);

    var command = "&Command=namecheap.domains.gettldlist";

    var name = namechape() + command;
    // res.send({data:name});

    request(name, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var xml = body;
            var json = parser.toJson(xml);
            var obj = JSON.parse(json);



            var data = obj.ApiResponse.CommandResponse;
            if (data) {

                //
                // var Data = new tld({
                //     //  data: data,
                //     tld: data
                // });
                // Data.save(function(err, Data) {
                //     if (err)
                //         return console.error(err);
                //     console.log("saved to database");
                // });




                res.json({
                    Data: data,
                    code: 200,
                    message: "sucess"
                }); // Get Pricee list of all domains
            }
        }
    })
    //console.log("hello");


};


exports.getTldsPrice = function (req, res) {
    var data = req.body.domain;
    var domainBody = data.split(".");
    var body = domainBody[1];
    domaindata.find({
        "data.UserGetPricingResult.ProductType.Name": "domains"
    }, function (err, data) {
        if (err)
            return console.error(err);
        res.json({
            data: data,
            code: 200

        });
    });




}


exports.registerDomain = function (req, res) {
    var a = req.body.data;
    var domain = req.body.domainName;
    var duration = req.body.duration;

    console.log(a);

    var command = "&Command=namecheap.domains.create";
    var name = namechape() + command;

   //var data="&DomainName="+domain+"&Years="+duration+"&AuxBillingFirstName=John&AuxBillingLastName=Smith&AuxBillingAddress1=123mariastret&AuxBillingStateProvince=Chattisgarah&AuxBillingPostalCode=490020&AuxBillingCountry=India&AuxBillingPhone=91.9092847169&AuxBillingEmailAddress=john@gmail.com&AuxBillingOrganizationName=NC&AuxBillingCity=Bhilai&TechFirstName=John&TechLastName=Smith&TechAddress1=maria&TechStateProvince=Chattisgarah&TechPostalCode=490020&TechCountry=India&TechPhone=91.9092847169&TechEmailAddress=abhizmr05@gmail.com&TechOrganizationName=Globussoft&TechCity=Bhilai&AdminFirstName=John&AdminLastName=Smith&AdminAddress1=mariastree&AdminStateProvince=Chattisgarah&AdminPostalCode=490020&AdminCountry=India&AdminPhone=91.9092847169&AdminEmailAddress=abhizmr05@gmail.com&AdminOrganizationName=NC&AdminCity=Bhilai&RegistrantFirstName="+a.RegistrantFirstName+"&RegistrantLastName="+a.RegistrantLastName+"&RegistrantAddress1="+a.RegistrantAddress1+"&RegistrantStateProvince="+a.RegistrantStateProvince+"&RegistrantPostalCode="+a.RegistrantPostalCode+"&RegistrantCountry="+a.RegistrantCountry+"&RegistrantPhone="+a.RegistrantPhone+"&RegistrantEmailAddress="+a.RegistrantEmailAddress+"&RegistrantOrganizationName="+a.RegistrantOrganizationName+"&RegistrantCity="+a.RegistrantCity+"";//test
      var data="&DomainName="+domain+"&Years="+duration+"&AuxBillingFirstName=John&AuxBillingLastName=Smith&AuxBillingAddress1=123mariastret&AuxBillingStateProvince=Chattisgarah&AuxBillingPostalCode=490020&AuxBillingCountry=India&AuxBillingPhone=91.9092847169&AuxBillingEmailAddress=john@gmail.com&AuxBillingOrganizationName=NC&AuxBillingCity=Bhilai&TechFirstName=John&TechLastName=Smith&TechAddress1=maria&TechStateProvince=Chattisgarah&TechPostalCode=490020&TechCountry=India&TechPhone=91.9092847169&TechEmailAddress=abhizmr05@gmail.com&TechOrganizationName=zxzx&TechCity=Bhilai&AdminFirstName=John&AdminLastName=Smith&AdminAddress1=mariastree&AdminStateProvince=Chattisgarah&AdminPostalCode=490020&AdminCountry=India&AdminPhone=91.9092847169&AdminEmailAddress=abhizmr05@gmail.com&AdminOrganizationName=NC&AdminCity=Bhilai&RegistrantFirstName="+a.RegistrantFirstName+"&RegistrantLastName="+a.RegistrantLastName+"&RegistrantAddress1="+a.RegistrantAddress1+"&RegistrantStateProvince="+a.RegistrantStateProvince+"&RegistrantPostalCode="+a.RegistrantPostalCode+"&RegistrantCountry="+a.RegistrantCountry+"&RegistrantPhone="+a.RegistrantPhone+"&RegistrantEmailAddress="+a.RegistrantEmailAddress+"&RegistrantOrganizationName="+a.RegistrantOrganizationName+"&RegistrantCity="+a.RegistrantCity+"";//test

   var newData =  encodeURI(data);

   console.log(newData);

//var data = "&DomainName="+domain+"&Years="+duration+"&AuxBillingFirstName=John&AuxBillingLastName=Smith&AuxBillingAddress1=8939%20S.cross%20Blv&AuxBillingStateProvince=CA&AuxBillingPostalCode=90045&AuxBillingCountry=US&AuxBillingPhone=+1.6613102107&AuxBillingEmailAddress=john@gmail.com&AuxBillingOrganizationName=NC&AuxBillingCity=CA&TechFirstName=John&TechLastName=Smith&TechAddress1=8939%20S.cross%20Blvd&TechStateProvince=CA&TechPostalCode=90045&TechCountry=US&TechPhone=+1.6613102107&TechEmailAddress=john@gmail.com&TechOrganizationName=NC&TechCity=CA&AdminFirstName=John&AdminLastName=Smith&AdminAddress1=8939%cross%20Blvd&AdminStateProvince=CA&AdminPostalCode=9004&AdminCountry=US&AdminPhone=+1.6613102107&AdminEmailAddress=joe@gmail.com&AdminOrganizationName=NC&AdminCity=CA&RegistrantFirstName="+a.RegistrantFirstName+"&RegistrantLastName="+a.RegistrantLastName+"&RegistrantAddress1="+a.RegistrantAddress1+"&RegistrantStateProvince="+a.RegistrantStateProvince+"&RegistrantPostalCode="+a.RegistrantPostalCode+"&RegistrantCountry="+a.RegistrantCountry+"&RegistrantPhone="+a.RegistrantPhone+"&RegistrantEmailAddress="+a.RegistrantEmailAddress+"&RegistrantOrganizationName="+a.RegistrantOrganizationName+"&RegistrantCity="+a.RegistrantCity;

//console.log(newData);
    //var data = "&DomainName="+domain+"&Years="+duration+"&AuxBillingFirstName="+a.AuxBillingFirstName+"&AuxBillingLastName="+a.AuxBillingLastName+"&AuxBillingAddress1="+a.AuxBillingAddress1+"&AuxBillingStateProvince="+a.AuxBillingStateProvince+"&AuxBillingPostalCode="+a.AuxBillingPostalCode+"&AuxBillingCountry="+a.AuxBillingCountry+"&AuxBillingPhone="+a.AuxBillingPhone+"&AuxBillingEmailAddress="+a.AuxBillingEmailAddress+"&AuxBillingOrganizationName="+a.AuxBillingOrganizationName+"&AuxBillingCity="+a.AuxBillingCity+"&TechFirstName="+a.TechFirstName+"&TechLastName="+a.TechLastName+"&TechAddress1="+a.TechAddress1+"&TechStateProvince="+a.TechStateProvince+"&TechPostalCode="+a.TechStateProvince+"&TechCountry="+a.TechCountry+"&TechPhone="+a.TechPhone+"&TechEmailAddress="+a.TechEmailAddress+"&TechOrganizationName="+a.TechOrganizationName+"&TechCity="+a.TechCity+"&AdminFirstName="+a.AdminFirstName+"&AdminLastName="+a.AdminLastName+"&AdminAddress1="+a.AdminAddress1+"&AdminStateProvince="+a.AdminStateProvince+"&AdminPostalCode="+a.AdminPostalCode+"&AdminCountry="+a.AdminCountry+"&AdminPhone="+a.AdminPhone+"&AdminEmailAddress="+a.AdminEmailAddress+"&AdminOrganizationName="+a.AdminOrganizationName+"&AdminCity="+a.AdminCity+"&RegistrantFirstName="+a.RegistrantFirstName+"&RegistrantLastName="+a.RegistrantLastName+"&RegistrantAddress1="+a.RegistrantAddress1+"&RegistrantStateProvince="+a.RegistrantStateProvince+"&RegistrantPostalCode="+a.RegistrantPostalCode+"&RegistrantCountry="+a.RegistrantCountry+"&RegistrantPhone="+a.RegistrantPhone+"&RegistrantEmailAddress="+a.RegistrantEmailAddress+"&RegistrantOrganizationName="+a.RegistrantOrganizationName+"&RegistrantCity="+a.RegistrantCity+"";

    // tested //var data = "&DomainName="+domain+"&Years="+duration+"&AuxBillingFirstName="+a.RegistrantFirstName+"&AuxBillingLastName="+a.RegistrantLastName+"&AuxBillingAddress1="+a.RegistrantAddress1+"&AuxBillingStateProvince="+a.RegistrantStateProvince+"&AuxBillingPostalCode="+a.RegistrantPostalCode+"&AuxBillingCountry="+a.RegistrantCountry+"&AuxBillingPhone="+a.RegistrantPhone+"&AuxBillingEmailAddress="+a.RegistrantEmailAddress+"&AuxBillingOrganizationName="+a.RegistrantOrganizationName+"&AuxBillingCity="+a.RegistrantCity+"&TechFirstName="+a.TechFirstName+"&TechLastName="+a.TechLastName+"&TechAddress1="+a.TechAddress1+"&TechStateProvince="+a.TechStateProvince+"&TechPostalCode="+a.TechStateProvince+"&TechCountry="+a.TechCountry+"&TechPhone="+a.TechPhone+"&TechEmailAddress="+a.TechEmailAddress+"&TechOrganizationName="+a.TechOrganizationName+"&TechCity="+a.TechCity+"&AdminFirstName="+a.AdminFirstName+"&AdminLastName="+a.AdminLastName+"&AdminAddress1="+a.AdminAddress1+"&AdminStateProvince="+a.AdminStateProvince+"&AdminPostalCode="+a.AdminPostalCode+"&AdminCountry="+a.AdminCountry+"&AdminPhone="+a.AdminPhone+"&AdminEmailAddress="+a.AdminEmailAddress+"&AdminOrganizationName="+a.AdminOrganizationName+"&AdminCity="+a.AdminCity+"&RegistrantFirstName="+a.RegistrantFirstName+"&RegistrantLastName="+a.RegistrantLastName+"&RegistrantAddress1="+a.RegistrantAddress1+"&RegistrantStateProvince="+a.RegistrantStateProvince+"&RegistrantPostalCode="+a.RegistrantPostalCode+"&RegistrantCountry="+a.RegistrantCountry+"&RegistrantPhone="+a.RegistrantPhone+"&RegistrantEmailAddress="+a.RegistrantEmailAddress+"&RegistrantOrganizationName="+a.RegistrantOrganizationName+"&RegistrantCity="+a.RegistrantCity+"";
    //var data = "&DomainName="+domain+"&Years="+duration+"&AuxBillingFirstName="+a.RegistrantFirstName+"&AuxBillingLastName="+a.RegistrantLastName+"&AuxBillingAddress1="+a.RegistrantAddress1+"&AuxBillingStateProvince="+a.RegistrantStateProvince+"&AuxBillingPostalCode="+a.RegistrantPostalCode+"&AuxBillingCountry="+a.RegistrantCountry+"&AuxBillingPhone="+a.RegistrantPhone+"&AuxBillingEmailAddress="+a.RegistrantEmailAddress+"&AuxBillingOrganizationName="+a.RegistrantOrganizationName+"&AuxBillingCity="+a.RegistrantCity+"&TechFirstName="+a.TechFirstName+"&TechLastName="+a.TechLastName+"&TechAddress1="+a.TechAddress1+"&TechStateProvince="+a.TechStateProvince+"&TechPostalCode="+a.TechStateProvince+"&TechCountry="+a.TechCountry+"&TechPhone="+a.TechPhone+"&TechEmailAddress="+a.TechEmailAddress+"&TechOrganizationName="+a.TechOrganizationName+"&TechCity="+a.TechCity+"&AdminFirstName="+a.AdminFirstName+"&AdminLastName="+a.AdminLastName+"&AdminAddress1="+a.AdminAddress1+"&AdminStateProvince="+a.AdminStateProvince+"&AdminPostalCode="+a.AdminPostalCode+"&AdminCountry="+a.AdminCountry+"&AdminPhone="+a.AdminPhone+"&AdminEmailAddress="+a.AdminEmailAddress+"&AdminOrganizationName="+a.AdminOrganizationName+"&AdminCity="+a.AdminCity+"&RegistrantFirstName="+a.RegistrantFirstName+"&RegistrantLastName="+a.RegistrantLastName+"&RegistrantAddress1="+a.RegistrantAddress1+"&RegistrantStateProvince="+a.RegistrantStateProvince+"&RegistrantPostalCode="+a.RegistrantPostalCode+"&RegistrantCountry="+a.RegistrantCountry+"&RegistrantPhone="+a.RegistrantPhone+"&RegistrantEmailAddress="+a.RegistrantEmailAddress+"&RegistrantOrganizationName="+a.RegistrantOrganizationName+"&RegistrantCity="+a.RegistrantCity+"";
    var val = name + newData;
    console.log("val" + val);
  //  val = val.replace(/\s+/g, '');
    //res.send(val);
    request(val, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var xml = body;
            var json = parser.toJson(xml);
            var obj = JSON.parse(json);

            res.json({
                data: obj,
                code: 200

            });

        }
    })






}


exports.tldDomain = function (req, res) {

    domaindata.findOne({
        "data.UserGetPricingResult.ProductType.Name": "domains"
    }, function (err, data) {
        if (err)
            return console.error(err);


        var data = data.data.UserGetPricingResult.ProductType.ProductCategory[1].Product;
        var domain = tldPrice(data);

        res.json({
            data: domain,
            code: 200

        });
    });

}





exports.getregistereddomains = function (req, res) {

    var command = "&Command=namecheap.domains.getList&page=1&pagesize=100";
    var name = namechape() + command;
    request(name, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var xml = body;
            var json = parser.toJson(xml);
            var obj = JSON.parse(json);

            res.json({
                data: obj,
                code: 200

            });

        }
    })

};


exports.getbalance = function (req, res) {

    var command = "&Command=namecheap.users.getBalances";
    var name = namechape() + command;
    request(name, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var xml = body;
            var json = parser.toJson(xml);
            var obj = JSON.parse(json);

            res.json({
                data: obj,
                code: 200

            });

        }
    })

};

exports.getdomaininfo = function (req, res) {


    console.log(req.body.domain);


    var command = "&Command=namecheap.domains.getinfo";
    var domain_name = "&DomainName=" + "sdsdsdcvzdawd.com";
    var name = namechape() + command + domain_name;
    request(name, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var xml = body;
            var json = parser.toJson(xml);
            var obj = JSON.parse(json);

            res.json({
                data: obj,
                code: 200

            });

        }
    })


}




//
// exports.changeTldPrice=function(req,res){
//
//   var val=req.body.value;
//   console.log(val);
//   domaindata.findOne({
//       "data.UserGetPricingResult.ProductType.Name": "domains"
//   }, function(err, data) {
//       if (err)
//           return console.error(err);
//
//
//     //  var data = data.data.UserGetPricingResult.ProductType.ProductCategory[1].Product;
//
//     var changed=changePrice(data,10);
//
//       res.json({
//           data: changed,
//           code: 200,
//           val:12
//
//       });
//   });
//
// // res.json({
// //   data:val,
// //   code:200
// // })
//
// }







//Filting Requested Tlds From List Of Available Tls
function domainDetails(data1, data2) {

    // console.log(data2);
    var data = [];
    //console.log(data1.length);
    for (var i = 0; i < data2.length; i++) {

        for (var j = 0; j < data1.length; j++) {
            //console.log(j);
            //console.log(data1[j].Name);
            if (data2[i] == data1[j].Name) {
                data.push(data1[j]);
            }

        }
    }
//    console.log(data);

    return data;
}



function tldPrice(data) {
    var mytlds = [];
    // var mydata={}
    for (var j = 0; j < data.length; j++) {
//        console.log()
        var a = 0;
        var b = 0;
        var c = 0;

        if (data[j].Price.length) {

            a = data[j].Price[0].YourPrice;
            b = data[j].Price[0].Price;
            c = data[j].Price[0].PromotionPrice;

        } else {
            a = data[j].Price.YourPrice;
            b = data[j].Price.Price;
            c = data[j].Price.PromotionPrice;
        }

        var x = {
            "TldName": data[j].Name,
            "MyPrice": a,
            "namecheapPrice": b,
            "MaximumDuration": data[j].Price.length,
            "PromotionPrice": c
        }









//          mydata.TldName= data[j].Name;
//          console.log( mydata.TldName);
        mytlds.push(x);
    }


    return mytlds;
}
//
// function changePrice(data,perc){
//   console.log("hi");
//   var data1=data.data.UserGetPricingResult.ProductType.ProductCategory[1].Product;
//
//   for (var j = 0; j < data1.length; j++) {
//   //        console.log()
//
//       if (data1[j].Price.length) {
//         for(var i=0;i<data1[j].Price.length;i++){
//           data1[j].Price[i].YourPrice=0;
//         console.log(data1[j].Price[i].YourPrice);
//
//         }
//
//
//
//
//
//       } else {
//           data1[j].Price.YourPrice=0;
//
//       }
//
//
//
//
//
//   }
//
// return data1;
//
// }
