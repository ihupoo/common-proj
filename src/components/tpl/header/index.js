import Store from '@/store/index';
import TemplateIndex from './index.art';
import AboutDialog from '../about';
import Main from '@/pages/home/tpl/main';

import avatorDefaultPng from '@/assets/images/avator.png';

function eventBind(user) {
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

    $(".user-info img[data-onerror]").on("error", function () {
        $(this).attr("src", $(this).attr("data-onerror"));
        $(this).off('error')
    })

    $('.public-private-cloud').on('click', '.li-a', function(){
        const { BASE_URL } = Store.getState()
        const { enablePublicCloudAccess, moid } = user
        if(enablePublicCloudAccess){
            var text = $(this).text()
            var value = $(this).attr("value")
            var origText = $(".cloud-name").text();
            var origValue = $(".cloud-name").attr("value");

            if (text != origText && value != origValue) {
                $.post(BASE_URL + "/system/user/updateCloudModel", {
                    moid: moid,
                    cloudModelName: text,
                    virMachineroomMoid: value
                }, function (ret) {
                    if (ret.success) {
                        $(".cloud-name").text(text)
                        $(".cloud-name").attr("value", value)
                    }
                }, 'json').error(function () {
                })
            }
        }
    })

    $(".logout").on("click", function () {
        const { BASE_URL } = Store.getState()
        
        Main.fetchAbort()

        location.href = BASE_URL + "/loginout";
    });

}


export default {
    render(dom, { user, cloudModelList }){
        const { BASE_URL , sysBrand } = Store.getState()
        $(dom).empty().append($(TemplateIndex({ BASE_URL, sysBrand, user, cloudModelList, avatorDefaultPng })).localize())
        eventBind(user);
    },
    setPortrait(portrait, portraitDomain) {
        const { BASE_URL } = Store.getState()
		if (!portrait) {
			portrait = avatorDefaultPng;
		} else if (portraitDomain) {
			portrait = '//' + portraitDomain + '/' + portrait;
		}
		let $userPortrait = $('.user-info .user-portrait');
		$userPortrait.on('load', function () {
			$(this).removeClass('hidden');
		});
		$userPortrait.attr('src', portrait);
	}
    
}
