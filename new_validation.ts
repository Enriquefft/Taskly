import type { CallbackManager as CallbackManagerLC } from "@langchain/core/callbacks/manager";
import type { AxiosProxyConfig, GenericAbortSignal } from "axios";
import type * as express from "express";

import type FormData from "form-data";
import type { IncomingHttpHeaders } from "http";
import type { Client as SSHClient } from "ssh2";
import type { Readable } from "stream";
import type { SecureContextOptions } from "tls";
import type {
    ReplyHeaders,
    RequestBodyMatcher,
    RequestHeaderMatcher,
} from "nock";
import type { URLSearchParams } from "url";
import type { ExecutionCancelledError } from "./errors";
import type { ExpressionError } from "./errors/expression.error";
import type { NodeApiError } from "./errors/node-api.error";
import type { NodeOperationError } from "./errors/node-operation.error";
import type { WorkflowActivationError } from "./errors/workflow-activation.error";
import type { WorkflowOperationError } from "./errors/workflow-operation.error";

export type PathLike = string | Buffer | URL;
export interface IWorkflowBase {
    id: string;
    name: string;
    active: boolean;
    createdAt: Date;
    startedAt?: Date;
    updatedAt: Date;
    nodes: INode[];
    connections: IConnections;
    settings?: IWorkflowSettings;
    staticData?: IDataObject;
    pinData?: IPinData;
    versionId?: string;
}

export type EnvProviderState = {
    isProcessAvailable: boolean;
    isEnvAccessBlocked: boolean;
    env: { [key: string]: string };
};
export declare const LOG_LEVELS: readonly [
    "silent",
    "error",
    "warn",
    "info",
    "debug",
];
export declare const CODE_LANGUAGES: readonly ["javaScript", "python"];
export declare const CODE_EXECUTION_MODES: readonly [
    "runOnceForAllItems",
    "runOnceForEachItem",
];
export type ExecutionStatus =
    | "canceled"
    | "crashed"
    | "error"
    | "new"
    | "running"
    | "success"
    | "unknown"
    | "waiting";

export interface IAdditionalCredentialOptions {
    oauth2?: IOAuth2Options;
    credentialsDecrypted?: {
        id: string;
        name: string;
        type: string;
        data?: ICredentialDataDecryptedObject;
        homeProject?: ProjectSharingData;
        sharedWithProjects?: ProjectSharingData[];
    };
}
export type IAllExecuteFunctions =
    | IExecuteFunctions
    | IExecutePaginationFunctions
    | IExecuteSingleFunctions
    | ISupplyDataFunctions
    | IHookFunctions
    | ILoadOptionsFunctions
    | IPollFunctions
    | ITriggerFunctions
    | IWebhookFunctions;
export type BinaryFileType =
    | "text"
    | "json"
    | "image"
    | "audio"
    | "video"
    | "pdf"
    | "html";
export interface IBinaryData {
    [key: string]: string | number | undefined;
    data: string;
    mimeType: string;
    fileType?: BinaryFileType;
    fileName?: string;
    directory?: string;
    fileExtension?: string;
    fileSize?: string;
    id?: string;
}
export interface IOAuth2Options {
    includeCredentialsOnRefreshOnBody?: boolean;
    property?: string;
    tokenType?: string;
    keepBearer?: boolean;
    tokenExpiredStatusCode?: number;
    keyToIncludeInAccessTokenHeader?: string;
}
export interface IConnection {
    node: string;
    type: NodeConnectionType;
    index: number;
}
export type ExecutionError =
    | ExpressionError
    | WorkflowActivationError
    | WorkflowOperationError
    | ExecutionCancelledError
    | NodeOperationError
    | NodeApiError;
export interface IGetCredentials {
    get(type: string, id: string | null): Promise<ICredentialsEncrypted>;
}

export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}
export type ProjectSharingData = {
    id: string;
    name: string | null;
    icon: {
        type: "emoji" | "icon";
        value: string;
    } | null;
    type: "personal" | "team" | "public";
    createdAt: string;
    updatedAt: string;
};

export interface ICredentialsEncrypted {
    id?: string;
    name: string;
    type: string;
    data?: string;
}
export interface ICredentialsExpressionResolveValues {
    connectionInputData: INodeExecutionData[];
    itemIndex: number;
    node: INode;
    runExecutionData: IRunExecutionData | null;
    runIndex: number;
    workflow: Workflow;
}
export interface IRequestOptionsSimplified {
    auth?: {
        username: string;
        password: string;
        sendImmediately?: boolean;
    };
    body: IDataObject;
    headers: IDataObject;
    qs: IDataObject;
}
export interface IRequestOptionsSimplifiedAuth {
    auth?: {
        username: string;
        password: string;
        sendImmediately?: boolean;
    };
    body?: IDataObject;
    headers?: IDataObject;
    qs?: IDataObject;
    url?: string;
    skipSslCertificateValidation?: boolean | string;
}
export interface IHttpRequestHelper {
    helpers: {
        httpRequest: IAllExecuteFunctions["helpers"]["httpRequest"];
    };
}
export declare class ICredentials {
    id?: string;
    name: string;
    type: string;
    data: string | undefined;
    constructor(
        nodeCredentials: INodeCredentialsDetails,
        type: string,
        data?: string,
    );
    getData(nodeType?: string): ICredentialDataDecryptedObject;
    getDataToSave(): ICredentialsEncrypted;
    setData(data: ICredentialDataDecryptedObject): void;
}
export declare class ICredentialsHelper {
    getParentTypes(name: string): string[];
    authenticate(
        credentials: ICredentialDataDecryptedObject,
        typeName: string,
        requestOptions: IHttpRequestOptions | IRequestOptionsSimplified,
        workflow: Workflow,
        node: INode,
    ): Promise<IHttpRequestOptions>;
    preAuthentication(
        helpers: IHttpRequestHelper,
        credentials: ICredentialDataDecryptedObject,
        typeName: string,
        node: INode,
        credentialsExpired: boolean,
    ): Promise<ICredentialDataDecryptedObject | undefined>;
    getCredentials(
        nodeCredentials: INodeCredentialsDetails,
        type: string,
    ): Promise<ICredentials>;
    getDecrypted(
        additionalData: IWorkflowExecuteAdditionalData,
        nodeCredentials: INodeCredentialsDetails,
        type: string,
        mode: WorkflowExecuteMode,
        executeData?: IExecuteData,
        raw?: boolean,
        expressionResolveValues?: ICredentialsExpressionResolveValues,
    ): Promise<ICredentialDataDecryptedObject>;
    updateCredentials(
        nodeCredentials: INodeCredentialsDetails,
        type: string,
        data: ICredentialDataDecryptedObject,
    ): Promise<void>;
    getCredentialsProperties(type: string): INodeProperties[];
}
export interface IAuthenticateBase {
    type: string;
    properties:
    | {
        [key: string]: string;
    }
    | IRequestOptionsSimplifiedAuth;
}
export interface IAuthenticateGeneric extends IAuthenticateBase {
    type: "generic";
    properties: IRequestOptionsSimplifiedAuth;
}
export type IAuthenticate =
    | ((
        credentials: ICredentialDataDecryptedObject,
        requestOptions: IHttpRequestOptions,
    ) => Promise<IHttpRequestOptions>)
    | IAuthenticateGeneric;
export interface IAuthenticateRuleBase {
    type: string;
    properties: {
        [key: string]: string | number;
    };
    errorMessage?: string;
}
export interface IAuthenticateRuleResponseCode extends IAuthenticateRuleBase {
    type: "responseCode";
    properties: {
        value: number;
        message: string;
    };
}
export interface IAuthenticateRuleResponseSuccessBody
    extends IAuthenticateRuleBase {
    type: "responseSuccessBody";
    properties: {
        message: string;
        key: string;
        value: string | number;
    };
}

export declare namespace DeclarativeRestApiSettings {
    type HttpRequestOptions = {
        baseURL?: string;
        headers?: IDataObject;
        method?: IHttpRequestMethods;
        body?: FormData | GenericValue | GenericValue[] | Buffer | URLSearchParams;
        qs?: IDataObject;
        arrayFormat?: "indices" | "brackets" | "repeat" | "comma";
        auth?: {
            username: string;
            password: string;
            sendImmediately?: boolean;
        };
        disableFollowRedirect?: boolean;
        encoding?: "arraybuffer" | "blob" | "document" | "json" | "text" | "stream";
        returnFullResponse?: boolean;
        ignoreHttpStatusErrors?: boolean;
        proxy?: {
            host: string;
            port: number;
            auth?: {
                username: string;
                password: string;
            };
            protocol?: string;
        };
        timeout?: number;
        json?: boolean;
        abortSignal?: GenericAbortSignal;
        skipSslCertificateValidation?: string | boolean;
        url?: string;
    };

    type ResultOptions = {
        maxResults?: number | string;
        options: HttpRequestOptions;
        paginate?: boolean | string;
        preSend: PreSendAction[];
        postReceive: Array<{
            data: {
                parameterValue: string | IDataObject | undefined;
            };
            actions: PostReceiveAction[];
        }>;
        requestOperations?: IN8nRequestOperations;
    };
}
export interface ICredentialTestRequest {
    request: DeclarativeRestApiSettings.HttpRequestOptions;
    rules?:
    | IAuthenticateRuleResponseCode[]
    | IAuthenticateRuleResponseSuccessBody[];
}
export interface ICredentialTestRequestData {
    nodeType?: INodeType;
    testRequest: ICredentialTestRequest;
}
type ICredentialHttpRequestNode = {
    name: string;
    docsUrl: string;
    hidden?: boolean;
} & (
        | {
            apiBaseUrl: string;
        }
        | {
            apiBaseUrlPlaceholder: string;
        }
    );
export interface ICredentialType {
    name: string;
    displayName: string;
    icon?: Icon;
    iconColor?: ThemeIconColor;
    iconUrl?:
    | string
    | {
        light: string;
        dark: string;
    };
    extends?: string[];
    properties: INodeProperties[];
    documentationUrl?: string;
    __overwrittenProperties?: string[];
    authenticate?: IAuthenticate;
    preAuthentication?: (
        this: IHttpRequestHelper,
        credentials: ICredentialDataDecryptedObject,
    ) => Promise<IDataObject>;
    test?: ICredentialTestRequest;
    genericAuth?: boolean;
    httpRequestNode?: ICredentialHttpRequestNode;
    supportedNodes?: string[];
}
export interface ICredentialTypes {
    recognizes(credentialType: string): boolean;
    getByName(credentialType: string): ICredentialType;
    getSupportedNodes(type: string): string[];
    getParentTypes(typeName: string): string[];
}
export interface ICredentialData {
    id?: string;
    name: string;
    data: string;
}
export type CredentialInformation =
    | string
    | string[]
    | number
    | boolean
    | IDataObject
    | IDataObject[];
