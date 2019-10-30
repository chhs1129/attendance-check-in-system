
var express = require('express');
var app = express();
var http = require('http');
var port = process.env.PORT || 23080;
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
const dbname='cmpt218_haosenc'
//DB
// var url="mongodb://haosen:1234@ds117469.mlab.com:17469/cmpt218_a3";
var url="mongodb://haosenc:uKDLc9do@127.0.0.1:27017/cmpt218_haosenc?authSource=admin";
mongoose.connect(url);
var connection = mongoose.connection;

//get all current collection names
// var temp=new Array()
// MongoClient.connect(url, function(err, client){
//   const dbname='cmpt218_a3'
//   client.db(dbname).listCollections().toArray(
//     function(err,names){
//       if (names){
//         names.forEach(function(e){
//           if (e.name!='objectlabs-system' && e.name!='objectlabs-system.admin.collections'&& e.name!='system.indexes'){
//             temp.push(e.name)
//           }
//         });
//       }
//       if(temp.length!=0){
//         console.log(temp)
//       }
//       else{
//         console.log('no db')
//       }
//     }
//   )
// });

//insert using mongodb
// MongoClient.connect(url, function(err, client){
//   //const dbname='cmpt218_a3'
//   // const dbname='cmpt218_haosenc'
//   client.db(dbname).listCollections().toArray(function(err,names){
//     var temp =names.map(function(e){
//       if (e.name!=='objectlabs-system' && e.name!=='objectlabs-system.admin.collections'&& e.name!=='system.indexes')
//       {
//         return e.name;          
//       }
//     })
//     var open_courses=temp.filter(function(e){
//       return typeof e==='string'
//     })
//      for (i=0;i<open_courses.length;i++){
//       client.db(dbname).collection(open_courses[i]).find().toArray(function(err,result){
//         var a = result.map(function(e){
//           return e;
//         })
//         console.log(a)
//       })    
//      } 
//   })
// });

//Stop搞定


// parsing body
app.use(express.json());
app.use(express.urlencoded( { extended:false} ));

var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm','html'],
  index: "login.html"
}

app.use('/', function(req,res,next){
  console.log(req.method, 'request:', req.url, JSON.stringify(req.body));
  next();
});
app.use('/', express.static('./', options));


//prof start check-in
var open_courses=new Array();
var student_courses=new Array();
var User=new Array();
app.post('/start-checkin', function(req,res,next){
  // var Schema = mongoose.Schema;
  // var userSchema = new Schema({
  //   course_id: { type:String },
  //   student_id: { type:String },
  //   name:{type:String},
  //   checkin_time:{type:String},
  //   is_prof:{type:Boolean}
  // },{collection:req.body.checkid});
  // mongoose.connection.db.listCollections().toArray(function(err, names){
  //   if (names) {
  //     names.forEach(function(e){
  //       if (e.name!='objectlabs-system' && e.name!='objectlabs-system.admin.collections'&& e.name!='system.indexes'){
  //         open_courses.push(e.name);
  //       }
  //     })
  //   }
  MongoClient.connect(url, function(err, client){
    //const dbname='cmpt218_a3'
    client.db(dbname).listCollections().toArray(function(err,names){
        //get all course names from db save them into open_courses
        var temp = names.map(function(e){
          if (e.name!=='objectlabs-system' && e.name!=='objectlabs-system.admin.collections'&& e.name!=='system.indexes')
          {
            return e.name;          
          }
        })
        var open_courses=temp.filter(function(e){
          return typeof e==='string'
        })
        ////////////////----------------------------------------
        // if (names){
        //   names.forEach(function(e){
        //     if (e.name!='objectlabs-system' && e.name!='objectlabs-system.admin.collections'&& e.name!='system.indexes')
        //     {
        //       open_courses.push(e.name)
        //     }
        //   });
        // }
    // if (open_courses.includes(req.body.checkid)===false){
      if (open_courses.indexOf(req.body.checkid)==-1){
      // open_courses.push(req.body.checkid);
      // User.push(mongoose.model(req.body.checkid, userSchema));
      // var user = mongoose.model(req.body.checkid, userSchema);
      // var prof = new user({
      //   name: "start",
      //   course_id: req.body.checkid,
      //   checkin_time: new Date().toLocaleString(),
      //   is_prof:true
      // });
      // prof.save(function(error) {
      //   if (error) {
      //     console.error(error);
      //   }
      // });
      //const dbname='cmpt218_a3'//cmpt218_haosenc
      var prof = {
          name: 'start',
          course_id: req.body.checkid,
          checkin_time: new Date().toLocaleString(),
          is_prof:true
        }
      client.db(dbname).collection(req.body.checkid).insertOne(prof);
      res.send(202,'Check-In page created')
    }
    else{
      //todo pop up a window: courses already created, here is the history
      res.send(202,'error')
    }
  });
});
});


