import {IQueryType, IUseCase} from "@denis_bruns/core";
import {IUseCaseInlineFunc} from "@denis_bruns/aws-lambda-handler";
import {awsLambdaHandlerBuilder} from "@denis_bruns/aws-lambda-handler";
import {PostCrudGateway} from "../gateways/PostCrudGateway";
import {PostCrudDynamoDBGateway} from "../gateways/PostCrudDynamoDBGateway";
import {Observable} from "rxjs";
import {IPost} from "../interfaces/IPost";
import {dynamoDbEgw, egw} from "../../handler";

export class CreatePostHandlerUseCase implements IUseCase<Partial<IPost>, IPost> {
    constructor(private readonly egw: PostCrudGateway | PostCrudDynamoDBGateway) {
    }

    execute(query?: IQueryType<Partial<IPost>>): Observable<IPost> {
        return this.egw.create(query?.data || {}, query?.config)
    }

}

export const CreatePostDynamoDbIUseCaseInlineFunc: IUseCaseInlineFunc<any, Partial<IPost>, IPost> =
    (query) => ({
        execute: () => {
            return new CreatePostHandlerUseCase(dynamoDbEgw).execute(query);
        }
    });

export const CreatePostIUseCaseInlineFunc: IUseCaseInlineFunc<any, Partial<IPost>, IPost> =
    (query) => ({
        execute: () => {
            return new CreatePostHandlerUseCase(egw).execute(query);
        }
    });

export const createPostHandler = awsLambdaHandlerBuilder<Partial<IPost>, [typeof CreatePostDynamoDbIUseCaseInlineFunc]>()({
    initialQueryReflector: {
        data: (event) => JSON.parse(event.body || '{}')
    },
    handlers: [
        CreatePostIUseCaseInlineFunc
    ]
})

export const createPostDynamoDbHandler = awsLambdaHandlerBuilder<Partial<IPost>, [typeof CreatePostDynamoDbIUseCaseInlineFunc]>()({
    initialQueryReflector: {
        data: (event) => JSON.parse(event.body || '{}')
    },
    handlers: [
        CreatePostDynamoDbIUseCaseInlineFunc
    ]
})