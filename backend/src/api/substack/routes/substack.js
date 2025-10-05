/**
 * substack router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/substack/posts',
      handler: 'substack.getPosts',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
