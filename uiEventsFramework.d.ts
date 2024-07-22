// uiEventsFramework.d.ts
declare namespace CX_SVC_UI_EVENTS_FRAMEWORK {
    enum EventName {
        'ContextOpen',
    }
    enum OperationName {
        GetFieldValue = 'GetFieldValue',
        SetFieldValue = 'SetFieldValue',
    }
    let uiEventsFramework: IUiEventsFramework;

    export interface IUiEventsFramework {
        initialize(applicationName: string, version: string): Promise<IUiEventsFrameworkProvider>;
    }
    export interface IUiEventsFrameworkProvider {
        requestHelper: IRequestHelper;
        dispose: () => void;
        getVersion(): string;
        getApplicationName(): string;
        getCurrentTabId(): Promise<string>;
        getActiveTabId(): Promise<string>;
        getAvailableRecords(tabId?: string): Promise<IRecordContext[]>;
        getActiveTab(): Promise<ITabContext>;
        getTabContext(browserTabId?: string, msiTabId?: string): Promise<ITabContext>;
        getCurrentBrowserTabContext(browserTabId?: string): Promise<ITabContext>;
        getAvailableTabs(): Promise<ITabContext[]>;
        getGlobalContext(): Promise<IGlobalContext>;
        getModalWindowContext(): Promise<IModalWindowContext>;
        getSidePaneContext(sidePaneId: string): Promise<ISidePaneContext>;
        getNotificationContext(notificationId: string): Promise<INotificationContext>;
        getMultiChannelAdaptorContext(): Promise<IMultiChannelAdaptorContext>;
    }

    export interface ISubscriptionContext {
        dispose: () => void;
    }

    export interface IContext {
        subscribe: (requestObject: IEventRequest, callbackFunction: (response:
            IEventResponse) => void) => ISubscriptionContext;
        subscribeOnce: (requestObject: IEventRequest, callbackFunction: (response:
            IEventResponse) => void) => ISubscriptionContext;
        publish: (requestObject: IOperationRequest) => Promise<IOperationResponse>;
        dispose: () => void;
        getSupportedEvents(): string[];
        getSupportedActions(): string[];
    }

    export interface IEventRequest {
        getEventName(): string;
    }

    export interface IOperationRequest {
        getOperationName(): string;
        setPropagateToTabs(propagateToTabs: boolean): void;
        isPropagateToTabsEnabled(): boolean;
    }

    export interface IGlobalContext extends IContext {
        getGlobalContextId(): string;
    }

    export interface ISidePaneContext extends IContext {
        getSidePaneContextId(): string;
    }

    export interface INotificationContext extends IContext {
        getNotificationContextId(): string;
    }

    export interface ITabContext extends IContext {
        getType(): string;
        getAvailableTabs(): Promise<ITabContext[]>;
        getAvailableRecords(): Promise<IRecordContext[]>;
        getActiveRecord(): Promise<IRecordContext>;
        getDependentTabs(): Promise<ITabContext[]>;
        getNotificationContext(notificationId: string): Promise<INotificationContext>;
    }

    export interface IRecordContext extends IContext {
        getRecordType(): string;
        getRecordId(): string;
    }

    export interface IRequestHelper {
        createSubscriptionRequest(eventName: string): IEventRequest;
        createPublishRequest(operationName: string): IOperationRequest;
    }

    export interface IFieldValueChangeEventRequest extends IEventRequest {
        setFields: (fields: string[]) => void;
    }

    export interface ISetFieldValueOperationRequest extends IOperationRequest {
        field: () => ISetFieldValueRequest;
    }

    export interface ISetFieldValueRequest {
        setValue: (fieldName: string, value: any) => void;
    }

    export interface IGetFieldValueOperationRequest extends IOperationRequest {
        setFields: (fields: string[]) => void;
    }

    export interface IContextOpenEventResponse extends IEventResponse {
        getResponseData(): IRecordContext;
    }
    export interface ITabCloseEventResponse extends IEventResponse {
        getResponseData(): ITabInfo;
        getType(): string;
    }

    export interface IGetAgentInfoResponse extends IOperationResponse {
        getFirstName(): string;
        getLastName(): string;
        getEmailAddress(): string;
        getUserName(): string;
        getPartyId(): string;
    }
    export interface ITabCloseOperationResponse extends IOperationResponse {
        getResponseData(): ITabInfo;
        getType(): string;
    }
    export interface IGetFieldValueResponse extends IOperationResponse {
        getResponseData(): IFieldValueCollection;
    }
    export interface ISetFieldValueResponse extends IOperationResponse {
        getResponseData(): IOperationSuccessData;
    }

    export interface ISidePaneActionResponse extends IOperationResponse {
        getResponseData(): IOperationSuccessData;
    }
    export interface IOnAfterSaveEventResponse extends IEventResponse {
        getResponseData(): IOnAfterExtensionContext;
    }

    export interface ITabEventResponse extends IEventResponse {
        getResponseData(): ITabContext;
        getType(): string;
    }

    export interface ITabChangeEventResponse extends IEventResponse {
        getResponseData(): ITabChangeResponse;
        getType(): string;
    }

    export interface ITabChangeResponse {
        getCurrentTab(): ITabContext;
        getPreviousTab(): ITabContext;
    }

    export interface ISaveRecordResponse extends IOperationResponse {
        getResponseData(): IOnAfterExtensionContext;
    }

    export interface IFieldValueChangeEventResponse extends IEventResponse {
        getResponseData(): IFieldValueChangeData;
    }
    export interface IContextResponse extends IEventResponse {
        getResponseData(): IObjectContext;
    }
    export interface ISidePaneCloseEventResponse extends IEventResponse {
        getResponseData(): ISidePaneCloseData;
    }
    export interface IErrorData {
        getStatus(): string;
        getMessage(): string;
        getErrorDetails(): any;
    }

    export interface IOperationSuccessData {
        getMessage: () => string;
    }
    export interface IObjectContext extends ITabInfo {
        getObjectType(): string;
        getObjectId(): string;
    }

    export interface ITabInfo {
        getTabId(): string;
        getMsiTabId(): string;
        getMsiSubTabId(): string;
    }
    export interface IExtensionResponse {
        getContext(): IObjectContext;
    }
    export interface IEventResponse extends IExtensionResponse {
        getEventName(): string;

    }
    export interface IOperationResponse extends IExtensionResponse {
        getOperationName(): string;
    }

