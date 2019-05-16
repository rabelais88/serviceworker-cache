var deferredPrompt;

// sw is automatically updated with newer code. but all the chrome tabs with the sw running must be closed.
if ('serviceWorker' in navigator) { // check if service worker is available, otherwise the app might crash
  navigator.serviceWorker
  // scope can't be '/'
  // by default, the app follows the 'scope' property on 'manifest.json'
    .register('/sw.js'/*, { scope: '/' }*/).then(function(reg) {
      console.log('[app] sw is registered! /w scope :', reg.scope);
    }, function(err) {
      console.log('[app] sw register failed', err);
    });
}

window.addEventListener('beforeinstallprompt', function(ev) {
  console.log('[app] before install fired(add to home screen)');
  ev.preventDefault();
  deferredPrompt = ev;
  return false;
});

// WARNING: this will remove all service workers available
// if ('serviceworker' in navigator) {
//   navigator.serviceWorker.getRegistrations()
//     .then(function(registrations) {
//       for (var i = 0; i < registrations.length; i++ ) {
//         registrations[i].unregister();
//       }
//     });
// }
