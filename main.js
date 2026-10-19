document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const video = document.getElementById('loader-video');
  const fallback = document.getElementById('loader-fallback');
  if (!loader || !video) return;

  if (sessionStorage.getItem('hasLoaded')) {
    // 2回目以降（リロード等）はローディングを瞬時に消す・非表示にする
    document.documentElement.classList.remove('is-loading');
    loader.style.display = 'none';
    loader.hidden = true;
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

    sessionStorage.setItem('hasLoaded', 'true');

    document.documentElement.classList.remove('is-loading');
    loader.classList.add('is-hidden');
    setTimeout(() => {
      loader.hidden = true;
      video.pause();
    }, 1000);
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
  video.addEventListener('play', () => {
    customTimer = setTimeout(dismissLoader, 3500);
  }, { once: true });

  video.addEventListener('ended', dismissLoader, { once: true });
  video.addEventListener('error', showFallback, { once: true });
  video.muted = true;
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
