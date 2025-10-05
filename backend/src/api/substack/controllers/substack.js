/**
 * substack controller
 */

export default {
  async getPosts(ctx) {
    try {
      const posts = await strapi.service('api::substack.substack').fetchPosts();
      ctx.body = posts;
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};
