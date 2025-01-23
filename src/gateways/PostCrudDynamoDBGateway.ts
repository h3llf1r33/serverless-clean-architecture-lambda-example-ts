import {
    AttributeValue,
    DeleteItemCommand,
    DynamoDBClient,
    PutItemCommand,
    UpdateItemCommand
} from "@aws-sdk/client-dynamodb";
import {from, map, Observable} from "rxjs";
import {
    IEntityGatewayCrud,
    IGenericFilterQuery,
    IPaginatedResponse
} from "@denis_bruns/core";

import {IPost} from "../interfaces/IPost";
import {fetchWithFiltersAndPaginationDynamoDb} from "@denis_bruns/nosql-dynamodb";


export class PostCrudDynamoDBGateway implements IEntityGatewayCrud<IPost, IPost, IGenericFilterQuery, string, string, string, boolean> {
    constructor(
        private readonly tableName: string = process.env.POSTS_TABLE || "posts-table",
        private readonly dynamoDBClient: DynamoDBClient = new DynamoDBClient({})
    ) {
    }

    create(data: Partial<IPost>): Observable<IPost> {
        return from((async () => {
            if (!data) throw new Error("No post data provided");
            const userId = data.userId ? parseInt(String(data.userId), 10) : NaN;
            if (isNaN(userId)) {
                throw new Error("Valid userId is required");
            }
            const item: IPost = {
                id: data.id || Date.now(),
                userId,
                title: data.title || "",
                body: data.body || ""
            };
            const params = {
                TableName: this.tableName,
                Item: {
                    id: {N: String(item.id)},
                    userId: {N: String(item.userId)},
                    title: {S: item.title},
                    body: {S: item.body}
                }
            };
            await this.dynamoDBClient.send(new PutItemCommand(params));
            return item;
        })());
    }

    delete(entityId: string): Observable<boolean> {
        return from((async () => {
            const params = {
                TableName: this.tableName,
                Key: {id: {N: entityId}}
            };
            await this.dynamoDBClient.send(new DeleteItemCommand(params));
            return true;
        })());
    }

    /**
     * read a single item by entityId using fetchWithFiltersAndPaginationDynamoDb
     * with a single filter + limit=1
     */
    read(entityId: string): Observable<IPost> {
        return from((async () => {
            const query: IGenericFilterQuery = {
                filters: [{field: "id", operator: "=", value: entityId}],
                pagination: {page: 1, limit: 1, offset: 0}
            };
            const items = await fetchWithFiltersAndPaginationDynamoDb<IPost>(
                this.tableName,
                query,
                this.dynamoDBClient,
                "id"
            );
            if (!items.data.length) {
                throw new Error("Post not found");
            }
            return items.data[0];
        })());
    }

    /**
     * readList with a full IGenericFilterQuery
     * => calls fetchWithFiltersAndPaginationDynamoDb with no extra logic
     */
    readList(query: IGenericFilterQuery): Observable<IPaginatedResponse<IPost>> {
        return from(fetchWithFiltersAndPaginationDynamoDb<IPost>(
            this.tableName,
            query,
            this.dynamoDBClient,
            "id"
        )).pipe(map((items) => {
            return {
                data: items.data,
                page: query.pagination.page,
                limit: query.pagination.limit,
                total: items.total
            } as IPaginatedResponse<IPost>;
        }));
    }

    /** Overwrite an existing Post item with PutItem. */
    replaceEntity(entityId: string, data: IPost): Observable<IPost> {
        return from((async () => {
            const params = {
                TableName: this.tableName,
                Item: {
                    id: {N: String(entityId)},
                    userId: {N: String(data.userId)},
                    title: {S: data.title},
                    body: {S: data.body}
                }
            };
            await this.dynamoDBClient.send(new PutItemCommand(params));
            return data;
        })());
    }

    /** Update partial fields with an UpdateExpression. */
    updateEntity(entityId: string, data: Partial<IPost>): Observable<IPost> {
        return from((async () => {
            const updateExpression: string[] = [];
            const ean: Record<string, string> = {};
            const eav: Record<string, AttributeValue> = {};

            Object.entries(data).forEach(([key, val]) => {
                if (key !== "id" && val !== undefined) {
                    updateExpression.push(`#${key} = :${key}`);
                    ean[`#${key}`] = key;
                    eav[`:${key}`] = this.toDynamoDBAttributeValue(val);
                }
            });
            if (!updateExpression.length) {
                throw new Error("No valid fields to update");
            }
            const params = {
                TableName: this.tableName,
                Key: {id: {N: String(entityId)}},
                UpdateExpression: `SET ${updateExpression.join(", ")}`,
                ExpressionAttributeNames: ean,
                ExpressionAttributeValues: eav,
                ReturnValues: "ALL_NEW" as const
            };
            const result = await this.dynamoDBClient.send(new UpdateItemCommand(params));
            if (!result.Attributes) {
                throw new Error("No updated item returned");
            }

            const attrs = result.Attributes;
            const idN = attrs.id?.N;
            const userIdN = attrs.userId?.N;
            if (!idN || !userIdN) {
                throw new Error("Invalid updated item: missing 'id' or 'userId'");
            }
            return {
                id: parseInt(idN, 10),
                userId: parseInt(userIdN, 10),
                title: attrs.title?.S ?? "",
                body: attrs.body?.S ?? ""
            } as IPost;
        })());
    }

    /** Convert a single JS value => an AttributeValue (no arrays). */
    private toDynamoDBAttributeValue(val: any): AttributeValue {
        if (typeof val === "number") return {N: String(val)};
        if (typeof val === "string") return {S: val};
        if (typeof val === "boolean") return {BOOL: val};
        throw new Error(`Unsupported type: ${typeof val}`);
    }
}
