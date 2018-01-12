var canvas = document.getElementById('canvas');
$(document).ready(function () {
			var lock = true;
			var city = '天津';
			var bg_value;
            
            var max = [];
            var min = [];
            var dataX = [];

            var p=0,t=0; 
		  var trigger = $('.hamburger'),
		      overlay = $('.overlay'),
		     isClosed = false;

		    trigger.click(function () {
		      hamburger_cross();      
		    });

           $(window).scroll(function(e){  
            p = $(this).scrollTop();  
              
            if(t<=p){//下滚  
                $("#menu").fadeOut();
            }  
              
            else{//上滚  
                $("#menu").fadeIn();
            }  
            setTimeout(function(){t = p;},0);         
            });
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
		      } else {   
		        overlay.show();
		        trigger.removeClass('is-closed');
		        trigger.addClass('is-open');
		        isClosed = true;
		      }
		  }
		  
		  $('[data-toggle="offcanvas"]').click(function () {
		        $('#wrapper').toggleClass('toggled');
		  });
		  $.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js',function(){
		  	var city2 = remote_ip_info.city;


		    if (lock == true){
		    	//initLocation();
				$.ajax(
				    {
                        type:"POST",
                        url:'/index/',
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
						
		  $('#sub').click(function(){
		      city = $('#city').val();
              $.ajax(
				    {
                        type:"POST",
                        url:'/index/',
                        data:{'city':city},
                        dataType:'json',
                        success:function (data) {

                            $('#city_name').text(data['city']);
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
		  	hamburger_cross();
		  	$('#wrapper').toggleClass('toggled');
		  });
		});


    

