//Variables
var head= `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Admin</title>
    </head>
    <body>`

var _head=`</body>
</html>`


//Student check-in html
function check_but_func(){
  $.ajax({
    method: 'post',
    url: './check-in'+ $('#name').val(),
    data: 'cid='+$('#cid').val()+'&name='+$('#name').val()+'&uid='+$('#uid').val(),
    success:function(data){
        alert(data);    
    }
  });
}
function clear_but_func(){
  window.location.reload();
}
function stop_but(){
  // setTimeout(function() {alert('Thank you for using this app! Have fun with your lecture');},10);
  // $.ajax({
  //   method: 'post',
  //   url: '/stop',
  //   data: 'id='+currentc,
  //   success: function(data){
  //     $('html>body').empty();
  //      var res_html=`
  //         <h1>Total attendees number:</h1>
  //         <h2>${data}</h2>
  //         <br/>
  //         <h2>Attendees:${data.length}</h2>
  //         <br/ id='newline'>
  //         <script src="jquery.min.js"></script>
  //         <script src="script.js"></script>
  //     `;
  //     res_html=head+res_html+_head;
  //     $('html').html(res_html);
  //   }
  $.ajax({
    method: 'post',
    url: './stop',
    data: 'id='+currentc,
    success: function(data){
      $('html>body').empty();
      if(data.length-2!=0){
        $('html>body').empty();
        //var names=new Array();
        var a=``;
        var start_time;
        var stop_time;
        data.forEach(function(e){
          //names.push(e.name);
          if(e.name!='start'&&e.name!='stop'){
            a+='<tr><td>'+e.course_id+'</td><td>'+e.student_id+'</td><td>'+e.name+'</td><td>'+e.checkin_time+'</td></tr>'
          }
          else if(e.name=='start'){
            start_time=e.checkin_time;
          }
          else{
            stop_time=e.checkin_time;
          }
          });
        var res_html=`
        <div>
          <h1>Attendees:</h1>
          <table border=1>
          <tr><th>Course ID</th><th>Student ID</th><th>Student Name</th><th>Check-in Time</th></tr>
          ${a}
          </table>
          <br/>
          <h1>Attendees number:  ${data.length-2}</h1>
          <br/ id='newline'>
          <h1>Check-In Start At: ${start_time}</h1>
          <h1>Check-In Stop  At: ${stop_time}</h1>
          <script src="jquery.min.js"></script>
          <script src="script.js"></script>
          <footer id="footer">Copyright &copy; Haosen Cheng 2018</footer>
          </div>
        `;
        res_html=head+res_html+_head;
        $('html').html(res_html);
      }
      else{
        $('html').empty();
        var res_html=`
        <link rel="stylesheet" type="text/css" href="style.css">

          <div>
          <h1>This Course has no attendees!</h1>
          <br/>
          <br/ id='newline'>
          </div>
        `;
        res_html=head+res_html+_head;
        $('html').html(res_html);
      }
    }
  });
}

//Admin Log-in html
function logfunc(){
  if (($('#uname').val()==='admin') && ($('#upass').val()==='1234')){
    $('html>body').empty();
    var res_html=`
    <link rel="stylesheet" type="text/css" href="style.css">
        <div>
            <h1>Admin Landing</h1>
            <label for='checkid'>Check-IN ID:</label> 
            <input name='checkid' id='checkid' type='text' style="text-transform:uppercase"/> <br />
            <br/ id='newline'>
            <button id='start_check_but' onclick='start_but()'>Start Check-in</button>
            <button id='history_but' onclick='history_but()'>View History</button>
            <br/>
            <script src="jquery.min.js"></script>
            <script src="script.js"></script>
            <footer id="footer">Copyright &copy; Haosen Cheng 2018</footer>
        </div>
            `;
    res_html=head+res_html+_head;
    $('html').html(res_html);
  }
  else{
    alert("Wrong Username or Password, Please try again");
  }
}


var currentc;
var s=0;
var interval;
//Admin Landing html
function run(){
  document.querySelector("#time").innerText = set_time(s);
  s++;
}
function set_time(s){
  var h = Math.floor(s/3600);
  var m = Math.floor((s%3600)/60);
  var ss = Math.floor((s%3600)%60);
  if (h<10){
      h="0"+h;
  }
  if (m<10){
      m="0"+m;
  }
  if (ss<10){
      ss="0"+ss;
  }
  return h+":"+m+":"+ss;
}
function start_but(){
  $.ajax({
    method: 'post',
    url: './start-checkin',
    data: 'checkid='+$('#checkid').val(),
    success: function(data){
      if(data!='error'){
        alert(data);
        $('html>body').empty();
        currentc=$('#checkid').val();
        var res_html=`
        <link rel="stylesheet" type="text/css" href="style.css">

                <div>
                <h1>Please Check-In Now!</h1>
                <h2>Check-In ID:</h2>
                <h2 id='courseid' name='courseid'>${($('#checkid').val()).toUpperCase()}</h2>
                <br/ id='newline'>
                <h2 id="time">00:00:00</h2>
                <button id='stop_check_but' onclick='stop_but()'>Stop Check-in</button>
                <br/>
                <script src="jquery.min.js"></script>
                <script src="script.js"></script>
                <footer id="footer">Copyright &copy; Haosen Cheng 2018</footer>
                </div>
                `;
        res_html=head+res_html+_head;
        $('html').html(res_html);
        interval = setInterval(run,1000);

      }
      else{
        alert('Your course is already created. Please check history');
      }
    }
  });

}

//history
function history_but(){
  $.ajax({
    method: 'post',
    url: './history',
    success:function(data){
      $('html').html(head+'<table border=1>'+'</table>'+_head);
      $('<tr>').html('<th>Course ID</th><th>Student ID</th><th>Student Name</th><th>Check-in Time</th>').appendTo('body>table');
      var res_html='';
      console.log(data)
      
      data.forEach(function(e){
        if(e!='readMe'){
        $.ajax({
          method: 'post',
          url: './course_history/'+e,
          success:function(data1){
            var a = '';
            data1.forEach(function(e){
              if(e.name!='start'&&e.name!='stop'){
                //a+='<tr><td>'+e.course_id+'</td><td>'+e.student_id+'</td><td>'+e.name+'</td><td>'+e.checkin_time+'</td></tr>'
                $('<tr>').html("<td>"+e.course_id+"</td>"+"<td>"+e.student_id+"</td>"+"<td>"+e.name+"</td>"+"<td>"+e.checkin_time+"</td>").appendTo('body>table');
              }
            })

      //     res_html=`
      //     <th>Course ID</th><th>Student ID</th><th>Student Name</th><th>Check-in Time</th>${a}`;
      //     //console.log(res_html);
      // $('<tr>').html(res_html).appendTo('body>table');
      
          }
        });}
        
      })
    }
    
  });
  
  
}

