function initRiveAnimation() {
  const canvas = document.getElementById("canvas");
  if (!canvas) {
    return;
  }

  new rive.Rive({
    src: "https://public.rive.app/community/runtime-files/113-173-loading-book.riv",
    canvas: canvas,
    autoplay: true,
  });
}

document.addEventListener("DOMContentLoaded", initRiveAnimation);