//student check-in
//var db_for_student = new Array();
app.post('/check-in:name', function(req,res,next){
  //req.body.cid/name/uid
  // mongoose.connection.db.listCollections().toArray(function(err, names){
  //   if (names) {
  //     names.forEach(function(e){
  //       if (e.name!='objectlabs-system' && e.name!='objectlabs-system.admin.collections'&& e.name!='system.indexes'){
  //         student_courses.push(e.name);
  //       }
  //     })
  //   }
  MongoClient.connect(url, function(err, client){
    //const dbname='cmpt218_a3'//cmpt218_haosenc
    client.db(dbname).listCollections().toArray(function(err,names){
        var temp = names.map(function(e){
          if (e.name!=='objectlabs-system' && e.name!=='objectlabs-system.admin.collections'&& e.name!=='system.indexes')
          {
            return e.name;          
          }
        })
        var open_courses=temp.filter(function(e){
          return typeof e==='string'
        })
        client.db(dbname).collection(req.body.cid).find({name:{$eq:'stop'}}).toArray(function(err,result){
          var a = result.length//0 means still open
          // if(open_courses.includes(req.body.cid)===false){
            console.log(open_courses)
            if (open_courses.indexOf(req.body.cid)==-1){
            res.send(202,'No Course Found')
          }
          else if(a!=0){
            res.send(202,'Check-in Time Expired')
          }
          else{
            MongoClient.connect(url, function(err, client){
              //const dbname='cmpt218_a3'//cmpt218_haosenc
              // const dbname='
              var student = {
                    name: req.body.name,
                    course_id: req.body.cid,
                    student_id: req.body.uid,
                    checkin_time: new Date().toLocaleString(),
                    is_prof:false
                  }
              client.db(dbname).collection(req.body.cid).insertOne(student)
              res.send("Thank you for checking-in");
            });
          }
          
        })
        
    // if (db_for_student.includes(req.body.cid)===false){
    //   res.send(202,'Cannot Check-In now')
    // }
    //TODO 检查要insert的collection里有没有stop

    // else if(stopped_courses.includes(req.body.cid)===true){
    //   res.send(202,'Check-in time expired')
    // }
    // else{
      // var Schema = mongoose.Schema;
      // var userSchema = new Schema({
      //   course_id: { type:String },
      //   student_id: { type:String },
      //   name:{type:String},
      //   checkin_time:{type:String},
      //   is_prof:{type:Boolean}
      // });
      // var user;
      // User.forEach(function(e){
      //   if(e.modelName==req.body.cid){
      //     user=e;
      //   }
      // });
      // var student = new user({
      //   name: req.body.name,
      //   course_id: req.body.cid,
      //   student_id: req.body.uid,
      //   checkin_time: new Date().toLocaleString(),
      //   is_prof:false
      // });
      // student.save(function(error) {
      //   if (error) {
      //     res.log('Check-in Error');
      //   } else {
      //     res.send("Check-in sucess");
      //   }
      //   //res.send(202,'1');
      // });
      // MongoClient.connect(url, function(err, client){
      //   const dbname='cmpt218_a3'//cmpt218_haosenc
      //   // const dbname='
      //   var student = {
      //         name: req.body.name,
      //         course_id: req.body.cid,
      //         student_id: req.body.uid,
      //         checkin_time: new Date().toLocaleString(),
      //         is_prof:false
      //       }
      //   client.db(dbname).collection(req.body.cid).insertOne(student)
      //   res.send("Check-in sucess");
      // });
    // }
    });
  });
});

