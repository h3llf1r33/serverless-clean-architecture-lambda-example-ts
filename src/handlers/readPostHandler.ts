import {IQueryType, IUseCase} from "@denis_bruns/core";
import {IUseCaseInlineFunc} from "@denis_bruns/aws-lambda-handler";
import {awsLambdaHandlerBuilder} from "@denis_bruns/aws-lambda-handler";
import {PostCrudGateway} from "../gateways/PostCrudGateway";
import {PostCrudDynamoDBGateway} from "../gateways/PostCrudDynamoDBGateway";
import {Observable} from "rxjs";
import {IPost} from "../interfaces/IPost";
import {dynamoDbEgw, egw} from "../../handler";

export class ReadPostHandlerUseCase implements IUseCase<undefined, IPost> {
    constructor(private readonly egw: PostCrudGateway | PostCrudDynamoDBGateway) {
    }

    execute(query?: IQueryType<undefined>): Observable<IPost> {
        return this.egw.read(query?.entityId || "");
    }

}

export const ReadPostDynamoDbIUseCaseInlineFunc: IUseCaseInlineFunc<undefined, unknown, IPost> =
    (query) => ({
        execute: () => {
            return new ReadPostHandlerUseCase(dynamoDbEgw).execute(query)
        }
    });

export const ReadPostIUseCaseInlineFunc: IUseCaseInlineFunc<undefined, unknown, IPost> =
    (query) => ({
        execute: () => {
            return new ReadPostHandlerUseCase(egw).execute(query)
        }
    });


export const readPostHandler = awsLambdaHandlerBuilder<undefined, [typeof ReadPostIUseCaseInlineFunc], [PostCrudGateway | PostCrudDynamoDBGateway]>()({
    initialQueryReflector: {
        entityId: "$['pathParameters']['id']",
    },
    handlers: [
        ReadPostIUseCaseInlineFunc
    ],
})

export const readPostDynamoDbHandler = awsLambdaHandlerBuilder<undefined, [typeof ReadPostIUseCaseInlineFunc], [PostCrudGateway | PostCrudDynamoDBGateway]>()({
    initialQueryReflector: {
        entityId: "$['pathParameters']['id']",
    },
    handlers: [
        ReadPostDynamoDbIUseCaseInlineFunc
    ],
})