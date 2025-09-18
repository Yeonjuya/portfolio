$(document).ready(function () {

    // 이메일 복사
    $('.email-copy').click(function () {
        var email = $(this).data('email');

        navigator.clipboard.writeText(email).then(function () {

            $('#email-alert').fadeIn(200).delay(2000).fadeOut(200);
        }).catch(function () {

            var $temp = $('<textarea>');
            $('body').append($temp);
            $temp.val(email).select();
            document.execCommand('copy');
            $temp.remove();
            $('#email-alert').fadeIn(200).delay(2000).fadeOut(200);
        });
    });

    $('.email-copy').attr('title', '클릭하여 이메일 복사');

    // 스크롤 네비게이션
    $('header a:not([href^="mailto:"]), .ft-nav a:not([href^="mailto:"])').on('click', function (e) {
        e.preventDefault();

        var target = $(this.getAttribute('href'));

        if (target.length) {
            var headerHeight = $('#header').outerHeight();

            $('html, body').animate({
                scrollTop: target.offset().top - headerHeight - 20
            }, {
                duration: 1000,
                easing: 'swing'
            });
        }
    });


    //header 스크롤 이벤트
    var prevScrollTop = 0;

    $(window).on('scroll', function () {
        var nowScrollTop = $(this).scrollTop();

        if (nowScrollTop > prevScrollTop) {
            $('#header').addClass('active');
        } else {
            $('#header').removeClass('active');
        }
        prevScrollTop = nowScrollTop;
    });

    const iconWrapper = $("#header .icon_wrapper");
    const contactItem = $("#header .contact_item");

    // GSAP 초기 설정 (contact_item 뒤에 숨김)
    gsap.set(iconWrapper, {
        rotation: -114,
        skewX: 0,
        x: -3
    });

    // 마우스 hover 시 아이콘이 회전하면서 등장
    contactItem.hover(
        function () {
            gsap.to(iconWrapper, {
                rotation: 80,
                skewX: 0,
                scale: 1,
                x: 80,
                duration: 0.5,
                ease: "power2.out",
                onComplete: function () {
                    gsap.to(iconWrapper, {
                        rotation: 0,
                        x: 36,
                        duration: 0.4,
                        ease: "power1.out"
                    });
                }
            });
        },
        function () {
            gsap.to(iconWrapper, {
                rotation: -114,
                skewX: -0.2,
                scale: 0.98,
                x: 0,
                duration: 0.5,
                ease: "power2.in"
            });
        }
    );


    // #hero
    const text = "Hello from Yeonju!";
    let index = 0;
    let speed = 67;

    function typeWriter() {
        if (index < text.length) {
            document.getElementById("text").textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        }
    }

    typeWriter();


    //READY TO CREATE
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".ht_text", {
        x: "-700px", // 원래 위치로 이동해서 전체 보이게
        ease: "none", // 스크롤에 따라 부드럽게 연동되도록
        scrollTrigger: {
            trigger: ".text-wrapper",
            start: "top 70%",
            end: "bottom 20%",
            scrub: 1.5,
            markers: false
        }
    });

    //introduce memo
    $('.about').hide();

    $('.intro_image').on('click', function () {
        $('.about').show();
    });

    $('.about_close').on('click', function () {
        $('.about').hide();
    });


    //GRAPHIC & BRANDING
    $('.btn').on('click', function (e) {
        e.preventDefault();
        $('.add-work').addClass('is-open');
        $('body').addClass('is-dimmed');
    });

    $('.btn_close').on('click', function () {
        $('.add-work').removeClass('is-open');
        $('body').removeClass('is-dimmed');
    });
});