export interface ICredentialDataDecryptedObject {
    [key: string]: CredentialInformation;
}
export type NodeInputConnections = Array<IConnection[] | null>;
export interface INodeConnection {
    sourceIndex: number;
    destinationIndex: number;
}
export interface INodeConnections {
    [key: string]: NodeInputConnections;
}
export interface IConnections {
    [key: string]: INodeConnections;
}
export type GenericValue =
    | string
    | object
    | number
    | boolean
    | undefined
    | null;
export type CloseFunction = () => Promise<void>;
export interface IDataObject {
    [key: string]: GenericValue | IDataObject | GenericValue[] | IDataObject[];
}
export type IExecuteResponsePromiseData = IDataObject | IN8nHttpFullResponse;
export interface INodeTypeNameVersion {
    name: string;
    version: number;
}
export interface IRunNodeResponse {
    data: INodeExecutionData[][] | null | undefined;
    hints?: NodeExecutionHint[];
    closeFunction?: CloseFunction;
}
export interface ISourceDataConnections {
    [key: string]: Array<ISourceData[] | null>;
}
export interface IExecuteData {
    data: ITaskDataConnections;
    metadata?: ITaskMetadata;
    node: INode;
    source: ITaskDataConnectionsSource | null;
}
export type IContextObject = {
    [key: string]: unknown;
};
export interface IExecuteContextData {
    [key: string]: IContextObject;
}
export type IHttpRequestMethods =
    | "DELETE"
    | "GET"
    | "HEAD"
    | "PATCH"
    | "POST"
    | "PUT";
export interface IHttpRequestOptions {
    url: string;
    baseURL?: string;
    headers?: IDataObject;
    method?: IHttpRequestMethods;
    body?: FormData | GenericValue | GenericValue[] | Buffer | URLSearchParams;
    qs?: IDataObject;
    arrayFormat?: "indices" | "brackets" | "repeat" | "comma";
    auth?: {
        username: string;
        password: string;
        sendImmediately?: boolean;
    };
    disableFollowRedirect?: boolean;
    encoding?: "arraybuffer" | "blob" | "document" | "json" | "text" | "stream";
    skipSslCertificateValidation?: boolean;
    returnFullResponse?: boolean;
    ignoreHttpStatusErrors?: boolean;
    proxy?: {
        host: string;
        port: number;
        auth?: {
            username: string;
            password: string;
        };
        protocol?: string;
    };
    timeout?: number;
    json?: boolean;
    abortSignal?: GenericAbortSignal;
}
export interface IRequestOptions {
    baseURL?: string;
    uri?: string;
    url?: string;
    method?: IHttpRequestMethods;
    qs?: IDataObject;
    qsStringifyOptions?: {
        arrayFormat: "repeat" | "brackets" | "indices";
    };
    useQuerystring?: boolean;
    headers?: IDataObject;
    auth?: {
        sendImmediately?: boolean;
        bearer?: string;
        user?: string;
        username?: string;
        password?: string;
        pass?: string;
    };
    body?: unknown;
    formData?: IDataObject | FormData;
    form?: IDataObject | FormData;
    json?: boolean;
    useStream?: boolean;
    encoding?: string | null;
    timeout?: number;
    rejectUnauthorized?: boolean;
    proxy?: string | AxiosProxyConfig;
    simple?: boolean;
    gzip?: boolean;
    resolveWithFullResponse?: boolean;
    followRedirect?: boolean;
    followAllRedirects?: boolean;
    maxRedirects?: number;
    agentOptions?: SecureContextOptions;
}
export interface PaginationOptions {
    binaryResult?: boolean;
    continue: boolean | string;
    request: IRequestOptionsSimplifiedAuth;
    requestInterval: number;
    maxRequests?: number;
}
export type IN8nHttpResponse =
    | IDataObject
    | Buffer
    | GenericValue
    | GenericValue[]
    | null;
export interface IN8nHttpFullResponse {
    body: IN8nHttpResponse | Readable;
    __bodyResolved?: boolean;
    headers: IDataObject;
    statusCode: number;
    statusMessage?: string;
}
export interface IN8nRequestOperations {
    pagination?:
    | IN8nRequestOperationPaginationGeneric
    | IN8nRequestOperationPaginationOffset
    | ((
        this: IExecutePaginationFunctions,
        requestOptions: DeclarativeRestApiSettings.ResultOptions,
    ) => Promise<INodeExecutionData[]>);
}
export interface IN8nRequestOperationPaginationBase {
    type: string;
    properties: {
        [key: string]: unknown;
    };
}
export interface IN8nRequestOperationPaginationGeneric
    extends IN8nRequestOperationPaginationBase {
    type: "generic";
    properties: {
        continue: boolean | string;
        request: IRequestOptionsSimplifiedAuth;
    };
}
export interface IN8nRequestOperationPaginationOffset
    extends IN8nRequestOperationPaginationBase {
    type: "offset";
    properties: {
        limitParameter: string;
        offsetParameter: string;
        pageSize: number;
        rootProperty?: string;
        type: "body" | "query";
    };
}
export type EnsureTypeOptions =
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "json";
export interface IGetNodeParameterOptions {
    contextNode?: INode;
    ensureType?: EnsureTypeOptions;
    extractValue?: boolean;
    rawExpressions?: boolean;
}
declare namespace ExecuteFunctions {
    namespace StringReturning {
        type NodeParameter =
            | "binaryProperty"
            | "binaryPropertyName"
            | "binaryPropertyOutput"
            | "dataPropertyName"
            | "dataBinaryProperty"
            | "resource"
            | "operation"
            | "filePath"
            | "encodingType";
    }
    namespace NumberReturning {
        type NodeParameter = "limit";
    }
    namespace BooleanReturning {
        type NodeParameter =
            | "binaryData"
            | "download"
            | "jsonParameters"
            | "returnAll"
            | "rawData"
            | "resolveData";
    }
    namespace RecordReturning {
        type NodeParameter =
            | "additionalFields"
            | "filters"
            | "options"
            | "updateFields";
    }
    export type GetNodeParameterFn = {
        getNodeParameter<
            T extends {
                resource: string;
            },
        >(parameterName: "resource", itemIndex?: number): T["resource"];
        getNodeParameter(
            parameterName: StringReturning.NodeParameter,
            itemIndex: number,
            fallbackValue?: string,
            options?: IGetNodeParameterOptions,
        ): string;
        getNodeParameter(
            parameterName: RecordReturning.NodeParameter,
            itemIndex: number,
            fallbackValue?: IDataObject,
            options?: IGetNodeParameterOptions,
        ): IDataObject;
        getNodeParameter(
            parameterName: BooleanReturning.NodeParameter,
            itemIndex: number,
            fallbackValue?: boolean,
            options?: IGetNodeParameterOptions,
        ): boolean;
        getNodeParameter(
            parameterName: NumberReturning.NodeParameter,
            itemIndex: number,
            fallbackValue?: number,
            options?: IGetNodeParameterOptions,
        ): number;
        getNodeParameter(
            parameterName: string,
            itemIndex: number,
            fallbackValue?: unknown,
            options?: IGetNodeParameterOptions,
        ): NodeParameterValueType | object;
    };
}
export interface IExecuteWorkflowInfo {
    code?: IWorkflowBase;
    id?: string;
}
export type ICredentialTestFunction = (
    this: ICredentialTestFunctions,
    credential: {
        id: string;
        name: string;
        type: string;
        data?: ICredentialDataDecryptedObject;
        homeProject?: ProjectSharingData;
        sharedWithProjects?: ProjectSharingData[];
    },
) => Promise<INodeCredentialTestResult>;
export interface ICredentialTestFunctions {
    logger: Logger;
    helpers: SSHTunnelFunctions & {
        request: (
            uriOrObject: string | object,
            options?: object,
        ) => Promise<unknown>;
    };
}
export interface BaseHelperFunctions {
    createDeferredPromise: <T = void>() => {
        promise: Promise<T>;
        resolve: (result: T | PromiseLike<T>) => void;
        reject: (error: Error) => void;
    };
    returnJsonArray(jsonData: IDataObject | IDataObject[]): INodeExecutionData[];
}
export interface FileSystemHelperFunctions {
    createReadStream(path: PathLike): Promise<Readable>;
    getStoragePath(): string;
    writeContentToFile(
        path: PathLike,
        content: string | Buffer | Readable,
        flag?: string,
    ): Promise<void>;
}
export interface BinaryHelperFunctions {
    prepareBinaryData(
        binaryData: Buffer | Readable,
        filePath?: string,
        mimeType?: string,
    ): Promise<IBinaryData>;
    setBinaryDataBuffer(
        data: IBinaryData,
        binaryData: Buffer,
    ): Promise<IBinaryData>;
    copyBinaryFile(): Promise<never>;
    binaryToBuffer(body: Buffer | Readable): Promise<Buffer>;
    binaryToString(
        body: Buffer | Readable,
        encoding?: BufferEncoding,
    ): Promise<string>;
    getBinaryPath(binaryDataId: string): string;
    getBinaryStream(binaryDataId: string, chunkSize?: number): Promise<Readable>;
    getBinaryMetadata(binaryDataId: string): Promise<{
        fileName?: string;
        mimeType?: string;
        fileSize: number;
    }>;
}
export type DeduplicationScope = "node" | "workflow";
export type DeduplicationItemTypes = string | number;
export type DeduplicationMode =
    | "entries"
    | "latestIncrementalKey"
    | "latestDate";