    export interface IFieldValueCollection {
        getField: (key: string) => IFieldData;
    }

    export interface IFieldData {
        getValue: () => string;
        getFieldName: () => string;
    }

    export interface IOnAfterExtensionContext {
        getObjectType(): string;
        getOldObjectId(): string;
        getObjectId(): string;
    }

    export interface ISidePaneCloseData {
        getId(): string;
    }

    export interface IFieldValueChangeData {
        getFieldName: () => string;
        getOldValue: () => string | number | boolean;
        getNewValue: () => string | number | boolean;
    }
    export interface ICustomEventRequest extends IOperationRequest {
        setCustomEventName(eventName: string): void;
        setEventPayload(payload: any): void;
    }
    export interface ICustomEventResponse extends IOperationResponse {
        getResponseData(): ICustomEventResponseData;
    }
    export interface ICustomEventResponseData {
        getData(): any;
        getCustomEventName(): string;
    }
    export interface IFocusTabResponseData extends IOperationResponse {
        getResponseData(): ITabChangeResponse;
    }
    export interface IPopFlowUrlRequest {
        setUrl(id: string): void;
    }
    export interface IPopFlowRequest extends IOperationRequest {
        setOpenPageInNewBrowserTab(value: boolean): void;
        setInputParameters(parameters: any): void;
    }

    export interface IPopFlowInAppRequest extends IPopFlowRequest {
        setRecordType(entity: string): void;
        setRecordId(id: string): void;
    }
    export interface IPopFlowAppUIRequest extends IPopFlowRequest {
        setApplicationUIName(id: string): void;
        setPage(id: string): void;
        setFlow(id: string): void;
    }

    export interface IPopFlowGenericRequest extends IPopFlowRequest {
        setFlow(id: string): void;
        setPage(id: string): void;
    }
    export interface IPopFlowResponse extends IOperationResponse {
        getResponseData(): ITabContext;
    }
    export interface IFocusTabResponseData extends IOperationResponse {
        getResponseData(): ITabChangeResponse;
    }
    export interface IServiceConnectionRequest extends IOperationRequest {
        setServiceConnectionId(url: string): void;
        setParameters(parameter: any): void;
        setBody(body: any): void;
    }

    export interface IServiceConnectionResponse extends IOperationResponse {
        getResponseData(): IServiceConnectionResponseData;
    }
    export interface IServiceConnectionResponseData {
        getBody(): any;
        getStatus(): IServiceConnectionStatus;
    }
    export interface IServiceConnectionStatus {
        getStatusCode(): string;
        getStatusText(): string;
    }
    export interface IUpdateSidePaneRequest extends IOperationRequest {
        setVisibility: (visibility: boolean) => void;
        setSectionId: (sectionId: string) => void;
        setIcon: (icon: string) => void;
    }

    export interface ISidePaneOpenEventResponse extends IEventResponse {
        getResponseData(): ISidePaneData;
    }

    export interface INotificationActionEventResponse extends IEventResponse {
        getResponseData(): INotificationActionData;
    }

    export interface INotificationActionData {
        getActionId(): string;
        getActionName(): string;
        getNotificationId(): string;
    }

    export interface INotificationCloseActionEventResponse extends IEventResponse {
        getResponseData(): INotificationCloseActionData;
    }

    export interface INotificationCloseActionData {
        getNotificationId(): string;
        getReason(): string;
    }

    export interface ICustomEventRequest extends IOperationRequest {
        setCustomEventName(eventName: string): void;
        setEventPayload(payload: any): void;
    }

    export interface INotificationActionPayload {
        id: string;
        name: string;
    }
    export interface IShowNotificationRequest extends IOperationRequest {
        setIcon(icon: string): void;
        setTitle(title: string): void;
        setClosable(isClosable: boolean): void;
        setAutoTimeout(time: number): void;
        setType(type: string): void;
        setSummary(summary: string): void;
        setActions(actions: INotificationActionPayload[]): void;
    }

    export interface IOpenModalWindowRequest extends IOperationRequest {
        setURL(url: string): void;
        setId(id: string): void;
        setTitle(title: string): void;
        setClosable(isClosable: boolean): void;
        setStyle(style: any): void;
    }

    export interface IOpenPopupWindowRequest extends IOperationRequest {
        setURL(url: string): void;
        setId(id: string): void;
        setTitle(title: string): void;
        setClosable(isClosable: boolean): void;
        setStyle(style: any): void;
    }
    export interface IModalWindowOperationResponse extends IOperationResponse {
        getResponseData(): IModalWindowOperationResponseData;
    }
    export interface IModalWindowOperationResponseData {
        getId(): string;
    }

    export interface IPopupWindowOperationResponse extends IOperationResponse {
        getResponseData(): IPopupWindowOperationResponseData;
    }
    export interface IPopupWindowOperationResponseData {
        getId(): any;
    }
    export interface ICloseModalWindowRequest extends IOperationRequest {
        setId(id: string): void;
    }

    export interface IClosePopupWindowRequest extends IOperationRequest {
        setId(id: string): void;
    }

    export interface INotificationOperationResponse extends IOperationResponse {
        getResponseData(): INotificationOperationResponseData;
    }
    export interface INotificationOperationResponseData {
        getNotificationId(): string;
    }

    export interface ISidePaneData {
        getActiveSectionId(): string;
        getId(): string;
    }

    export interface ICustomEventSubscriptionRequest extends IEventRequest {
        setCustomEventName(eventName: string): void;
    }

    export interface ICustomEventSubscriptionResponse extends IEventResponse {
        getResponseData(): ICustomEventSubscriptionResponseData;
    }
    export interface ICustomEventSubscriptionResponseData {
        getData(): any;
        getCustomEventName(): string;
    }
    export interface IDataLoadEventResponse extends IEventResponse {
        getResponseData(): IDataLoadEventData;
    }
    export interface IDataLoadEventData {
        getCurrentView(): string;
    }

    export interface IMcaEventResponse extends IEventResponse {
        getResponseData(): IMcaEventResponseData;
    }
    export interface IMcaEventResponseData {
        getEngagementId(): string;
        getEngagementType(): McaChannels;
        getAssociatedTabContext(): Promise<ITabContext>;
    }
    export interface IMultiChannelAdaptorContext extends IContext {
        getActiveChannels(): Promise<string[]>;
        getCommunicationChannelContext(channelType: McaChannels): Promise<ICommunicationChannelContext>;
    }

