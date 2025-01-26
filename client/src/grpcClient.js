import { QuestionServiceClient } from './questionpb/questions_grpc_web_pb';
import { QuestionsRequest } from './questionpb/questions_pb';

// Create a gRPC client instance
const client = new QuestionServiceClient(
  "http://localhost:8080" // Note the use of http:// for grpc-web
);

// Function to fetch questions by title and type
export function getQuestions(title, type, callback) {
  const request = new QuestionsRequest();
  request.setTitle(title);
  if (type !== null) {
    request.setType(type);
  }

  console.log("Requesting questions with:", { title, type });

  client.getQuestions(request, {}, (error, response) => {
    if (error) {
      console.error("Error in GetQuestions:", error);
      callback(error, null);
    } else {
      const questions = response.toObject().questionsList;
      console.log("Fetched Questions:", questions);
      callback(null, response.toObject());
    }
  });
}