export interface IDeduplicationOutput {
    new: DeduplicationItemTypes[];
    processed: DeduplicationItemTypes[];
}
export interface IDeduplicationOutputItems {
    new: IDataObject[];
    processed: IDataObject[];
}
export interface ICheckProcessedOptions {
    mode: DeduplicationMode;
    maxEntries?: number;
}
export interface DeduplicationHelperFunctions {
    checkProcessedAndRecord(
        items: DeduplicationItemTypes[],
        scope: DeduplicationScope,
        options: ICheckProcessedOptions,
    ): Promise<IDeduplicationOutput>;
    checkProcessedItemsAndRecord(
        propertyName: string,
        items: IDataObject[],
        scope: DeduplicationScope,
        options: ICheckProcessedOptions,
    ): Promise<IDeduplicationOutputItems>;
    removeProcessed(
        items: DeduplicationItemTypes[],
        scope: DeduplicationScope,
        options: ICheckProcessedOptions,
    ): Promise<void>;
    clearAllProcessedItems(
        scope: DeduplicationScope,
        options: ICheckProcessedOptions,
    ): Promise<void>;
    getProcessedDataCount(
        scope: DeduplicationScope,
        options: ICheckProcessedOptions,
    ): Promise<number>;
}
interface NodeHelperFunctions {
    copyBinaryFile(
        filePath: string,
        fileName: string,
        mimeType?: string,
    ): Promise<IBinaryData>;
}
export interface RequestHelperFunctions {
    httpRequest(requestOptions: IHttpRequestOptions): Promise<unknown>;
    httpRequestWithAuthentication(
        this: IAllExecuteFunctions,
        credentialsType: string,
        requestOptions: IHttpRequestOptions,
        additionalCredentialOptions?: IAdditionalCredentialOptions,
    ): Promise<unknown>;
    requestWithAuthenticationPaginated(
        this: IAllExecuteFunctions,
        requestOptions: IRequestOptions,
        itemIndex: number,
        paginationOptions: PaginationOptions,
        credentialsType?: string,
        additionalCredentialOptions?: IAdditionalCredentialOptions,
    ): Promise<unknown[]>;
    request(
        uriOrObject: string | IRequestOptions,
        options?: IRequestOptions,
    ): Promise<unknown>;
    requestWithAuthentication(
        this: IAllExecuteFunctions,
        credentialsType: string,
        requestOptions: IRequestOptions,
        additionalCredentialOptions?: IAdditionalCredentialOptions,
        itemIndex?: number,
    ): Promise<unknown>;
    requestOAuth1(
        this: IAllExecuteFunctions,
        credentialsType: string,
        requestOptions: IRequestOptions,
    ): Promise<unknown>;
    requestOAuth2(
        this: IAllExecuteFunctions,
        credentialsType: string,
        requestOptions: IRequestOptions,
        oAuth2Options?: IOAuth2Options,
    ): Promise<unknown>;
}
export type SSHCredentials = {
    sshHost: string;
    sshPort: number;
    sshUser: string;
} & (
        | {
            sshAuthenticateWith: "password";
            sshPassword: string;
        }
        | {
            sshAuthenticateWith: "privateKey";
            privateKey: string;
            passphrase?: string;
        }
    );
export interface SSHTunnelFunctions {
    getSSHClient(credentials: SSHCredentials): Promise<SSHClient>;
}
type CronUnit = number | "*" | `*/${number}`;
export type CronExpression =
    `${CronUnit} ${CronUnit} ${CronUnit} ${CronUnit} ${CronUnit} ${CronUnit}`;
export interface SchedulingFunctions {
    registerCron(cronExpression: CronExpression, onTick: () => void): void;
}
export type NodeTypeAndVersion = {
    name: string;
    type: string;
    typeVersion: number;
    disabled: boolean;
    parameters?: INodeParameters;
};
export interface FunctionsBase {
    logger: Logger;
    getCredentials<T extends object = ICredentialDataDecryptedObject>(
        type: string,
        itemIndex?: number,
    ): Promise<T>;
    getCredentialsProperties(type: string): INodeProperties[];
    getExecutionId(): string;
    getNode(): INode;
    getWorkflow(): IWorkflowMetadata;
    getWorkflowStaticData(type: string): IDataObject;
    getTimezone(): string;
    getRestApiUrl(): string;
    getInstanceBaseUrl(): string;
    getInstanceId(): string;
    getChildNodes(
        nodeName: string,
        options?: {
            includeNodeParameters?: boolean;
        },
    ): NodeTypeAndVersion[];
    getParentNodes(nodeName: string): NodeTypeAndVersion[];
    getKnownNodeTypes(): IDataObject;
    getMode?: () => WorkflowExecuteMode;
    getActivationMode?: () => WorkflowActivateMode;
    prepareOutputData(
        outputData: INodeExecutionData[],
    ): Promise<INodeExecutionData[][]>;
}

export type ContextType = "flow" | "node";
type FunctionsBaseWithRequiredKeysGetMode = FunctionsBase & {
    [K in "getMode"]: NonNullable<FunctionsBase[K]>;
};
type FunctionsBaseWithRequiredKeysBoth = FunctionsBase & {
    [K in "getMode" | "getActivationMode"]: NonNullable<FunctionsBase[K]>;
};
export type ISupplyDataFunctions = ExecuteFunctions.GetNodeParameterFn &
    FunctionsBaseWithRequiredKeysGetMode &
    Pick<
        IExecuteFunctions,
        | "addInputData"
        | "addOutputData"
        | "getInputConnectionData"
        | "getInputData"
        | "getNodeOutputs"
        | "executeWorkflow"
        | "sendMessageToUI"
        | "helpers"
    > & {
        continueOnFail(): boolean;
        evaluateExpression(
            expression: string,
            itemIndex: number,
        ): NodeParameterValueType;
        getWorkflowDataProxy(itemIndex: number): IWorkflowDataProxyData;
        getExecutionCancelSignal(): AbortSignal | undefined;
        onExecutionCancellation(handler: () => unknown): void;
        logAiEvent(eventName: AiEvent, msg?: string | undefined): void;
        cloneWith(replacements: {
            runIndex: number;
            inputData: INodeExecutionData[][];
        }): ISupplyDataFunctions;
    };
export interface IPollFunctions extends FunctionsBaseWithRequiredKeysBoth {
    __emit(
        data: INodeExecutionData[][],
        responsePromise?: {
            promise: Promise<IExecuteResponsePromiseData>;
            resolve: (
                result:
                    | IExecuteResponsePromiseData
                    | PromiseLike<IExecuteResponsePromiseData>,
            ) => void;
            reject: (error: Error) => void;
        },
        donePromise?: {
            promise: Promise<IRun>;
            resolve: (result: IRun | PromiseLike<IRun>) => void;
            reject: (error: Error) => void;
        },
    ): void;
    __emitError(
        error: Error,
        responsePromise?: {
            promise: Promise<IExecuteResponsePromiseData>;
            resolve: (
                result:
                    | IExecuteResponsePromiseData
                    | PromiseLike<IExecuteResponsePromiseData>,
            ) => void;
            reject: (error: Error) => void;
        },
    ): void;
    getNodeParameter(
        parameterName: string,
        fallbackValue?: unknown,
        options?: IGetNodeParameterOptions,
    ): NodeParameterValueType | object;
    helpers: RequestHelperFunctions &
    BaseHelperFunctions &
    BinaryHelperFunctions &
    SchedulingFunctions;
}
export interface IHookFunctions extends FunctionsBaseWithRequiredKeysBoth {
    getWebhookName(): string;
    getWebhookDescription(name: WebhookType): IWebhookDescription | undefined;
    getNodeWebhookUrl: (name: WebhookType) => string | undefined;
    getNodeParameter(
        parameterName: string,
        fallbackValue?: unknown,
        options?: IGetNodeParameterOptions,
    ): NodeParameterValueType | object;
    helpers: RequestHelperFunctions;
}
export interface IWebhookFunctions
    extends FunctionsBaseWithRequiredKeysGetMode {
    getBodyData(): IDataObject;
    getHeaderData(): IncomingHttpHeaders;
    getInputConnectionData(
        connectionType: AINodeConnectionType,
        itemIndex: number,
        inputIndex?: number,
    ): Promise<unknown>;
    getNodeParameter(
        parameterName: string,
        fallbackValue?: unknown,
        options?: IGetNodeParameterOptions,
    ): NodeParameterValueType | object;
    getNodeWebhookUrl: (name: WebhookType) => string | undefined;
    evaluateExpression(
        expression: string,
        itemIndex?: number,
    ): NodeParameterValueType;
    getParamsData(): object;
    getQueryData(): object;
    getRequestObject(): express.Request;
    getResponseObject(): express.Response;
    getWebhookName(): string;
    nodeHelpers: NodeHelperFunctions;
    helpers: RequestHelperFunctions & BaseHelperFunctions & BinaryHelperFunctions;
}
export interface ITriggerFunctions extends FunctionsBaseWithRequiredKeysBoth {
    emit(
        data: INodeExecutionData[][],
        responsePromise?: {
            promise: Promise<IExecuteResponsePromiseData>;
            resolve: (
                result:
                    | IExecuteResponsePromiseData
                    | PromiseLike<IExecuteResponsePromiseData>,
            ) => void;
            reject: (error: Error) => void;
        },
        donePromise?: {
            promise: Promise<IRun>;
            resolve: (result: IRun | PromiseLike<IRun>) => void;
            reject: (error: Error) => void;
        },
    ): void;
    emitError(
        error: Error,
        responsePromise?: {
            promise: Promise<IExecuteResponsePromiseData>;
            resolve: (
                result:
                    | IExecuteResponsePromiseData
                    | PromiseLike<IExecuteResponsePromiseData>,
            ) => void;
            reject: (error: Error) => void;
        },
    ): void;
    getNodeParameter(
        parameterName: string,
        fallbackValue?: unknown,
        options?: IGetNodeParameterOptions,
    ): NodeParameterValueType | object;
    helpers: RequestHelperFunctions &
    BaseHelperFunctions &
    BinaryHelperFunctions &
    SSHTunnelFunctions &
    SchedulingFunctions;
}
type BaseExecutionFunctions = FunctionsBaseWithRequiredKeysGetMode & {
    continueOnFail(): boolean;
    setMetadata(metadata: ITaskMetadata): void;
    evaluateExpression(
        expression: string,
        itemIndex: number,
    ): NodeParameterValueType;
    getContext(type: ContextType): IContextObject;
    getExecuteData(): IExecuteData;
    getWorkflowDataProxy(itemIndex: number): IWorkflowDataProxyData;
    getInputSourceData(
        inputIndex?: number,
        connectionType?: NodeConnectionType,
    ): ISourceData;
    getExecutionCancelSignal(): AbortSignal | undefined;
    onExecutionCancellation(handler: () => unknown): void;
    logAiEvent(eventName: AiEvent, msg?: string | undefined): void;
};
export type IExecuteFunctions = ExecuteFunctions.GetNodeParameterFn &
    BaseExecutionFunctions & {
        executeWorkflow(
            workflowInfo: IExecuteWorkflowInfo,
            inputData?: INodeExecutionData[],
            parentCallbackManager?: CallbackManager,
            options?: {
                doNotWaitToFinish?: boolean;
                parentExecution?: RelatedExecution;
            },
        ): Promise<ExecuteWorkflowData>;
        getInputConnectionData(
            connectionType: AINodeConnectionType,
            itemIndex: number,
            inputIndex?: number,
        ): Promise<unknown>;
        getInputData(
            inputIndex?: number,
            connectionType?: NodeConnectionType,
        ): INodeExecutionData[];
        getNodeInputs(): INodeInputConfiguration[];
        getNodeOutputs(): INodeOutputConfiguration[];
        putExecutionToWait(waitTill: Date): Promise<void>;
        sendMessageToUI(message: unknown): void;
        sendResponse(response: IExecuteResponsePromiseData): void;
        addInputData(
            connectionType: NodeConnectionType,
            data: INodeExecutionData[][] | ExecutionError,
            runIndex?: number,
        ): {
            index: number;
        };
        addOutputData(
            connectionType: NodeConnectionType,
            currentNodeRunIndex: number,
            data: INodeExecutionData[][] | ExecutionError,
            metadata?: ITaskMetadata,
        ): void;
        addExecutionHints(...hints: NodeExecutionHint[]): void;
        nodeHelpers: NodeHelperFunctions;
        helpers: RequestHelperFunctions &
        BaseHelperFunctions &
        BinaryHelperFunctions &
        DeduplicationHelperFunctions &
        FileSystemHelperFunctions &
        SSHTunnelFunctions & {
            normalizeItems(
                items: INodeExecutionData | INodeExecutionData[],
            ): INodeExecutionData[];
            constructExecutionMetaData(
                inputData: INodeExecutionData[],
                options: {
                    itemData: IPairedItemData | IPairedItemData[];
                },
            ): NodeExecutionWithMetadata[];
            assertBinaryData(itemIndex: number, propertyName: string): IBinaryData;
            getBinaryDataBuffer(
                itemIndex: number,
                propertyName: string,
            ): Promise<Buffer>;
            detectBinaryEncoding(buffer: Buffer): string;
            copyInputItems(
                items: INodeExecutionData[],
                properties: string[],
            ): IDataObject[];
        };
        getParentCallbackManager(): CallbackManager | undefined;
        startJob<T = unknown, E = unknown>(
            jobType: string,
            settings: unknown,
            itemIndex: number,
        ): Promise<
            | {
                ok: true;
                result: T;
            }
            | {
                ok: false;
                Error: E;
            }
        >;
    };
