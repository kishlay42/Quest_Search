import mongoose from "mongoose";

const BlockSchema = new mongoose.Schema({
  text: { type: String, required: true },
  showInOption: { type: Boolean, required: true },
  isAnswer: { type: Boolean, required: true },
});

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrectAnswer: { type: Boolean, required: true },
});

const QuestionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  anagramType: { type: String },
  blocks: [BlockSchema],
  options: [OptionSchema],
  siblingId: { type: String },
  solution: { type: String },
  title: { type: String, required: true },
});

const Question = mongoose.model("Question", QuestionSchema);
export default Question;
