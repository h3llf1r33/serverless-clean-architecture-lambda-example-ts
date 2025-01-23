import {
    HttpClientRequestOptions,
    IEntityGatewayCrud,
    IGenericFilterQuery,
    IHttpClient,
    IPaginatedResponse
} from "@denis_bruns/core";
import {map, Observable} from "rxjs";
import {IPost} from "../interfaces/IPost";
import {HttpClientAxios} from "@denis_bruns/http-axios";

const POST_CRUD_GATEWAY_BASE_URL = "https://jsonplaceholder.typicode.com/";

export class PostCrudGateway implements IEntityGatewayCrud<IPost, IPost, IGenericFilterQuery, string, string, string, boolean> {
    constructor(private readonly httpClient: IHttpClient = new HttpClientAxios(POST_CRUD_GATEWAY_BASE_URL),
    ) {
    }

    create(query: Partial<IPost>, config?: HttpClientRequestOptions): Observable<IPost> {
        return this.httpClient.post<IPost>("/posts", query, config);
    }

    delete(entityId: string, config?: HttpClientRequestOptions): Observable<boolean> {
        return this.httpClient.delete<boolean>(`/posts/${entityId}`, config);
    }

    read(query?: string, filterQuery?: IGenericFilterQuery, config?: HttpClientRequestOptions): Observable<IPost> {
        return this.httpClient.get<IPost>(`/posts/${query}`, config, filterQuery);
    }

    readList(filterQuery?: IGenericFilterQuery, config?: HttpClientRequestOptions): Observable<IPaginatedResponse<IPost>> {
        return this.httpClient.get<IPost[]>(`/posts`, config, filterQuery).pipe(map((data) => {
            return {
                data,
                page: filterQuery?.pagination.page || 1,
                limit: filterQuery?.pagination.limit || 10,
                total: data.length
            } as IPaginatedResponse<IPost>;
        }));
    }

    replaceEntity(entityId: string, query: IPost, config?: HttpClientRequestOptions): Observable<IPost> {
        return this.httpClient.put<IPost>(`/posts/${entityId}`, query, config);
    }

    updateEntity(entityId: string, query: Partial<IPost>, config?: HttpClientRequestOptions): Observable<IPost> {
        return this.httpClient.patch<IPost>(`/posts/${entityId}`, query, config);
    }
}