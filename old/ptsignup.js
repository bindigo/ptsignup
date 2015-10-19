$(function() {
    setTimeout("_pt_sp_2.push('RecordSource');", 2000)
});

function urlArgs() {
    var B = {};
    var F = location.search.substring(1);
    var E = F.split("&");
    for (var C = 0; C < E.length; C++) {
        var G = E[C].indexOf("=");
        if (G == -1) {
            continue
        }
        var A = E[C].substring(0, G);
        var D = E[C].substring(G + 1);
        D = decodeURIComponent(D);
        B[A] = D
    }
    return B
}
var sourceObj = {
    hasSource: false,
    utm_source: ""
};
var sourceCode = {
    heatmapjs: "afpat-hjs-dis"
};
var inviteData = {};
$(function() {
    var H = "";
    if (getCookie("utm_source")) {
        if (getCookie("utm_source") != "ptengine") {
            H = getCookie("utm_source");
            sourceObj.hasSource = true;
            sourceObj.utm_source = H;
            sourceCode[H] = H
        }
    } else {
        if (location.search.indexOf("utm_campaign") != -1 && location.search.indexOf("utm_source") != -1 && location.search.indexOf("utm_medium") != -1) {
            H = urlArgs()["utm_campaign"] + "-" + urlArgs()["utm_source"] + "-" + urlArgs()["utm_medium"];
            SetCookie("utm_source", H, 30);
            sourceObj.hasSource = true;
            sourceObj.utm_source = H;
            sourceCode[H] = H
        } else {
            SetCookie("utm_source", "ptengine", 30)
        }
    }
    if (location.search.indexOf("CJPID") != -1 && location.search.indexOf("CJSID") != -1 && location.search.indexOf("CJAID") != -1) {
        var I = urlArgs()["CJPID"] || "";
        var D = urlArgs()["CJSID"] || "";
        var E = urlArgs()["CJAID"] || "";
        var A = I + "|" + D + "|" + E;
        SetCookie("utm_source_cj", A, 1825)
    }
    if (getCookie("utm_source_cj")) {
        var A = getCookie("utm_source_cj");
        var I = A.split("|")[0];
        var D = A.split("|")[1];
        var E = A.split("|")[2]
    }
    if (urlArgs()["invite_data"] && urlArgs()["utm_source"] === "invite_v2") {
        var B = true;
        $.ajax({
            url: "/templets/miapex/php/ajax.php",
            data: {
                type: "invite_isover"
            },
            type: "post",
            async: false,
            success: function(J) {
                if (J != "error") {
                    B = J
                }
            }
        });
        var C = decodeURIComponent(base64decode(urlArgs()["invite_data"])).split(",");
        inviteData = {};
        inviteData.u = C[0];
        inviteData.s = C[1];
        inviteData.p = C[2];
        if (inviteData && typeof inviteData == "object" && inviteData.u && inviteData.s && inviteData.p) {
            $(".coupon_txt a").click(function() {
                $("#friend_coupon").find(".close_entry").trigger("click")
            });
            var F = $("a");
            F.each(function() {
                if (this.href.indexOf("www.ptengine.com") != -1 || this.href.indexOf("www_ptengine_com") != -1) {
                    var J = this.href.indexOf("?") != -1 ? "&" : "?";
                    this.href += J + "utm_source=invite_v2&invite_data=" + urlArgs()["invite_data"] + "&inviteinfo=none"
                }
            });
            $.ajax({
                url: "/templets/miapex/php/ajax.php",
                data: {
                    data: inviteData.u,
                    type: "getEmailById"
                },
                dataType: "json",
                type: "post",
                success: function(L) {
                    if (L && L != "error" && L.email) {
                        var K = L.email;
                        var J = 25;
                        if (K.length > J) {
                            K = K.slice(0, J - 3) + "..."
                        }
                        $("#friend_name").text(K);
                        $("#friend_name").attr("title", L.email);
                        if (window.location.href.indexOf("inviteinfo=none") == -1) {
                            $("#invite_email").trigger("click")
                        }
                        $("#invite_email").show()
                    }
                }
            })
        }
    }
    $("#invite_email").bind("click", function() {
        showid("friend_coupon", false);
        $("#friend_coupon").find(".close_entry").bind("click", function() {
            $("#friend_coupon .error").removeClass("error");
            $("#friend_coupon,#layer").fadeOut(300, function() {
                $("#layer").remove()
            })
        })
    });
    $("#sign-up").hover(function() {
        $("#sign-up-box").show()
    }, function() {
        if ($("#free-signup").val() == "Sending...") {
            $("#sign-up-box").show()
        } else {
            $("#sign-up-box").hide()
        }
    });
    $(".go_top").live("click", function(J) {
        $("#join").find("header").css("position", "static");
        $("body, html").stop().animate({
            scrollTop: 0
        }, "fast", function() {
            $(".go_top").fadeOut()
        })
    });
    $("body").append("<a class='go_top text_over''>go to top</a>");
    var G = $("<a>", {
        "class": "go_top text_over",
        click: function() {
            $("body, html").stop().animate({
                scrollTop: 0
            }, "fast", function() {
                $(".go_top").fadeOut()
            })
        }
    }).appendTo($("body"));
    $(".reg-btn").live("click", function() {
        if ($(this).hasClass("disabled")) {
            return
        }
        var L = emailFlag = true;
        var P = $(this);
        var O = P.val();
        var J = P.parents(".register").find(".email");
        var K = P.parents(".register").find(".pwd");
        var N = J.val();
        var M = K.val();
        if (P.attr("id") === "free-signup") {
            if ($("#checkbox").attr("checked")) {
                $("#checkbox").parent().next("p").css("display", "none")
            } else {
                $("#checkbox").parent().next("p").css("display", "block");
                L = false
            }
        }
        if (P.attr("id") === "pop-reg-btn") {
            if ($("#pop-checked").attr("checked")) {
                $("#pop-checked").parent().next("p").css("display", "none")
            } else {
                $("#pop-checked").parent().next("p").css("display", "block");
                L = false
            }
        }
        if (M.length == 0) {
            K.focus().parents(".reg-pwd").addClass("error").find(".ipt_tips i").text("Please enter the password.");
            L = false
        } else {
            if (M.length < 6 || M.length > 20) {
                K.focus().parents(".reg-pwd").addClass("error").find(".ipt_tips i").text("6 to 20 character.");
                L = false
            } else {
                K.blur().parents(".reg-pwd").removeClass("error")
            }
        }
        if (N.length == 0) {
            J.focus().parents(".reg-email").addClass("error").find(".ipt_tips i").text("Please enter the email address.");
            emailFlag = false
        } else {
            if (N.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) == -1) {
                J.focus().parents(".reg-email").addClass("error").find(".ipt_tips i").text("Please enter the correct email address.");
                emailFlag = false
            } else {
                J.blur().parents(".reg-email").removeClass("error")
            }
        }
        if (!emailFlag) {
            return
        }
        if (!L) {
            return
        }
        P.addClass("checking");
        P.attr("disabled", "disabled");
        $.ajax({
            url: "https://report.ptengine.com/ajax/userCheckRepeat.pt?loginEmail=" + N,
            type: "get",
            dataType: "jsonp",
            jsonp: "jsoncallback",
            success: function(R) {
                P.removeClass("checking");
                if (R.msg == "no") {
                    J.focus().parents(".reg-email").addClass("error").find(".ipt_tips i").text("Email has already been used.");
                    L = false;
                    P.removeAttr("disabled");
                    return
                } else {
                    J.blur().parents(".reg-email").removeClass("error")
                }
                reg_date = new Date().getTime();
                if (L) {
                    P.addClass("load disabled").val("Sending...").next("div").css("display", "block");
                    P.attr("disabled", "disabled");
                    var Q = new Date();
                    var S = "email=" + encodeURI(N) + "&password=" + encodeURIComponent(M) + "&timestamp=" + reg_date + "&utm_source=" + (sourceCode[sourceObj.utm_source] || "") + "&invite_uid=" + (inviteData.u || "") + "&source_detail=" + (inviteData.s || "") + "&source=" + (inviteData.p || "");
                    if (I && D && E) {
                        S = S + "&cjpid=" + encodeURI(I) + "&cjsid=" + encodeURI(D) + "&cjaid=" + encodeURI(E);
                        delCookie("utm_source_cj")
                    }
                    $.ajax({
                        type: "POST",
                        url: "/templets/miapex/php/registe.php",
                        data: S,
                        dataType: "text",
                        success: function() {
                            $("#friend_coupon").find(".close_entry").trigger("click");
                            var U = "https://report.ptengine.com/activation/activation_form.htm?ptengine=" + base64encode(utf16to8(N));
                            var T = "email=" + encodeURI(N) + "&link=" + encodeURI(U) + "&password=" + encodeURIComponent(M) + "&date=" + Q.getFullYear() + "-" + (Q.getMonth() + 1) + "-" + Q.getDate();
                            $("#reg_pop_name").val(N);
                            $("#reg_pop_pwd").val(MD5(M, 32));
                            SetCookie("login_email", encodeURI(N));
                            SetCookie("login_pass", encodeURIComponent(M));
                            $.ajax({
                                type: "POST",
                                url: "/templets/miapex/php/regSesSendEmail.php",
                                data: T,
                                dataType: "text",
                                success: function() {
                                    $("#pop-register").hide();
                                    showid("register_succeed");
                                    if (!getBrowser()) {
                                        $("#register_succeed").find("form").attr("action", "https://report.ptengine.com/error/browser.pt")
                                    }
                                    $("#register_succeed h4").text(N);
                                    timerJump("#cont", "", N, M)();
                                    P.removeClass("load disabled").val(O).next("div").hide();
                                    P.removeAttr("disabled");
                                    _pt_sp_2.push("setCustomVar,def02,ptselfSource,value," + N + ",0");
                                    _pt_sp_2.push("ClearSource");
                                    J.val("");
                                    K.val("");
                                    P.parents(".register").find(".placeholder").css("display", "block");
                                    if (P.attr("id") == "index-ban-reg") {
                                        ga("send", "pageview", "/vpv/signup/fromhomepage_top");
                                        _pt_sp_2.push("setPVTag,/vpv/signup/fromhomepage_top");
                                        window.optimizely.push(["trackEvent", "signup"])
                                    } else {
                                        if (P.attr("id") == "index-ft-btn") {
                                            ga("send", "pageview", "/vpv/signup/fromwholesite_bottom");
                                            _pt_sp_2.push("setPVTag,/vpv/signup/fromwholesite_bottom");
                                            window.optimizely.push(["trackEvent", "signup"])
                                        } else {
                                            if (P.attr("id") == "fear-reg-btn") {
                                                ga("send", "pageview", "/vpv/signup/fromwholesite_bottom");
                                                _pt_sp_2.push("setPVTag,/vpv/signup/fromwholesite_bottom");
                                                window.optimizely.push(["trackEvent", "signup"])
                                            } else {
                                                if (P.attr("id") == "pop-register") {
                                                    ga("send", "pageview", "/vpv/signup/fromplanpage_top");
                                                    _pt_sp_2.push("setPVTag,/vpv/signup/fromplanpage_top");
                                                    window.optimizely.push(["trackEvent", "signup"])
                                                } else {
                                                    if (P.attr("id") == "plan-reg-ft") {
                                                        ga("send", "pageview", "/vpv/signup/fromplanpage_mid");
                                                        _pt_sp_2.push("setPVTag,/vpv/signup/fromplanpage_mid");
                                                        window.optimizely.push(["trackEvent", "signup"])
                                                    } else {
                                                        if (P.attr("id") == "free-signup") {
                                                            ga("send", "pageview", "/vpv/signup/fromwholenavigation_top");
                                                            _pt_sp_2.push("setPVTag,/vpv/signup/fromwholenavigation_top");
                                                            window.optimizely.push(["trackEvent", "signup"])
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                error: function() {
                                    P.removeClass("disabled").val(O)
                                }
                            })
                        },
                        error: function() {
                            P.removeClass("disabled").val(O)
                        }
                    })
                }
            },
            error: function() {
                P.removeClass("disabled").val(O)
            }
        })
    });
    $(window).scroll(function() {
        if ($(this).scrollTop() > 72) {
            $("body").css("padding-top", "72px");
            $("#hd,.hd_line").addClass("hd_fixed");
            goTop();
            $(".go_top").fadeIn()
        } else {
            $("#hd,.hd_line").removeClass("hd_fixed");
            $(".go_top").fadeOut();
            $("body").removeAttr("style")
        }
    });
    $(document).click(function(J) {
        if (!$(J.target).hasClass(".btn_signIn") && $(J.target).parent().attr("id") != "signIn" && $(J.target).parents(".signIn_tb_bd").parent().attr("id") != "signIn_tb") {
            $("#signIn_tb").hide();
            $("#signIn").children("a").removeClass("active")
        }
    })
});

function goTop() {
    var B = $("body").height() - winSize()[1];
    var A = $(window).scrollTop();
    if (A >= (B)) {
        $(".go_top").addClass("bottom")
    } else {
        $(".go_top").removeClass("bottom")
    }
}

function SetCookie(A, C, B) {
    B = B || 1;
    var E = new Date();
    E.setTime(E.getTime() + B * 24 * 60 * 60 * 1000);
    var D = getCookie(A);
    document.cookie = A + "=" + escape(C) + ";expires=" + E.toGMTString() + ";path=/"
}

function getCookie(B) {
    var A = document.cookie.match(new RegExp("(^| )" + B + "=([^;]*)(;|$)"));
    if (A != null) {
        return unescape(A[2])
    }
    return null
}

function delCookie(A) {
    var B = new Date();
    B.setTime(B.getTime() - (86400 * 1000 * 1));
    SetCookie(A, "", B)
}
var timer;

function timerJump(H, A, C, B) {
    var E = 5;
    var D = "...";
    var F = 3;

    function G() {
        timer = window.setTimeout(G, 1000);
        var I = "Redirect in " + E + " secs " + D.substr(0, F);
        $(H).text(I);
        E--;
        F = F == 3 ? 1 : (F + 1);
        if (E < 0) {
            window.clearTimeout(timer);
            $("#reg_pop_name").val(C);
            $("#reg_pop_pwd").val(MD5(B, 32));
            $("#register_succeed").find("form").submit()
        }
    }
    return G
}

function getBrowser() {
    var B = true;
    var C = navigator.appName;
    var E = navigator.appVersion;
    var A = E.split(";");
    var D;
    if (A[1] != null) {
        D = A[1].replace(/[ ]/g, "");
        if (C == "Microsoft Internet Explorer" && D == "MSIE6.0") {
            B = false
        } else {
            if (C == "Microsoft Internet Explorer" && D == "MSIE7.0") {
                B = false
            } else {
                if (C == "Microsoft Internet Explorer" && D == "MSIE8.0") {
                    B = false
                } else {
                    if (C == "Microsoft Internet Explorer" && D == "MSIE9.0") {
                        B = false
                    } else {
                        if (!!window.ActiveXObject || "ActiveXObject" in window) {
                            B = false
                        }
                    }
                }
            }
        }
        if (navigator.userAgent.indexOf("Opera") > -1 || navigator.userAgent.indexOf("OPR") > -1) {
            B = false
        }
        if (navigator.userAgent.indexOf("Navigator") > -1) {
            B = false
        }
    }
    return B
}

function handlerJump() {
    window.clearTimeout(timer);
    $("#cont").hide();
    $(".sign-btn").children("#circularG").show();
    $(".sign-btn").attr("class", "sign-btn loading");
    $("#register_succeed").find("form").submit()
}

function showid(I, F) {
    var B = (document.all) ? true : false;
    var D = B && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 6);
    var E = document.getElementById(I);
    E.style.zIndex = "9999";
    $(E).fadeIn(1000);
    E.style.position = !D ? "fixed" : "absolute";
    E.style.top = E.style.left = "50%";
    E.style.marginTop = -E.offsetHeight / 2 + "px";
    E.style.marginLeft = -E.offsetWidth / 2 + "px";
    var H = document.createElement("div");
    H.id = "layer";
    H.style.width = H.style.height = "100%";
    H.style.position = !D ? "fixed" : "absolute";
    H.style.top = H.style.left = 0;
    H.style.backgroundColor = "#000";
    H.style.zIndex = "9998";
    H.style.opacity = "0.30";
    H.style.filter = "alpha(opacity=30)";
    H.style.display = "none";
    $(H).fadeIn(1000);
    document.body.appendChild(H);
    var A = document.getElementsByTagName("select");
    for (var G = 0; G < A.length; G++) {
        A[G].style.visibility = "hidden"
    }

    function J() {
        H.style.width = Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth) + "px";
        H.style.height = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight) + "px"
    }

    function C() {
        E.style.marginTop = document.documentElement.scrollTop - E.offsetHeight / 2 + "px";
        E.style.marginLeft = document.documentElement.scrollLeft - E.offsetWidth / 2 + "px"
    }
    if (B) {
        H.style.filter = "alpha(opacity=60)"
    }
    if (D) {
        J();
        C();
        window.attachEvent("onscroll", function() {
            C()
        });
        window.attachEvent("onresize", J)
    }
    F = F === undefined ? true : false;
    if (F) {
        $("#signUp_now_close, #layer,#feat_signUp_close").click(function() {
            $(E, H).fadeOut(300, function() {
                $(H).remove()
            })
        })
    }
}

function winSize() {
    var B = 0;
    var A = 0;
    var C = Array();
    if (window.innerWidth) {
        B = window.innerWidth
    } else {
        if ((document.body) && (document.body.clientWidth)) {
            B = document.body.clientWidth
        }
    }
    if (window.innerHeight) {
        A = window.innerHeight
    } else {
        if ((document.body) && (document.body.clientHeight)) {
            A = document.body.clientHeight
        }
    }
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        A = document.documentElement.clientHeight;
        B = document.documentElement.clientWidth
    }
    C[0] = B;
    C[1] = A;
    return C
}
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(G) {
    var C, E, A;
    var F, D, B;
    A = G.length;
    E = 0;
    C = "";
    while (E < A) {
        F = G.charCodeAt(E++) & 255;
        if (E == A) {
            C += base64EncodeChars.charAt(F >> 2);
            C += base64EncodeChars.charAt((F & 3) << 4);
            C += "==";
            break
        }
        D = G.charCodeAt(E++);
        if (E == A) {
            C += base64EncodeChars.charAt(F >> 2);
            C += base64EncodeChars.charAt(((F & 3) << 4) | ((D & 240) >> 4));
            C += base64EncodeChars.charAt((D & 15) << 2);
            C += "=";
            break
        }
        B = G.charCodeAt(E++);
        C += base64EncodeChars.charAt(F >> 2);
        C += base64EncodeChars.charAt(((F & 3) << 4) | ((D & 240) >> 4));
        C += base64EncodeChars.charAt(((D & 15) << 2) | ((B & 192) >> 6));
        C += base64EncodeChars.charAt(B & 63)
    }
    return C
}

function utf16to8(D) {
    var B, C, A, E;
    B = "";
    A = D.length;
    for (C = 0; C < A; C++) {
        E = D.charCodeAt(C);
        if ((E >= 1) && (E <= 127)) {
            B += D.charAt(C)
        } else {
            if (E > 2047) {
                B += String.fromCharCode(224 | ((E >> 12) & 15));
                B += String.fromCharCode(128 | ((E >> 6) & 63));
                B += String.fromCharCode(128 | ((E >> 0) & 63))
            } else {
                B += String.fromCharCode(192 | ((E >> 6) & 31));
                B += String.fromCharCode(128 | ((E >> 0) & 63))
            }
        }
    }
    return B
}
this.MD5 = function(J, AA) {
    var Y = AA;

    function l(G, F) {
        return (G << F) | (G >>> (32 - F))
    }

    function j(a, G) {
        var c, F, I, b, H;
        I = (a & 2147483648);
        b = (G & 2147483648);
        c = (a & 1073741824);
        F = (G & 1073741824);
        H = (a & 1073741823) + (G & 1073741823);
        if (c & F) {
            return (H ^ 2147483648 ^ I ^ b)
        }
        if (c | F) {
            if (H & 1073741824) {
                return (H ^ 3221225472 ^ I ^ b)
            } else {
                return (H ^ 1073741824 ^ I ^ b)
            }
        } else {
            return (H ^ I ^ b)
        }
    }

    function R(F, H, G) {
        return (F & H) | ((~F) & G)
    }

    function Q(F, H, G) {
        return (F & G) | (H & (~G))
    }

    function P(F, H, G) {
        return (F ^ H ^ G)
    }

    function N(F, H, G) {
        return (H ^ (F | (~G)))
    }

    function T(H, G, AC, AB, F, I, k) {
        H = j(H, j(j(R(G, AC, AB), F), k));
        return j(l(H, I), G)
    }

    function B(H, G, AC, AB, F, I, k) {
        H = j(H, j(j(Q(G, AC, AB), F), k));
        return j(l(H, I), G)
    }

    function h(H, G, AC, AB, F, I, k) {
        H = j(H, j(j(P(G, AC, AB), F), k));
        return j(l(H, I), G)
    }

    function S(H, G, AC, AB, F, I, k) {
        H = j(H, j(j(N(G, AC, AB), F), k));
        return j(l(H, I), G)
    }

    function A(c) {
        var d;
        var I = c.length;
        var H = I + 8;
        var G = (H - (H % 64)) / 64;
        var b = (G + 1) * 16;
        var k = Array(b - 1);
        var F = 0;
        var a = 0;
        while (a < I) {
            d = (a - (a % 4)) / 4;
            F = (a % 4) * 8;
            k[d] = (k[d] | (c.charCodeAt(a) << F));
            a++
        }
        d = (a - (a % 4)) / 4;
        F = (a % 4) * 8;
        k[d] = k[d] | (128 << F);
        k[b - 2] = I << 3;
        k[b - 1] = I >>> 29;
        return k
    }

    function f(H) {
        var G = "",
            I = "",
            a, F;
        for (F = 0; F <= 3; F++) {
            a = (H >>> (F * 8)) & 255;
            I = "0" + a.toString(16);
            G = G + I.substr(I.length - 2, 2)
        }
        return G
    }
    var g = Array();
    var p, E, i, U, C, z, y, w, v;
    var s = 7,
        q = 12,
        n = 17,
        m = 22;
    var e = 5,
        Z = 9,
        X = 14,
        W = 20;
    var O = 4,
        M = 11,
        L = 16,
        K = 23;
    var u = 6,
        t = 10,
        r = 15,
        o = 21;
    g = A(J);
    z = 1732584193;
    y = 4023233417;
    w = 2562383102;
    v = 271733878;
    var D = g.length;
    for (p = 0; p < D; p += 16) {
        E = z;
        i = y;
        U = w;
        C = v;
        z = T(z, y, w, v, g[p + 0], s, 3614090360);
        v = T(v, z, y, w, g[p + 1], q, 3905402710);
        w = T(w, v, z, y, g[p + 2], n, 606105819);
        y = T(y, w, v, z, g[p + 3], m, 3250441966);
        z = T(z, y, w, v, g[p + 4], s, 4118548399);
        v = T(v, z, y, w, g[p + 5], q, 1200080426);
        w = T(w, v, z, y, g[p + 6], n, 2821735955);
        y = T(y, w, v, z, g[p + 7], m, 4249261313);
        z = T(z, y, w, v, g[p + 8], s, 1770035416);
        v = T(v, z, y, w, g[p + 9], q, 2336552879);
        w = T(w, v, z, y, g[p + 10], n, 4294925233);
        y = T(y, w, v, z, g[p + 11], m, 2304563134);
        z = T(z, y, w, v, g[p + 12], s, 1804603682);
        v = T(v, z, y, w, g[p + 13], q, 4254626195);
        w = T(w, v, z, y, g[p + 14], n, 2792965006);
        y = T(y, w, v, z, g[p + 15], m, 1236535329);
        z = B(z, y, w, v, g[p + 1], e, 4129170786);
        v = B(v, z, y, w, g[p + 6], Z, 3225465664);
        w = B(w, v, z, y, g[p + 11], X, 643717713);
        y = B(y, w, v, z, g[p + 0], W, 3921069994);
        z = B(z, y, w, v, g[p + 5], e, 3593408605);
        v = B(v, z, y, w, g[p + 10], Z, 38016083);
        w = B(w, v, z, y, g[p + 15], X, 3634488961);
        y = B(y, w, v, z, g[p + 4], W, 3889429448);
        z = B(z, y, w, v, g[p + 9], e, 568446438);
        v = B(v, z, y, w, g[p + 14], Z, 3275163606);
        w = B(w, v, z, y, g[p + 3], X, 4107603335);
        y = B(y, w, v, z, g[p + 8], W, 1163531501);
        z = B(z, y, w, v, g[p + 13], e, 2850285829);
        v = B(v, z, y, w, g[p + 2], Z, 4243563512);
        w = B(w, v, z, y, g[p + 7], X, 1735328473);
        y = B(y, w, v, z, g[p + 12], W, 2368359562);
        z = h(z, y, w, v, g[p + 5], O, 4294588738);
        v = h(v, z, y, w, g[p + 8], M, 2272392833);
        w = h(w, v, z, y, g[p + 11], L, 1839030562);
        y = h(y, w, v, z, g[p + 14], K, 4259657740);
        z = h(z, y, w, v, g[p + 1], O, 2763975236);
        v = h(v, z, y, w, g[p + 4], M, 1272893353);
        w = h(w, v, z, y, g[p + 7], L, 4139469664);
        y = h(y, w, v, z, g[p + 10], K, 3200236656);
        z = h(z, y, w, v, g[p + 13], O, 681279174);
        v = h(v, z, y, w, g[p + 0], M, 3936430074);
        w = h(w, v, z, y, g[p + 3], L, 3572445317);
        y = h(y, w, v, z, g[p + 6], K, 76029189);
        z = h(z, y, w, v, g[p + 9], O, 3654602809);
        v = h(v, z, y, w, g[p + 12], M, 3873151461);
        w = h(w, v, z, y, g[p + 15], L, 530742520);
        y = h(y, w, v, z, g[p + 2], K, 3299628645);
        z = S(z, y, w, v, g[p + 0], u, 4096336452);
        v = S(v, z, y, w, g[p + 7], t, 1126891415);
        w = S(w, v, z, y, g[p + 14], r, 2878612391);
        y = S(y, w, v, z, g[p + 5], o, 4237533241);
        z = S(z, y, w, v, g[p + 12], u, 1700485571);
        v = S(v, z, y, w, g[p + 3], t, 2399980690);
        w = S(w, v, z, y, g[p + 10], r, 4293915773);
        y = S(y, w, v, z, g[p + 1], o, 2240044497);
        z = S(z, y, w, v, g[p + 8], u, 1873313359);
        v = S(v, z, y, w, g[p + 15], t, 4264355552);
        w = S(w, v, z, y, g[p + 6], r, 2734768916);
        y = S(y, w, v, z, g[p + 13], o, 1309151649);
        z = S(z, y, w, v, g[p + 4], u, 4149444226);
        v = S(v, z, y, w, g[p + 11], t, 3174756917);
        w = S(w, v, z, y, g[p + 2], r, 718787259);
        y = S(y, w, v, z, g[p + 9], o, 3951481745);
        z = j(z, E);
        y = j(y, i);
        w = j(w, U);
        v = j(v, C)
    }
    var V;
    if (Y == "16") {
        V = f(y) + f(w)
    }
    if (Y == "32") {
        V = f(z) + f(y) + f(w) + f(v)
    }
    return V
};

function base64decode(I) {
    var G = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    var E, D, B, A;
    var F, H, C;
    H = I.length;
    F = 0;
    C = "";
    while (F < H) {
        do {
            E = G[I.charCodeAt(F++) & 255]
        } while (F < H && E == -1);
        if (E == -1) {
            break
        }
        do {
            D = G[I.charCodeAt(F++) & 255]
        } while (F < H && D == -1);
        if (D == -1) {
            break
        }
        C += String.fromCharCode((E << 2) | ((D & 48) >> 4));
        do {
            B = I.charCodeAt(F++) & 255;
            if (B == 61) {
                return C
            }
            B = G[B]
        } while (F < H && B == -1);
        if (B == -1) {
            break
        }
        C += String.fromCharCode(((D & 15) << 4) | ((B & 60) >> 2));
        do {
            A = I.charCodeAt(F++) & 255;
            if (A == 61) {
                return C
            }
            A = G[A]
        } while (F < H && A == -1);
        if (A == -1) {
            break
        }
        C += String.fromCharCode(((B & 3) << 6) | A)
    }
    return C
};
