'use strict';

window.onload = function() {
    var loader = document.getElementById('pagePreloader');

    /* Just to see preloader, delete in production and uncomment bottom commented code
    * ***************
    * */
    setTimeout(function () {
        loader.classList.add('no-visible');
    }, 2000);
    setTimeout(function () {
        loader.parentNode.removeChild(loader);
    }, 3000);
    /***************/
    /*loader.classList.add('no-visible');
     setTimeout(function () {
     loader.parentNode.removeChild(loader);
     }, 1000);*/
};

document.addEventListener('DOMContentLoaded', function() {

    // Mobile menu
    var toggleMenuEls = [
        document.querySelector('.btn-mob-menu'),
        document.querySelector('.btn-close-menu'),
        document.querySelector('.overlay')
    ];

    for (var i = 0; i < toggleMenuEls.length; i++) {
        toggleMenuEls[i].addEventListener('click', toggleMobMenu);
    }

    // Appearing content
    document.addEventListener('scroll', function () {
        var els = document.querySelectorAll('.no-visible.animate-fadeIn'),
            cond = false,
            animDuration = 0.3,
            delay = 0;

        for (var i = 0; i < els.length; i++) {
            cond = els[i].getBoundingClientRect().top < window.innerHeight * 0.66;

            if (cond) {
                if (els.length > 1) {
                    delay = animDuration * i;

                    els[i].style.transitionDelay = delay.toString() + 's';
                    els[i].style.WebkitTransitionDelay = delay.toString() + 's';

                    els[i].classList.remove('no-visible');
                } else {
                    els[i].classList.remove('no-visible');
                }
            }
        }
    });

    function toggleMobMenu() {
        var html = document.documentElement,
            menu = document.querySelector('.cont-main-menu'),
            overlay = document.querySelector('.overlay');

        html.classList.toggle('no-scroll');
        menu.classList.toggle('menu-opened');
        overlay.classList.toggle('visible');
    }
});