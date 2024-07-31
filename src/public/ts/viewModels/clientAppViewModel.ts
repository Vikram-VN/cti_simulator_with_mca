import { uefChannel } from '../uef/uefChannel';
import { Logger } from '../misc/logger';
import { CtiChannelClientApp } from "../cti/ctiChannelClientApp";
import { genericListener } from '../genericListeners/ctiGenericlistener';
import { Utilities } from '../misc/utilities';
import { CtiActionsCallbackHandlerFactory } from '../handlers/ctiActionscallbackHanlderFactory';
import {GenericUefApis} from "../uef/genericUefApis";

/*
* This viewModel is used in toolbar application */
export class ClientAppViewModel {
    private ctiCallBackHandler: CtiActionsCallbackHandlerFactory;
    clientAppCtiChannel: CtiChannelClientApp;
    agentInfo: any = ko.observable({
        agentId: '',
        isAvailable: false,
        isLoggedIn: false,
    });
    isAgentBusy: boolean = false;
    showAcceptOrRejectDialog: any = ko.observable(false);
    callerDetails: any = ko.observable({
        name: 'Unknown',
        number: '',
        email: '',
    });
    eventId: string;
    outDataFromNewComm: Record<string, any>;
    isOutgoingCall: any = ko.observable(false);
    showEndButton: any = ko.observable(false);
    logger: Logger;
    loggerVisibility: any = ko.observable(false);
    callTimer: any;
    timerValue: any = ko.observable('');
    constructor() {
        this.initialize();
        addEventListener('beforeunload', (event) => {
            Logger.log('beforeunload');
            this.clientAppCtiChannel.logout(this.agentInfo().agentId);
        });
    }

    private async initialize() {

        this.logger = new Logger();
        this.showEndButton.subscribe((newValue: boolean) => {
            let seconds: number = 0;
            if (newValue) {
                this.callTimer = setInterval(() => {
                    seconds++;
                    this.timerValue(Utilities.secondsToHMS(seconds));
                }, 1000)
            } else {
                clearInterval(this.callTimer);
                this.timerValue('');
            }
        })
        /*
         * CTI INTEGRATION INITIALIZATION STARTS
         * Initialize the channels
         * Set Agent Info
         * Initialize the callBack handler to handle each CTI actions
         * Subscribe to all CTI generic events from Fusion app
         * */
        await uefChannel.initialize();
        this.clientAppCtiChannel = new CtiChannelClientApp(this.agentInfo);
        /* To get details like agentId and set agent state to available */
        await this.setAgentInfo();

        /*
        * Subscribe to Service center events like Click on a Phone number
        * or press Answer / Decline / EndCall button press or Wrap-up Save
        * button press.
        * */
        this.ctiCallBackHandler = new CtiActionsCallbackHandlerFactory(this.updateUserDetails, this.enableCallConnectedUI, this.disableCallConnectedUI);
        genericListener.registerGenericCtiListeners(this.clientAppCtiChannel);

        /* a socket channel that wires client app, end user page and server */

        /* APIs exposed to register callback when an event generated from end user */
        /*
        * The below listeners are called when an event is triggered in the partner communication
        * channel The simulator uses socket.io in the clientAppCtiChannel. As an example the partner's
        * function analogous to onRingReceived can be hooked here. So the below code will become
        * PartnerChannel.onRingReceived((ivrData: any) => {...})
        * */
        this.clientAppCtiChannel.onRingReceived((ivrData: any) => {
            console.log('onRingReceived');
            if (this.isAgentBusy) {
                return;
            }
            this.enableRingReceivedUI();
            this.ctiCallBackHandler.onRingReceivedCallback(ivrData);
        });

        this.clientAppCtiChannel.onAcceptReceived(() => {
            this.ctiCallBackHandler.onCallConnectedCallback();
        });

        this.clientAppCtiChannel.onDeclineReceived(() => {
            this.ctiCallBackHandler.onCallDeclinedCallback();
        });

        this.clientAppCtiChannel.onRejectReceived(() => {
            this.ctiCallBackHandler.onCallRejectedCallback();
        });

        this.clientAppCtiChannel.onEndCallReceived(() => {
            this.ctiCallBackHandler.onCallEndCallCallback();
        })

        this.clientAppCtiChannel.onHangupReceived(() => {
            this.ctiCallBackHandler.onCallEndCallCallback();
        });

        this.clientAppCtiChannel.onConnectReceived(async (outGoingEventData: any) => {
            console.log('onConnectReceived', outGoingEventData);
            this.ctiCallBackHandler.onConnectReceivedCallback(outGoingEventData);
            this.enableRingReceivedUI(true);
        });

        this.clientAppCtiChannel.onFailReceived((outGoingEventData: any) => {

        });

    }