    export interface ICommunicationChannelContext extends IContext {
        getChannelType(): McaChannelTypes;
        getChannel(): McaChannels;
    }

    export interface IPhoneContext extends ICommunicationChannelContext {
        getChannelType(): McaChannelTypes;
        getChannel(): McaChannels;
        getFrameOrigin(): string;
        getToolbarName(): string;
        getVersion(): string;
        getEventSource(): string;
    }
    export interface IChatContext extends ICommunicationChannelContext {
        getChannelType(): McaChannelTypes;
        getChannel(): McaChannels;
    }
    export interface IEngagementContext extends IContext {
        getChannelType(): McaChannelTypes;
        getChannel(): McaChannels;
        getEngagementId(): string;
        getTabContext(): Promise<ITabContext>;
        getEngagementData(): IMcaEngagementData;
    }

    export interface IMcaActionRequest extends IOperationRequest {
        setAppClassification: (appClassification: string) => void;
        setEventId: (eventId: string) => void;
    }

    export interface IMcaNewCommEventActionRequest extends IMcaActionRequest {
        setLookupObject: (lookupObject: string) => void;
        setInputData: (inData: IMcaInData) => void;
        getInData: () => IMcaInDataRequest;
    }
    export interface IMcaStartCommEventActionRequest extends IMcaActionRequest {
        setInputData: (inData: IMcaStartCommInData) => void;
        getInData: () => IMcaStartCommInDataRequest;
    }
    export interface IMcaCloseCommEventActionRequest extends IMcaActionRequest {
        setReason: (reason: string) => void;
        setInputData: (inData: IMcaCloseCommInData) => void;
        getInData: () => IMcaInDataRequest;
    }
    export interface IMcaNewComActionResponse extends IOperationResponse {
        getResponseData(): IMcaNewComActionData;
    }
    export interface IMcaStartComActionResponse extends IOperationResponse {
        getResponseData(): IMcaStartComActionData;
    }

    export interface IMcaCloseComActionResponse extends IOperationResponse {
        getResponseData(): IMcaCloseComActionData;
    }

    export interface IMcaNewComActionData {
        getData(): IMcaNewComEventActionData;
        getOutputData(): IMcaOutDataResponse;
        getOutData(): IMcaOutData;
    }
    export interface IMcaStartComActionData {
        getData(): IMcaStartComEventActionData;
        getOutData(): IMcaStartCommEventOutData;
        getEngagementContext(): IEngagementContext;
        getOutputData(): IMcaStartCommEventOutDataResponse;
    }
    export interface IMcaCloseComActionData {
        getData(): IMcaCloseComEventActionData;
        getOutData(): IMcaCloseCommEventOutData;
        getOutputData(): IMcaCloseCommEventOutDataResponse;
    }
    export interface IMcaEngagementData {
        getData(): IMcaStartComEventActionData;
        getOutData(): IMcaStartCommEventOutData;
        getOutputData(): IMcaStartCommEventOutDataResponse;
        getEngagementId(): string;
    }
    export interface IMcaOutData {
        SVCMCA_EMAIL: string;
        SVCMCA_COMMUNICATION_DIRECTION: string;
        SVCMCA_CONTACT_NAME: string;
        channel: string;
        channelType: string;
        SVCMCA_DISPLAY_NAME: string;
        notificationType: string;
        lookupObject: string;
        SVCMCA_OFFER_TIMEOUT_SEC: string;
        SVCMCA_CONTACT_FIRST_NAME: string;
        SVCMCA_SR_ID: string;
        appClassification: string;
        callStatus: string;
        channelId: string;
        eventId: string;
        SVCMCA_CONTACT_PRIMARY_PHONE: string;
        SVCMCA_INTERACTION_REF_OBJ_TYPE: string;
        SVCMCA_SR_NUM: string;
        SVCMCA_WRAPUP_TIMEOUT: string;
        SVCMCA_CONTACT_LAST_NAME: string;
        phoneLineId: string;
        SVCMCA_CONTACT_NUMBER: string;
        callDrection: string;
        SVCMCA_CONTACT_ID: string;
        SVCMCA_ANI: string;
        SVCMCA_CONTACT_PRIM_ORG_NAME: string;
        SVCMCA_INTERACTION_REF_OBJ_ID: string;
        SVCMCA_CONTACT_ORG_ID: string;
        SVCMCA_INTERACTION_ID: string;
    }
    export interface IMcaStartCommEventOutData extends IMcaOutData {
        SVCMCA_CHANNEL_ID: string;
        SVCMCA_UI_TYPE_CD: string;
        SVCMCA_SR_TITLE: string;
        SVCMCA_WRAPUP_ID: string;
    }
    export interface IMcaCloseCommEventOutData extends IMcaOutData {
        SVCMCA_CHANNEL_ID: string;
        SVCMCA_UI_TYPE_CD: string;
        SVCMCA_SR_TITLE: string;
        SVCMCA_WRAPUP_ID: string;
        WrapupStartTime: string;
    }

    export interface IMcaInData {
        eventId: string;
        callStatus: string;
        callDirection: string;
        appClassification: string;
        notificationType: string;
        lookupObject: string;
        callSource: string;
        callDestination: string;
        channelType: string;
        comPanelMsg1: string;
        comPanelMsg2: string;
        comPanelQName1: string;
        comPanelQName2: string;
        comPanelQName3: string;
        averageWaitTime: string;
        numberOfCalls: string;
        agentMsg2ComPanel: string;
        phoneLineId: string;
        chatTestMode: string;
        SVCMCA_ANI?: string;
        SVCMCA_OFFER_TIMEOUT_SEC?: string;
        channel: string;
        SVCMCA_SR_NUM?: string;
        SVCMCA_COMMUNICATION_DIRECTION: string;
        SVCMCA_WRAPUP_TIMEOUT?: string;
    }

