import Question from "../models/Question.js";

export class QuestionService {
  async GetQuestions(call, callback) {
    const { title, type } = call.request;

    try {
      const query = {
        title: { $regex: title, $options: "i" },
      };

      if (type) {
        query.type = type;
      }

      const questions = await Question.find(query).lean();

      return callback(null, { questions });
    } catch (error) {
      return callback(error, null);
    }
  }
}