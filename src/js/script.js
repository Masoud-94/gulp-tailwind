import anime from "animejs/lib/anime.es.js";
const svgPath = document.querySelectorAll(".path");

const svgText = anime({
  targets: svgPath,
  loop: true,
  direction: "alternate",
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: "easeInOutSine",
  duration: 7000,
  delay: (el, i) => {
    return i * 7000;
  },
});
