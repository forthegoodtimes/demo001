/**
 * Created by Administrator on 2016/12/28.
 */
/*�����б�*/

(function(){
    $.extend({
        status:function(){
            $(".status-list li ").click(function(){
                $(this).find("i").addClass("redbborder").parent("li").siblings().find("i").removeClass("redbborder");
                return false;
            })
        },
        requestFunc:function(){

        }
    });
})(jQuery)