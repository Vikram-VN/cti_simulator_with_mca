import { io, Socket } from "socket.io-client";
import { CtiCommands } from "./ctiCommands";
import { CtiTargets } from "./ctiTargets";
import { IRingData } from "../models/iRingData";

export class CtiChannelEndUser {
    private static CTI_EVENT: string = 'ctiEvent'
    private socket: Socket;
    private readonly selfType: CtiTargets;
    private agentInfo: any;
    private dataUpdatedReceivedCallback: Function;
    private callAcceptDeclineInteractionReceivedCallback: Function;
    private onLoginReceivedCallback: Function;
    private onLogoutReceivedCallback: Function;
    private onSetAvailabilityReceivedCallback: Function;
    private outGoingCallReceivedCallback: Function;

    constructor(agentInfo: any = ko.observable({})) {
        this.agentInfo = agentInfo;
        this.socket = io();
        this.socket.on(CtiChannelEndUser.CTI_EVENT, (payload) => {
            if (payload.target == CtiTargets.ADMIN) {
                switch (payload.command) {
                    case CtiCommands.LOGIN:
                        console.log('Login Received from.', payload.agentId);
                        this.onLoginReceivedCallback(payload.agentId);
                        break;
                    case CtiCommands.LOGOUT:
                        console.log('Logout Received from.', payload.agentId);
                        this.onLogoutReceivedCallback(payload.agentId);
                        break;
                    case CtiCommands.AVAILABILITY:
                        console.log(`Availability for ${payload.agentId} setTo ${payload.availability}.`);
                        this.onSetAvailabilityReceivedCallback(payload.agentId);
                        break;
                    case CtiCommands.OUT_GOING_CALL:
                        console.log(payload);
                        this.outGoingCallReceivedCallback(payload);
                        break;
                    case CtiCommands.DATA_UPDATED:
                        this.dataUpdatedReceivedCallback(payload);
                        break;
                    case CtiCommands.CALL_ACCEPT_DECLIEN_INTERACTION:
                        this.callAcceptDeclineInteractionReceivedCallback(payload);
                        break;
                    default:
                        console.log('Unknown Command');
                        break;
                }
            }
        });
    }

    ring(iRingData: IRingData): void {
        const payload: any = { ...iRingData, target: CtiTargets.APP, command: CtiCommands.RING };
        this.socket.emit(CtiChannelEndUser.CTI_EVENT, payload);
    }

    hangup(agentId: string): void {
        const payload: any = { agentId, target: CtiTargets.APP, command: CtiCommands.HANG_UP };
        this.socket.emit(CtiChannelEndUser.CTI_EVENT, payload);
    }

    connect(agentId: any, outGoingEventData: any) {
        console.log('connect clicked');
        const payload: any = { agentId, outGoingEventData, target: CtiTargets.APP, command: CtiCommands.CONNECT };
        this.socket.emit(CtiChannelEndUser.CTI_EVENT, payload);
    }

    fail(agentId: string, outGoingEventData: any) {
        console.log('fail clicked');
        const payload: any = { agentId, outGoingEventData, target: CtiTargets.APP, command: CtiCommands.FAIL };
        this.socket.emit(CtiChannelEndUser.CTI_EVENT, payload);
    }

    accept(agentId: string): void {
        console.log('accepted')
        const payload: any = { agentId, target: CtiTargets.APP, command: CtiCommands.ACCEPT };
        this.socket.emit(CtiChannelEndUser.CTI_EVENT, payload);
    }

    decline(agentId: string): void {
        console.log('decline');
        const payload: any = { agentId, target: CtiTargets.APP, command: CtiCommands.DECLINE };
        this.socket.emit(CtiChannelEndUser.CTI_EVENT, payload);
    }

    callAcceptRejectDeclineActions(payload: any) {
        payload.target = CtiTargets.APP;
        payload.command = CtiCommands.CALL_ACCEPT_REJEECT_DECLINE;
        this.socket.emit(CtiChannelEndUser.CTI_EVENT, payload);
    }

    onCallAcceptDeclineInteractionReceived(callback: Function): void {
        this.callAcceptDeclineInteractionReceivedCallback = callback;
    }

    onOutGoingCallReceived(callback: Function): void {
        this.outGoingCallReceivedCallback = callback;
    }

    onDataUpdatedReceived(callback: Function): void {
        this.dataUpdatedReceivedCallback = callback;
    }

    onLoginReceived(callback: Function) {
        this.onLoginReceivedCallback = callback;
    }

    onLogoutReceived(callback: Function) {
        this.onLogoutReceivedCallback = callback;
    }

    onSetAvailabilityReceived(callback: Function) {
        this.onSetAvailabilityReceivedCallback = callback;
    }
}
