(function() {
    var state = {
            index: 0,
            length: 4
        },
        $leftArrow = document.querySelector('.slider-arrow-pic._left'),
        $rightArrow = document.querySelector('.slider-arrow-pic._right'),
        $slider = document.querySelector('.slider-slides'),
        $pagingItems = document.querySelectorAll('.slider-paging-item');

    $rightArrow.addEventListener('click', function() {
        if (state.index < state.length - 1) {
            state.index += 1;
            slide();
            checkArrowVisibility();
            checkPagingPosition();
        }
    });

    $leftArrow.addEventListener('click', function() {
        if (state.index > 0) {
            state.index -= 1;
            slide();
            checkArrowVisibility();
            checkPagingPosition();
        }
    });
    for (var i = 0; i < $pagingItems.length; i += 1) {
        (function(i) {
            var $item = $pagingItems[i];
            $item.addEventListener('click', function() {
                state.index = i;
                checkArrowVisibility();
                slide();
                checkPagingPosition();
            })
        }(i));
    }

    function slide() {
        var width = $slider.offsetWidth;
        $slider.style.transform = "translateX(-" + state.index * width + "px)"
    }

    function checkArrowVisibility() {
        if (state.index >= state.length - 1) {
            $rightArrow.classList.add('_hidden');
        }
        else if (state.index <= 0) {
            $leftArrow.classList.add('_hidden');
        }
        else {
            $rightArrow.classList.remove('_hidden');
            $leftArrow.classList.remove('_hidden');
        }
    }

    function checkPagingPosition() {
        for (var i = 0; i < $pagingItems.length; i += 1) {
            $pagingItems[i].classList.remove('_active');
        }
        $pagingItems[state.index].classList.add('_active');
    }

    window.onresize = slide;
}());

(function() {
    var state = {
            index: 0,
            length: 11
        },
        $leftArrow = document.querySelector('.productsSlider-pic._left'),
        $rightArrow = document.querySelector('.productsSlider-pic._right'),
        $slider = document.querySelector('.productsSlider-wrp');

    $rightArrow.addEventListener('click', function() {
        if (state.index < state.length - 1) {
            state.index += 1;
            slide();
            checkArrowVisibility();
        }
    });

    $leftArrow.addEventListener('click', function() {
        if (state.index > 0) {
            state.index -= 1;
            slide();
            checkArrowVisibility();
        }
    });

    function slide() {
        var width = $slider.offsetWidth;
        $slider.style.transform = "translateX(-" + state.index * width / 5 + "px)"
    }

    function checkArrowVisibility() {
        if (state.index >= state.length - 1) {
            $rightArrow.classList.add('_hidden');
        }
        else if (state.index <= 0) {
            $leftArrow.classList.add('_hidden');
        }
        else {
            $rightArrow.classList.remove('_hidden');
            $leftArrow.classList.remove('_hidden');
        }
    }
}());