export interface IExecuteSingleFunctions extends BaseExecutionFunctions {
    getInputData(
        inputIndex?: number,
        connectionType?: NodeConnectionType,
    ): INodeExecutionData;
    getItemIndex(): number;
    getNodeParameter(
        parameterName: string,
        fallbackValue?: unknown,
        options?: IGetNodeParameterOptions,
    ): NodeParameterValueType | object;
    helpers: RequestHelperFunctions &
    BaseHelperFunctions &
    BinaryHelperFunctions & {
        assertBinaryData(propertyName: string, inputIndex?: number): IBinaryData;
        getBinaryDataBuffer(
            propertyName: string,
            inputIndex?: number,
        ): Promise<Buffer>;
        detectBinaryEncoding(buffer: Buffer): string;
    };
}
export interface IExecutePaginationFunctions extends IExecuteSingleFunctions {
    makeRoutingRequest(
        this: IAllExecuteFunctions,
        requestOptions: DeclarativeRestApiSettings.ResultOptions,
    ): Promise<INodeExecutionData[]>;
}
export interface ILoadOptionsFunctions extends FunctionsBase {
    getNodeParameter(
        parameterName: string,
        fallbackValue?: unknown,
        options?: IGetNodeParameterOptions,
    ): NodeParameterValueType | object;
    getCurrentNodeParameter(
        parameterName: string,
        options?: IGetNodeParameterOptions,
    ): NodeParameterValueType | object | undefined;
    getCurrentNodeParameters(): INodeParameters | undefined;
    helpers: RequestHelperFunctions & SSHTunnelFunctions;
}
export type FieldValueOption = {
    name: string;
    type: FieldType | "unknown";
};
export type IWorkflowNodeContext = ExecuteFunctions.GetNodeParameterFn & {

    getNode(): INode;
    getWorkflow(): IWorkflowMetadata;
};
export interface ILocalLoadOptionsFunctions {
    getWorkflowNodeContext(
        nodeType: string,
    ): Promise<IWorkflowNodeContext | null>;
}
export interface IWorkflowLoader {
    get(workflowId: string): Promise<IWorkflowBase>;
}
export interface INodeCredentialsDetails {
    id: string | null;
    name: string;
}
export interface INodeCredentials {
    [key: string]: INodeCredentialsDetails;
}
export type OnError =
    | "continueErrorOutput"
    | "continueRegularOutput"
    | "stopWorkflow";
export interface INode {
    id: string;
    name: string;
    typeVersion: number;
    type: string;
    position: [number, number];
    disabled?: boolean;
    notes?: string;
    notesInFlow?: boolean;
    retryOnFail?: boolean;
    maxTries?: number;
    waitBetweenTries?: number;
    alwaysOutputData?: boolean;
    executeOnce?: boolean;
    onError?: OnError;
    continueOnFail?: boolean;
    parameters: INodeParameters;
    credentials?: INodeCredentials;
    webhookId?: string;
    extendsCredential?: string;
}
export interface IPinData {
    [nodeName: string]: INodeExecutionData[];
}
export interface INodes {
    [key: string]: INode;
}
export interface IObservableObject {
    [key: string]: unknown;
    __dataChanged: boolean;
}
export interface IBinaryKeyData {
    [key: string]: IBinaryData;
}
export interface IPairedItemData {
    item: number;
    input?: number;
    sourceOverwrite?: ISourceData;
}
export interface INodeExecutionData {
    [key: string]:
    | IDataObject
    | IBinaryKeyData
    | IPairedItemData
    | IPairedItemData[]
    | NodeApiError
    | NodeOperationError
    | number
    | undefined;
    json: IDataObject;
    binary?: IBinaryKeyData;
    error?: NodeApiError | NodeOperationError;
    pairedItem?: IPairedItemData | IPairedItemData[] | number;
    metadata?: {
        subExecution: RelatedExecution;
    };
    index?: number;
}
export type NodeParameterValue = string | number | boolean | undefined | null;
export type ResourceLocatorModes = "id" | "url" | "list" | string;
export interface IResourceLocatorResult {
    name: string;
    value: string;
    url?: string;
}
export interface INodeParameterResourceLocator {
    __rl: true;
    mode: ResourceLocatorModes;
    value: NodeParameterValue;
    cachedResultName?: string;
    cachedResultUrl?: string;
    __regex?: string;
}
export type NodeParameterValueType =
    | NodeParameterValue
    | INodeParameters
    | INodeParameterResourceLocator
    | ResourceMapperValue
    | FilterValue
    | AssignmentCollectionValue
    | NodeParameterValue[]
    | INodeParameters[]
    | INodeParameterResourceLocator[]
    | ResourceMapperValue[];
export interface INodeParameters {
    [key: string]: NodeParameterValueType;
}
export type NodePropertyTypes =
    | "boolean"
    | "button"
    | "collection"
    | "color"
    | "dateTime"
    | "fixedCollection"
    | "hidden"
    | "json"
    | "notice"
    | "multiOptions"
    | "number"
    | "options"
    | "string"
    | "credentialsSelect"
    | "resourceLocator"
    | "curlImport"
    | "resourceMapper"
    | "filter"
    | "assignmentCollection"
    | "credentials"
    | "workflowSelector";
export type CodeAutocompleteTypes = "function" | "functionItem";
export type EditorType =
    | "codeNodeEditor"
    | "jsEditor"
    | "htmlEditor"
    | "sqlEditor"
    | "cssEditor";
export type CodeNodeEditorLanguage = (typeof CODE_LANGUAGES)[number];
export type CodeExecutionMode = (typeof CODE_EXECUTION_MODES)[number];
export type SQLDialect =
    | "StandardSQL"
    | "PostgreSQL"
    | "MySQL"
    | "MariaSQL"
    | "MSSQL"
    | "SQLite"
    | "Cassandra"
    | "PLSQL";
export interface ILoadOptions {
    routing?: {
        operations?: IN8nRequestOperations;
        output?: INodeRequestOutput;
        request?: DeclarativeRestApiSettings.HttpRequestOptions;
    };
}
export type NodePropertyAction = {
    type: "askAiCodeGeneration";
    handler?: string;
    target?: string;
};
export interface INodePropertyTypeOptions {
    buttonConfig?: {
        action?: string | NodePropertyAction;
        label?: string;
        hasInputField?: boolean;
        inputFieldMaxLength?: number;
    };
    containerClass?: string;
    alwaysOpenEditWindow?: boolean;
    codeAutocomplete?: CodeAutocompleteTypes;
    editor?: EditorType;
    editorIsReadOnly?: boolean;
    sqlDialect?: SQLDialect;
    loadOptionsDependsOn?: string[];
    loadOptionsMethod?: string;
    loadOptions?: ILoadOptions;
    maxValue?: number;
    minValue?: number;
    multipleValues?: boolean;
    multipleValueButtonText?: string;
    numberPrecision?: number;
    password?: boolean;
    rows?: number;
    showAlpha?: boolean;
    sortable?: boolean;
    expirable?: boolean;
    resourceMapper?: ResourceMapperTypeOptions;
    filter?: FilterTypeOptions;
    assignment?: AssignmentTypeOptions;
    minRequiredFields?: number;
    maxAllowedFields?: number;
    [key: string]: unknown;
}
export interface ResourceMapperTypeOptionsBase {
    mode: "add" | "update" | "upsert" | "map";
    valuesLabel?: string;
    fieldWords?: {
        singular: string;
        plural: string;
    };
    addAllFields?: boolean;
    noFieldsError?: string;
    multiKeyMatch?: boolean;
    supportAutoMap?: boolean;
    matchingFieldsLabels?: {
        title?: string;
        description?: string;
        hint?: string;
    };
    showTypeConversionOptions?: boolean;
}
export type ResourceMapperTypeOptionsLocal = {
    resourceMapperMethod: string;
    localResourceMapperMethod?: never;
};
export type ResourceMapperTypeOptionsExternal = {
    localResourceMapperMethod: string;
    resourceMapperMethod?: never;
};
export type ResourceMapperTypeOptions = ResourceMapperTypeOptionsBase &
    (ResourceMapperTypeOptionsLocal | ResourceMapperTypeOptionsExternal);
export type FilterTypeCombinator = "and" | "or";
export type FilterTypeOptions = {
    version: 1 | 2 | {};
    caseSensitive?: boolean | string;
    leftValue?: string;
    allowedCombinators?: [FilterTypeCombinator, ...FilterTypeCombinator[]];
    maxConditions?: number;
    typeValidation?: "strict" | "loose" | {};
};
export type AssignmentTypeOptions = {
    hideType?: boolean;
};
export type DisplayCondition =
    | {
        _cnd: {
            eq: NodeParameterValue;
        };
    }
    | {
        _cnd: {
            not: NodeParameterValue;
        };
    }
    | {
        _cnd: {
            gte: number | string;
        };
    }
    | {
        _cnd: {
            lte: number | string;
        };
    }
    | {
        _cnd: {
            gt: number | string;
        };
    }
    | {
        _cnd: {
            lt: number | string;
        };
    }
    | {
        _cnd: {
            between: {
                from: number | string;
                to: number | string;
            };
        };
    }
    | {
        _cnd: {
            startsWith: string;
        };
    }
    | {
        _cnd: {
            endsWith: string;
        };
    }
    | {
        _cnd: {
            includes: string;
        };
    }
    | {
        _cnd: {
            regex: string;
        };
    }
    | {
        _cnd: {
            exists: true;
        };
    };
