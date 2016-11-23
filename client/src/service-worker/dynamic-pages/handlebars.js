console.log('This was freaking required');

export default define => {
  define('handlebars.runtime', [],  function () {
    console.log('Handlebars was freaking required');
    return {
      freaking: 'handlebars',
    }
  })
}
