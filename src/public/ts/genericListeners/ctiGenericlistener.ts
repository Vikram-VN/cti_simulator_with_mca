import { CtiChannelClientApp } from "../cti/ctiChannelClientApp";
import { uefChannel } from "../uef/uefChannel";
import {GenericUefApis} from "../uef/genericUefApis";

export class GenericListener {
    public registerGenericCtiListeners(clientAppCtiChannel: CtiChannelClientApp) {
        this.listenCallAcceptDeclineActions(clientAppCtiChannel);
        this.listenOutGoingCallEvent(clientAppCtiChannel);
    }

    /* Using NativeUef */
    // private async listenCallAcceptDeclineActions(clientAppCtiChannel: CtiChannelClientApp) {
    //     const notificationContext: INotificationContext = await uefChannel.frameworkProvider.getNotificationContext('notifId') as INotificationContext;
    //     const requestObject = uefChannel.frameworkProvider.requestHelper.createSubscriptionRequest('cxEventBusOnNotificationActionEvent');
    //     notificationContext.subscribe(requestObject, (res) => {
    //         const response: INotificationActionEventResponse = res as INotificationActionEventResponse;
    //         const action: string = response.getResponseData().getActionId();
    //         clientAppCtiChannel.ctiCallAcceptDeclineCommands({ action });
    //     });
    // }

    /* Using MCA */
    private async listenCallAcceptDeclineActions(clientAppCtiChannel: CtiChannelClientApp): Promise<any> {
        GenericUefApis.onToolbarInteractionCommand((eventResponse: any) => {
            const eventResponseDetails = eventResponse.responseDetails;
            // action can be accept, reject, disconnect, setActive
            const action: string = eventResponseDetails.command;
            console.log('action:', action);
            clientAppCtiChannel.ctiCallAcceptDeclineCommands({ action });
            eventResponseDetails.result = 'success';
            return new Promise((resolve, reject) => {
                resolve(eventResponseDetails);
            })
        })
    }

    private listenOutGoingCallEvent(clientAppCtiChannel: CtiChannelClientApp) {
        GenericUefApis.onOutgoingEvent((eventResponse: IEventResponse) => {
            clientAppCtiChannel.outGoingCall({ outGoingEvent: eventResponse });
        })
    }

}

export const genericListener = new GenericListener();
