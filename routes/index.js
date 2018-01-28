const posts = require('./posts');

module.exports = function(app, db) {
    app.use('/api/posts', posts(db));
}