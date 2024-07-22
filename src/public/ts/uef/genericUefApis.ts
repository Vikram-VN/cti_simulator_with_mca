import {uefChannel} from "./uefChannel";
import {Utilities} from "../misc/utilities";

/**
 * This class covers the MCA APIs required for a complete inbound and outbound call
 * Once a call is initiated the event ID will be same for the entire call. For each
 * and every interaction API call the UUID will be different.
 */
export class GenericUefApis {
    private static eventId: string;
    private static outDataFromNewComm: Record<string, any>;

    static newCommEvent(inData: Record<string, any> = {}): Promise<IMcaOutData> {
        return new Promise((resolve: Function, reject: Function) => {
            const request: IMcaNewCommEventActionRequest = uefChannel.frameworkProvider.requestHelper.createPublishRequest('newCommEvent') as IMcaNewCommEventActionRequest;
            /**
             * Every call whether it is inbound or outbound will have a newCommEvent. For inbound calls
             * the eventId will be a random string. For outbound call, the uuid in the payload from onToolbarInteractionCommand
             * event from the fusion application is the event ID. An event ID will be constant for an entire interaction
             * See 'this.clientAppCtiChannel.onConnectReceived' in ClientAppViewModel.ts
             * More on README.md > "SECTION*
             */
            if (!GenericUefApis.eventId) {
                GenericUefApis.eventId = Utilities.generateEventId();
            }
            /**
             * For outbound call the data from the outGoingEvent is passed as the newCommEvent inData.
             */
            for (let key in inData) {
                request.getInData().setInDataValueByAttribute(key, inData[key]);
            }
            request.setEventId(GenericUefApis.eventId);
            request.setAppClassification('ORA_SERVICE');
            console.log('newCommEventRequest', request);
            uefChannel.phoneContext.publish(request).then((operationResponse: IOperationResponse) => {
                console.log('newCommEvent', operationResponse);
                const mcaNewComActionData: IMcaNewComActionData = (operationResponse as IMcaNewComActionResponse).getResponseData();
                const mcaOutData: IMcaOutData = mcaNewComActionData.getOutData();
                /**
                 * The outData from the newCommEvent action is saved in this class which will be used in
                 * startCommEvent and closeCommEvent actions.
                 */
                GenericUefApis.outDataFromNewComm = mcaOutData;
                resolve(mcaOutData);
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        });
    }

    static startCommEvent(): Promise<IMcaOutData> {
        return new Promise((resolve: Function, reject: Function) => {
            const acceptRequest: IMcaStartCommEventActionRequest = uefChannel.frameworkProvider.requestHelper.createPublishRequest('startCommEvent') as IMcaStartCommEventActionRequest;
            for (const property in GenericUefApis.outDataFromNewComm) {
                acceptRequest.getInData().setInDataValueByAttribute(property, GenericUefApis.outDataFromNewComm[property]);
            }
            acceptRequest.setEventId(GenericUefApis.eventId);
            acceptRequest.setAppClassification('ORA_SERVICE');
            uefChannel.phoneContext.publish(acceptRequest).then((operationResponse: IOperationResponse) => {
                console.log('startCommEvent', operationResponse);
                const mcaOutData: IMcaStartCommEventOutData = (operationResponse as IMcaStartComActionResponse).getResponseData().getOutData();
                resolve(mcaOutData);
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        });
    }

    static closeCommEvent(reason: string): Promise<IMcaCloseCommEventOutData> {
        return new Promise((resolve: Function, reject: Function) => {
            const hangupRequest: IMcaCloseCommEventActionRequest = uefChannel.frameworkProvider.requestHelper.createPublishRequest('closeCommEvent') as IMcaCloseCommEventActionRequest;
            hangupRequest.setReason(reason);
            for (const property in this.outDataFromNewComm) {
                hangupRequest.getInData().setInDataValueByAttribute(property, GenericUefApis.outDataFromNewComm[property]);
            }
            hangupRequest.setEventId(this.eventId);
            hangupRequest.setAppClassification('ORA_SERVICE');
            uefChannel.phoneContext.publish(hangupRequest).then((operationResponse) => {
                console.log('closeCommEvent', operationResponse);
                const mcaCloseCommEventOutData: IMcaCloseCommEventOutData = (operationResponse as IMcaCloseComActionResponse).getResponseData().getOutData();
                resolve(mcaCloseCommEventOutData);
                this.eventId = '';
                this.outDataFromNewComm = {};
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        });
    }

    static agentStateEvent(newAvailability: boolean): Promise<IMcaAgentStateEventActionResponseData> {
        return new Promise((resolve: Function, reject: Function) => {
            const stateCd = newAvailability ? 'AVAILABLE' : 'UNAVAILABLE'
            const stateDisplayString = newAvailability ? 'Idle' : 'On Break. Lunch break';
            const reasonDisplayString = newAvailability ? 'Idle' : 'On Break';
            const inData: Record<string, any> = { 'phoneLineId': '1' };
            const reasonCd: any = null;
            // start uef
            const requestObject: IMcaAgentStateEventActionRequest =
                uefChannel.frameworkProvider.requestHelper
                    .createPublishRequest('agentStateEventOperation') as IMcaAgentStateEventActionRequest;
            requestObject.setEventId('1');
            requestObject.setIsAvailable(newAvailability);
            requestObject.setIsLoggedIn(true); //this.agentInfo().isLoggedIn
            requestObject.setState(stateCd);
            requestObject.setStateDisplayString(stateDisplayString);
            requestObject.setReason(reasonCd);
            requestObject.setReasonDisplayString(reasonDisplayString);
            requestObject.setInData(inData);
            uefChannel.phoneContext.publish(requestObject).then((operationResponse: IOperationResponse) => {
                console.log('agentStateEventOperation', operationResponse);
                const mcaAgentStateEventActionResponseData: IMcaAgentStateEventActionResponseData =
                    (operationResponse as IMcaAgentStateEventActionResponse).getResponseData();
                resolve(mcaAgentStateEventActionResponseData);
            }).catch((error: any) => {
                console.error(error);
                reject(error);
            });
        });
    }

    static getConfiguration(): Promise<IMcaGetConfigurationActionResponseData> {
        return new Promise( (resolve: Function, reject: Function) => {
            const requestObject: IMcaGetConfigurationActionRequest = uefChannel.frameworkProvider.requestHelper.createPublishRequest('getConfigurationOperation') as IMcaGetConfigurationActionRequest;
            requestObject.setConfigType('TOOLBAR');
            uefChannel.phoneContext.publish(requestObject).then((operationResponse: IOperationResponse ) => {
                console.log('getConfiguration', operationResponse);
                const mcaGetConfigurationActionResponseData: IMcaGetConfigurationActionResponseData = (operationResponse as IMcaGetConfigurationActionResponse).getResponseData();
                resolve(mcaGetConfigurationActionResponseData);
            }).catch((error: any) => {
                console.error(error);
                reject(error);
            });
        })
    }

    static outboundCommError(errorCode: string, errorMessage: string): Promise<IMCAOutBoundCommErrorResponsePayload> {
        return new Promise((resolve: Function, reject: Function) => {
            const request = uefChannel.frameworkProvider.requestHelper.createPublishRequest('outboundCommError');
            (request as any).setCommUuid(GenericUefApis.eventId);
            (request as any).setErrorCode(errorCode);
            (request as any).setErrorMsg(errorMessage);
            uefChannel.phoneContext.publish(request).then((operationResponse: IOperationResponse) => {
                console.log('outboundCommError', operationResponse);
                const mcaOutBoundCommErrorResponsePayload: IMCAOutBoundCommErrorResponsePayload = (operationResponse as IMcaOutBoundCommErrorActionResponse).getResponseData().getData()
                resolve(mcaOutBoundCommErrorResponsePayload);
            }).catch((error: any) => {
                console.error(error);
                reject(error);
            });
        });
    }

    static onOutgoingEvent(callback: (response: IEventResponse) => void): void {
        const requestForOutGoing: any = uefChannel.frameworkProvider.requestHelper.createSubscriptionRequest('onOutgoingEvent');
        requestForOutGoing.setAppClassification('ORA_SERVICE');
        uefChannel.phoneContext.subscribe(requestForOutGoing, callback);
    }

    static onToolbarInteractionCommand(callback: (response: IEventResponse) => void): void {
        const requestForOutGoing: any = uefChannel.frameworkProvider.requestHelper.createSubscriptionRequest('onToolbarInteractionCommand');
        uefChannel.phoneContext.subscribe(requestForOutGoing, callback);
    }

    static onToolbarAgentCommand(callback: (response: IEventResponse) => void): void {
        const requestForOutGoing: any = uefChannel.frameworkProvider.requestHelper.createSubscriptionRequest('onToolbarAgentCommand');
        uefChannel.phoneContext.subscribe(requestForOutGoing, callback);
    }

    static onDataUpdated(callback: (response: IEventResponse) => void) {
        const requestForOutGoing: any = uefChannel.frameworkProvider.requestHelper.createSubscriptionRequest('onDataUpdated');
        requestForOutGoing.setAppClassification('ORA_SERVICE');
        uefChannel.phoneContext.subscribe(requestForOutGoing, callback);
    }

    static setEventId(eventId: string): void {
        GenericUefApis.eventId = eventId;
    }

    static getEventId(): string {
        return GenericUefApis.eventId;
    }
}
