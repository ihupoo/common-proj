import Store from '@/store/index';
import TemplateIndex from './index.art';
import AboutDialog from '../about';

const eventBind = () => {
    $(".li").on("mouseover", function () {
        $(".li-a", $(this)).toggleClass("hover");
        $(".check-hook", $(this)).toggleClass("hover");
    })
    $(".public-private-cloud-content").on('click', function (e) {
        $(".public-private-cloud").toggle(0, function () {
            $(".cloud-name").toggleClass("active");
            $(".arrow").toggleClass("active");
        });

        e.stopPropagation()

        let id = $.trim($(".cloud-name").attr("value"));
        $(".check-hook").removeClass("active");
        $("#" + id).addClass("active");
    })
    $(".setting").on("click", function (e) {
        if ($(this).hasClass('disabled')) {
            return
        }
        $("#nav-sublist-notify").removeClass("hover");
        $(".setting-list").toggle();
        
        e.stopPropagation()
    })

    $(document).on("click", function () {
        $(".setting-list").hide();
        $(".public-private-cloud").hide(0, function () {
            $(".cloud-name").removeClass("active");
            $(".arrow").removeClass("active");
        });
    });

    $("#modifyUser").on("click", function () {
        $(".setting-list").hide();
        location.href = Store.getState('BASE_URL') + "/set#profile";
    });

    $("#modifyPassword").on("click", function () {
        $(".setting-list").hide();
        location.href = Store.getState('BASE_URL') + "/set#password";
    });
    $("#gmt").on("click", function () {
        $(".setting-list").hide();
        location.href = Store.getState('BASE_URL') + "/set#gmt";
    });
    $("#language").on("click", function () {
        $(".setting-list").hide();
        location.href = Store.getState('BASE_URL') + "/set#language";
    });
    $("#modifyPortrait").on("click", function () {
        $(".setting-list").hide();
        location.href = Store.getState('BASE_URL') + "/set#portrait";
    });
    $("#about").on("click", function () {
        $(".setting-list").hide();
        AboutDialog.show()
    });
}


export default {
    render(dom, { user, cloudModelList }){
        const { BASE_URL , sysBrand } = Store.getState()
        $(dom).empty().append($(TemplateIndex({ BASE_URL, sysBrand, user, cloudModelList })).localize())
        eventBind();
    }
    
}