    export interface IMcaStartCommInData extends IMcaInData {
        SVCMCA_EMAIL: string;
        SVCMCA_CONTACT_NAME: string;
        channel: string;
        SVCMCA_DISPLAY_NAME: string;
        SVCMCA_CONTACT_FIRST_NAME: string;
        SVCMCA_SR_ID: string;
        channelId: string;
        SVCMCA_CONTACT_PRIMARY_PHONE: string;
        SVCMCA_INTERACTION_REF_OBJ_TYPE: string;
        SVCMCA_CONTACT_LAST_NAME: string;
        SVCMCA_CONTACT_NUMBER: string;
        SVCMCA_CONTACT_ID: string;
        SVCMCA_CONTACT_PRIM_ORG_NAME: string;
        SVCMCA_INTERACTION_REF_OBJ_ID: string;
        SVCMCA_CONTACT_ORG_ID: string;
        SVCMCA_INTERACTION_ID: string;
    }
    export interface IMcaCloseCommInData extends IMcaInData {
        SVCMCA_EMAIL: string;
        SVCMCA_CONTACT_NAME: string;
        channel: string;
        SVCMCA_DISPLAY_NAME: string;
        SVCMCA_CONTACT_FIRST_NAME: string;
        SVCMCA_SR_ID: string;
        channelId: string;
        SVCMCA_CONTACT_PRIMARY_PHONE: string;
        SVCMCA_INTERACTION_REF_OBJ_TYPE: string;
        SVCMCA_CONTACT_LAST_NAME: string;
        SVCMCA_CONTACT_NUMBER: string;
        SVCMCA_CONTACT_ID: string;
        SVCMCA_CONTACT_PRIM_ORG_NAME: string;
        SVCMCA_INTERACTION_REF_OBJ_ID: string;
        SVCMCA_CONTACT_ORG_ID: string;
        SVCMCA_INTERACTION_ID: string;
        SVCMCA_CHANNEL_ID: string;
        SVCMCA_UI_TYPE_CD: string;
        SVCMCA_SR_TITLE: string;
        SVCMCA_WRAPUP_ID: string;
    }
    export interface IMcaInDataRequest {
        setCallDestination: (value: string) => void;
        setCallDirection: (value: string) => void;
        setAppClassification: (value: string) => void;
        setNotificationType: (value: string) => void;
        setLookupObject: (value: string) => void;
        setCallSource: (value: string) => void;
        setCallStatus: (value: string) => void;
        setChannelType: (value: string) => void;
        setComPanelMsg1: (value: string) => void;
        setComPanelMsg2: (value: string) => void;
        setComPanelQName1: (value: string) => void;
        setComPanelQName2: (value: string) => void;
        setComPanelQName3: (value: string) => void;
        setAverageWaitTime: (value: string) => void;
        setNumberOfCalls: (value: string) => void;
        setAgentMsg2ComPanel: (value: string) => void;
        setPhoneLineId: (value: string) => void;
        setChatTestMode: (value: string) => void;
        setSVCMCA_ANI: (value: string) => void;
        setSVCMCA_WRAPUP_TIMEOUT: (value: string) => void;
        setSVCMCA_OFFER_TIMEOUT_SEC: (value: string) => void;
        setSVCMCA_COMMUNICATION_DIRECTION: (value: string) => void;
        setSVCMCA_SR_NUM: (value: string) => void;
        setChannel: (value: string) => void;
        setInDataValueByAttribute: (attribute: string, value: any) => void;
    }
    export interface IMcaStartCommInDataRequest extends IMcaInDataRequest {
        setSVCMCA_EMAIL: (value: string) => void;
        setSVCMCA_CONTACT_NAME: (value: string) => void;
        setChannel: (value: string) => void;
        setSVCMCA_DISPLAY_NAME: (value: string) => void;
        setSVCMCA_CONTACT_FIRST_NAME: (value: string) => void;
        setSVCMCA_SR_ID: (value: string) => void;
        setChannelId: (value: string) => void;
        setSVCMCA_CONTACT_PRIMARY_PHONE: (value: string) => void;
        setSVCMCA_INTERACTION_REF_OBJ_TYPE: (value: string) => void;
        setSVCMCA_CONTACT_LAST_NAME: (value: string) => void;
        setSVCMCA_CONTACT_NUMBER: (value: string) => void;
        setSVCMCA_CONTACT_ID: (value: string) => void;
        setSVCMCA_CONTACT_PRIM_ORG_NAME: (value: string) => void;
        setSVCMCA_INTERACTION_REF_OBJ_ID: (value: string) => void;
        setSVCMCA_CONTACT_ORG_ID: (value: string) => void;
        setSVCMCA_INTERACTION_ID: (value: string) => void;
    }

    export interface IMcaCloseCommInDataRequest extends IMcaInDataRequest {
        setSVCMCA_EMAIL: (value: string) => void;
        setSVCMCA_CONTACT_NAME: (value: string) => void;
        setChannel: (value: string) => void;
        setSVCMCA_DISPLAY_NAME: (value: string) => void;
        setSVCMCA_CONTACT_FIRST_NAME: (value: string) => void;
        setSVCMCA_SR_ID: (value: string) => void;
        setChannelId: (value: string) => void;
        setSVCMCA_CONTACT_PRIMARY_PHONE: (value: string) => void;
        setSVCMCA_INTERACTION_REF_OBJ_TYPE: (value: string) => void;
        setSVCMCA_CONTACT_LAST_NAME: (value: string) => void;
        setSVCMCA_CONTACT_NUMBER: (value: string) => void;
        setSVCMCA_CONTACT_ID: (value: string) => void;
        setSVCMCA_CONTACT_PRIM_ORG_NAME: (value: string) => void;
        setSVCMCA_INTERACTION_REF_OBJ_ID: (value: string) => void;
        setSVCMCA_CONTACT_ORG_ID: (value: string) => void;
        setSVCMCA_INTERACTION_ID: (value: string) => void;
        setSVCMCA_UI_TYPE_CD: (value: string) => void;
        setSVCMCA_CHANNEL_ID: (value: string) => void;
        setSVCMCA_SR_TITLE: (value: string) => void;
        setSVCMCA_WRAPUP_ID: (value: string) => void;
    }

    export interface IMcaComEventActionData {
        channelId: string;
        channelType: string;
        engagementId: string;
        eventId: string;
        eventSource: string;
        interactionId: string;
        method: string;
        result: string;
        toolbarName: string;
        uuid: string;
        channel: McaChannels;
    }

