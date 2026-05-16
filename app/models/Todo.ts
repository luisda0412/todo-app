import mongoose from 'mongoose'

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  priority: {
  type: String,
  enum: ['high', 'medium', 'low'],
  default: 'medium',
},
dueDate: {
  type: Date
}

})

export default mongoose.models.Todo || mongoose.model('Todo', TodoSchema)