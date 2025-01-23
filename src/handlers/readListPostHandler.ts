import {IPaginatedResponse, IQueryType, IUseCase} from "@denis_bruns/core";
import {IUseCaseInlineFunc} from "@denis_bruns/aws-lambda-handler";
import {awsLambdaHandlerBuilder} from "@denis_bruns/aws-lambda-handler";
import {PostCrudDynamoDBGateway} from "../gateways/PostCrudDynamoDBGateway";
import {Observable} from "rxjs";
import {IPost} from "../interfaces/IPost";
import {dynamoDbEgw, egw} from "../../handler";
import {PostCrudGateway} from "../gateways/PostCrudGateway";

export class ReadListPostHandlerUseCase implements IUseCase<undefined, IPaginatedResponse<IPost>> {
    constructor(private readonly egw: PostCrudDynamoDBGateway | PostCrudGateway) {
    }

    execute(query?: IQueryType<undefined>): Observable<IPaginatedResponse<IPost>> {
        return this.egw.readList(query?.filterQuery!!);
    }

}

export const ReadListDynamoDbIUseCaseInlineFunc: IUseCaseInlineFunc<undefined, never, IPaginatedResponse<IPost>> =
    (query) => ({
        execute: () => new ReadListPostHandlerUseCase(dynamoDbEgw).execute(query)
    });

export const ReadListIUseCaseInlineFunc: IUseCaseInlineFunc<undefined, never, IPaginatedResponse<IPost>> =
    (query) => ({
        execute: () => new ReadListPostHandlerUseCase(egw).execute(query)
    });

export const readListPostHandler = awsLambdaHandlerBuilder<never, [typeof ReadListIUseCaseInlineFunc]>()({
    initialQueryReflector: {
        filterQuery: (event) => {
            return {
                filters: JSON.parse(event.queryStringParameters?.filters || "[]"),
                pagination: JSON.parse(event.queryStringParameters?.pagination || "{}"),
            };
        }
    },
    handlers: [
        ReadListIUseCaseInlineFunc
    ]
});

export const readListPostDynamoDbHandler = awsLambdaHandlerBuilder<never, [typeof ReadListIUseCaseInlineFunc]>()({
    initialQueryReflector: {
        filterQuery: (event) => {
            return {
                filters: JSON.parse(event.queryStringParameters?.filters || "[]"),
                pagination: JSON.parse(event.queryStringParameters?.pagination || "{}"),
            };
        }
    },
    handlers: [
        ReadListDynamoDbIUseCaseInlineFunc
    ]
});