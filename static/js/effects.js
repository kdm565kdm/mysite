var canvas = document.getElementById('canvas');
$(document).ready(function () {
	var lock = true;
	var city = '天津';
	var bg_value;
            
    var max = [];
    var min = [];
    var dataX = [];

    beauty_page = 0;
    douban_page = 0;
    var p=0,t=0; 
    $("#top").hide();
	var trigger = $('.hamburger'),
		overlay = $('.overlay'),
		isClosed = false;

	trigger.click(function () {
		hamburger_cross();      
		});
    $("#top").click(function(){
        $("html").animate({"scrollTop": "0px"},500); //IE,FF
        $("body").animate({"scrollTop": "0px"},500); //Webkit
        });

    $(window).scroll(function(e){  
        p = $(this).scrollTop();  
              
        if(t<=p){//下滚  
            $("#menu").fadeOut();
            $("#top").fadeIn();
        }  
              
        else{//上滚  
            $("#menu").fadeIn();
            if (p==0) {
                $("#top").fadeOut();
            }
        }  
        setTimeout(function(){t = p;},0);         
    });
    //豆瓣电影下拉监听函数
    function douban_scroll(){
        if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                    console.log("滚动条已经到达底部为" + $(document).scrollTop());
                if(douban_page <=250){
                    douban_page+=25;
                    $.ajax({
                        url:'/douban/',
                        type:'POST',
                        data:{"page":douban_page.toString()}, 
                        async:true,    //或false,是否异步
                        dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                        success:function(data){
                        contents = data["contents"];
                        (function() {for(var i=0, len=contents.length; i<len; i++ ){
                               var tem='<div class="douban_item"><h3><span>'+contents[i]["title"]+'</span>&nbsp;&nbsp;<span>'+contents[i]["score"]+'</span></h3><a href="'+contents[i]["href"]+'"><img src="'+contents[i]["img_src"]+'"></a><p>'+contents[i]["relevant_info"]+'</p><p>'+contents[i]["summary"]+'</p></div>';
                               $('#douban_content').append(tem);

                           }
                           })();

                        },
                        error:function(){
                            console.log("error");
                        }
    
                    });
                }else{
                    alert("已经到达底部！！");
                }
        }
    }
    //美女图的下拉监听函数
    function beauty_scroll() {
                //$(document).scrollTop() 获取垂直滚动的距离
                if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                    console.log("滚动条已经到达底部为" + $(document).scrollTop());
                    beauty_page++;
            $.ajax({
                url:'/beautiful/',
                type:'POST',
                data:{"page":beauty_page.toString()}, 
                async:true,    //或false,是否异步
                dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                success:function(data){
                srcs = data['srcs'];
                (function() {for(var i=0, len=srcs.length; i<len; i++ ){
                             var tem =  '<div class="water_item"><a href="'+srcs[i]+'"><img src="'+srcs[i]+'"></a></div>';
                             $('#beauty_pics').append(tem);

                         }
                         })();

                },
                error:function(){
                console.log("error");
                }
    
            });

                }
            }
    //折线图函数
    function init_chart(canvas,datax,data1,data2){
        var myChart = echarts.init(canvas);
        var option = {
            title: {
                text: '一周温度曲线图',
                left:'7%',
                textStyle:{
                    fontSize:14,
                    color:'#ccc'
                }
            },
            tooltip: {},
            color:['orange','blue'],
            legend: {
                data:['高温','低温'],
                right:'9%',
                textStyle:{
                    color:'#ccc'
                }
            },
            xAxis: {
                axisLine:{
                    lineStyle:{
                        type:'solid',
                        color:'#ccc',
                        width:'1'
                    }
                },
                data: datax,
                textStyle:{
                    fontSize:2,
                    color:'#ccc'
                }
            },
            yAxis: {
                name:'温度',
                axisLine:{
                    lineStyle:{
                        type:'solid',
                        color:'#ccc',
                        width:'2'
                    }
                },
            },
            series: [{
                name: '高温',
                type: 'line',
                itemStyle:{
                    normal:{
                        lineStyle:{
                            color:'#aaa'
                        }
                    }
                },
                data: data1
            },
            {
                name:'低温',
                type:'line',
                itemStyle:{
                    normal:{

                        lineStyle:{
                            color:'#ccc'
                        }
                    }
                },
                data:data2
            }
           ]
        };
        myChart.setOption(option);
        window.addEventListener("resize",function () {
            myChart.resize();
        });

    }



	function hamburger_cross() {

		if (isClosed == true) {          
		  overlay.hide();
		  trigger.removeClass('is-open');
		  trigger.addClass('is-closed');
		  isClosed = false;
		} 
        else {   
		  overlay.show();
		  trigger.removeClass('is-closed');
		  trigger.addClass('is-open');
		  isClosed = true;
		}
	}
		  