export interface IDisplayOptions {
    hide?: {
        [key: string]: Array<NodeParameterValue | DisplayCondition> | undefined;
    };
    show?: {
        "@version"?: Array<number | DisplayCondition>;
        [key: string]: Array<NodeParameterValue | DisplayCondition> | undefined;
    };
    hideOnCloud?: boolean;
}
export interface ICredentialsDisplayOptions {
    hide?: {
        [key: string]: NodeParameterValue[] | undefined;
    };
    show?: {
        "@version"?: number[];
        [key: string]: NodeParameterValue[] | undefined;
    };
    hideOnCloud?: boolean;
}
export interface INodeProperties {
    displayName: string;
    name: string;
    type: NodePropertyTypes;
    typeOptions?: INodePropertyTypeOptions;
    default: NodeParameterValueType;
    description?: string;
    hint?: string;
    disabledOptions?: IDisplayOptions;
    displayOptions?: IDisplayOptions;
    options?: Array<
        INodePropertyOptions | INodeProperties | INodePropertyCollection
    >;
    placeholder?: string;
    isNodeSetting?: boolean;
    noDataExpression?: boolean;
    required?: boolean;
    routing?: INodePropertyRouting;
    credentialTypes?: Array<
        | "extends:oAuth2Api"
        | "extends:oAuth1Api"
        | "has:authenticate"
        | "has:genericAuth"
    >;
    extractValue?: INodePropertyValueExtractor;
    modes?: INodePropertyMode[];
    requiresDataPath?: "single" | "multiple";
    doNotInherit?: boolean;
    validateType?: FieldType;
    ignoreValidationDuringExecution?: boolean;
}
export interface INodePropertyModeTypeOptions {
    searchListMethod?: string;
    searchFilterRequired?: boolean;
    searchable?: boolean;
}
export interface INodePropertyMode {
    displayName: string;
    name: string;
    type: "string" | "list";
    hint?: string;
    validation?: Array<
        | INodePropertyModeValidation
        | {
            (this: IExecuteSingleFunctions, value: string): void;
        }
    >;
    placeholder?: string;
    url?: string;
    extractValue?: INodePropertyValueExtractor;
    initType?: string;
    entryTypes?: {
        [name: string]: {
            selectable?: boolean;
            hidden?: boolean;
            queryable?: boolean;
            data?: {
                request?: IHttpRequestOptions;
                output?: INodeRequestOutput;
            };
        };
    };
    search?: INodePropertyRouting;
    typeOptions?: INodePropertyModeTypeOptions;
}
export interface INodePropertyModeValidation {
    type: string;
    properties: {};
}
export interface INodePropertyRegexValidation
    extends INodePropertyModeValidation {
    type: "regex";
    properties: {
        regex: string;
        errorMessage: string;
    };
}
export interface INodePropertyOptions {
    name: string;
    value: string | number | boolean;
    action?: string;
    description?: string;
    routing?: INodePropertyRouting;
    outputConnectionType?: NodeConnectionType;
}
export interface INodeListSearchItems extends INodePropertyOptions {
    icon?: string;
    url?: string;
}
export interface INodeListSearchResult {
    results: INodeListSearchItems[];
    paginationToken?: unknown;
}
export interface INodePropertyCollection {
    displayName: string;
    name: string;
    values: INodeProperties[];
}
export interface INodePropertyValueExtractorBase {
    type: string;
}
export interface INodePropertyValueExtractorRegex
    extends INodePropertyValueExtractorBase {
    type: "regex";
    regex: string | RegExp;
}
export interface INodePropertyValueExtractorFunction {
    (
        this: IExecuteSingleFunctions,
        value: string | NodeParameterValue,
    ): Promise<string | NodeParameterValue> | (string | NodeParameterValue);
}
export type INodePropertyValueExtractor = INodePropertyValueExtractorRegex;
export interface IParameterDependencies {
    [key: string]: string[];
}
export type IParameterLabel = {
    size?: "small" | "medium";
};
export interface ITriggerResponse {
    closeFunction?: CloseFunction;
    manualTriggerFunction?: () => Promise<void>;
    manualTriggerResponse?: Promise<INodeExecutionData[][]>;
}
export interface ExecuteWorkflowData {
    executionId: string;
    data: Array<INodeExecutionData[] | null>;
    waitTill?: Date | null;
}
export type WebhookSetupMethodNames = "checkExists" | "create" | "delete";
export declare namespace MultiPartFormData {
    interface File {
        filepath: string;
        mimetype?: string;
        originalFilename?: string;
        newFilename: string;
        size?: number;
    }
    type Request = express.Request<
        {},
        {},
        {
            data: { [key: string]: string | string[] };
            files: { [key: string]: File | File[] };
        }
    >;
}
export interface SupplyData {
    metadata?: IDataObject;
    response: unknown;
    closeFunction?: CloseFunction;
}
type NodeOutput = INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null;
export interface INodeType {
    description: INodeTypeDescription;
    supplyData?(
        this: ISupplyDataFunctions,
        itemIndex: number,
    ): Promise<SupplyData>;
    execute?(this: IExecuteFunctions): Promise<NodeOutput>;
    poll?(this: IPollFunctions): Promise<INodeExecutionData[][] | null>;
    trigger?(this: ITriggerFunctions): Promise<ITriggerResponse | undefined>;
    webhook?(this: IWebhookFunctions): Promise<IWebhookResponseData>;
    methods?: {
        loadOptions?: {
            [key: string]: (
                this: ILoadOptionsFunctions,
            ) => Promise<INodePropertyOptions[]>;
        };
        listSearch?: {
            [key: string]: (
                this: ILoadOptionsFunctions,
                filter?: string,
                paginationToken?: string,
            ) => Promise<INodeListSearchResult>;
        };
        credentialTest?: {
            [functionName: string]: ICredentialTestFunction;
        };
        resourceMapping?: {
            [functionName: string]: (
                this: ILoadOptionsFunctions,
            ) => Promise<ResourceMapperFields>;
        };
        localResourceMapping?: {
            [functionName: string]: (
                this: ILocalLoadOptionsFunctions,
            ) => Promise<ResourceMapperFields>;
        };
        actionHandler?: {
            [functionName: string]: (
                this: ILoadOptionsFunctions,
                payload: IDataObject | string | undefined,
            ) => Promise<NodeParameterValueType>;
        };
    };
    webhookMethods?: {
        [name in WebhookType]?: {
            [method in WebhookSetupMethodNames]: (
                this: IHookFunctions,
            ) => Promise<boolean>;
        };
    };
    customOperations?: {
        [resource: string]: {
            [operation: string]: (this: IExecuteFunctions) => Promise<NodeOutput>;
        };
    };
}
export declare abstract class Node {
    abstract description: INodeTypeDescription;
    execute?(context: IExecuteFunctions): Promise<INodeExecutionData[][]>;
    webhook?(context: IWebhookFunctions): Promise<IWebhookResponseData>;
    poll?(context: IPollFunctions): Promise<INodeExecutionData[][] | null>;
}
export interface IVersionedNodeType {
    nodeVersions: {
        [key: number]: INodeType;
    };
    currentVersion: number;
    description: INodeTypeBaseDescription;
    getNodeType: (version?: number) => INodeType;
}
export interface INodeCredentialTestResult {
    status: "OK" | "Error";
    message: string;
}
export interface INodeCredentialTestRequest {
    credentials: {
        id: string;
        name: string;
        type: string;
        data?: ICredentialDataDecryptedObject;
        homeProject?: ProjectSharingData;
        sharedWithProjects?: ProjectSharingData[];
    };
}
export interface INodeCredentialDescription {
    name: string;
    required?: boolean;
    displayName?: string;
    disabledOptions?: ICredentialsDisplayOptions;
    displayOptions?: ICredentialsDisplayOptions;
    testedBy?: ICredentialTestRequest | string;
}
export type INodeIssueTypes =
    | "credentials"
    | "execution"
    | "input"
    | "parameters"
    | "typeunknown";
export interface INodeIssueObjectProperty {
    [key: string]: string[];
}
export interface INodeIssueData {
    node: string;
    type: INodeIssueTypes;
    value: null | boolean | string | string[] | INodeIssueObjectProperty;
}
export interface INodeIssues {
    execution?: boolean;
    credentials?: INodeIssueObjectProperty;
    input?: INodeIssueObjectProperty;
    parameters?: INodeIssueObjectProperty;
    typeunknown?: boolean;
    [key: string]: undefined | boolean | INodeIssueObjectProperty;
}
export interface IWorkflowIssues {
    [key: string]: INodeIssues;
}
export type ThemeIconColor =
    | "gray"
    | "black"
    | "blue"
    | "light-blue"
    | "dark-blue"
    | "orange"
    | "orange-red"
    | "pink-red"
    | "red"
    | "light-green"
    | "green"
    | "dark-green"
    | "azure"
    | "purple"
    | "crimson";
export type IconRef = `fa:${string}` | `node:${string}.${string}`;
export type IconFile = `file:${string}.png` | `file:${string}.svg`;
export type Icon =
    | IconRef
    | IconFile
    | {
        light: IconFile;
        dark: IconFile;
    };
export interface INodeTypeBaseDescription {
    displayName: string;
    name: string;
    icon?: Icon;
    iconColor?: ThemeIconColor;
    iconUrl?:
    | string
    | {
        light: string;
        dark: string;
    };
    badgeIconUrl?:
    | string
    | {
        light: string;
        dark: string;
    };
    group: string[];
    description: string;
    documentationUrl?: string;
    subtitle?: string;
    defaultVersion?: number;
    codex?: CodexData;
    parameterPane?: "wide";
    hidden?: true;
    usableAsTool?: true;
}
export interface INodePropertyRouting {
    operations?: IN8nRequestOperations;
    output?: INodeRequestOutput;
    request?: DeclarativeRestApiSettings.HttpRequestOptions;
    send?: INodeRequestSend;
}
export type PostReceiveAction =
    | ((
        this: IExecuteSingleFunctions,
        items: INodeExecutionData[],
        response: IN8nHttpFullResponse,
    ) => Promise<INodeExecutionData[]>)
    | IPostReceiveBinaryData
    | IPostReceiveFilter
    | IPostReceiveLimit
    | IPostReceiveRootProperty
    | IPostReceiveSet
    | IPostReceiveSetKeyValue
    | IPostReceiveSort;
