import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import connectDB from "./config/db.js";
import { QuestionService } from "./services/QuestionService.js";

await connectDB();

const PROTO_PATH = "../proto/questions.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const questionProto = grpc.loadPackageDefinition(packageDefinition).questions;

// Instantiate the service
const questionService = new QuestionService();

// Create gRPC server
const server = new grpc.Server({
  'grpc.max_receive_message_length': 50 * 1024 * 1024, // 50 MB
  'grpc.max_send_message_length': 50 * 1024 * 1024,   // 50 MB
});

server.addService(questionProto.QuestionService.service, {
  GetQuestions: questionService.GetQuestions.bind(questionService),
});

const PORT = "50051";
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`gRPC server running on port ${PORT}`);
});