$(document).ready(function () {
    // ページ読み込み時のハッシュリンク処理
    if (window.location.hash) {
        console.log("Hash detected on page load:", window.location.hash);
        var target = $(window.location.hash);
        if (target.length) {
            var speed = 800;
            var headerHeight = $("header").outerHeight() || 0;
            var position = target.offset().top - headerHeight;
            $("body,html").animate({ scrollTop: position }, speed, "swing");
        } else {
            console.log("Target not found for hash:", window.location.hash);
        }
    }

    // サービス項目のタブ切り替え
    $(".service").click(function () {
        console.log("Service clicked:", $(this).attr("id"));
        let id = $(this).attr("id");
        $(".service").removeClass("active");
        $(this).addClass("active");
        $(".description_text").removeClass("active");
        $("#" + id + "_text").addClass("active");
    });

    // ハンバーガーメニューのトグル
$("#hamburger").on("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("Hamburger clicked, current state:", $(this).hasClass("open") ? "open" : "closed");
    const isOpen = $(this).toggleClass("open").hasClass("open");
    $(this).attr("aria-expanded", isOpen);
    if (isOpen) {
        $("#header-menu").stop(true, true).addClass("open").slideDown(400, function () {
            console.log("Menu opened, state: open");
        });
    } else {
        $("#header-menu").stop(true, true).removeClass("open").slideUp(400, function () {
            console.log("Menu closed, state: closed");
        });
    }
});

    // メニュー内のハッシュリンクの処理（メニューを閉じない）
    $("#header-menu a[href^='#']").click(function (event) {
        event.preventDefault(); // デフォルト動作を防止
        var href = $(this).attr("href");
        console.log("Menu hash link clicked:", href);
        var target = $(href == "#" || href == "" ? "html" : href);
        if (target.length) {
            var speed = 800;
            var headerHeight = $("header").outerHeight() || 0;
            var position = target.offset().top - headerHeight;
            $("body,html").animate({ scrollTop: position }, speed, "swing");
            // メニューは閉じない（必要に応じて以下を有効化）
            // if ($(window).width() <= 690) {
            //     $("#hamburger").removeClass("open").attr("aria-expanded", false);
            //     $("#header-menu").stop(true, true).removeClass("open").slideUp(400);
            // }
        } else {
            console.log("Target not found for hash:", href);
        }
    });

    // メニュー外のハッシュリンクの処理
    $("a[href^='#']").not("#header-menu a").click(function (event) {
        event.preventDefault();
        var href = $(this).attr("href");
        console.log("Non-menu hash link clicked:", href);
        var target = $(href == "#" || href == "" ? "html" : href);
        if (target.length) {
            var speed = 800;
            var headerHeight = $("header").outerHeight() || 0;
            var position = target.offset().top - headerHeight;
            $("body,html").animate({ scrollTop: position }, speed, "swing");
        } else {
            console.log("Target not found for hash:", href);
        }
    });

    // ナビゲーションリンク（index3.html）の処理
    $('a[href*="index3.html"], a.logo-link, a[href="index3.html"]').click(function () {
        console.log("Navigation or logo link clicked:", $(this).attr("href"));
        if ($(window).width() <= 690) {
            $("#hamburger").removeClass("open").attr("aria-expanded", false);
            $("#header-menu").stop(true, true).removeClass("open").slideUp(400);
        }
    });

    // 電話番号の入力制限
    $("#phone").on("input", function () {
        const $this = $(this);
        $this.val($this.val().replace(/[^0-9]/g, ""));
    });

    // フォーム送信処理
    $(".submit-btn").on("click", function () {
        const name = $("#name").val().trim();
        const prefecture = $("#prefecture").val();
        const city = $("#city").val();
        const email = $("#email").val().trim();
        const phone = $("#phone").val().trim();

        if (!name || !prefecture || !city || !email) {
            alert("必須項目をすべて入力してください。");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("正しいメールアドレス形式で入力してください（例：user@domain.com）。");
            $("#email").focus();
            return;
        }

        if (phone) {
            const phoneRegex = /^\d{10,11}$/;
            if (!phoneRegex.test(phone)) {
                alert("電話番号は10桁または11桁の数字で入力してください（例：09012345678）。");
                $("#phone").focus();
                return;
            }
        }

        const queryParams = new URLSearchParams({
            name: name,
            prefecture: prefecture,
            city: city,
            email: email,
            phone: phone || ""
        }).toString();

        console.log("フォームデータ:", { name, prefecture, city, email, phone });
        window.location.href = `thanks3.html?${queryParams}`;
    });

    // 市区町村の動的更新
    const cityData = {
        北海道: [
            "札幌市", "函館市", "小樽市", "旭川市", "室蘭市", "釧路市", "帯広市", "北見市", "夕張市", "岩見沢市",
            "網走市", "留萌市", "苫小牧市", "稚内市", "美唄市", "芦別市", "江別市", "赤平市", "紋別市", "士別市",
            "名寄市", "三笠市", "根室市", "千歳市", "滝川市", "砂川市", "歌志内市", "深川市", "富良野市", "登別市",
            "恵庭市", "伊達市", "北広島市", "石狩市", "北斗市"
        ],
        青森県: ["青森市", "弘前市", "八戸市", "黒石市", "五所川原市", "十和田市", "三沢市", "むつ市", "つがる市", "平川市"],
        岩手県: ["盛岡市", "宮古市", "大船渡市", "花巻市", "北上市", "久慈市", "遠野市", "一関市", "陸前高田市", "釜石市", "二戸市", "八幡平市", "奥州市"]
    };

    function updateCities() {
        const prefecture = $("#prefecture").val();
        const $citySelect = $("#city");
        $citySelect.empty();
        $citySelect.append('<option value="">選択してください</option>');
        if (prefecture && cityData[prefecture]) {
            console.log("選択された都道府県:", prefecture, "市区町村リスト:", cityData[prefecture]);
            cityData[prefecture].forEach((city) => {
                $citySelect.append(`<option value="${city}">${city}</option>`);
            });
        } else {
            console.log("都道府県が選択されていないか、データが存在しません");
        }
    }

    $("#prefecture").on("change", updateCities);

    // デバッグ用：ドキュメント全体のクリックイベントを監視
    $(document).on("click", function (event) {
        console.log("Document clicked, target:", event.target);
    });
});