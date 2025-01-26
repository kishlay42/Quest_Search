# QuestSearch

QuestSearch is a web application that allows users to search for questions based on a given title. It supports various types of questions including MCQ, Anagram, Read Along, and Content Only.

## Features

- Search for questions by title
- Filter questions by type
- Pagination support
- Responsive design
- Smooth animations
- "Back to Top" button
- Error handling with `react-toastify`
- gRPC for efficient communication between services
- Envoy Proxy for service discovery and load balancing

## Technologies Used

- React
- Node.js
- Express
- MongoDB
- Mongoose
- gRPC
- Envoy Proxy
- `react-toastify` for notifications
- `dotenv` for environment variables

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- MongoDB
- gRPC
- Envoy Proxy

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/QuestSearch.git
    cd QuestSearch
    ```

2. Install server dependencies:

    ```bash
    cd server
    npm install
    ```

3. Install client dependencies:

    ```bash
    cd ../client
    npm install
    ```

4. Create a `.env` file in the root of the [server](http://_vscodecontentref_/0) directory and add your MongoDB URI:

    ```env
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xjjiq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    ```

### Running the Application

1. Start the server:

    ```bash
    cd server
    npm run start:dev
    ```

2. Start the client:

    ```bash
    cd ../client
    npm start
    ```

3. Open your browser and navigate to `http://localhost:3000`.

### Using gRPC and Envoy Proxy

1. Ensure that gRPC and Envoy Proxy are installed on your system.

2. Configure Envoy Proxy to route requests to your gRPC server. Here is a sample Envoy configuration:

    ```yaml
    static_resources:
      listeners:
        - name: listener_0
          address:
            socket_address:
              address: 0.0.0.0
              port_value: 8080
          filter_chains:
            - filters:
                - name: envoy.filters.network.http_connection_manager
                  typed_config:
                    "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
                    stat_prefix: ingress_http
                    route_config:
                      name: local_route
                      virtual_hosts:
                        - name: local_service
                          domains: ["*"]
                          routes:
                            - match:
                                prefix: "/"
                              route:
                                cluster: grpc_service
                    http_filters:
                      - name: envoy.filters.http.router
      clusters:
        - name: grpc_service
          connect_timeout: 0.25s
          type: logical_dns
          lb_policy: round_robin
          http2_protocol_options: {}
          load_assignment:
            cluster_name: grpc_service
            endpoints:
              - lb_endpoints:
                  - endpoint:
                      address:
                        socket_address:
                          address: 127.0.0.1
                          port_value: 50051
    ```

3. Start Envoy Proxy with the configuration file:

    ```bash
    envoy -c path/to/envoy.yaml
    ```

4. Ensure your gRPC server is running and listening on the specified port (e.g., 50051).

### Note for Linux Users

For ease of use, it is recommended to run this project on a Linux system. Linux provides better support for development tools and environments required for running gRPC and Envoy Proxy.

## Project Structure
