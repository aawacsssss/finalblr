$('form[method="post"]').submit(function (e) {
	var $catpcha = $(this).find('.g-recaptcha');
	var button =  $(this).find('button[type="submit"]');
	var buttonHtml =  button.html();
	function disabledButton() {
		button.prop('disabled', true);
		button.html('Gönderiliyor...');
	}
	function activatedButton() {
		button.prop('disabled', false);
		button.html(buttonHtml);
	}
	var clientID = !1;
	if ($catpcha.length) {
		disabledButton();
		Object.keys(window.___grecaptcha_cfg.clients).forEach(function (key) {
			Object.keys(window.___grecaptcha_cfg.clients[key]).forEach(function (_key) {
				if ($catpcha.is(window.___grecaptcha_cfg.clients[key][_key])) {
					clientID = key
				}
			})
		});
		if (clientID !== !1) {
			if (!grecaptcha.getResponse(clientID)) {
				e.preventDefault();
				activatedButton();
				$('.fake_error').remove();
				$catpcha.prepend('<div class="error-text-area">Recaptcha Doldurulması Gerekiyor !</div>')
			} else {
				$('.fake_error').remove()
			}
		}
	}
});

function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

$(".mobile-nav-menu ul li.sub-menu i").click(function () {
  $(this).closest(".sub-menu-flex").next('ul').slideToggle();
});

  $(window).scroll(function () {
    if ($(window).scrollTop() >= 120) {
      $('.header-nav').addClass('fixed-header');
    } else {
      $('.header-nav').removeClass('fixed-header');
    }
  });

$(".mobile-nav-menu ul li.sub-menu span").click(function () {
  $(this).closest(".sub-menu-flex").next('ul').slideToggle();
});

  $(window).scroll(function () {
    if ($(window).scrollTop() >= 120) {
      $('.header-nav').addClass('fixed-header');
    } else {
      $('.header-nav').removeClass('fixed-header');
    }
  });



/* FAQ */

$(function () {
	let $qus = $(".qus");
	let $ans = $(".ans");

	$qus.click(function () {
		$(this).next().slideToggle("slow");
		$(this).toggleClass("active");

		$(this).parent().siblings().find(".qus").removeClass("active");
		$(this).parent().siblings().find(".ans").slideUp("slow");
	});

	$(".menu p").click(function () {
		$(this)
			.parent()
			.siblings(".item-container")
			.children(".hide")
			.addClass("hide-mark");
		$(this)
			.parent()
			.siblings(".item-container")
			.children(".hide-mark")
			.fadeToggle("slow");

		if ($(this).html() == "+ More") {
			$(this).html("- Hide");
		} else {
			$(this).html("+ More");
		}
	});
});



// Slider 1

const swiper = new Swiper('.swiper-slider', {
    loop: true,
  
    pagination: {
      el: '.swiper-slider-pagination',
    },
  
    navigation: {
      nextEl: '.slider-button-next',
      prevEl: '.slider-button-prev',
    },

    autoplay: {
      delay: 5000,
    },
    touchEventsTarget: 'container',
    simulateTouch: true,
    allowTouchMove: true,
  
  });


  // Slider 2 

  const swiper2 = new Swiper('.swiper-slider-2', {
    loop: true,
    
    pagination: {
      el: '.swiper-slider-pagination-2',
    },
  
    navigation: {
      nextEl: '.slider-button-next-2',
      prevEl: '.slider-button-prev-2',
    },

    autoplay: {
      delay: 5000,
    },
    touchEventsTarget: 'container',
    simulateTouch: true,
    allowTouchMove: true,
    
  
  });


  // Video Slider

  const swiperVideo = new Swiper('.swiper-videos', {
    loop: true,
  
    pagination: {
      el: '.swiper-video-pagination',
    },
  
    navigation: {
      nextEl: '.slider-video-button-next',
      prevEl: '.slider-video-button-prev',
    },
    touchEventsTarget: 'container',
    simulateTouch: true,
    allowTouchMove: true,
    
  
  });




// Swiper Services

  const swiperServices = new Swiper('.swiper-services', {
    loop: true,
  
    pagination: {
      el: '.swiper-pagination',
    },
    slidesPerView: 3.6,
	spaceBetween: 30,
    centeredSlides: true,
    
    breakpoints: {
      0:{
      slidesPerView: 1
      },
      576: {
      slidesPerView: 2
      },
      768: {
      slidesPerView: 2
      },
      992: {
      slidesPerView: 2
      },
      1200: {
      slidesPerView: 2.6
      },
      1600: {
      slidesPerView: 2.6
      }
          
  },
  
    navigation: {
      nextEl: '.services-button-next',
      prevEl: '.services-button-prev',
    },
  
  });

  // Swiper Services Container

  const swiperServices2 = new Swiper('.swiper-services2', {
    loop: true,
  
    pagination: {
      el: '.swiper-pagination',
    },
    slidesPerView: 3,
	spaceBetween: 30,
    centeredSlides: true,
    
    breakpoints: {
      0:{
      slidesPerView: 1
      },
      576: {
      slidesPerView: 2
      },
      768: {
      slidesPerView: 2
      },
      992: {
      slidesPerView: 2
      },
      1200: {
      slidesPerView: 3
      },
      1600: {
      slidesPerView: 3
      }
          
  },
  
    navigation: {
      nextEl: '.services-button-next',
      prevEl: '.services-button-prev',
    },
  
  });

