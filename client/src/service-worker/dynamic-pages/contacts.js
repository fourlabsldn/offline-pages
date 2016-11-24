import assemble from './assemble';
import routes from '../routes';

/**
 * The parameters are provided by sw-toolbox.
 * @method
 * @param  {Request} request [description]
 * @param  {Object} values - Values captured in express-style url pattern matching
 * @param  {Object} options - Route options
 * @return {Promise<response>}
 */
export default function (request, values, options) { // eslint-disable-line no-unused-vars
  return assemble(
    routes.contactsPage.layoutTemplate,
    routes.contactsPage.pageTemplate,
    [routes.database.all],
    data => {
      return {
        layoutData: {},
        templateData: { data: { name: 'Marcelo' } },
      };
    }
  )
  .catch(_ => {
    // If we fail to build the page dynamically, let's just fetch it entirely
    // from the server.
    console.warn('Unable to build page dynamically');
    return fetch(request.clone());
  });
}
