// LIFF SDK初期化スクリプト
(function() {
  'use strict';
  
  // LIFF SDKの読み込み
  const script = document.createElement('script');
  script.src = 'https://static.line-scdn.net/liff/edge/2/sdk.js';
  script.onload = function() {
    // LIFF SDKが読み込まれた後の処理
    if (window.liff) {
      console.log('LIFF SDK loaded successfully');
      
      // LIFF初期化イベントを発火
      window.dispatchEvent(new CustomEvent('liff-sdk-loaded'));
    }
  };
  script.onerror = function() {
    console.error('Failed to load LIFF SDK');
    window.dispatchEvent(new CustomEvent('liff-sdk-error'));
  };
  
  document.head.appendChild(script);
})();
