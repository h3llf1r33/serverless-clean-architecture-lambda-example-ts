import {PostCrudDynamoDBGateway} from "./src/gateways/PostCrudDynamoDBGateway";
import {PostCrudGateway} from "./src/gateways/PostCrudGateway";
import {createPostDynamoDbHandler, createPostHandler} from "./src/handlers/createPostHandler";
import {deletePostDynamoDbHandler, deletePostHandler} from "./src/handlers/deletePostHandler";
import {readListPostDynamoDbHandler, readListPostHandler} from "./src/handlers/readListPostHandler";
import {readPostDynamoDbHandler, readPostHandler} from "./src/handlers/readPostHandler";
import {updatePostDynamoDbHandler, updatePostHandler} from "./src/handlers/updatePostHandler";

export const egw = new PostCrudGateway();
export const dynamoDbEgw = new PostCrudDynamoDBGateway();

export {
    createPostHandler,
    deletePostHandler,
    readListPostHandler,
    readPostHandler,
    updatePostHandler,
    createPostDynamoDbHandler,
    deletePostDynamoDbHandler,
    readListPostDynamoDbHandler,
    readPostDynamoDbHandler,
    updatePostDynamoDbHandler,
};