export type PreSendAction = (
    this: IExecuteSingleFunctions,
    requestOptions: IHttpRequestOptions,
) => Promise<IHttpRequestOptions>;
export interface INodeRequestOutput {
    maxResults?: number | string;
    postReceive?: PostReceiveAction[];
}
export interface INodeRequestSend {
    preSend?: PreSendAction[];
    paginate?: boolean | string;
    property?: string;
    propertyInDotNotation?: boolean;
    type?: "body" | "query";
    value?: string;
}
export interface IPostReceiveBase {
    type: string;
    enabled?: boolean | string;
    properties: {
        [key: string]: string | number | boolean | IDataObject;
    };
    errorMessage?: string;
}
export interface IPostReceiveBinaryData extends IPostReceiveBase {
    type: "binaryData";
    properties: {
        destinationProperty: string;
    };
}
export interface IPostReceiveFilter extends IPostReceiveBase {
    type: "filter";
    properties: {
        pass: boolean | string;
    };
}
export interface IPostReceiveLimit extends IPostReceiveBase {
    type: "limit";
    properties: {
        maxResults: number | string;
    };
}
export interface IPostReceiveRootProperty extends IPostReceiveBase {
    type: "rootProperty";
    properties: {
        property: string;
    };
}
export interface IPostReceiveSet extends IPostReceiveBase {
    type: "set";
    properties: {
        value: string;
    };
}
export interface IPostReceiveSetKeyValue extends IPostReceiveBase {
    type: "setKeyValue";
    properties: {
        [key: string]: string | number;
    };
}
export interface IPostReceiveSort extends IPostReceiveBase {
    type: "sort";
    properties: {
        key: string;
    };
}
export declare const enum NodeConnectionType {
    AiAgent = "ai_agent",
    AiChain = "ai_chain",
    AiDocument = "ai_document",
    AiEmbedding = "ai_embedding",
    AiLanguageModel = "ai_languageModel",
    AiMemory = "ai_memory",
    AiOutputParser = "ai_outputParser",
    AiRetriever = "ai_retriever",
    AiTextSplitter = "ai_textSplitter",
    AiTool = "ai_tool",
    AiVectorStore = "ai_vectorStore",
    Main = "main",
}
export type AINodeConnectionType = Exclude<
    NodeConnectionType,
    NodeConnectionType.Main
>;
export declare const nodeConnectionTypes: NodeConnectionType[];
export interface INodeInputFilter {
    nodes: string[];
}
export interface INodeInputConfiguration {
    category?: string;
    displayName?: string;
    required?: boolean;
    type: NodeConnectionType;
    filter?: INodeInputFilter;
    maxConnections?: number;
}
export interface INodeOutputConfiguration {
    category?: "error";
    displayName?: string;
    maxConnections?: number;
    required?: boolean;
    type: NodeConnectionType;
}
export type ExpressionString = `={{${string}}}`;
export type NodeDefaults = {
    color?: string;
    name?: string;
};
export interface INodeTypeDescription extends INodeTypeBaseDescription {
    version: number | number[];
    defaults: NodeDefaults;
    eventTriggerDescription?: string;
    activationMessage?: string;
    inputs:
    | Array<NodeConnectionType | INodeInputConfiguration>
    | ExpressionString;
    requiredInputs?: string | number[] | number;
    inputNames?: string[];
    outputs:
    | Array<NodeConnectionType | INodeOutputConfiguration>
    | ExpressionString;
    outputNames?: string[];
    properties: INodeProperties[];
    credentials?: INodeCredentialDescription[];
    maxNodes?: number;
    polling?: true | undefined;
    supportsCORS?: true | undefined;
    requestDefaults?: DeclarativeRestApiSettings.HttpRequestOptions;
    requestOperations?: IN8nRequestOperations;
    hooks?: {
        [key: string]: INodeHookDescription[] | undefined;
        activate?: INodeHookDescription[];
        deactivate?: INodeHookDescription[];
    };
    webhooks?: IWebhookDescription[];
    translation?: {
        [key: string]: object;
    };
    mockManualExecution?: true;
    triggerPanel?: TriggerPanelDefinition | boolean;
    extendsCredential?: string;
    hints?: NodeHint[];
    __loadOptionsMethods?: string[];
}
export type TriggerPanelDefinition = {
    hideContent?: boolean | string;
    header?: string;
    executionsHelp?:
    | string
    | {
        active: string;
        inactive: string;
    };
    activationHint?:
    | string
    | {
        active: string;
        inactive: string;
    };
};
export type NodeHint = {
    message: string;
    type?: "info" | "warning" | "danger";
    location?: "outputPane" | "inputPane" | "ndv";
    displayCondition?: string;
    whenToDisplay?: "always" | "beforeExecution" | "afterExecution";
};
export type NodeExecutionHint = {
    message: string;
    type?: "info" | "warning" | "danger";
    location?: "outputPane" | "inputPane" | "ndv";
};
export interface INodeHookDescription {
    method: string;
}
export interface IWebhookData {
    httpMethod: IHttpRequestMethods;
    node: string;
    path: string;
    webhookDescription: IWebhookDescription;
    workflowId: string;
    workflowExecuteAdditionalData: IWorkflowExecuteAdditionalData;
    webhookId?: string;
    isTest?: boolean;
    userId?: string;
    staticData?: Workflow["staticData"];
}
export type WebhookType = "default" | "setup";
export interface IWebhookDescription {
    [key: string]:
    | IHttpRequestMethods
    | WebhookResponseMode
    | boolean
    | string
    | undefined;
    httpMethod: IHttpRequestMethods | string;
    isFullPath?: boolean;
    name: WebhookType;
    path: string;
    responseBinaryPropertyName?: string;
    responseContentType?: string;
    responsePropertyName?: string;
    responseMode?: WebhookResponseMode | string;
    responseData?: WebhookResponseData | string;
    restartWebhook?: boolean;
    isForm?: boolean;
    ndvHideUrl?: string | boolean;
    ndvHideMethod?: string | boolean;
}
export interface ProxyInput {
    all: () => INodeExecutionData[];
    context: unknown;
    first: () => INodeExecutionData | undefined;
    item: INodeExecutionData | undefined;
    last: () => INodeExecutionData | undefined;
    params?: INodeParameters;
}
export interface IWorkflowDataProxyData {
    [key: string]: unknown;
    $binary: INodeExecutionData["binary"];
    $data: unknown;
    $env: unknown;
    $evaluateExpression: (
        expression: string,
        itemIndex?: number,
    ) => NodeParameterValueType;
    $item: (itemIndex: number, runIndex?: number) => IWorkflowDataProxyData;
    $items: (
        nodeName?: string,
        outputIndex?: number,
        runIndex?: number,
    ) => INodeExecutionData[];
    $json: INodeExecutionData["json"];
    $node: unknown;
    $parameter: INodeParameters;
    $position: number;
    $workflow: unknown;
    $: unknown;
    $input: ProxyInput;
    $thisItem: unknown;
    $thisRunIndex: number;
    $thisItemIndex: number;
    $now: unknown;
    $today: unknown;
    $getPairedItem: (
        destinationNodeName: string,
        incomingSourceData: ISourceData | null,
        pairedItem: IPairedItemData,
    ) => INodeExecutionData | null;
    constructor: unknown;
}
export type IWorkflowDataProxyAdditionalKeys = IDataObject & {
    $execution?: {
        id: string;
        mode: "test" | "production";
        resumeUrl: string;
        resumeFormUrl: string;
        customData?: {
            set(key: string, value: string): void;
            setAll(obj: { [key: string]: string }): void;
            get(key: string): string;
            getAll(): { [key: string]: string };
        };
    };
    $vars?: IDataObject;
    $secrets?: IDataObject;
    $pageCount?: number;
    $executionId?: string;
    $resumeWebhookUrl?: string;
};
export interface IWorkflowMetadata {
    id?: string;
    name?: string;
    active: boolean;
}
export interface IWebhookResponseData {
    workflowData?: INodeExecutionData[][];
    webhookResponse?: unknown;
    noWebhookResponse?: boolean;
}
export type WebhookResponseData =
    | "allEntries"
    | "firstEntryJson"
    | "firstEntryBinary"
    | "noData";
export type WebhookResponseMode =
    | "onReceived"
    | "lastNode"
    | "responseNode"
    | "formPage";
export interface INodeTypes {
    getByName(nodeType: string): INodeType | IVersionedNodeType;
    getByNameAndVersion(nodeType: string, version?: number): INodeType;
    getKnownTypes(): IDataObject;
}
export type LoadingDetails = {
    className: string;
    sourcePath: string;
};
export type CredentialLoadingDetails = LoadingDetails & {
    supportedNodes?: string[];
    extends?: string[];
};
export type NodeLoadingDetails = LoadingDetails;
export type KnownNodesAndCredentials = {
    nodes: { [key: string]: NodeLoadingDetails };
    credentials: { [key: string]: CredentialLoadingDetails };
};
export type ICredentialTypeData = {
    [key: string]: {
        sourcePath: string;
        type: ICredentialType;
    };
};
export type INodeTypeData = {
    [key: string]: {
        sourcePath: string;
        type: INodeType | IVersionedNodeType;
    };
};
export interface IRun {
    data: IRunExecutionData;
    finished?: boolean;
    mode: WorkflowExecuteMode;
    waitTill?: Date | null;
    startedAt: Date;
    stoppedAt?: Date;
    status: ExecutionStatus;
}
export interface IRunExecutionData {
    startData?: {
        startNodes?: StartNodeData[];
        destinationNode?: string;
        runNodeFilter?: string[];
    };
    resultData: {
        error?: ExecutionError;
        runData: IRunData;
        pinData?: IPinData;
        lastNodeExecuted?: string;
        metadata?: { [key: string]: string };
    };
    executionData?: {
        contextData: IExecuteContextData;
        nodeExecutionStack: IExecuteData[];
        metadata: {
            [key: string]: ITaskMetadata[];
        };
        waitingExecution: IWaitingForExecution;
        waitingExecutionSource: IWaitingForExecutionSource | null;
    };
    parentExecution?: RelatedExecution;
    waitTill?: Date;
    pushRef?: string;
    isTestWebhook?: boolean;
    manualData?: {

        userId?: string;
        partialExecutionVersion?: 1 | 2;
        dirtyNodeNames?: string[];
        triggerToStartFrom?: {
            name: string;
            data?: ITaskData;
        };
    }
}
export interface IRunData {
    [key: string]: ITaskData[];
}
export interface ITaskSubRunMetadata {
    node: string;
    runIndex: number;
}
export interface RelatedExecution {
    executionId: string;
    workflowId: string;
}
export interface ITaskMetadata {
    subRun?: ITaskSubRunMetadata[];
    parentExecution?: RelatedExecution;
    subExecution?: RelatedExecution;
    subExecutionsCount?: number;
}
export interface ITaskData {
    startTime: number;
    executionTime: number;
    executionStatus?: ExecutionStatus;
    data?: ITaskDataConnections;
    inputOverride?: ITaskDataConnections;
    error?: ExecutionError;
    hints?: NodeExecutionHint[];
    source: Array<ISourceData | null>;
    metadata?: ITaskMetadata;
}
export interface ISourceData {
    previousNode: string;
    previousNodeOutput?: number;
    previousNodeRun?: number;
}
export interface StartNodeData {
    name: string;
    sourceData: ISourceData | null;
}
export interface ITaskDataConnections {
    [key: string]: Array<INodeExecutionData[] | null>;
}
export interface IWaitingForExecution {
    [key: string]: {
        [key: number]: ITaskDataConnections;
    };
}
export interface ITaskDataConnectionsSource {
    [key: string]: Array<ISourceData | null>;
}
export interface IWaitingForExecutionSource {
    [key: string]: {
        [key: number]: ITaskDataConnectionsSource;
    };
}
export type WorkflowId = IWorkflowBase["id"];
export interface IWorkflowCredentials {
    [credentialType: string]: {
        [id: string]: ICredentialsEncrypted;
    };
}
export interface IWorkflowExecutionDataProcess {
    destinationNode?: string;
    restartExecutionId?: string;
    executionMode: WorkflowExecuteMode;
    executionData?: IRunExecutionData;
    runData?: IRunData;
    pinData?: IPinData;
    retryOf?: string | null;
    pushRef?: string;
    startNodes?: StartNodeData[];
    workflowData: IWorkflowBase;
    userId?: string;
    projectId?: string;
    partialExecutionVersion?: 1 | 2;
    dirtyNodeNames?: string[];
    triggerToStartFrom?: {
        name: string;
        data?: ITaskData;
    };
}
export interface ExecuteWorkflowOptions {
    node?: INode;
    parentWorkflowId: string;
    inputData?: INodeExecutionData[];
    loadedWorkflowData?: IWorkflowBase;
    loadedRunData?: IWorkflowExecutionDataProcess;
    parentWorkflowSettings?: IWorkflowSettings;
    parentCallbackManager?: CallbackManager;
    doNotWaitToFinish?: boolean;
    parentExecution?: RelatedExecution;
}
export type AiEvent =
    | "ai-messages-retrieved-from-memory"
    | "ai-message-added-to-memory"
    | "ai-output-parsed"
    | "ai-documents-retrieved"
    | "ai-document-embedded"
    | "ai-query-embedded"
    | "ai-document-processed"
    | "ai-text-split"
    | "ai-tool-called"
    | "ai-vector-store-searched"
    | "ai-llm-generated-output"
    | "ai-llm-errored"
    | "ai-vector-store-populated"
    | "ai-vector-store-updated";
