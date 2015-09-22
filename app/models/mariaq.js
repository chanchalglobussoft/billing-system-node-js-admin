'use strict';

var validator=require("validator");
var inspect=require("inspect");

/**
     * Desc : Common function for get All results with conditions
     * Arguments
     * args1 : Table Name
     * args2 : rows required
     * args3 : condittion
     * args4 : callback function
     * return : Boolean
     * NOTE : * All columns and values should be in sequence
     *        * No Security and can be called by all functions inside API
     * */

     var apiConfig={};
     apiConfig.dbName="billing";
   exports.select =function selectQry(db1,tablename , row , condition, callback){
      if(condition != ''){
          var qry = "SELECT "+row+"  FROM `"+apiConfig.dbName+"`.`"+ tablename +"` where "+condition;
      }else{
          var qry = "SELECT "+row+"  FROM `"+apiConfig.dbName+"`.`"+ tablename +"`";
      }
      console.log(qry);
      var result1 = [];
      var result =[];
      var finalresult=[];
      db1.query(qry)
        .on('result', function(res) {
          res.on('row', function(row) {
//            console.log('Result row: ' + inspect(row));
            result1.push(row);
//            console.log(result);
//            callback(result);
//            res.send(row);
          })
          .on('error', function(err) {
            console.log('Result error: ' + inspect(err));
            result = err;
          })
          .on('end', function(info) {
//           console.log('Result finished successfully' + JSON.stringify(info) );
          finalresult = {'cnt':info.numRows , 'data':result1};
//            console.log(result);
            callback(finalresult);
          });
        });

    }
    
    /**
     * Desc : Common function for custom query
     * Arguments
     * args1 : Custom Query
     * args4 : callback function
     * return : data result
     * */
    function customqry(qry, callback){
      console.log(qry);
      var result1 = [];
      var result =[];
      var finalresult=[];
      
      db1.query(qry)
        .on('result', function(res) {
          res.on('row', function(row) {
            result1.push(row);
          })
          .on('error', function(err) {
            console.log('Result error: ' + inspect(err));
            result = err;
            callback({error:result});
          })
          .on('end', function(info) {
//            console.log('Result finished successfully' + JSON.stringify(info) );
            finalresult = {'cnt':info.numRows , 'data':result1};
//            console.log(result);
            callback(finalresult);
          });
        });

    }

    /**
     * Desc : Common function for inserting data
     * Arguments
     * args1 : Table Name
     * args2 : JSON formatted data
     * args3 : condittion
     * args4 : callback function
     * return : Boolean
     * NOTE : * All columns and values should be in sequence
     *        * No Security and can be called by all functions inside API
     * */
    exports.insert =function insertQry(db1,tablename , data, callback){

      console.log('Inside insertQry : '+tablename+' : '+JSON.stringify(data));

      var columns = "(`";
      var value = "('";
      var ite = 0;

      /*Cross-browser support*/
      var JSONlength = Object.keys(data).map(function(k) { return data[k] }).length;
//    console.log('JSONlength : '+JSONlength);
      for(var key in data){
          if (ite == 0){
              columns += key+"` ";
              value += data[key] +"' ";
          } else if(ite < JSONlength-1){
              columns += ", `"+key+"` ";
              value += ", '"+ data[key] +"' ";
          } else {
              if(JSONlength == ite+1){  /*Before : 13 Aug 2015 -> if(JSONlength == 2){*/
                  columns += ", `"+key+"`)";
                  value += ", '"+ data[key] +"')";
              }else{
                  columns += ")";
                  value += ")";
              }
          }
          ite++;
      }


      var qry = 'INSERT INTO `'+apiConfig.dbName+'`.`'+tablename+'` '+columns+' values'+value+"";

//      console.log('=====================');
//      console.log(qry);
//      console.log('=====================');
//return true;
      var result;
      db1.query(qry)
        .on('result', function(res) {
          res.on('row', function(row) {
            console.log('Result row: ' + inspect(row));
          })
          .on('error', function(err) {
            console.log('Result error: ' + err);
            result = err;
          })
          .on('end', function(info) {
            console.log('Result finished successfully '+JSON.stringify(info));
            console.log('--------'+typeof info.affectedRows);
                        console.log('LAST_INSERT_ID() : '+info.insertId);
            if(info.affectedRows != 1){
//              console.log('False');
                callback(false) ;
            }else{
//              console.log('true');
                callback(info.insertId) ;
            }
          });
        });
    }

    /**
     * Desc : Common function for Update data
     * Arguments
     * args1 : Table Name
     * args2 : JSON formatted data
     * args3 : condition
     * args4 : callback function
     * return : Boolean
     * NOTE : * All columns and values should be in sequence
     *        * No Security and can be called by all functions inside API
     * */
     exports.update =function updateQry(db1,tablename , data, condition , callback){

      var ite = 0;
      var col = '';

      /*Cross-browser support*/
      var JSONlength = Object.keys(data).map(function(k) { return data[k] }).length;
//      console.log('Length : '+JSONlength);
      for(var key in data){
//        console.log('Crnt : '+ite);
          if (ite == 0){
              col += '`'+key+'`=\''+validator.trim(data[key])+'\'';
          } else if(ite < JSONlength-1){
              col += ', `'+key+'`=\''+validator.trim(data[key])+'\'';
          }
          else {
              if(JSONlength == 2){
                  col += ', `'+key+'`=\''+validator.trim(data[key])+'\'';
              }else{
                  col += ', `'+key+'`=\''+validator.trim(data[key])+'\'';
              }
          
          }
          ite++;
      }

      //update songrequest set status=true where sid=1;
      //update table set last_update=now(), last_monitor=last_update where id=1;
      var qry = 'UPDATE  `'+apiConfig.dbName+'`.`'+tablename+'` set '+col+' where '+condition+"";

      console.log('=====================');
      console.log(qry);
      console.log('=====================');

      /**/
      var result;
      db1.query(qry)
        .on('result', function(res) {
          res.on('row', function(row) {
            console.log('Result row: ' + inspect(row));
          })
          .on('error', function(err) {
            console.log('Result error: ' + inspect(err));
            result = err;
            callback({error:result});
          })
          .on('end', function(info) {
            console.log('Result finished successfully '+JSON.stringify(info));
            console.log('--------'+ info.affectedRows);
            if(info.affectedRows > 0){
//              console.log('False');
                callback('1');
            }else{
//              console.log('true');
                callback('0');
            }
          });
        });
      /**/
      return  true;

    }