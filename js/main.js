/**
 * Created by Administrator on 2016/12/8.
 */
var areanum=localStorage.getItem('key');
var equipment="";
var pageId=1;
var taskType="";
var sortType=1;
if(areanum==null||areanum==undefined){
    areanum= 101001000;
}
var u = navigator.userAgent;
if (u.indexOf('Android') > -1) { //android
    equipment=2;
} else if (u.indexOf('iPhone') > -1) {//ios
    equipment=1;
}
var hitNum=1;
var taskParams=[];

var options={
    areaNum:areanum,
    equipment:equipment,
    pageId:pageId,
    type:taskType,
    sortType:sortType
}
var parameter={
    page:null,
    taskId:null,
    platform:null,
    mewId:null,
    more:null
};

(function(){
    $.extend({
        /*
        *
        *
        * 初始化..
        *
        * */
        init:function(){
            return false;
        },

        /*
        *
        * 获取url传过来的值
        *
        * */
        args:function(){
            var url=window.location.href;
            if(url.indexOf("?")>0){
                var urlstr=url.split("?")[1];
                var arr="";
                if(urlstr.indexOf("&")>0){
                    arr=urlstr.split("&");
                    parameter.page=arr[0].split("=")[1];
                    parameter.taskId=arr[1].split("=")[1];
                    parameter.platform=arr[2].split("=")[1];
                    parameter.mewId=arr[3].split("=")[1];
                }else{
                    parameter.page=urlstr.split("=")[1];
                }
            }
            return parameter;
        },
        /*
        *
        * 提示框
        *
        * */
        dialog:function(tips){
            var model=$('<div class="model" ><div class="dialog"> <p> '+tips+'</p><span class="sure"> 确定</span> </div></div>');
            $("body").append(model);
            $(".model").show();
            $(".sure").click(function(){
                $(".model").hide();
                model.remove();
            });
            return false;
        },
       /*
       *
       *
       * 绑定手机
       *
       * */
        register:function(){
            var regular=/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/;
            /*只能输入数字*/
            $(".tell").bind("input propertychange",function(){
                $(".tell").val($(this).val().replace(/\D/g,""));
            })
            /*获取验证码*/
            $(".getCode").click(function(){
                var tellValue = $(".tell").val();
                console.log(tellValue);
                    if(tellValue.length==0){
                        $.dialog("您还没输入手机号码！");
                    }else if(!regular.test(tellValue)){
                        $.dialog("您输入的手机号码格式不正确！");
                    }else {
                        $.ajax({
                            url: "http://www.timemtech.com/palmjobadmin/weixin_login/getCode",
                            type: "post",
                            dataType: "json",
                            data: {telephone: tellValue},
                            success: function (data) {
                                $.dialog(data.msg);
                            }, error: function (data) {
                                $.dialog(data.msg);
                            }
                        });
                        var num=60;
                        timer=setInterval(function(){
                            if(num==1){
                                clearInterval(timer);
                                var str1="重新获取";
                                $(".getCode").html(str1);

                            }else{
                                num--;
                                var str2=num+"秒后重新获取";
                                $(".waitCode").html(str2);
                            }
                        },1000);
                    }
            });
            /*提交号码*/
            $(".submitBtn").click(function(){
                var tellValue=$(".tell").val();
                var codeValue=$(".code").val();
                if(tellValue.length==0){
                    $.dialog("您还没输入手机号码！");
                }else if(!regular.test(tellValue)){
                    $.dialog("您输入的手机号码格式不正确！");
                }else if(codeValue.length==0){
                    $.dialog("请输入验证码！");
                }else{
                    var url=window.location.href;
                    var openId="";
                    if(url.indexOf("?")>0){
                        openId=url.split('?')[1].split('=')[1];
                    }
                    $.ajax({
                        url:"http://www.timemtech.com/palmjobadmin/weixin_login/authCode",
                        type:"post",
                        dataType:"json",
                        data:{content:codeValue,telephone:tellValue ,openId:openId},
                        success:function(data){
                             if(data.result.errorCode==102){
                                 $.dialog("验证码输入有误！");
                            }else if(data.result.errorCode==103){
                                 $.dialog("验证码已过期，请重新获取！");
                            }else if(data.result.errorCode==500){
                                 $.dialog("验证码已过期，请重新获取！");
                            }else if(data.result.errorCode==1){
                                window.location.href="home.html";
                            }
                        },error:function(data){
                            console.log(data);
                        }
                    });
                }
            });
            return false;
        },
        /*
        *
        *
        * 首页
        *
        * */
        rendering:function(){

            $.ajax({
                //url:"http://192.168.199.196/palmjobadmin/weixin_login/getShouYe",
                url:"http://www.timemtech.com/palmjobadmin/weixin_login/getShouYe",
                type:"post",
                dataType:"json",
                data:options,
                beforeSend: function(){
                    var loading=$('<div class="beforeLoading"><img src="./images/loading.gif" alt=""/></div>');
                    $(".layout .content").prepend(loading);
                },
                success:function (data)
                {
                    $(".beforeLoading").remove();
                    if(data.result.errorCode==1){
                        $(".layout .header .tocity").text(data.data.city);
                        $(".layout .information ul li .todaymoney").html(data.data.allTotal);
                        $(".layout .information ul li .todotask").html(data.data.allTaskNum);
                        var hometaskList=data.data.taskList;
                        if(hometaskList.length!=0){

                            var content=template('homeTemplate', {hometaskList:hometaskList});
                            $(".layout .content").prepend(content);
                            $(".layout .content").append(createLoadMore);
                            $.loadMore();
                            $(".layout .content .loadMore").show();
                        }
                    }
                },
                error:function (data)
                {
                    $.dialog(data.result.msg);
                }
            });
            return false;
        },
        selectFunc:function(){
            $(".layout .header").click(function(){
                $.closePage();
                $.dealSort();
            });
            $(".information").click(function(){
                $.closePage();
                $.dealSort();
            });
            $(".fenlei").bind("click",function(){
                var distanceY=$(".operate").offset().top+$(".operate").height()+1;
                $(".showfenlei").css({
                    "position":"absolute",
                    "top":distanceY,
                    "z-index":2
                });
                $(".msk").css({
                    "top":distanceY
                });
                $(".msk").show();
                $.hiddenPage();
                $(this).find(".sort").addClass("fenleiC");
                if($(".paixu").find(".rank").text()=="排序"){
                    $(".paixu").find(".rank").removeClass("paixuC");
                }

                $(".showpaixu").hide();
                $(".showfenlei").show();
                return false;
            });

            $(".paixu").bind("click",function(){
                var distanceY=$(".operate").offset().top+$(".operate").height()+1;
                $(".showpaixu").css({
                    "position":"absolute",
                    "top":distanceY,
                    "z-index":2
                });
                $(".msk").css({
                    "top":distanceY
                });
                $(".msk").show();
                $.hiddenPage();
                $(this).find(".rank").addClass("paixuC");
                if($(".fenlei").find(".sort").text()=="分类"){
                    $(".fenlei").find(".sort").removeClass("fenleiC");
                }
                $(".showfenlei").hide();
                $(".showpaixu").show();
                return false;
            });
            return false;
        },
        closePage:function(){
            $(".showfenlei").hide();
            $(".showpaixu").hide();
            $(".msk").hide();
            $.autoPage();
            if($(".fenlei").find(".sort").text()=="分类"){
                $(".fenlei").find(".sort").removeClass("fenleiC");
            }
            if($(".paixu").find(".rank").text()=="排序"){
                $(".paixu").find(".rank").removeClass("paixuC");
            }
            return false;
        },
        /*
        *
        * 模态框
        *
        * */
        dealSort:function(){
            if(!$(".feileiSubmitBtn").hasClass("clicked")){
                $(".fenlei").find(".sort").text("分类").removeClass("fenleiC");
                $(".checkf").removeClass("checkfok");
            }
            return false;
        },
        msk:function(){
            $(".msk").click(function(){
                $.closePage();
                $.dealSort();
                return false;
            });
        },
        autoPage:function(){
            $("html").css("overflow","auto");
            $("body").css("overflow","auto");
        },
        hiddenPage:function(){
            $("html").css("overflow","hidden");
            $("body").css("overflow","hidden");
        },
        /*
        *
        * 加载更多
        *
        * */
        loadMore:function(){
            $(".loadMoreBtn").click(function(){
                console.log("hitNum="+hitNum+"/type="+taskType+"/sortType="+sortType);
                hitNum++;
                $.ajax({
                  url:"http://www.timemtech.com/palmjobadmin/weixin_login/getShouYe",
                    //url:"http://192.168.199.196/palmjobadmin/weixin_login/getShouYe",
                    type:"post",
                    dataType:"json",
                    data:{pageId:hitNum,type:taskType,sortType:sortType,areaNum:areanum,equipment:equipment},
                    success:function (data)
                    {

                        if(data.data.taskList.length==0){
                            $(".loadMoreBtn").html("没有更多了..");
                            return false;
                        }else{
                            if(data.result.errorCode==1){
                                var hometaskList=data.data.taskList;
                                var loadMoreContent=template('homeTemplate', {hometaskList:hometaskList});
                                $(".layout .content").prepend(loadMoreContent);
                                $(".loadMoreBtn").html("加载更多..");
                            }
                        }
                    },
                    error:function (data)
                    {
                        console.log(data);
                    }
                });
            });
            return false;
        },
        /*
        *
        *
        * 任务分类
        *
        * */
        sortFunc:function(){

            $(".showfenlei ul li").click(function(){
                if($(this).find(".checkf").hasClass("checkfok")){
                    $(this).find(".checkf").removeClass("checkfok");
                }else{
                    if($(".unlimit").hasClass("checkfok")){
                        taskParams=[];
                        $(".unlimit").removeClass("checkfok");
                    }
                    $(this).find(".checkf").addClass("checkfok");
                }
                if($(".checkfok").length==4){
                    $(".checkf").removeClass("checkfok");
                    $(".unlimit").addClass("checkfok");
                }
                return false;
            });
            $(".layout .showfenlei ul li").eq(0).click(function(){
                if($(this).find(".unlimit").hasClass("checkfok")){
                    $(".checkf").removeClass("checkfok");
                    $(".unlimit").addClass("checkfok");
                }else{
                    $(".unlimit").removeClass("checkfok");
                }
                return false;
            });
            return false;
        },
        judgeParams:function(){
            if(taskParams.length==4){
                taskParams=[];
                taskType=taskParams.join("");
                console.log("taskParams.length=4;type=[]"+taskType+"空");
            }
            return false;
        },
        judgeType:function(o){
            if($.inArray(o,taskParams)>-1){//存在,从数组中删除
                taskParams = $.grep(taskParams,function(n,i){return n ==o;},true);
                console.log(taskParams);
            }else{ //不存在，添加
                taskParams.push(o);
                taskType=taskParams.join("");
                console.log(taskParams);
                console.log("type="+taskType);
            }
            return false;
        },
        sortTxt:function(){
            if(!$('.checkfok').length){
                $('.layout .operate ul li .sort').text('分类');
            }else{
                var sortText="";
                $('.checkfok').each(function(index,item){
                    sortText+=$(this).parent().text()+',';
                });
                console.log(sortText);
                $('.layout .operate ul li .sort').text(sortText.slice(0,-1));
            }
        },
        requestSort:function(){
            $(".buxian").click(function(){
                taskParams=[];
                $.sortTxt();
                return false;
            });
            $(".tiyan").click(function(){
                $.judgeType("2");
                $.judgeParams();
                $.sortTxt();
                return false;
            });
            $(".hudong").click(function(){
                $.judgeType("3");
                $.judgeParams();
                $.sortTxt();
                return false;
            });
            $(".fenxian").click(function(){
                $.judgeType("1");
                $.judgeParams();
                $.sortTxt();
                return false;
            });
            $(".qita").click(function(){
                $.judgeType("0");
                $.judgeParams();
                $.sortTxt();
                return false;
            });
            $(".layout .showfenlei .feileiSubmitBtn").click(function(){
                $.closePage();
                $(this).addClass("clicked");
                taskType=taskParams.join("");
                if(hitNum>1){
                    hitNum=1;
                }
                console.log("hitNum="+hitNum+"/type="+taskType+"/sortType="+sortType);
                $.ajax({
                    url:"http://www.timemtech.com/palmjobadmin/weixin_login/getShouYe",
                    //url:"http://192.168.199.196/palmjobadmin/weixin_login/getShouYe",
                    type:"post",
                    dataType:"json",
                    data:{pageId:hitNum,type:taskType,sortType:sortType,areaNum:areanum,equipment:equipment},
                    success:function(data){

                        if(data.result.errorCode==1){
                            var hometaskList=data.data.taskList;
                            var sortContent=template('homeTemplate', {hometaskList:hometaskList});
                            $(".layout .content").html(sortContent);
                            $(".layout .content").append(createLoadMore);
                            $.loadMore();
                        }
                    },error:function(data){
                        console.log(data);
                    }
                });
            });
            return false;
        },
        /*
        *
        *
        *任务排序
        *
        * */
        rankFunc:function(){
            $(".showpaixu ul li").click(function(){
                $.closePage();
                $(".layout .operate ul li .rank").html($(this).text()).addClass("paixuC");
                sortType=$(".showpaixu ul li").index($(this))+1;
                if(hitNum>1){
                    hitNum=1;
                }
                $.ajax({
                  url:"http://www.timemtech.com/palmjobadmin/weixin_login/getShouYe",
                    //url:"http://192.168.199.196/palmjobadmin/weixin_login/getShouYe",
                    type:"post",
                    dataType:"json",
                    data:{pageId:hitNum,type:taskType,sortType:sortType,areaNum:areanum,equipment:equipment},
                    success:function(data){
                        if(data.result.errorCode==1){
                            var hometaskList=data.data.taskList;
                            var t1html=template('homeTemplate', {hometaskList:hometaskList});
                            $(".layout .content").html(t1html);
                            $(".layout .content").append(createLoadMore);
                            $.loadMore();
                              console.log("hitNum="+hitNum+"/type="+taskType+"/sortType="+sortType);
                        }
                    },error:function(data){
                        console.log(data);
                    }
                });
                $(this).find(".checkp").addClass("checkpok").parent("li").siblings().find(".checkp").removeClass("checkpok");
                return false;
            });
        }
    });
})(jQuery)