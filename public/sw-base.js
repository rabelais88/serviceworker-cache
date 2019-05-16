importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");
const {strategies} = workbox;



const handlerCb = ({url, event, params}) => {
  return fetch(event.request)
  .then((response) => {
    return response.text();
  })
  .then((responseBody) => {
    return new Response(`${responseBody} <!-- Look Ma. Added Content. -->`);
  });
};

workbox.routing.registerRoute(
  new RegExp('\.jpg'),
  new workbox.strategies.StaleWhileRevalidate()
);

// this must be included

workbox.precaching.precaching.precacheAndRoute([]);
