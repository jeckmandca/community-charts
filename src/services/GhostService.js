import GhostContentAPI from '@tryghost/content-api';

const api = new GhostContentAPI({
    host: 'https://the-databull.ghost.io',
    key: 'bb7a10b093f49d7a13bfe78f78'
})

api.posts
    .browse({ limit: 5, include: 'tags,authors' })
    .catch(() => {});