// Swiper Products
  
  const swiperProducts = new Swiper('.swiper-products', {
    loop: true,
  
    pagination: {
      el: '.swiper-pagination',
    },
    slidesPerView: 3.6,
	spaceBetween: 30,
    centeredSlides: true,
    
    breakpoints: {
      0:{
      slidesPerView: 1
      },
      576: {
      slidesPerView: 2
      },
      768: {
      slidesPerView: 2
      },
      992: {
      slidesPerView: 2
      },
      1200: {
      slidesPerView: 3.6
      },
      1600: {
      slidesPerView: 3.6
      }
          
  },
  
    navigation: {
      nextEl: '.products-button-next',
      prevEl: '.products-button-prev',
    },
  
  });

  // Swiper Testimonials
  
  const swiperTestimonials = new Swiper('.swiper-testimonials', {
    loop: true,
  
    pagination: {
      el: '.swiper-pagination',
    },
    slidesPerView: 2,
	spaceBetween: 30,
  
  breakpoints: {
    0:{
    slidesPerView: 1
    },
    576: {
    slidesPerView: 1
    },
    768: {
    slidesPerView: 2
    },
    992: {
    slidesPerView: 2
    },
    1200: {
    slidesPerView: 2
    },
    1600: {
    slidesPerView: 2
    }
        
},
  
    navigation: {
      nextEl: '.testimonials-button-next',
      prevEl: '.testimonials-button-prev',
    },
  
  });

  // Blog
  
  const swiperBlog = new Swiper('.swiper-blog', {
    loop: true,
  
    pagination: {
      el: '.swiper-pagination',
    },
    slidesPerView: 3,
	spaceBetween: 30,
  
  breakpoints: {
    0:{
    slidesPerView: 1
    },
    576: {
    slidesPerView: 2
    },
    768: {
    slidesPerView: 2
    },
    992: {
    slidesPerView: 2
    },
    1200: {
    slidesPerView: 3
    },
    1600: {
    slidesPerView: 3
    }
        
},
    navigation: {
      nextEl: '.blog-button-next',
      prevEl: '.blog-button-prev',
    },
  
  });

    // Blog
  
    const swiperTeams = new Swiper('.swiper-teams', {
        loop: true,
      
        pagination: {
          el: '.swiper-pagination',
        },
        slidesPerView: 4,
        spaceBetween: 30,
        
    breakpoints: {
      0:{
      slidesPerView: 1
      },
      576: {
      slidesPerView: 2
      },
      768: {
      slidesPerView: 2
      },
      992: {
      slidesPerView: 2
      },
      1200: {
      slidesPerView: 3
      },
      1600: {
      slidesPerView: 4
      }
          
  },
      
        navigation: {
          nextEl: '.teams-button-next',
          prevEl: '.teams-button-prev',
        },
      
      });



    // Videos
  
    const swiperVideos = new Swiper('.swiper-videos-area', {
      loop: true,
    
      pagination: {
        el: '.swiper-pagination',
      },
      slidesPerView: 3,
      spaceBetween: 30,
      
    breakpoints: {
      0:{
      slidesPerView: 1
      },
      576: {
      slidesPerView: 2
      },
      768: {
      slidesPerView: 2
      },
      992: {
      slidesPerView: 2
      },
      1200: {
      slidesPerView: 3
      },
      1600: {
      slidesPerView: 3
      }
          
  },
    
      navigation: {
        nextEl: '.videos-button-next',
        prevEl: '.videos-button-prev',
      },
    
    });



    // Picture Gallery
  
    const swiperPictures = new Swiper('.swiper-pictures', {
      loop: true,
    
      pagination: {
        el: '.swiper-pagination',
      },
      slidesPerView: 3,
      spaceBetween: 30,
      
    breakpoints: {
      0:{
      slidesPerView: 1
      },
      576: {
      slidesPerView: 2
      },
      768: {
      slidesPerView: 2
      },
      992: {
      slidesPerView: 2
      },
      1200: {
      slidesPerView: 3
      },
      1600: {
      slidesPerView: 3
      }
          
  },
    
      navigation: {
        nextEl: '.pictures-button-next',
        prevEl: '.pictures-button-prev',
      },
    
    });


    // References
  
    const swiperReferences = new Swiper('.swiper-references', {
      loop: true,
    
      pagination: {
        el: '.swiper-pagination',
      },
      slidesPerView: 5,
      spaceBetween: 30,
      
    breakpoints: {
      0:{
      slidesPerView: 2
      },
      576: {
      slidesPerView: 2
      },
      768: {
      slidesPerView: 2
      },
      992: {
      slidesPerView: 2
      },
      1200: {
      slidesPerView: 4
      },
      1600: {
      slidesPerView: 5
      }
          
  },
    
      navigation: {
        nextEl: '.references-button-next',
        prevEl: '.references-button-prev',
      },
    
    });

    /* product swiper */

    const swiperPro = new Swiper('.swiper-products-detail', {
      loop: true,
      slidesPerView: 1,
      spaceBetween:0,
      pagination: {
        el: '.swiper-slider-pagination',
      },
    
      navigation: {
        nextEl: '.products-button-next',
        prevEl: '.products-button-prev',
      },
    
    });
  
    
    $(window).scroll(function () {
      if ($(window).scrollTop() >= 700) {
        $('.back-to-top').addClass('opacity-up');
      } else {
        $('.back-to-top').removeClass('opacity-up');
      }
    });

$(window).scroll(function(){
	var height=$(window).height();
	var scrollTop=$(window).scrollTop();
	var scrollPercent=Math.round((scrollTop) / ($(document).height() - height) * 100);
	$("#scroll-percent").text(scrollPercent + "%");
	if(scrollTop > height){
	$(".back-to-top").addClass("back-to-top-on");
	}else{
	$(".back-to-top").removeClass("back-to-top-on");
	}});
	$('.back-to-top').click(function(){
	$('body,html').animate({
	scrollTop: '0px'
	}, 500);
	});