    export interface IMcaNewComEventActionData extends IMcaComEventActionData {
        outData: IMcaOutData;
    }
    export interface IMcaStartComEventActionData extends IMcaComEventActionData {
        outData: IMcaStartCommEventOutData;
        screenPopMode: string;
        wrapupId: string;
    }
    export interface IMcaCloseComEventActionData extends IMcaComEventActionData {
        outData: IMcaCloseCommEventOutData;
        wrapupId: string;
    }
    export interface IMcaOutDataResponse {
        getSVCMCA_COMMUNICATION_DIRECTION: () => string;
        getSVCMCA_CONTACT_NAME: () => string;
        getSVCMCA_EMAIL: () => string;
        getChannel: () => string;
        getChannelType: () => string;
        getSVCMCA_DISPLAY_NAME: () => string;
        getNotificationType: () => string;
        getLookupObject: () => string;
        getSVCMCA_OFFER_TIMEOUT_SEC: () => string;
        getSVCMCA_CONTACT_FIRST_NAME: () => string;
        getSVCMCA_SR_ID: () => string;
        getAppClassification: () => string;
        getCallStatus: () => string;
        getChannelId: () => string;
        getEventId: () => string;
        getSVCMCA_CONTACT_PRIMARY_PHONE: () => string;
        getSVCMCA_INTERACTION_REF_OBJ_TYPE: () => string;
        getSVCMCA_SR_NUM: () => string;
        getSVCMCA_WRAPUP_TIMEOUT: () => string;
        getSVCMCA_CONTACT_LAST_NAME: () => string;
        getPhoneLineId: () => string;
        getSVCMCA_CONTACT_NUMBER: () => string;
        getCallDirection: () => string;
        getSVCMCA_CONTACT_ID: () => string;
        getSVCMCA_ANI: () => string;
        getSVCMCA_CONTACT_PRIM_ORG_NAME: () => string;
        getSVCMCA_INTERACTION_REF_OBJ_ID: () => string;
        getSVCMCA_CONTACT_ORG_ID: () => string;
        getSVCMCA_INTERACTION_ID: () => string;
        getValueByAttribute: (attribute: string) => string;
    }

    export interface IMcaCloseCommEventOutDataResponse extends IMcaOutDataResponse {
        getSVCMCA_CHANNEL_ID: () => string;
        getSVCMCA_UI_TYPE_CD: () => string;
        getSVCMCA_SR_TITLE: () => string;
        getSVCMCA_WRAPUP_ID: () => string;
        getWrapupStartTime: () => string;
    }
    export interface IMcaStartCommEventOutDataResponse extends IMcaOutDataResponse {
        getSVCMCA_CHANNEL_ID: () => string;
        getSVCMCA_UI_TYPE_CD: () => string;
        getSVCMCA_SR_TITLE: () => string;
        getSVCMCA_WRAPUP_ID: () => string;
    }

    type McaChannelTypes = string;
    type McaChannels = string;

    export interface IMcaGetConfigurationActionRequest extends IOperationRequest {
        setConfigType: (configType: IMCAGetConfigurationConfigTypes) => void;
    }

    export interface IMcaAgentStateEventActionRequest extends IOperationRequest {
        setEventId: (eventId: string) => void;
        setIsAvailable: (isAvailable: boolean) => void;
        setIsLoggedIn: (isLoggedIn: boolean) => void;
        setState: (stateCd: string) => void;
        setStateDisplayString: (stateDisplayString: string) => void;
        setReason: (reasonCd: string) => void;
        setReasonDisplayString: (reasonDisplayString: string) => void;
        setInData: (inData: Record<string, any>) => void;
    }

    export interface IMcaDisableFeatureActionRequest extends IOperationRequest {
        setFeatures: (features: string[]) => void;
    }

    export interface IMcaReadyForOperationActionRequest extends IOperationRequest {
        setReadiness: (readiness: boolean) => void;
    }

    export interface IMcaGetConfigurationActionResponse extends IOperationResponse {
        getResponseData(): IMcaGetConfigurationActionResponseData;
    }

    export interface IMcaDisableFeatureActionResponse extends IOperationResponse {
        getResponseData(): IMcaDisableFeatureActionResponseData;
    }

    export interface IMcaReadyForOperationActionResponse extends IOperationResponse {
        getResponseData(): IMcaReadyForOperationActionResponseData;
    }

    export interface IMcaAgentStateEventActionResponse extends IOperationResponse {
        getResponseData(): IMcaAgentStateEventActionResponseData;
    }

    export interface IMcaOutboundCommErrorActionRequest extends IOperationRequest {
        setCommUuid(commUuid: string): void;
        setErrorCode(errorCode: string): void;
        setErrorMsg(errorMsg: string): void;
    }

    export interface IMcaOutBoundCommErrorActionResponse extends IOperationResponse {
        getResponseData(): IMcaOutBoundCommErrorActionResponseData;
    }

    export interface IMcaGetConfigurationActionResponseData {
        getData(): IMCAGetConfigurationResponsePayload;
        getConfiguration(): IMCAGetConfiguration;
        isSuccess(): boolean;
        getError(): any;
    }

    export interface IMcaOutBoundCommErrorActionResponseData {
        getData(): IMCAOutBoundCommErrorResponsePayload;
        isSuccess(): boolean;
        getError(): string;
    }

    export interface IMcaAgentStateEventActionResponseData {
        getData(): any;
        isSuccess(): boolean;
        getError(): any;
    }

    export interface IMcaDisableFeatureActionResponseData {
        getData(): any;
    }

    export interface IMcaReadyForOperationActionResponseData {
        getData(): any;
    }

    export interface IMCAGetConfigurationResponsePayload {
        outData: Record<string, any>;
        method: any;
        configuration: IMCAConfiguration;
        result: string;
        toolbarName: string;
        uuid: string;
        error: any;
    }

    export interface IMCAOutBoundCommErrorResponsePayload {
        result: string;
        error: string;
    }

    export interface IMCAAgentStateEventResponsePayload {
        method: string;
        result: string;
        toolbarName: string;
        uuid: string;
        error: any;
    }

    export interface IMCAConfiguration {
        faTrustToken: string;
        agentId: string;
        agentPartyId: string;
        features: string;
        companionPanelUrl: string;
        companionPanelTitle: string;
    }

    export interface IMCAGetConfiguration {
        getAgentId(): string;
        getAgentPartyId(): string;
        getFeatures(): string[];
        getCompanionPanelUrl(): string;
        getCompanionPanelTitle(): string;
        getFaTrustToken(): string;
    }

