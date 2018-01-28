const router = require('express').Router();
const autoIncrement = require("mongodb-autoincrement");

module.exports = function(db) {
  router.post('/', function(req, res) {
    const key = req.query.key;

    if (!key) {
      res.status(400).send({ error: 'Parameter "key" is required in query!' });
      return;
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      res.send({ error: 'No data sent!' });
      return;
    }

    try {
      autoIncrement.getNextSequence(db, 'posts', (err, _id) => {
        if (err) { return }
        db.collection('posts')
          .insertOne({
            _id,
            key,
            title: req.body.title,
            categories: req.body.categories,
            content: req.body.content
          })
          .then((result) => {
            console.log(result.ops);
            let createdPost = result.ops[0]
            res.send({
              id: createdPost._id,
              key,
              title: createdPost.title,
              categories: createdPost.categories,
              content: createdPost.content
            });
          })
          .catch(err => { console.error(err) })

      })
    } catch (err) {
      console.error(err);
      res.status((err && err.status) || 500).send({ error: err });
    }
  });

  router.get('/', async function({ query: { key } }, res) {
    if (!key) {
      res.status(400).send({ error: 'Parameter "key" is required in query!' });
      return;
    }

    try {
      let posts = await db.collection('posts')
        .find({ key })
        .toArray();


      res.send(posts.map(post=>{
            post.id = JSON.stringify(post._id);
            delete post._id;
            return post
        }));

    } catch (err) {
      console.error(err);
      res.status((err && err.status) || 500).send({ error: err });
    }
  });


  router.get('/:id', async function({
    query: { key },
    params: { id }
  }, res) {
    if (!key) {
      res.status(400).send({ error: 'Parameter "key" is required in query!' });
      return;
    }

    if (!id || !/^\d+$/.test(id)) {
      res.status(400).send({ error: 'Parameter "id" is required in url!' });
      return;
    }

    try {
      let post = await db.collection('posts')
        .findOne({ key, _id:+id });

      res.send({
        id:post._id,
        title:post.title,
        categories:post.categories,
        content:post.content
      });
    } catch (err) {
      console.error(err);
      res.status((err && err.status) || 500).send({ error: err });
    }
  });

  router.delete('/:id', async function({
    query: { key },
    params: { id }
  }, res) {
    if (!key) {
      res.status(400).send({ error: 'Parameter "key" is required in query!' });
      return;
    }

    if (!id || !/^\d+$/.test(id)) {
      res.status(400).send({ error: 'Parameter "id" is required in url!' });
      return;
    }

    try {
      await db.collection('posts')
        .deleteOne({ key, _id:+id });

      res.send({ message: `Post with id ${id} successfully deleted!` });
    } catch (err) {
      console.error(err);
      res.status((err && err.status) || 500).send({ error: err });
    }
  });

  return router;
}