type AiEventPayload = {
    msg: string;
    workflowName: string;
    executionId: string;
    nodeName: string;
    workflowId?: string;
    nodeType?: string;
};
export interface IWorkflowExecuteAdditionalData {
    credentialsHelper: ICredentialsHelper;
    executeWorkflow: (
        workflowInfo: IExecuteWorkflowInfo,
        additionalData: IWorkflowExecuteAdditionalData,
        options: ExecuteWorkflowOptions,
    ) => Promise<ExecuteWorkflowData>;
    executionId?: string;
    restartExecutionId?: string;
    httpResponse?: express.Response;
    httpRequest?: express.Request;
    restApiUrl: string;
    instanceBaseUrl: string;
    setExecutionStatus?: (status: ExecutionStatus) => void;
    sendDataToUI?: (type: string, data: IDataObject | IDataObject[]) => void;
    formWaitingBaseUrl: string;
    webhookBaseUrl: string;
    webhookWaitingBaseUrl: string;
    webhookTestBaseUrl: string;
    currentNodeParameters?: INodeParameters;
    executionTimeoutTimestamp?: number;
    userId?: string;
    variables: IDataObject;
    secretsHelpers: SecretsHelpersBase;
    logAiEvent: (eventName: AiEvent, payload: AiEventPayload) => void;
    parentCallbackManager?: CallbackManager;
    startRunnerTask<T, E = unknown>(
        additionalData: IWorkflowExecuteAdditionalData,
        jobType: string,
        settings: unknown,
        executeFunctions: IExecuteFunctions,
        inputData: ITaskDataConnections,
        node: INode,
        workflow: Workflow,
        runExecutionData: IRunExecutionData,
        runIndex: number,
        itemIndex: number,
        activeNodeName: string,
        connectionInputData: INodeExecutionData[],
        siblingParameters: INodeParameters,
        mode: WorkflowExecuteMode,
        envProviderState: EnvProviderState,
        executeData?: IExecuteData,
    ): Promise<
        | {
            ok: true;
            result: T;
        }
        | {
            ok: false;
            Error: E;
        }
    >;
}
export type WorkflowExecuteMode =
    | "cli"
    | "error"
    | "integrated"
    | "internal"
    | "manual"
    | "retry"
    | "trigger"
    | "webhook"
    | "evaluation";
export type WorkflowActivateMode =
    | "init"
    | "create"
    | "update"
    | "activate"
    | "manual"
    | "leadershipChange";
export declare namespace WorkflowSettings {
    type CallerPolicy =
        | "unknown"
        | "none"
        | "workflowsFromAList"
        | "workflowsFromSameOwner";
    type SaveDataExecution = "DEFAULT" | "all" | "none";
}
export interface IWorkflowSettings {
    timezone?: "DEFAULT" | string;
    errorWorkflow?: string;
    callerIds?: string;
    callerPolicy?: WorkflowSettings.CallerPolicy;
    saveDataErrorExecution?: WorkflowSettings.SaveDataExecution;
    saveDataSuccessExecution?: WorkflowSettings.SaveDataExecution;
    saveManualExecutions?: "DEFAULT" | boolean;
    saveExecutionProgress?: "DEFAULT" | boolean;
    executionTimeout?: number;
    executionOrder?: "v0" | "v1";
}
export interface WorkflowFEMeta {
    onboardingId?: string;
}
export interface WorkflowTestData {
    description: string;
    input: {
        workflowData: {
            nodes: INode[];
            connections: IConnections;
            settings?: IWorkflowSettings;
        };
    };
    output: {
        nodeExecutionOrder?: string[];
        testAllOutputs?: boolean;
        nodeData: {
            [key: string]: unknown[][];
        };
    };
    nock?: {
        baseUrl: string;
        mocks: Array<{
            method: "delete" | "get" | "patch" | "post" | "put";
            path: string;
            requestBody?: RequestBodyMatcher;
            requestHeaders?: { [key: string]: RequestHeaderMatcher };
            statusCode: number;
            responseBody: string | object;
            responseHeaders?: ReplyHeaders;
        }>;
    };
    trigger?: {
        mode: WorkflowExecuteMode;
        input: INodeExecutionData;
    };
}
export type LogLevel = (typeof LOG_LEVELS)[number];
export type LogMetadata = {
    [key: string]: unknown;
    scopes?: unknown[];
    file?: string;
    function?: string;
};
export type Logger = {
    [key: "error" | "warn" | "info" | "debug"]: (
        message: string,
        metadata?: LogMetadata,
    ) => void;
};
export type LogLocationMetadata = {

    file?: string;
    function?: string;
};
export interface IStatusCodeMessages {
    [key: string]: string;
}
export type DocumentationLink = {
    url: string;
};
export type CodexData = {
    categories?: string[];
    subcategories?: {
        [category: string]: string[];
    };
    resources?: {
        credentialDocumentation?: DocumentationLink[];
        primaryDocumentation?: DocumentationLink[];
    };
    alias?: string[];
};
export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonObject
    | JsonValue[];
export type JsonObject = {
    [key: string]: JsonValue;
};

export interface ITelemetryTrackProperties {
    user_id?: string;
    [key: string]: GenericValue;
}
export interface INodesGraph {
    node_types: string[];
    node_connections: IDataObject[];
    nodes: INodesGraphNode;
    notes: INotesGraphNode;
    is_pinned: boolean;
}
export interface INodesGraphNode {
    [key: string]: INodeGraphItem;
}
export interface INotesGraphNode {
    [key: string]: INoteGraphItem;
}
export interface INoteGraphItem {
    overlapping: boolean;
    position: [number, number];
    height: number;
    width: number;
}
export interface INodeGraphItem {
    id: string;
    type: string;
    version?: number;
    resource?: string;
    operation?: string;
    domain?: string;
    domain_base?: string;
    domain_path?: string;
    position: [number, number];
    mode?: string;
    credential_type?: string;
    credential_set?: boolean;
    method?: string;
    src_node_id?: string;
    src_instance_id?: string;
    agent?: string;
    prompts?: IDataObject[] | IDataObject;
    toolSettings?: IDataObject;
    sql?: string;
    workflow_id?: string;
    runs?: number;
    items_total?: number;
}
export interface INodeNameIndex {
    [name: string]: string;
}
export interface INodesGraphResult {
    nodeGraph: INodesGraph;
    nameIndices: INodeNameIndex;
    webhookNodeNames: string[];
}
export interface FeatureFlags {
    [featureFlag: string]: string | boolean | undefined;
}
export interface IConnectedNode {
    name: string;
    indicies: number[];
    depth: number;
}
export type PublicInstalledPackage = {
    packageName: string;
    installedVersion: string;
    authorName?: string;
    authorEmail?: string;
    installedNodes: PublicInstalledNode[];
    createdAt: Date;
    updatedAt: Date;
    updateAvailable?: string;
    failedLoading?: boolean;
};
export type PublicInstalledNode = {
    name: string;
    type: string;
    latestVersion: number;
    package: PublicInstalledPackage;
};
export interface NodeExecutionWithMetadata extends INodeExecutionData {
    pairedItem: IPairedItemData | IPairedItemData[];
}
export type AnnotationVote = "up" | "down";
export interface ExecutionSummary {
    id: string;
    finished?: boolean;
    mode: WorkflowExecuteMode;
    retryOf?: string | null;
    retrySuccessId?: string | null;
    waitTill?: Date;
    createdAt: Date;
    startedAt: Date;
    stoppedAt?: Date;
    workflowId: string;
    workflowName?: string;
    status: ExecutionStatus;
    lastNodeExecuted?: string;
    executionError?: ExecutionError;
    nodeExecutionStatus?: {
        [key: string]: IExecutionSummaryNodeExecutionResult;
    };
    annotation?: {
        vote: AnnotationVote;
        tags: Array<{
            id: string;
            name: string;
        }>;
    };
}
export interface IExecutionSummaryNodeExecutionResult {
    executionStatus: ExecutionStatus;
    errors?: Array<{
        name?: string;
        message?: string;
        description?: string;
    }>;
}
export interface ResourceMapperFields {
    fields: ResourceMapperField[];
    emptyFieldsNotice?: string;
}
export interface WorkflowInputsData {
    fields: ResourceMapperField[];
    dataMode: string;
    subworkflowInfo?: {
        id?: string;
    };
}
export interface ResourceMapperField {
    id: string;
    displayName: string;
    defaultMatch: boolean;
    canBeUsedToMatch?: boolean;
    required: boolean;
    display: boolean;
    type?: FieldType;
    removed?: boolean;
    options?: INodePropertyOptions[];
    readOnly?: boolean;
}
export type FormFieldsParameter = Array<{
    fieldLabel: string;
    elementName?: string;
    fieldType?: string;
    requiredField?: boolean;
    fieldOptions?: {
        values: Array<{
            option: string;
        }>;
    };
    multiselect?: boolean;
    multipleFiles?: boolean;
    acceptFileTypes?: string;
    formatDate?: string;
    html?: string;
    placeholder?: string;
    fieldName?: string;
    fieldValue?: string;
}>;
export type FieldTypeMap = {
    boolean: boolean;
    number: number;
    string: string;
    "string-alphanumeric": string;
    dateTime: string;
    time: string;
    array: unknown[];
    object: object;
    options: unknown;
    url: string;
    jwt: string;
    "form-fields": FormFieldsParameter;
};
export type FieldType = keyof FieldTypeMap;
export type ResourceMapperValue = {
    mappingMode: string;
    value: {
        [key: string]: string | number | boolean | null;
    } | null;
    matchingColumns: string[];
    schema: ResourceMapperField[];
    attemptToConvertTypes: boolean;
    convertFieldsToString: boolean;
};
export type FilterOperatorType =
    | "string"
    | "number"
    | "boolean"
    | "array"
    | "object"
    | "dateTime"
    | "unknown";
