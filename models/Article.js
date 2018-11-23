const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    unique: {
      index: { unique: true }
    },
    required: true
  },
  link: {
    type: String,
    unique: true,
    required: true
  },
  site: {
    type: String
  },
  saved: {
    type: Boolean
  },
  // points: {
  //     type: Number,
  //     required: true
  // },
  note: {
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;