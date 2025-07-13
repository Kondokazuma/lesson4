$(document).ready(function() {
    function updateBodyPadding() {
        const headerHeight = $('header').outerHeight();
        $('body').css('padding-top', headerHeight + 'px');
    }
    $(window).on('resize', updateBodyPadding);
    updateBodyPadding();

    const bgImage = new Image();
    bgImage.src = '../image/kv.jpg';
    bgImage.onload = function() { console.log('背景画像が正常に読み込まれました'); };
    bgImage.onerror = function() { console.warn('背景画像の読み込みに失敗しました。パスを確認してください: ../image/kv.jpg'); };

    function updateBodyHeight() {
        const docHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        );
        $('body').css('min-height', docHeight + 'px');
    }

    function checkFooterVisibility() {
        const footer = $('#footer-content');
        if (footer.length === 0) {
            console.warn('フッター要素が見つかりません: #footer-content');
            return;
        }
        const windowHeight = $(window).height();
        const scrollPosition = $(window).scrollTop();
        const footerTop = footer.offset().top || 0;
        if (scrollPosition + windowHeight > footerTop - 200) {
            footer.addClass('visible');
        } else {
            footer.removeClass('visible');
        }
        updateBodyHeight();
    }
    checkFooterVisibility();
    $(window).on('scroll resize', checkFooterVisibility);

    function scrollToAnchor() {
        const hash = window.location.hash;
        if (hash) {
            const $target = $(hash);
            if ($target.length) {
                const headerHeight = $('header').outerHeight();
                const targetPosition = $target.offset().top - headerHeight;
                $('html, body').animate({ scrollTop: targetPosition }, 800, function() {
                    updateBodyHeight();
                });
                $('#footer-content').addClass('visible');
                $('#hamburger').prop('checked', false);
            } else {
                console.warn(`ターゲット要素が見つかりません: ${hash}`);
            }
        }
    }
    $(window).on('load hashchange', scrollToAnchor);
    scrollToAnchor();

    $('.service > p > a, .qa > p > a, .company > p > a').on('click', function(e) {
        const href = $(this).attr('href');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const [page, targetId] = href.split('#');

        if (page && page !== currentPage) {
            e.preventDefault();
            window.location.href = href;
        } else {
            e.preventDefault();
            const $target = targetId ? $(`#${targetId}`) : null;
            if ($target && $target.length) {
                $('#footer-content').addClass('visible');
                const headerHeight = $('header').outerHeight();
                const targetPosition = $target.offset().top - headerHeight;
                $('html, body').animate({ scrollTop: targetPosition }, 800, function() {
                    updateBodyHeight();
                });
                $('#hamburger').prop('checked', false);
            } else {
                console.warn(`ターゲット要素が見つかりません: #${targetId}`);
                window.location.href = href;
            }
        }
    });

    $('.service-items div').on('click touchstart', function(e) {
        e.preventDefault();
        const $this = $(this);
        
        if ($this.hasClass('WEB')) {
            $('.service-items div').removeClass('smart-clicked seo-clicked');
            $('.WEB').removeClass('web-white');
        } else if ($this.hasClass('SEO')) {
            $('.service-items div').removeClass('smart-clicked seo-clicked');
            $this.addClass('seo-clicked');
            $('.WEB').addClass('web-white');
        } else if ($this.hasClass('smart')) {
            $('.service-items div').removeClass('smart-clicked seo-clicked');
            $this.addClass('smart-clicked');
            $('.WEB').addClass('web-white');
        }

        $('.WEBseisaku p').text($this.find('p').text());

        if (e.type === 'touchstart') {
            const bgColor = $this.hasClass('WEB') ? '#b3ffff' :
                           $this.hasClass('SEO') ? '#ffdea0' :
                           $this.hasClass('smart') ? '#a7ff99' : '';
            $this.css('background-color', bgColor);
            setTimeout(() => $this.css('background-color', ''), 300);
        }
    });

    $('.submit-btn').on('click', function() {
        const name = $('#name').val().trim();
        const prefecture = $('#prefecture').val();
        const city = $('#city').val().trim();
        const email = $('#email').val().trim();
        const phone = $('#phone').val().trim();

        if (!name || !prefecture || !city || !email) {
            alert('必須項目をすべて入力してください。');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('正しいメールアドレス形式で入力してください（例：user@domain.com）。');
            $('#email').focus();
            return;
        }

        console.log('フォームデータ:', { name, prefecture, city, email, phone });
        window.location.href = 'thanks.html';
    });

    const cityData = {
        '北海道': ['札幌市', '函館市', '小樽市', '旭川市', '室蘭市', '釧路市', '帯広市', '北見市', '夕張市', '岩見沢市', '網走市', '留萌市', '苫小牧市', '稚内市', '美唄市', '芦別市', '江別市', '赤平市', '紋別市', '士別市', '名寄市', '三笠市', '根室市', '千歳市', '滝川市', '砂川市', '歌志内市', '深川市', '富良野市', '登別市', '恵庭市', '伊達市', '北広島市', '石狩市', '北斗市'],
        '青森県': ['青森市', '弘前市', '八戸市', '黒石市', '五所川原市', '十和田市', '三沢市', 'むつ市', 'つがる市', '平川市'],
        '岩手県': ['盛岡市', '宮古市', '大船渡市', '花巻市', '北上市', '久慈市', '遠野市', '一関市', '陸前高田市', '釜石市', '二戸市', '八幡平市', '奥州市', '滝川市']
    };

    function updateCities() {
        const prefecture = $('#prefecture').val();
        const $citySelect = $('#city');
        $citySelect.empty();
        $citySelect.append('<option value="">選択してください</option>');
        if (prefecture && cityData[prefecture]) {
            cityData[prefecture].forEach(city => {
                $citySelect.append(`<option value="${city}">${city}</option>`);
            });
        }
    }
    updateCities();
    $('#prefecture').on('change', updateCities);
});