$('[data-toggle="offcanvas"]').click(function () {
	$('#wrapper').toggleClass('toggled');
	});
//定位城市
	$.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js',function(){
		var city2 = remote_ip_info.city;


		if (lock == true){
		
			$.ajax(
				{
                    type:"POST",
                    url:'/weather/',
                    data:{'city':city2},
                    dataType:'json',
                    success:function (data) {
                        $('#city_name').text(data['city']);
                        var details = data['detail'];
                        $('#climate').text(details[0][2]);
                        $('#temperature').text(details[0][3]);
                        $('#wind_direction').text(details[0][4]);
                        $('#wind_degree').text(details[0][5]);

                        bg_value = details[0][8];
                        $('body').attr('class',bg_value);

                        $('#days').html("");

                        (function() {for(var i=0, len=details.length; i<len; i++ ){
                            var tr = "<tr><td><h6>"+details[i][0]+"</h6></td><td><h6>"+details[i][1]+"</h6></td><td><h6>"+details[i][2]+"</h6></td><td><h6>"+details[i][3]+"</h6></td><td><h6>"+details[i][4]+"</h6></td><td><h6>"+details[i][5]+"</h6></td></tr>";
                            $('#days').append(tr);
                            var date = details[i][0].split('（');
                            dataX.push(date[0]);
                            max.push(details[i][6]);
                            min.push(details[i][7]);
                        }
                        })();
                        init_chart(canvas,dataX,max,min);
                        }
				});
		    lock = false;
		    //回收变量
		    city2 = null;
	   }
	});
	//查询后				
	$('#sub').click(function(){
        $('#movie_top').css("display","none");
        $('#beauty').css("display","none");
        $('#weather_app').css("display","block");
        $('#bottom').css("display","block");
        $(window).unbind("scroll", beauty_scroll);
        $(window).unbind("scroll", douban_scroll);
        $("html").animate({"scrollTop": "0px"},500); //IE,FF
        $("body").animate({"scrollTop": "0px"},500);
		city = $('#city').val();
            $.ajax(
				{
                    type:"POST",
                    url:'/weather/',
                    data:{'city':city},
                    dataType:'json',
                    success:function (data) {

                    $('#city_name').text(data['city']);
                    //error
                        if (data['detail'] == 'error') {
                            $('#city_name').attr('class','error');

                        	$('#climate').text('error');
                            $('#climate').attr('class','error');

                            $('#temperature').text('error');
                            $('#temperature').attr('class','error');

                            $('#wind_direction').text('error');
                            $('#wind_direction').attr('class','error');

                            $('#wind_degree').text('error');
                            $('#wind_degree').attr('class','error');
                            $('#days').html("");
                            init_chart(canvas,[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]);
                            $('body').attr('class','error_bg');
                        }
                        //can find city name
                        else{
                            var details = data['detail'];
                            $('#city_name').removeClass("error");
                            $('#climate').removeClass("error");
                            $('#temperature').removeClass("error");
                            $('#wind_direction').removeClass("error");
                            $('#wind_degree').removeClass("error");

                            $('#climate').text(details[0][2]);
                            $('#temperature').text(details[0][3]);
                            $('#wind_direction').text(details[0][4]);
                            $('#wind_degree').text(details[0][5]);
                            bg_value = details[0][8];
                            $('body').attr('class',bg_value);
                            $('#days').html("");
                            max = [];
                            min =[];
                            dataX = [];
                            (function() {for(var i=0, len=details.length; i<len; i++ ){
                            	//var tr = "<tr><td>"+details[i][0]+"</td><td>"+details[i][1]+"</td><td>"+details[i][2]+"</td><td>"+details[i][3]+"</td><td>"+details[i][4]+"</td><td>"+details[i][5]+"</td></tr>";
                            	var tr = "<tr><td><h6>"+details[i][0]+"</h6></td><td><h6>"+details[i][1]+"</h6></td><td><h6>"+details[i][2]+"</h6></td><td><h6>"+details[i][3]+"</h6></td><td><h6>"+details[i][4]+"</h6></td><td><h6>"+details[i][5]+"</h6></td></tr>";
                                $('#days').append(tr);
                            	var date = details[i][0].split('（');
                            	dataX.push(date[0]);
                            	max.push(details[i][6]);
                            	min.push(details[i][7]);
                            }
                        })();
                        init_chart(canvas,dataX,max,min);
                    	}
                    	}
				});
        $('#city').val('');
        //弹出框复位
		hamburger_cross();
		$('#wrapper').toggleClass('toggled');
	});

    $('#b_pic').click(function(){
        $('#weather_app').css("display","none");
        $('#movie_top').css("display","none");
        $('#bottom').css("display","none");
        $('#beauty').css("display","block");
        $('body').attr('class','common');
        $(window).unbind("scroll", douban_scroll);
        $.ajax({
            url:'/beautiful/',
            type:'POST',
            data:{"page":beauty_page.toString()},
            async:true,    //或false,是否异步
            dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
            success:function(data){
                srcs = data['srcs'];
                (function() {for(var i=0, len=srcs.length; i<len; i++ ){
                             var tem =  '<div class="water_item"><a href="'+srcs[i]+'"><img src="'+srcs[i]+'"></a></div>';
                             $('#beauty_pics').append(tem);

                         }
                         })();

            $(window).bind("scroll", beauty_scroll);
            },
            error:function(){
                console.log("error")
            }
    
        });
        hamburger_cross();
        $('#wrapper').toggleClass('toggled');
        beauty_page++;
    });

    $('#moive').click(function(){
        $('#weather_app').css("display","none");
        $('#movie_top').css("display","block");
        $('#bottom').css("display","none");
        $('#beauty').css("display","none");
        $('body').attr('class','douban');
        $(window).unbind("scroll", beauty_scroll);
        $.ajax({
            url:'/douban/',
            type:'POST',
            data:{"page":douban_page.toString()},
            async:true,    //或false,是否异步
            dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
            success:function(data){
                contents = data["contents"];
                console.log(contents);
                  (function() {for(var i=0, len=contents.length; i<len; i++ ){
                               var tem='<div class="douban_item"><h3><span>'+contents[i]["title"]+'</span>&nbsp;&nbsp;<span>'+contents[i]["score"]+'</span></h3><a href="'+contents[i]["href"]+'"><img src="'+contents[i]["img_src"]+'"></a><p>'+contents[i]["relevant_info"]+'</p><p>'+contents[i]["summary"]+'</p></div>';
                               $('#douban_content').append(tem);

                           }
                           })();

            $(window).bind("scroll", douban_scroll);
            },
            error:function(){
                console.log("error")
            }
    
        });
        hamburger_cross();
        $('#wrapper').toggleClass('toggled');
        douban_page+=25;
    });
});


    

