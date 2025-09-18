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

    //guide contents animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $(entry.target).addClass("active");
            }
        });
    });

    $(".desktop_img, .mobile_img").each(function () {
        observer.observe(this);
    });


    // team 
    const text = "booting members… ready";
    let index = 0;
    let speed = 67;
    let hasTyped = false;

    function typeWriter() {
        if (index < text.length) {
            document.getElementById("text").textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        }
    }

    $(window).scroll(function () {
        var elementTop = $('.visual-text').offset().top;
        var scrollTop = $(window).scrollTop() + $(window).height();

        if (scrollTop > elementTop && !hasTyped) {
            hasTyped = true;
            typeWriter();
        }
    });

    // go top
    // document.querySelector('.go-top').addEventListener('click', function (e) {
    //     e.preventDefault();
    //     window.scrollTo({
    //         top: 0,
    //         behavior: 'smooth'
    //     });
    // });

});