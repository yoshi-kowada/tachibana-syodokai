// ローディングアニメーション設定
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');

  setTimeout(() => {
    loader.style.opacity = '0';           
    loader.style.pointerEvents = 'none'; 
    
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
    
  }, 3500); // 時間調節（2000 = 2秒, 3000 = 3秒）
});


document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('js-hamburger');
  const navMenu = document.getElementById('js-nav');

  // ボタンをクリックしたらメニューを開閉
  hamburger.addEventListener('click', function () {
    navMenu.classList.toggle('is-open');
  });

  // リンク（メニュー内の項目）をクリックしたら自動で閉じる（ページ内スクロール用）
  const links = navMenu.querySelectorAll('a');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('is-open');
    });
  });
});