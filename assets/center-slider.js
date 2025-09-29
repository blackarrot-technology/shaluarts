var swiper = new Swiper('.swiper-container.two', {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    effect: 'coverflow',
    loop: true,
    autoplay: false,
    spaceBetween: 10,
    
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflow: {
      rotate: 0,
      stretch:50,
      depth: 100,
      modifier: 1.5,
      slideShadows: false,
    },
});

document.addEventListener("DOMContentLoaded", function () {  
  const stopButtons = document.getElementsByClassName("swiper-pagination-bullet");

  // Loop through all buttons and add event listeners
  Array.from(stopButtons).forEach((stopButton) => {
      stopButton.addEventListener("click", function () {
          // Delay the execution of the function
          setTimeout(() => {
              const prevVideoIframe = document.querySelector(".swiper-slide-prev iframe");
              const nextVideoIframe = document.querySelector(".swiper-slide-next iframe");

              // Save the original sources
              const originalSrc1 = prevVideoIframe ? prevVideoIframe.src : null;
              const originalSrc2 = nextVideoIframe ? nextVideoIframe.src : null;

              if (prevVideoIframe && originalSrc1) {
                  prevVideoIframe.src = ""; // Stop the previous video
                  setTimeout(() => (prevVideoIframe.src = originalSrc1), 100); // Reset source to enable replay
              }
              if (nextVideoIframe && originalSrc2) {
                  nextVideoIframe.src = ""; // Stop the next video
                  setTimeout(() => (nextVideoIframe.src = originalSrc2), 100); // Reset source to enable replay
              }
          }, 500); // Add a delay of 500ms (adjust as needed)
      });
  });
});


/*document.addEventListener("DOMContentLoaded", function () {
    const prevVideoIframe = document.querySelector(".swiper-slide-prev iframe");
    const nextVideoIframe = document.querySelector(".swiper-slide-next iframe");
    const stopButtons = document.getElementsByClassName("swiper-pagination-bullet");

    // Save the original sources
    const originalSrc1 = prevVideoIframe ? prevVideoIframe.src : null;
    const originalSrc2 = nextVideoIframe ? nextVideoIframe.src : null;

    // Loop through all buttons and add event listeners
    Array.from(stopButtons).forEach((stopButton) => {
        stopButton.addEventListener("click", function () {
            if (prevVideoIframe && originalSrc1) {
                prevVideoIframe.src = ""; // Stop the previous video
                setTimeout(() => (prevVideoIframe.src = originalSrc1), 100); // Reset source to enable replay
            }
            if (nextVideoIframe && originalSrc2) {
                nextVideoIframe.src = ""; // Stop the next video
                setTimeout(() => (nextVideoIframe.src = originalSrc2), 100); // Reset source to enable replay
            }
        });
    });
});*/
