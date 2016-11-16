
const creationTime = Date().toString();

export default serviceWorker => {
  serviceWorker.addEventListener('fetch', event => {
    console.log(creationTime);
  });
};
