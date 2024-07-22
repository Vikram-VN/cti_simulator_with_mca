import { CtiTargets } from "../cti/ctiTargets";
import axios, { isCancel, AxiosError, AxiosResponse } from 'axios';
import { agentStatus } from "../../../routes/globals";
import { CtiChannelEndUser } from "../cti/ctiChannelEndUser";
import { Logger } from "../misc/logger";

export class CtiAdminViewModel {
    endUserCtiChannel: CtiChannelEndUser;
    agentStatus: any = ko.observableArray([]);
    messages: any = ko.observableArray([]);
    dataUpdatedMessages: any = ko.observableArray([{
        message: ''
    }]);
    ivrData: any = ko.observableArray([
        { key: 'SVCMCA_ANI', value: '62738490' },
        // { key: 'SVCMCA_SR_NUM', value: 'SR0000082184' },
    ]);
    shouldFail = ko.observable(false);
    selectedAgent = ko.observable({});
    logger: Logger;
    showAcceptDeclineHangupWidget: any = ko.observable(false);
    callingAgent: any = ko.observable('');
    isOnCall: any = ko.observable(false);
    loggerVisibility: any = ko.observable(false);
    constructor() {
        this.logger = new Logger();
        this.initialize();
        this.getAgentStatus();
    }

    public addEntryToIvrData() {
        this.ivrData.push({ key: '', value: '' })
    }

    private initialize() {

        this.endUserCtiChannel = new CtiChannelEndUser();

        this.endUserCtiChannel.onOutGoingCallReceived((payload: any) => {
            console.log('onOutGoingCallReceived')
            const agentStatus = this.agentStatus();
            let specificAgent = agentStatus.find((agent: any) => agent.agentId === payload.agentId);
            specificAgent['outGoingEventData'] = payload.outGoingEvent;
            if (payload.agentId != (this.selectedAgent() as any).agentId) {
                return;
            }
            if (!this.shouldFail()) {
                this.callingAgent(payload.agentId);
                this.endUserCtiChannel.connect(this.callingAgent(), payload.outGoingEvent);
                this.showAcceptDeclineHangupWidget(true);
            } else {
                this.endUserCtiChannel.fail(payload.agentId, payload.outGoingEvent);
            }
            const eventId = payload.outGoingEvent.responseDetails.uuid;
            this.logger.addToMessages(`OutGoingEvent: ${eventId}`, payload.outGoingEvent.responseDetails.outData)
        });

        this.endUserCtiChannel.onDataUpdatedReceived((payload: any) => {
            const updateType = payload.dataUpdated.responseDetails.outData?.updateType;
            this.logger.addToMessages(`DataUpdatedEvent: ${updateType}`, payload.dataUpdated.responseDetails.outData)
        });

        this.endUserCtiChannel.onCallAcceptDeclineInteractionReceived((payload: any) => {
            this.endUserCtiChannel.callAcceptRejectDeclineActions(payload);
            switch(payload.action) {
                case 'disconnect':
                    this.showAcceptDeclineHangupWidget(false);
                    this.isOnCall(false);
                    break;
                default:
                    break;
            }
        });

        this.endUserCtiChannel.onLoginReceived((agentId: string) => {
            const agentStatusList: any = this.agentStatus();
            let specificAgent: any = agentStatusList.find((agent: any) => agent.agentId === agentId);
            if (!specificAgent) {
                this.agentStatus.push({
                    agentId, isAvailable: false,
                });
            }
        });

        this.endUserCtiChannel.onLogoutReceived((agentId: string) => {
            this.agentStatus.remove((agentStatus: any) => agentStatus.agentId == agentId);
        });

        this.endUserCtiChannel.onSetAvailabilityReceived((agentId: string, isAvailable: boolean) => {
            const agentStatusList: any = this.agentStatus();
            let specificAgent: any = agentStatusList.find((agent: any) => agent.agentId === agentId);
            if (specificAgent) {
                specificAgent.isAvailable = isAvailable;
                this.agentStatus(agentStatusList);
            }
        })
    }

    private ivrDataToObject() {
        const ivrDataArray = this.ivrData();
        const ivrDataObject: Record<string, string> = {};
        ivrDataArray.forEach((ele: { key: any; value: any; }) => {
            ivrDataObject[ele.key] = ele.value;
        });
        return ivrDataObject;
    }

    private getAgentStatus(): void {
        axios.get('/cti-simulator/apis/agent-status')
            .then((response: AxiosResponse<any>) => {
                response.data.forEach((agentDetails: any) => this.agentStatus.push(agentDetails));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    private ringClick() {
        console.log('ringClick', this.selectedAgent())
        this.endUserCtiChannel.ring({
            agentId: (this.selectedAgent() as any).agentId,
            ivrData: this.ivrDataToObject()
        });
    }

    private hangupClick() {
        console.log('hangupClick', this.selectedAgent())
        this.endUserCtiChannel.hangup((this.selectedAgent() as any).agentId);
    }

    private acceptClick() {
        this.endUserCtiChannel.accept(this.callingAgent());
        this.isOnCall(true);
    }

    private declineClick() {
        this.endUserCtiChannel.decline(this.callingAgent());
        this.isOnCall(false);
        this.showAcceptDeclineHangupWidget(false);
    }

    private hangupOutgoingClick() {
        this.endUserCtiChannel.hangup(this.callingAgent());
        this.isOnCall(false);
        this.showAcceptDeclineHangupWidget(false);
    }

    toggleLoggerVisibility() {
        const visibility = this.loggerVisibility();
        this.loggerVisibility(!visibility);
    }
}
