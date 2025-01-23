import {IQueryType, IUseCase} from "@denis_bruns/core";
import {IUseCaseInlineFunc} from "@denis_bruns/aws-lambda-handler";
import {awsLambdaHandlerBuilder} from "@denis_bruns/aws-lambda-handler";
import {PostCrudGateway} from "../gateways/PostCrudGateway";
import {PostCrudDynamoDBGateway} from "../gateways/PostCrudDynamoDBGateway";
import {Observable} from "rxjs";
import {IPost} from "../interfaces/IPost";
import {dynamoDbEgw, egw} from "../../handler";

export class UpdatePostHandlerUseCase implements IUseCase<Partial<IPost>, IPost> {
    constructor(private readonly egw: PostCrudGateway | PostCrudDynamoDBGateway) {
    }

    execute(query?: IQueryType<Partial<IPost>>): Observable<IPost> {
        return this.egw.updateEntity(query?.entityId || "", query?.data || {}, query?.config)
    }
}

export const UpdatePostDynamoDbIUseCaseInlineFunc: IUseCaseInlineFunc<any, Partial<IPost>, IPost> =
    (query) => ({
        execute: () => new UpdatePostHandlerUseCase(dynamoDbEgw).execute(query)
    });

export const UpdatePostIUseCaseInlineFunc: IUseCaseInlineFunc<any, Partial<IPost>, IPost> =
    (query) => ({
        execute: () => new UpdatePostHandlerUseCase(egw).execute(query)
    });

export const updatePostHandler = awsLambdaHandlerBuilder<Partial<IPost>, [typeof UpdatePostIUseCaseInlineFunc], [PostCrudGateway | PostCrudDynamoDBGateway]>()({
    initialQueryReflector: {
        entityId: "$['pathParameters']['id']",
        data: (event) => JSON.parse(event.body || '{}')
    },
    handlers: [
        UpdatePostIUseCaseInlineFunc
    ],
})

export const updatePostDynamoDbHandler = awsLambdaHandlerBuilder<Partial<IPost>, [typeof UpdatePostIUseCaseInlineFunc], [PostCrudGateway | PostCrudDynamoDBGateway]>()({
    initialQueryReflector: {
        entityId: "$['pathParameters']['id']",
        data: (event) => JSON.parse(event.body || '{}')
    },
    handlers: [
        UpdatePostDynamoDbIUseCaseInlineFunc
    ],
})