//prof stop
//var stopped_courses=new Array();
app.post('/stop',function(req,res,next){
  // stopped_courses.push(req.body.id);
  // var user = mongoose.model(req.body.id, userSchema);
  // var prof = new user({
  //   name: "stoped",
  //   course_id: req.body.checkid,
  //   checkin_time: new Date().toLocaleString(),
  //   is_prof:true
  // });
  // prof.save(function(error) {
  //   if (error) {
  //     console.error(error);
  //   } 
  // });
  // var user;
  // User.forEach(function(e){
  //   if(e.modelName==req.body.id){
  //     user=e;
  //   }
  // });
  MongoClient.connect(url, function(err, client){
    //const dbname='cmpt218_a3'//cmpt218_haosenc
    var student = {
          name: 'stop',
          course_id: req.body.id,
          checkin_time: new Date().toLocaleString(),
          is_prof:true
        }
     client.db(dbname).collection(req.body.id).insertOne(student);

    // client.db(dbname).collection(req.body.id).find({$and:[{name:{$ne:'start'}},{name:{$ne:'stop'}}]},function(err,result){
      client.db(dbname).collection(req.body.id).find().toArray(function(err,result){
        var temp = result.map(function(e){
          return e;
        })
      //console.log(result.length)
      // if(result.length==0){
      //   res.send(202,'error')
      // }
      // else{
         res.send(202,temp);
      // }
    })
  });

  // user.find({name:{$ne:'start'}},function(err,c){
  //   var user_names=new Array();
  //   c.forEach(function(e){
  //     user_names.push(e)
  //   })
  //   if(c.length==0){
  //     res.send(202,'error')
  //   }
  //   else{
  //     res.send(202,user_names);
  //   }  
  // })
})
var history_courses=new Array();
//todo
app.post('/history',function(req,res,next){
  MongoClient.connect(url, function(err, client){
    //const dbname='cmpt218_a3'
    // const dbname='cmpt218_haosenc'
    client.db(dbname).listCollections().toArray(function(err,names){
      var temp =names.map(function(e){
        if (e.name!=='objectlabs-system' && e.name!=='objectlabs-system.admin.collections'&& e.name!=='system.indexes')
        {
          return e.name;          
        }
      })
      var open_courses=temp.filter(function(e){
        return typeof e==='string'
      })
      res.send(202,open_courses)
      // var a;
      // for (i=0;i<open_courses.length;i++){
        
      //   client.db(dbname).collection(open_courses[i]).find().toArray(function(err,result){
      //       a = result.map(function(e){
      //       return e;
      //     })
      //     if(i==open_courses.length-1){
      //       console.log(a)
      //       res.send(202,a) 
      //     }
              
      //   })    
      // }
      // Promise.all(a).then((result)=>res.send('202,a'))
      // res.send(202,a) 
    })
  });
})
app.post('/course_history/:course',function(req,res,next){
  //console.log(req.params.course)
  MongoClient.connect(url, function(err, client){
  client.db(dbname).collection(req.params.course).find().toArray(function(err,result){
    var temp = result.map(function(e){
      return e;
    })
    
  //console.log(result.length)
  // if(result.length==0){
  //   res.send(202,'error')
  // }
  // else{
     res.send(202,temp);
  })
  // }
})
})

http.createServer(app).listen(port);
console.log('running on port',port);
