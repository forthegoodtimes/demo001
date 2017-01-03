/**
 * Created by Administrator on 2016/12/9.
 */
(function(){
    $.extend({
        /*城市列表*/
        list:function(){
            var letters=["A", "B","C","D","E","F", "G", "H","J","K", "L", "M",  "N",  "P","Q","R", "S","T",  "W",  "X", "Y", "Z"];
            $.ajax({
                url:"http://www.timemtech.com/palmjobadmin/address/getAllCity",
                type:"post",
                dataType:"json",
                success:function(data){
                    var objects=data.data;
                    var hotc="";
                    for(var a=0;a<objects.length;a++){
                        if(objects[a].ishot==1){
                            hotc+='<li id="'+objects[a].areanum+'" onclick="gotoFunc(this.id)">'+objects[a].city+'</li>';
                        }
                    }
                    $(".hot-city").html(hotc);
                    var sortc="";
                    for(var i=0;i<letters.length;i++){
                        sortc+='<li>'+letters[i]+'</li>';
                        for(var j=0;j<objects.length;j++){
                            if(objects[j].firstcode==letters[i]){
                                sortc+='<li id="'+objects[j].areanum+'" onclick="gotoFunc(this.id)">'+objects[j].city+'</li>';
                            }
                        }
                    }
                    $(".sort-city").html(sortc);
                },error:function(result){
                    console.log(result);
                }
            });
        },
        toTop:function(){
            $(".icont").click(function(){
                $('html,body').stop().animate({scrollTop:0}, 500);
            });
        },
        tofind:function(){
            $('.slide ul li').bind('click', function() {
                var height = $(".sort-city").children('li:contains('+$(this).html()+')').offset().top-$('.header').height()-23;
                $('html,body').stop().animate({scrollTop: height}, 500);
            });
        },
        /*获取当前城市*/
        currrent:function(){
            var geolocation = new BMap.Geolocation();
            var gc = new BMap.Geocoder();
            geolocation.getCurrentPosition( function(r) {
                    if(this.getStatus() == BMAP_STATUS_SUCCESS)
                    {
                        var pt = r.point;
                        gc.getLocation(pt, function(rs){
                            var addComp = rs.addressComponents;
                            $(".currentC").html(addComp.city);
                            var txt=addComp.city;
                            console.log(txt);
                            if(txt!=undefined){
                                $.ajax({
                                    url:"http://www.timemtech.com/palmjobadmin/address/getAreaNumByCity",
                                    type:"post",
                                    data:{city:txt},
                                    success:function(data){
                                        console.log(data);
                                        var obj=JSON.parse(data)
                                        var areanum=obj.data.areanum;
                                        localStorage.setItem('key',areanum);
                                        $(".currentC").click(function(){
                                            window.location.href="home.html";
                                        });
                                    },error:function(data){
                                        console.log(data);
                                    }
                                });
                            }
                        });
                    }
                    else
                    {
                        switch( this.getStatus() )
                        {
                            case 2:
                                alert( '位置结果未知 获取位置失败.' );
                                break;
                            case 3:
                                alert( '导航结果未知 获取位置失败..' );
                                break;
                            case 4:
                                alert( '非法密钥 获取位置失败.' );
                                break;
                            case 5:
                                alert( '对不起,非法请求位置  获取位置失败.' );
                                break;
                            case 6:
                                alert( '对不起,当前 没有权限 获取位置失败.' );
                                break;
                            case 7:
                                alert( '对不起,服务不可用 获取位置失败.' );
                                break;
                            case 8:
                                alert( '对不起,请求超时 获取位置失败.' );
                                break;
                        }
                    }
                },
                {enableHighAccuracy: true});
        }

    });
})(jQuery)
