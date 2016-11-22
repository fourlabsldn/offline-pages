export default function (request, values, options) {
  console.log('I was at least called');
  return new Response("It worked");
}
