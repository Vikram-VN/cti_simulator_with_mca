import { io, Socket } from "socket.io-client";
import { CtiCommands } from "./ctiCommands";
import { CtiTargets } from "./ctiTargets";
import { IRingData } from "../models/iRingData";

export class CtiChannelClientApp {
    private static CTI_EVENT: string = 'ctiEvent'
    private socket: Socket;
    private agentInfo: any;
    private ringReceivedCallback: Function;
    private hangupReceivedCallback: Function;
    private connectReceivedCallback: Function;
    private failReceivedCallback: Function;
    private acceptReceivedCallback: Function;
    private declineReceivedCallback: Function;
    private rejectReceivedCallback: Function;
    private endCallReceivedCallback: Function;
    private callAcceptReceived: Function;

    // ctiAdmin doesn't need login info. Assign it to empty object therefore.
    constructor(agentInfo: any = ko.observable({})) {
        this.agentInfo = agentInfo;
        this.socket = io();
        this.socket.on(CtiChannelClientApp.CTI_EVENT, (payload) => {
            if (payload.target == CtiTargets.APP) {
                if (this.isTargetCurrentAgentInfo(payload.agentId)) {
                    switch (payload.command) {
                        case CtiCommands.RING:
                            if (this.ringReceivedCallback) {
                                this.ringReceivedCallback(payload.ivrData);
                            }
                            break;
                        case CtiCommands.HANG_UP:
                            if (this.hangupReceivedCallback) {
                                this.hangupReceivedCallback();
                            }
                            break;
                        case CtiCommands.CONNECT:
                            if (this.connectReceivedCallback) {
                                this.connectReceivedCallback(payload.outGoingEventData);
                            }
                            break;
                        case CtiCommands.FAIL:
                            if (this.failReceivedCallback) {
                                this.failReceivedCallback(payload.outGoingEventData);
                            }
                            break;
                        case CtiCommands.ACCEPT:
                            if (this.acceptReceivedCallback) {
                                this.acceptReceivedCallback();
                            }
                            break;
                        case CtiCommands.DECLINE:
                            if (this.declineReceivedCallback) {
                                this.declineReceivedCallback();
                            }
                            break;
                        case CtiCommands.CALL_ACCEPT_REJEECT_DECLINE:
                            if (payload.action === 'accept' && this.acceptReceivedCallback) {
                                this.acceptReceivedCallback();
                            } else if (payload.action === 'decline' && this.declineReceivedCallback) {
                                this.declineReceivedCallback();
                            } else if (payload.action === 'reject' && this.rejectReceivedCallback) {
                                this.rejectReceivedCallback();
                            } else if (payload.action === 'disconnect' && this.endCallReceivedCallback) {
                                this.endCallReceivedCallback();
                            }
                        default:
                            break;
                    }
                }
            }
        });
    }

    private isTargetCurrentAgentInfo(agentId: string): boolean {
        return agentId === this.agentInfo().agentId &&
            this.agentInfo().isAvailable == true &&
            this.agentInfo().isLoggedIn == true;
    }

    onRingReceived(callback: Function): void {
        this.ringReceivedCallback = callback;
    }

    onHangupReceived(callback: Function): void {
        this.hangupReceivedCallback = callback;
    }

    onConnectReceived(callback: Function) {
        this.connectReceivedCallback = callback;
    }

    onFailReceived(callback: Function) {
        this.failReceivedCallback = callback;
    }

    onAcceptReceived(callback: Function) {
        this.acceptReceivedCallback = callback;
    }

    onDeclineReceived(callback: Function) {
        this.declineReceivedCallback = callback;
    }

    onRejectReceived(callback: Function) {
        this.rejectReceivedCallback = callback;
    }

    onEndCallReceived(callback: Function) {
        this.endCallReceivedCallback = callback;
    }

    onCallAcceptReceived(callback: Function) {
        this.callAcceptReceived = callback;
    }

    ctiCallAcceptDeclineCommands(data: any): void {
        let payload = {
            agentId: this.agentInfo().agentId,
            target: CtiTargets.ADMIN,
            command: CtiCommands.CALL_ACCEPT_DECLIEN_INTERACTION
        };
        payload = { ...data, ...payload };
        this.socket.emit(CtiChannelClientApp.CTI_EVENT, payload);
    }

    setAvailability(agentId: string, availability: boolean): void {
        const payload: any = { agentId, target: CtiTargets.ADMIN, command: CtiCommands.AVAILABILITY, availability };
        this.socket.emit(CtiChannelClientApp.CTI_EVENT, payload);
    }

    outGoingCall(outGoingDataPayload: any): void {
        let payload = {
            agentId: this.agentInfo().agentId,
            target: CtiTargets.ADMIN,
            command: CtiCommands.OUT_GOING_CALL
        };
        payload = { ...outGoingDataPayload, ...payload };
        this.socket.emit(CtiChannelClientApp.CTI_EVENT, payload);
    }

    dataUpdated(dataUpdatedPayload: any): void {
        let payload = {
            agentId: this.agentInfo().agentId,
            target: CtiTargets.ADMIN,
            command: CtiCommands.DATA_UPDATED
        };
        payload = { ...dataUpdatedPayload, ...payload };
        this.socket.emit(CtiChannelClientApp.CTI_EVENT, payload);
    }

    login(agentId: string): void {
        const payload: any = { agentId, target: CtiTargets.ADMIN, command: CtiCommands.LOGIN };
        this.socket.emit(CtiChannelClientApp.CTI_EVENT, payload);
    }

    logout(agentId: string): void {
        const payload: any = { agentId, target: CtiTargets.ADMIN, command: CtiCommands.LOGOUT };
        this.socket.emit(CtiChannelClientApp.CTI_EVENT, payload);
    }

}
