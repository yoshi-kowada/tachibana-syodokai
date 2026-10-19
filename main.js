document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const video = document.getElementById('loader-video');
  const fallback = document.getElementById('loader-fallback');
  if (!loader || !video) return;

  let alreadyLoaded = false;
  try {
    alreadyLoaded = sessionStorage.getItem('hasLoaded') === 'true';
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
  if (alreadyLoaded) {
    loader.hidden = true;
    video.pause();
    document.documentElement.classList.remove('is-loading');
    return;
  }

  document.documentElement.classList.add('is-loading');
  let dismissed = false;
  let fallbackTimer;
  let customTimer;

  const dismissLoader = () => {
    if (dismissed) return;
    dismissed = true;
    clearTimeout(watchdog);
    clearTimeout(fallbackTimer);
    clearTimeout(customTimer);

    try {
      sessionStorage.setItem('hasLoaded', 'true');
    } catch {
      // Finishing the loader must not depend on storage permission.
    }
    loader.classList.add('is-hidden');
    setTimeout(() => {
      loader.hidden = true;
      video.pause();
      document.documentElement.classList.remove('is-loading');
    }, 500);
  };

  const watchdog = setTimeout(dismissLoader, 15000);

  const showFallback = () => {
    if (dismissed || fallbackTimer) return;
    video.pause();
    video.hidden = true;
    if (fallback) fallback.hidden = false;
    fallbackTimer = setTimeout(dismissLoader, 3500);
  };

  // ローディング時間を設定
  const onPlaying = () => {
    if (!dismissed && !customTimer && !fallbackTimer) {
      customTimer = setTimeout(dismissLoader, 3500);
    }
  };
  video.addEventListener('playing', onPlaying, { once: true });

  video.addEventListener('ended', dismissLoader, { once: true });
  video.addEventListener('error', showFallback, { once: true });
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  if (!video.paused && video.readyState >= 3) onPlaying();
  video.play().catch(showFallback);
});

// ハンバーガーメニューの処理（変更なし）
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('js-hamburger');
  const navMenu = document.getElementById('js-nav');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', function () {
    navMenu.classList.toggle('is-open');
  });

  const links = navMenu.querySelectorAll('a');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('is-open');
    });
  });
});