    export interface IMcaEventRequest extends IEventRequest {
        setAppClassification(appClassification: string): void;
    }
    export interface IMcaOnDataUpdatedEventResponse extends IEventResponse {
        getResponseData(): IMcaOnDataUpdatedData;
    }

    export interface IMcaOnDataUpdatedData {
        getData: () => IMcaOnDataUpdatedEventData;
        getOutData: () => IMcaOnDataUpdatedOutData;
        getEventId: () => string;
        getOutputData: () => IMcaOnDataUpdatedOutDataResponse;
    }

    export interface IMcaOnDataUpdatedOutDataResponse {
        getUpdateType: () => string;
    }

    export interface IMcaOnDataUpdatedOutData {
        updateType: string;
    }
    export interface IMcaOnDataUpdatedEventData extends IMcaEventData {
        outData: IMcaOnDataUpdatedOutData;
        eventId: string;
        eventSource: string;
        result: string;
    }

    export interface IMcaEventData {
        channel: string;
        channelType: string;
        method: string;
        toolbarName: string;
        uuid: string;
    }

    export interface IMcaonOutgoingEventResponse extends IEventResponse {
        getResponseData(): IMcaOnOutgoingEventData;
    }

    export interface IMcaOnOutgoingEventData {
        getData: () => IMcaOnOutgoingEventPayloadData;
        getOutData: () => IMcaOnOutgoingEventOutData;
        getOutputData: () => IMcaOnOutgoingEventOutDataResponse;
    }

    export interface IMcaOnOutgoingEventPayloadData extends IMcaEventData {
        outData: IMcaOnOutgoingEventOutData;
        origin: string;
        windowName: string;
    }
    export interface IMcaOnOutgoingEventOutData {
        SVCMCA_ANI: string;
        SVCMCA_DISPLAY_NAME: string;
        SVCMCA_COMMUNICATION_DIRECTION: string;
        SVCMCA_CALL_ID: string;
        SVCMCA_CONTACT_ID: string;
        SVCMCA_CONTACT_JOB_TITLE: string;
        SVCMCA_INTERACTION_REF_OBJ_ID: string;
        SVCMCA_INTERACTION_REF_OBJ_TYPE: string;
        SVCMCA_ORG_ID: string;
    }

    export interface IMcaOnOutgoingEventOutDataResponse {
        getSVCMCA_ANI: () => string;
        getSVCMCA_DISPLAY_NAME: () => string;
        getSVCMCA_COMMUNICATION_DIRECTION: () => string;
        getSVCMCA_CALL_ID: () => string;
        getSVCMCA_CONTACT_ID: () => string;
        getSVCMCA_CONTACT_JOB_TITLE: () => string;
        getSVCMCA_INTERACTION_REF_OBJ_ID: () => string;
        getSVCMCA_INTERACTION_REF_OBJ_TYPE: () => string;
        getSVCMCA_ORG_ID: () => string;
    }
    export interface IMcaOnToolbarInteractionCommandEventResponse extends IEventResponse {
        getResponseData(): IMcaOnToolbarInteractionCommandDataResponse;
    }
    export interface IMcaOnToolbarAgentCommandEventResponse extends IEventResponse {
        getResponseData(): IMcaOnToolbarAgentCommandDataResponse;
    }
    export interface IMcaOnToolbarInteractionCommandDataResponse {
        getData(): IMcaOnToolbarInteractionCommandData;
        getEventId(): string;
        getCommand(): string;
        getSlot(): string;
        getInData(): any;
        getResult(): string;
        getResultDisplayString(): string;
        getOutdata(): any;
        setResult(value: string): void;
    }

    export interface IMcaOnToolbarAgentCommandDataResponse {
        getData(): IMcaOnToolbarAgentCommandData;
        getEventId(): string;
        getCommand(): string;
        getInData(): any;
        getResult(): string;
        getResultDisplayString(): string;
        getOutdata(): any;
        setOutdata(data: any): void;
        setResult(value: string): void;
    }

    export interface IMcaOnToolbarInteractionCommandData extends IMcaEventData {
        command: string;
        commandId: string;
        eventId: string;
        inData: any;
        outData: any;
        result: string;
        target: string;
        timeStamp: number;
        slot: string;
        resultDisplayString: string;
    }

    export interface IMcaOnToolbarAgentCommandData extends IMcaEventData {
        command: string;
        eventId: string;
        inData: any;
        outData: any;
        result: string;
        timeStamp: number;
        resultDisplayString: string;
    }

    export type IMCAGetConfigurationConfigTypes = string;
}

