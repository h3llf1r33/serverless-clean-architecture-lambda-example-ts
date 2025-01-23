# Angular Posts Lambda Example

This project demonstrates a clean architecture implementation using Angular with AWS Lambda and DynamoDB backend. It
consists of two repositories:

1.

Backend: [serverless-clean-architecture-lambda-example-ts](https://github.com/h3llf1r33/serverless-clean-architecture-lambda-example-ts)

2.

Frontend: [angular-clean-architecture-lambda-example-ts](https://github.com/h3llf1r33/angular-clean-architecture-lambda-example-ts)

## Project Structure

The project is split into two parts:

- A serverless backend using AWS Lambda, API Gateway, and DynamoDB
- An Angular frontend that interfaces with both the AWS backend and JSONPlaceholder API

## Backend Setup

### Prerequisites

- Node.js (LTS version)
- AWS CLI configured with appropriate credentials
- Serverless Framework CLI

### Installation Steps

1. Clone the backend repository:

```bash
git clone https://github.com/h3llf1r33/serverless-clean-architecture-lambda-example-ts
cd serverless-clean-architecture-lambda-example-ts
```

2. Install dependencies:

```bash
npm install
```

3. Configure the deployment:

- Create/edit `config/config.dev.yml` with your desired values:

   ```yaml
   tableName: posts-table
   dynamoDbUriPrefix: dynamodb
   jsonPlaceholderUriPrefix: json-placeholder
   ```

4. Deploy to AWS:

```bash
serverless deploy --stage dev --region your-region
```

5. After deployment, note down the API Gateway URL from the terminal output. You'll need this for the frontend
   configuration.

## Frontend Setup

1. Clone the frontend repository:

```bash
git clone https://github.com/h3llf1r33/angular-clean-architecture-lambda-example-ts
cd angular-clean-architecture-lambda-example-ts
```

2. Install dependencies:

```bash
npm install
```

3. Configure the API Gateway URL:

- Set the `awsApiGatewayBaseUrl` constant to your deployed API Gateway URL

4. Start the development server:

```bash
ng serve
```

## Features

### Backend Capabilities

- DynamoDB CRUD operations for posts
- JSONPlaceholder API integration
- Clean architecture implementation with:
    - Entity Gateways (DynamoDB and HTTP)
    - Use Cases for each operation
    - Lambda handlers for API endpoints

### Frontend Features

- Posts management interface
- Real-time editing
- Search functionality
- Pagination with sorting
- Data source switching (DynamoDB/JSONPlaceholder)
- Material Design UI
- Loading state simulation for better UX

## API Endpoints

The backend provides two sets of endpoints:

### DynamoDB Endpoints

- GET `/${dynamoDbUriPrefix}/posts` - List posts
- GET `/${dynamoDbUriPrefix}/posts/{id}` - Get single post
- POST `/${dynamoDbUriPrefix}/posts` - Create post
- PATCH `/${dynamoDbUriPrefix}/posts/{id}` - Update post
- DELETE `/${dynamoDbUriPrefix}/posts/{id}` - Delete post

### JSONPlaceholder Endpoints

- GET `/${jsonPlaceholderUriPrefix}/posts` - List posts
- GET `/${jsonPlaceholderUriPrefix}/posts/{id}` - Get single post
- POST `/${jsonPlaceholderUriPrefix}/posts` - Create post
- PATCH `/${jsonPlaceholderUriPrefix}/posts/{id}` - Update post
- DELETE `/${jsonPlaceholderUriPrefix}/posts/{id}` - Delete post

## Architecture

### Backend Architecture

- Implements Clean Architecture principles
- Uses the Repository pattern
- Leverages AWS serverless services
- Provides multiple data source implementations

### Frontend Architecture

- Angular 17+ with standalone components
- Clean Architecture implementation
- RxJS for state management
- Material Design components
- Tailwind CSS for styling
- Full support for pagination with accurate total items count
- Simulated loading states for smooth UX

## Technologies Used

### Backend

- AWS Lambda
- AWS DynamoDB
- AWS API Gateway
- Serverless Framework
- Node.js
- TypeScript

### Frontend

- Angular 17+
- RxJS
- Angular Material
- Tailwind CSS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🌟 Show your support

Give a ⭐️ if this project helped you!

## 📝 License

This project is [MIT](LICENSE) licensed.