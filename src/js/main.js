import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body");
  {
    // bubble interactive

    const interBubble = document.querySelector(".interactive");
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    function move(followElem) {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      followElem.style.transform = `translate(${Math.round(
        curX
      )}px, ${Math.round(curY)}px)`;
      requestAnimationFrame(() => {
        move(followElem);
      });
    }

    window.addEventListener("mousemove", (event) => {
      tgX = event.clientX;
      tgY = event.clientY;
    });

    move(interBubble);
  }

  {
    // Burger menu
    const burger = document.querySelector(".header-burger-icon");
    const menu = document.querySelector(".header-burger-links");
    const menuLinks = document.querySelectorAll(".header-burger-link");
    const bg = document.querySelector(".background");

    burger.addEventListener("click", () => {
      burger.classList.toggle("active");
      menu.classList.toggle("active");
      bg.classList.toggle("active");
      body.classList.toggle("no-scroll");
    });
    bg.addEventListener("click", () => {
      burger.classList.remove("active");
      menu.classList.remove("active");
      bg.classList.remove("active");
      body.classList.remove("no-scroll");
    });

    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setTimeout(() => {
          burger.classList.remove("active");
          menu.classList.remove("active");
          bg.classList.remove("active");
          body.classList.remove("no-scroll");
        }, 200);
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        burger.classList.remove("active");
        menu.classList.remove("active");
        bg.classList.remove("active");
        body.classList.remove("no-scroll");
      }
    });
  }

  {
    // carrousel
    const carrousel = document.querySelector(".carrousel");
    const items = document.querySelectorAll(".carrousel-item");

    function getItemWidthIncludingMargin() {
      const style = getComputedStyle(items[0]);
      const margin =
        parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      return items[0].offsetWidth + margin;
    }

    function isAtEnd() {
      return (
        Math.ceil(carrousel.scrollLeft + carrousel.offsetWidth) >=
        carrousel.scrollWidth
      );
    }

    function isAtStart() {
      return carrousel.scrollLeft <= 0;
    }

    // NEXT (right)
    document.querySelector(".next").addEventListener("click", () => {
      const scrollAmount = getItemWidthIncludingMargin();
      if (isAtEnd()) {
        carrousel.scrollTo({ left: 0, behavior: "smooth" }); // Go to start
      } else {
        carrousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    });

    // PREV (left)
    document.querySelector(".prev").addEventListener("click", () => {
      const scrollAmount = getItemWidthIncludingMargin();
      if (isAtStart()) {
        carrousel.scrollTo({ left: carrousel.scrollWidth, behavior: "smooth" }); // Go to end
      } else {
        carrousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    });

    carrousel.addEventListener("mouseenter", () => {
      carrousel.addEventListener("mousemove", (event) => {
        const rect = carrousel.getBoundingClientRect();
        tgX = event.clientX - rect.left;
        tgY = event.clientY - rect.top;
      });
      move(document.querySelector(".carrousel-cta"));
    });
  }

  {
    // Random Color
    const colors = ["#66ebfa", "#D351E2", "#F5CC13", "#FD2E08"];

    function applyRandomColorOnHover(elements, property) {
      elements.forEach((element) => {
        let previousColor = null;

        element.addEventListener("mouseenter", function () {
          let randomColor;

          do {
            randomColor = colors[Math.floor(Math.random() * colors.length)];
          } while (randomColor === previousColor);

          previousColor = randomColor;
          element.style.setProperty(property, randomColor);
        });
      });
    }

    const buttonElements = document.querySelectorAll(".btn");
    applyRandomColorOnHover(buttonElements, "--random-color");
    applyRandomColorOnHover(
      document.querySelectorAll("footer a"),
      "--random-color"
    );
    applyRandomColorOnHover(
      document.querySelectorAll(".presse"),
      "--random-color"
    );
    applyRandomColorOnHover(
      document.querySelectorAll(".header-burger-link a"),
      "--random-color"
    );
    applyRandomColorOnHover(
      document.querySelectorAll(".event-detail-links a"),
      "--random-color"
    );
  }

  {
    //hide banner / show footer on scroll
    const banner = document.querySelector(".banner-text-container");
    const footer = document.querySelector("footer");

    ScrollTrigger.create({
      trigger: "#books",
      start: "top top",
      onEnter: () => {
        gsap.set(banner, { display: "none" });
        gsap.set(footer, { display: "flex" });
      },
      onLeaveBack: () => {
        gsap.set(banner, { display: "flex" });
        gsap.set(footer, { display: "none" });
      },
    });
  }

  {
    // add controls on hover
    const carrouselVids = document.querySelectorAll(".carrousel-item video");

    carrouselVids.forEach((video) => {
      if (window.innerWidth > 768) {
        video.removeAttribute("controls", "");

        video.addEventListener("mouseenter", () => {
          video.setAttribute("controls", "");
        });
        video.addEventListener("mouseleave", () => {
          video.removeAttribute("controls", "");
        });
      }
    });
  }

  {
    // second screen anim scrolltrigger

    if (window.innerWidth > 768) {
      const screen = document.querySelector(".about-cont");

      gsap.from(screen, {
        scale: 0.9,
        scrollTrigger: {
          trigger: screen,
          top: "top bottom",
          end: "top 30%",
          markers: false,
          scrub: true,
        },
      });
    }
  }

  {
    // popup
    const thumbs = document.querySelectorAll(".event-thumb");
    const popups = document.querySelectorAll(".event-detail-cont");
    const bgPop = document.querySelector(".background.event");

    thumbs.forEach((thumb) => {
      const value = thumb.dataset.value;

      thumb.addEventListener("click", () => {
        // Close any open popups first
        popups.forEach((popup) => popup.classList.remove("open"));

        const isMobile = thumb.classList.contains("mobile");
        const isDesktop = thumb.classList.contains("desktop");

        popups.forEach((popup) => {
          if (
            popup.classList.contains(value) &&
            ((isMobile && popup.classList.contains("mobile")) ||
              (isDesktop && popup.classList.contains("desktop")))
          ) {
            popup.classList.add("open");
            bgPop.classList.add("active");
            body.classList.add("no-scroll");

            const closeBtn = popup.querySelector(".event-detail-cross-cont");
            if (closeBtn) {
              closeBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // prevent bubbling
                popup.classList.remove("open");
                bgPop.classList.remove("active");
                body.classList.remove("no-scroll");
              });
            }
            bgPop.addEventListener("click", () => {
              popup.classList.remove("open");
              bgPop.classList.remove("active");
              body.classList.remove("no-scroll");
            });
          }
        });
      });
    });
  }

  {
    //header down up

    const header = document.querySelector(".header-nav");

    let lastScrollPosition = 0;

    window.addEventListener("scroll", () => {
      let currentScrollPosition = window.scrollY;

      if (currentScrollPosition > lastScrollPosition) {
        header.classList.add("scrolling-down");
      } else {
        header.classList.remove("scrolling-down");
      }

      lastScrollPosition = currentScrollPosition;
    });
  }
});
