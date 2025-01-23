import {IQueryType, IUseCase} from "@denis_bruns/core";
import {IUseCaseInlineFunc} from "@denis_bruns/aws-lambda-handler";
import {awsLambdaHandlerBuilder} from "@denis_bruns/aws-lambda-handler";
import {PostCrudGateway} from "../gateways/PostCrudGateway";
import {PostCrudDynamoDBGateway} from "../gateways/PostCrudDynamoDBGateway";
import {Observable} from "rxjs";
import {dynamoDbEgw, egw} from "../../handler";

export class DeletePostHandlerUseCase implements IUseCase<string, boolean> {
    constructor(private readonly egw: PostCrudGateway | PostCrudDynamoDBGateway) {
    }

    execute(query?: IQueryType<string>): Observable<boolean> {
        return this.egw.delete(query?.entityId || "", query?.config)
    }
}

export const DeletePostDynamoDbIUseCaseInlineFunc: IUseCaseInlineFunc<string, string, boolean> =
    (query) => ({
        execute: () => new DeletePostHandlerUseCase(dynamoDbEgw).execute(query)
    });

export const DeletePostIUseCaseInlineFunc: IUseCaseInlineFunc<string, string, boolean> =
    (query) => ({
        execute: () => new DeletePostHandlerUseCase(egw).execute(query)
    });

export const deletePostHandler = awsLambdaHandlerBuilder<never, [typeof DeletePostIUseCaseInlineFunc]>()({
    initialQueryReflector: {
        entityId: "$['pathParameters']['id']"
    },
    handlers: [
        DeletePostIUseCaseInlineFunc
    ]
})

export const deletePostDynamoDbHandler = awsLambdaHandlerBuilder<never, [typeof DeletePostIUseCaseInlineFunc]>()({
    initialQueryReflector: {
        entityId: "$['pathParameters']['id']"
    },
    handlers: [
        DeletePostDynamoDbIUseCaseInlineFunc
    ]
})