declare type IUiEventsFramework = CX_SVC_UI_EVENTS_FRAMEWORK.IUiEventsFramework;
declare type IUiEventsFrameworkProvider = CX_SVC_UI_EVENTS_FRAMEWORK.IUiEventsFrameworkProvider;
declare type ISubscriptionContext = CX_SVC_UI_EVENTS_FRAMEWORK.ISubscriptionContext;
declare type IContext = CX_SVC_UI_EVENTS_FRAMEWORK.IContext;
declare type IModalWindowContext = CX_SVC_UI_EVENTS_FRAMEWORK.IContext;
declare type IEventRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IEventRequest;
declare type IOperationRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IOperationRequest;
declare type IGlobalContext = CX_SVC_UI_EVENTS_FRAMEWORK.IGlobalContext;
declare type ITabContext = CX_SVC_UI_EVENTS_FRAMEWORK.ITabContext;
declare type IRecordContext = CX_SVC_UI_EVENTS_FRAMEWORK.IRecordContext;
declare type IRequestHelper = CX_SVC_UI_EVENTS_FRAMEWORK.IRequestHelper;
declare type IFieldValueChangeEventRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IFieldValueChangeEventRequest;
declare type IFieldValueChangeEventResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IFieldValueChangeEventResponse;
declare type ISetFieldValueOperationRequest = CX_SVC_UI_EVENTS_FRAMEWORK.ISetFieldValueOperationRequest;
declare type ISetFieldValueRequest = CX_SVC_UI_EVENTS_FRAMEWORK.ISetFieldValueRequest;
declare type IGetFieldValueOperationRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IGetFieldValueOperationRequest;
declare type IContextOpenEventResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IContextOpenEventResponse;
declare type ITabEventResponse = CX_SVC_UI_EVENTS_FRAMEWORK.ITabEventResponse;
declare type ITabCloseEventResponse = CX_SVC_UI_EVENTS_FRAMEWORK.ITabCloseEventResponse;
declare type IContextResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IContextResponse;
declare type ITabCloseOperationResponse = CX_SVC_UI_EVENTS_FRAMEWORK.ITabCloseOperationResponse;
declare type IGetFieldValueResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IGetFieldValueResponse;
declare type ISetFieldValueResponse = CX_SVC_UI_EVENTS_FRAMEWORK.ISetFieldValueResponse;
declare type IOnAfterSaveEventResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IOnAfterSaveEventResponse;
declare type ITabChangeEventResponse = CX_SVC_UI_EVENTS_FRAMEWORK.ITabChangeEventResponse;
declare type ITabChangeResponse = CX_SVC_UI_EVENTS_FRAMEWORK.ITabChangeResponse;
declare type ISaveRecordResponse = CX_SVC_UI_EVENTS_FRAMEWORK.ISaveRecordResponse;
declare type IErrorData = CX_SVC_UI_EVENTS_FRAMEWORK.IErrorData;
declare type IOperationSuccessData = CX_SVC_UI_EVENTS_FRAMEWORK.IOperationSuccessData;
declare type IObjectContext = CX_SVC_UI_EVENTS_FRAMEWORK.IObjectContext;
declare type ITabInfo = CX_SVC_UI_EVENTS_FRAMEWORK.ITabInfo;
declare type IExtensionResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IExtensionResponse;
declare type IEventResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IEventResponse;
declare type IOperationResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IOperationResponse;
declare type IFieldValueCollection = CX_SVC_UI_EVENTS_FRAMEWORK.IFieldValueCollection;
declare type IFieldData = CX_SVC_UI_EVENTS_FRAMEWORK.IFieldData;
declare type IOnAfterExtensionContext = CX_SVC_UI_EVENTS_FRAMEWORK.IOnAfterExtensionContext;
declare type IFieldValueChangeData = CX_SVC_UI_EVENTS_FRAMEWORK.IFieldValueChangeData;
declare type ICustomEventRequest = CX_SVC_UI_EVENTS_FRAMEWORK.ICustomEventRequest;
declare type ICustomEventResponse = CX_SVC_UI_EVENTS_FRAMEWORK.ICustomEventResponse;
declare type ICustomEventResponseData = CX_SVC_UI_EVENTS_FRAMEWORK.ICustomEventResponseData;
declare type ICustomEventSubscriptionRequest = CX_SVC_UI_EVENTS_FRAMEWORK.ICustomEventSubscriptionRequest;
declare type ICustomEventSubscriptionResponse = CX_SVC_UI_EVENTS_FRAMEWORK.ICustomEventSubscriptionResponse;
declare type ICustomEventSubscriptionResponseData = CX_SVC_UI_EVENTS_FRAMEWORK.ICustomEventSubscriptionResponseData;
declare type IFocusTabResponseData = CX_SVC_UI_EVENTS_FRAMEWORK.IFocusTabResponseData;
declare type IServiceConnectionRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IServiceConnectionRequest;
declare type IServiceConnectionResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IServiceConnectionResponse;
declare type IServiceConnectionResponseData = CX_SVC_UI_EVENTS_FRAMEWORK.IServiceConnectionResponseData;
declare type IServiceConnectionStatus = CX_SVC_UI_EVENTS_FRAMEWORK.IServiceConnectionStatus;
declare type IOpenModalWindowRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IOpenModalWindowRequest;
declare type IOpenPopupWindowRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IOpenPopupWindowRequest;
declare type IModalWindowOperationResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IModalWindowOperationResponse;
declare type IModalWindowOperationResponseData = CX_SVC_UI_EVENTS_FRAMEWORK.IModalWindowOperationResponseData;
declare type IPopupWindowOperationResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IPopupWindowOperationResponse;
declare type IPopupWindowOperationResponseData = CX_SVC_UI_EVENTS_FRAMEWORK.IPopupWindowOperationResponseData;
declare type ICloseModalWindowRequest = CX_SVC_UI_EVENTS_FRAMEWORK.ICloseModalWindowRequest;
declare type IClosePopupWindowRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IClosePopupWindowRequest;
declare type IUpdateSidePaneRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IUpdateSidePaneRequest;
declare type ISidePaneOpenEventResponse = CX_SVC_UI_EVENTS_FRAMEWORK.ISidePaneOpenEventResponse;
declare type ISidePaneData = CX_SVC_UI_EVENTS_FRAMEWORK.ISidePaneData;
declare type ISidePaneContext = CX_SVC_UI_EVENTS_FRAMEWORK.ISidePaneContext;
declare type ISidePaneCloseEventResponse = CX_SVC_UI_EVENTS_FRAMEWORK.ISidePaneCloseEventResponse;
declare type ISidePaneCloseData = CX_SVC_UI_EVENTS_FRAMEWORK.ISidePaneCloseData;
declare type IPopFlowRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IPopFlowRequest;
declare type IPopFlowInAppRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IPopFlowInAppRequest;
declare type IPopFlowGenericRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IPopFlowGenericRequest;
declare type IPopFlowAppUIRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IPopFlowAppUIRequest;
declare type IPopFlowResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IPopFlowResponse;
declare type IGetAgentInfoResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IGetAgentInfoResponse;
declare type IDataLoadEventResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IDataLoadEventResponse;
declare type IDataLoadEventData = CX_SVC_UI_EVENTS_FRAMEWORK.IDataLoadEventData;
declare type INotificationContext = CX_SVC_UI_EVENTS_FRAMEWORK.INotificationContext;
declare type INotificationActionEventResponse = CX_SVC_UI_EVENTS_FRAMEWORK.INotificationActionEventResponse;
declare type INotificationActionData = CX_SVC_UI_EVENTS_FRAMEWORK.INotificationActionData;
declare type INotificationCloseActionEventResponse = CX_SVC_UI_EVENTS_FRAMEWORK.INotificationCloseActionEventResponse;
declare type INotificationCloseActionData = CX_SVC_UI_EVENTS_FRAMEWORK.INotificationCloseActionData;
declare type INotificationActionPayload = CX_SVC_UI_EVENTS_FRAMEWORK.INotificationActionPayload;
declare type IShowNotificationRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IShowNotificationRequest;
declare type INotificationOperationResponse = CX_SVC_UI_EVENTS_FRAMEWORK.INotificationOperationResponse;
declare type INotificationOperationResponseData = CX_SVC_UI_EVENTS_FRAMEWORK.INotificationOperationResponseData;
declare type IMultiChannelAdaptorContext = CX_SVC_UI_EVENTS_FRAMEWORK.IMultiChannelAdaptorContext;
declare type ICommunicationChannelContext = CX_SVC_UI_EVENTS_FRAMEWORK.ICommunicationChannelContext;
declare type IPhoneContext = CX_SVC_UI_EVENTS_FRAMEWORK.IPhoneContext;
declare type IEngagementContext = CX_SVC_UI_EVENTS_FRAMEWORK.IEngagementContext;
declare type IMcaActionRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaActionRequest;
declare type IMcaNewCommEventActionRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaNewCommEventActionRequest;
declare type IMcaStartCommEventActionRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaStartCommEventActionRequest;
declare type IMcaCloseCommEventActionRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaCloseCommEventActionRequest;
declare type IMcaNewComActionResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaNewComActionResponse;
declare type IMcaStartComActionResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaStartComActionResponse;
declare type IMcaCloseComActionResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaCloseComActionResponse;
declare type IMcaNewComActionData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaNewComActionData;
declare type IMcaStartComActionData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaStartComActionData;
declare type IMcaCloseComActionData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaCloseComActionData;
declare type IMcaOutData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOutData;
declare type IMcaStartCommEventOutData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaStartCommEventOutData;
declare type IMcaCloseCommEventOutData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaCloseCommEventOutData;
declare type IMcaInData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaInData;
declare type IMcaInDataRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaInDataRequest;
declare type IMcaComEventActionData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaComEventActionData;
declare type IMcaNewComEventActionData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaNewComEventActionData;
declare type IMcaStartComEventActionData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaStartComEventActionData;
declare type IMcaCloseComEventActionData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaCloseComEventActionData;
declare type IMcaEngagementData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaEngagementData;
declare type IMcaOutDataResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOutDataResponse;
declare type IMcaCloseCommEventOutDataResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaCloseCommEventOutDataResponse;
declare type IMcaStartCommEventOutDataResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaStartCommEventOutDataResponse;
declare type IMcaCloseCommInDataRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaCloseCommInDataRequest;
declare type IMcaStartCommInDataRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaStartCommInDataRequest;
declare type IMcaStartCommInData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaStartCommInData;
declare type IMcaCloseCommInData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaCloseCommInData;
declare type IMcaGetConfigurationActionResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaGetConfigurationActionResponse;
declare type IMcaGetConfigurationActionResponseData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaGetConfigurationActionResponseData;
declare type IMcaDisableFeatureActionResponseData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaDisableFeatureActionResponseData;
declare type IMcaDisableFeatureActionResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaDisableFeatureActionResponse;
declare type IMCAGetConfigurationResponsePayload = CX_SVC_UI_EVENTS_FRAMEWORK.IMCAGetConfigurationResponsePayload;
declare type IMcaGetConfigurationActionRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaGetConfigurationActionRequest;
declare type IMCAGetConfigurationConfigTypes = CX_SVC_UI_EVENTS_FRAMEWORK.IMCAGetConfigurationConfigTypes;
declare type IMCAConfiguration = CX_SVC_UI_EVENTS_FRAMEWORK.IMCAConfiguration;
declare type IMCAGetConfiguration = CX_SVC_UI_EVENTS_FRAMEWORK.IMCAGetConfiguration;
declare type IMcaDisableFeatureActionRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaDisableFeatureActionRequest;
declare type IMcaReadyForOperationActionRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaReadyForOperationActionRequest;
declare type IMcaReadyForOperationActionResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaReadyForOperationActionResponse;
declare type IMcaReadyForOperationActionResponseData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaReadyForOperationActionResponseData;
declare type IMcaOnDataUpdatedEventResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOnDataUpdatedEventResponse;
declare type IMcaOnDataUpdatedData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOnDataUpdatedData;
declare type IMcaOnDataUpdatedOutData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOnDataUpdatedOutData;
declare type IMcaEventData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaEventData;
declare type IMcaOnDataUpdatedEventData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOnDataUpdatedEventData;
declare type IMcaOnDataUpdatedOutDataResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOnDataUpdatedOutDataResponse;
declare type IMcaonOutgoingEventResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaonOutgoingEventResponse;
declare type IMcaOnOutgoingEventData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOnOutgoingEventData;
declare type IMcaOnOutgoingEventPayloadData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOnOutgoingEventPayloadData;
declare type IMcaOnOutgoingEventOutData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOnOutgoingEventOutData;
declare type IMcaOnOutgoingEventOutDataResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOnOutgoingEventOutDataResponse;
declare type IMcaAgentStateEventActionResponseData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaAgentStateEventActionResponseData;
declare type IMCAAgentStateEventResponsePayload = CX_SVC_UI_EVENTS_FRAMEWORK.IMCAAgentStateEventResponsePayload;
declare type IMcaAgentStateEventActionResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaAgentStateEventActionResponse;
declare type IMcaAgentStateEventActionRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaAgentStateEventActionRequest;
declare type IMcaOutBoundCommErrorActionResponseData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOutBoundCommErrorActionResponseData;
declare type IMcaOutBoundCommErrorActionResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOutBoundCommErrorActionResponse;
declare type IMCAOutBoundCommErrorResponsePayload = CX_SVC_UI_EVENTS_FRAMEWORK.IMCAOutBoundCommErrorResponsePayload;
declare type IMcaOutboundCommErrorActionRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOutboundCommErrorActionRequest;
declare type IMcaEventRequest = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaEventRequest;
declare type IMcaOnToolbarInteractionCommandEventResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOnToolbarInteractionCommandEventResponse;
declare type IMcaOnToolbarInteractionCommandDataResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOnToolbarInteractionCommandDataResponse;
declare type IMcaOnToolbarInteractionCommandData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOnToolbarInteractionCommandData;
declare type IMcaOnToolbarAgentCommandEventResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOnToolbarAgentCommandEventResponse;
declare type IMcaOnToolbarAgentCommandDataResponse = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOnToolbarAgentCommandDataResponse;
declare type IMcaOnToolbarAgentCommandData = CX_SVC_UI_EVENTS_FRAMEWORK.IMcaOnToolbarAgentCommandData;