    /*
     * Button press from the Toolbar View
     */
    public acceptRejectEnd(action: string) {
        switch (action) {
            case 'accept':
                this.ctiCallBackHandler.onCallConnectedCallback();
                break;
            case 'reject':
                this.ctiCallBackHandler.onCallDeclinedCallback();
                break;
            case 'end':
                this.ctiCallBackHandler.onCallEndCallCallback();
                break;
            default:
                break;
        }
    }


    /*
     * ACTION: part of initialisation two apis are called sequentially */
    async setAgentInfo(): Promise<void> {
        const mcaGetConfigurationActionResponseData: IMcaGetConfigurationActionResponseData = await GenericUefApis.getConfiguration();
        const isSuccess: boolean = mcaGetConfigurationActionResponseData.isSuccess();
        if (isSuccess) {
            const mcaGetConfiguration: IMCAGetConfiguration = mcaGetConfigurationActionResponseData.getConfiguration();
            this.agentInfo({
                agentId: mcaGetConfiguration.getAgentId() + '_' + Utilities.randomNumberBetween(1000, 9999),
                isAvailable: true,
                isLoggedIn: true,
            });
            this.clientAppCtiChannel.login(this.agentInfo().agentId);
            this.clientAppCtiChannel.setAvailability(this.agentInfo().agentId, true);
            await this.toggleAvailability(true);
        }
    };

    private async toggleAvailability(newValue: boolean | null = null): Promise<void> {
        if(this.isAgentBusy) {
            Logger.log('agent is busy');
            this.logger.addToMessages('agent is busy', '');
            return;
        }
        const newAgentInfo: any = this.agentInfo();
        const newAvailability = newValue === null ? !this.agentInfo().isAvailable : newValue;
        const mcaAgentStateEventActionResponseData: IMcaAgentStateEventActionResponseData = await GenericUefApis.agentStateEvent(newAvailability);
        this.logger.addToMessages('agentStateEventOperation', mcaAgentStateEventActionResponseData.getData());
        if (mcaAgentStateEventActionResponseData.isSuccess()) {
            newAgentInfo.isAvailable = newAvailability;
            this.agentInfo(newAgentInfo);
            this.clientAppCtiChannel.setAvailability(this.agentInfo().agentId, newAvailability);
        } else {
            Logger.log('agentStateEvent > result !== success');
        }
    }


    private updateUserDetails = (contactName: string, number: string, emailId: string) => {
        this.callerDetails({
            name: contactName,
            number: number,
            email: emailId,
        });
        // this.showEndButton(false);
        // this.isOutgoingCall(false);
        // this.showAcceptOrRejectDialog(true);
    }

    private enableCallConnectedUI = () => {
        this.isOutgoingCall(false);
        this.showEndButton(true);
        this.isAgentBusy = true;
    }

    private disableCallConnectedUI = () => {
        this.showAcceptOrRejectDialog(false);
        this.showEndButton(false);
        this.isOutgoingCall(false);
        this.isAgentBusy = false;
    }

    private enableRingReceivedUI = (isOutgoingCall: boolean = false) => {
        this.isAgentBusy = true;
        this.isOutgoingCall(isOutgoingCall);
        this.showAcceptOrRejectDialog(true);
    }
}