export interface FilterOperatorValue {
    type: FilterOperatorType;
    operation: string;
    rightType?: FilterOperatorType;
    singleValue?: boolean;
}
export type FilterConditionValue = {
    id: string;
    leftValue: NodeParameterValue | NodeParameterValue[];
    operator: FilterOperatorValue;
    rightValue: NodeParameterValue | NodeParameterValue[];
};
export type FilterOptionsValue = {
    caseSensitive: boolean;
    leftValue: string;
    typeValidation: "strict" | "loose";
    version: 1 | 2;
};
export type FilterValue = {
    options: FilterOptionsValue;
    conditions: FilterConditionValue[];
    combinator: FilterTypeCombinator;
};
export type AssignmentCollectionValue = {
    assignments: AssignmentValue[];
};
export type AssignmentValue = {
    id: string;
    name: string;
    value: NodeParameterValue;
    type?: string;
};
export interface ExecutionOptions {
    limit?: number;
}
export interface ExecutionFilters {
    finished?: boolean;
    mode?: WorkflowExecuteMode[];
    retryOf?: string;
    retrySuccessId?: string;
    status?: ExecutionStatus[];
    waitTill?: boolean;
    workflowId?: number | string;
}
export type NpsSurveyRespondedState = {
    lastShownAt: number;
    responded: true;
};
export type NpsSurveyWaitingState = {
    lastShownAt: number;
    waitingForResponse: true;
    ignoredCount: number;
};
export type NpsSurveyState = NpsSurveyRespondedState | NpsSurveyWaitingState;
export interface IUserSettings {
    isOnboarded?: boolean;
    firstSuccessfulWorkflowId?: string;
    userActivated?: boolean;
    userActivatedAt?: number;
    allowSSOManualLogin?: boolean;
    npsSurvey?: NpsSurveyState;
    easyAIWorkflowOnboarded?: boolean;
    userClaimedAiCredits?: boolean;
}
export interface IProcessedDataConfig {
    availableModes: string;
    mode: string;
}
export interface IDataDeduplicator {
    checkProcessedAndRecord(
        items: DeduplicationItemTypes[],
        context: DeduplicationScope,
        contextData: ICheckProcessedContextData,
        options: ICheckProcessedOptions,
    ): Promise<IDeduplicationOutput>;
    removeProcessed(
        items: DeduplicationItemTypes[],
        context: DeduplicationScope,
        contextData: ICheckProcessedContextData,
        options: ICheckProcessedOptions,
    ): Promise<void>;
    clearAllProcessedItems(
        context: DeduplicationScope,
        contextData: ICheckProcessedContextData,
        options: ICheckProcessedOptions,
    ): Promise<void>;
    getProcessedDataCount(
        context: DeduplicationScope,
        contextData: ICheckProcessedContextData,
        options: ICheckProcessedOptions,
    ): Promise<number>;
}
export interface ICheckProcessedContextData {
    node?: INode;
    workflow: {
        id: string;
        active: boolean;
    };
}
export type ExpressionEvaluatorType = "tmpl" | "tournament";
export type N8nAIProviderType = "openai" | "unknown";
export interface SecretsHelpersBase {
    update(): Promise<void>;
    waitForInit(): Promise<void>;
    getSecret(provider: string, name: string): unknown;
    hasSecret(provider: string, name: string): boolean;
    hasProvider(provider: string): boolean;
    listProviders(): string[];
    listSecrets(provider: string): string[];
}
export type Functionality = "regular" | "configuration-node" | "pairedItem";
export type CallbackManager = CallbackManagerLC;
export type IPersonalizationSurveyAnswersV4 = {
    version: "v4";
    personalization_survey_submitted_at: string;
    personalization_survey_n8n_version: string;
    automationGoalDevops?: string[] | null;
    automationGoalDevopsOther?: string | null;
    compunknownIndustryExtended?: string[] | null;
    otherCompunknownIndustryExtended?: string[] | null;
    compunknownSize?: string | null;
    compunknownType?: string | null;
    automationGoalSm?: string[] | null;
    automationGoalSmOther?: string | null;
    usageModes?: string[] | null;
    email?: string | null;
    role?: string | null;
    roleOther?: string | null;
    reportedSource?: string | null;
    reportedSourceOther?: string | null;
};
export interface WorkflowParameters {
    id?: string;
    name?: string;
    nodes: INode[];
    connections: IConnections;
    active: boolean;
    nodeTypes: INodeTypes;
    staticData?: IDataObject;
    settings?: IWorkflowSettings;
    pinData?: IPinData;
}
export declare class Workflow {
    id: string;
    name: string | undefined;
    nodes: INodes;
    connectionsBySourceNode: IConnections;
    connectionsByDestinationNode: IConnections;
    nodeTypes: INodeTypes;
    expression: Expression;
    active: boolean;
    settings: IWorkflowSettings;
    readonly timezone: string;
    staticData: IDataObject;
    testStaticData: IDataObject | undefined;
    pinData?: IPinData;
    constructor(parameters: WorkflowParameters);
    overrideStaticData(staticData?: IDataObject): void;
    static getConnectionsByDestination(connections: IConnections): IConnections;
    getStaticData(type: string, node?: INode): IDataObject;
    setTestStaticData(testStaticData: IDataObject): void;
    getTriggerNodes(): INode[];
    getPollNodes(): INode[];
    queryNodes(checkFunction: (nodeType: INodeType) => boolean): INode[];
    getNode(nodeName: string): INode | null;
    getNodes(nodeNames: string[]): INode[];
    getPinDataOfNode(nodeName: string): INodeExecutionData[] | undefined;
    renameNodeInParameterValue(
        parameterValue: NodeParameterValueType,
        currentName: string,
        newName: string,
        {
            hasRenamableContent,
        }?: {
            hasRenamableContent: boolean;
        },
    ): NodeParameterValueType;
    renameNode(currentName: string, newName: string): void;
    getHighestNode(
        nodeName: string,
        nodeConnectionIndex?: number,
        checkedNodes?: string[],
    ): string[];
    getChildNodes(
        nodeName: string,
        type?: NodeConnectionType | "ALL" | "ALL_NON_MAIN",
        depth?: number,
    ): string[];
    getParentNodes(
        nodeName: string,
        type?: NodeConnectionType | "ALL" | "ALL_NON_MAIN",
        depth?: number,
    ): string[];
    getConnectedNodes(
        connections: IConnections,
        nodeName: string,
        connectionType?: NodeConnectionType | "ALL" | "ALL_NON_MAIN",
        depth?: number,
        checkedNodesIncoming?: string[],
    ): string[];
    getParentNodesByDepth(nodeName: string, maxDepth?: number): IConnectedNode[];
    searchNodesBFS(
        connections: IConnections,
        sourceNode: string,
        maxDepth?: number,
    ): IConnectedNode[];
    getParentMainInputNode(node: INode): INode;
    getNodeConnectionIndexes(
        nodeName: string,
        parentNodeName: string,
        type?: NodeConnectionType,
        depth?: number,
        checkedNodes?: string[],
    ): INodeConnection | undefined;
    __getStartNode(nodeNames: string[]): INode | undefined;
    getStartNode(destinationNode?: string): INode | undefined;
}
type ReturnValue = string | null | (() => unknown);
export declare class Expression {
    private readonly workflow;
    constructor(workflow: Workflow);
    static resolveWithoutWorkflow(
        expression: string,
        data?: IDataObject,
    ): ReturnValue;
    convertObjectValueToString(value: object): string;
    resolveSimpleParameterValue(
        parameterValue: NodeParameterValue,
        siblingParameters: INodeParameters,
        runExecutionData: IRunExecutionData | null,
        runIndex: number,
        itemIndex: number,
        activeNodeName: string,
        connectionInputData: INodeExecutionData[],
        mode: WorkflowExecuteMode,
        additionalKeys: IWorkflowDataProxyAdditionalKeys,
        executeData?: IExecuteData,
        returnObjectAsString?: boolean,
        selfData?: {},
        contextNodeName?: string,
    ):
        | NodeParameterValue
        | INodeParameters
        | NodeParameterValue[]
        | INodeParameters[];
    private renderExpression;
    getSimpleParameterValue(
        node: INode,
        parameterValue: string | boolean | undefined,
        mode: WorkflowExecuteMode,
        additionalKeys: IWorkflowDataProxyAdditionalKeys,
        executeData?: IExecuteData,
        defaultValue?: boolean | number | string | unknown[],
    ): boolean | number | string | undefined | unknown[];
    getComplexParameterValue(
        node: INode,
        parameterValue:
            | NodeParameterValue
            | INodeParameters
            | NodeParameterValue[]
            | INodeParameters[],
        mode: WorkflowExecuteMode,
        additionalKeys: IWorkflowDataProxyAdditionalKeys,
        executeData?: IExecuteData,
        defaultValue?: NodeParameterValueType | undefined,
        selfData?: {},
    ): NodeParameterValueType | undefined;
    getParameterValue(
        parameterValue: NodeParameterValueType | INodeParameterResourceLocator,
        runExecutionData: IRunExecutionData | null,
        runIndex: number,
        itemIndex: number,
        activeNodeName: string,
        connectionInputData: INodeExecutionData[],
        mode: WorkflowExecuteMode,
        additionalKeys: IWorkflowDataProxyAdditionalKeys,
        executeData?: IExecuteData,
        returnObjectAsString?: boolean,
        selfData?: {},
        contextNodeName?: string,
    ): NodeParameterValueType;
}
