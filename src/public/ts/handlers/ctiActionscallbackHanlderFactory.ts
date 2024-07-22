import { CallDirection } from "../enums/callDirection";
import { incomingCallHandler } from "./incomingCallHandler";
import {GenericUefApis} from "../uef/genericUefApis";
import {outgoingCallHandler} from "./outgoingCallHandler";

export class CtiActionsCallbackHandlerFactory {

    private updateUserDetails: Function;
    private enableCallConnected: Function;
    private disableCallConnected: Function;

    constructor(updateUserDetailsCb: Function, enableCallConnectedUiCb: Function, disableCallConnectedUiCb: Function) {
        this.updateUserDetails = updateUserDetailsCb;
        this.enableCallConnected = enableCallConnectedUiCb;
        this.disableCallConnected = disableCallConnectedUiCb;
    }

    public async onRingReceivedCallback(ivrData: any) {
        const handler: any = this.getHandler(CallDirection.INCOMING);
        const userDetails: { contactId: string, contactEmail: string, contactName: string, phoneNumber: string } =
            await handler.onRingReceivedHandler(ivrData);
        this.updateUserDetails(userDetails.contactName, userDetails.phoneNumber, userDetails.contactEmail);
    }

    public async onConnectReceivedCallback(outGoingEventData: any) {
        const handler: any = this.getHandler(CallDirection.OUTGOING);
        const userDetails: { contactId: string, contactEmail: string, contactName: string, phoneNumber: string } =
            await handler.onConnectReceivedHandler(outGoingEventData);
        this.updateUserDetails(userDetails.contactName, userDetails.phoneNumber, userDetails.contactEmail);
    }

    public onCallConnectedCallback() {
        const handler: any = this.getHandler(CallDirection.INCOMING);
        handler.onCallConnectHandler();
        this.enableCallConnected();
    }

    public onCallDeclinedCallback() {
        const handler: any = this.getHandler(CallDirection.INCOMING);
        handler.onCallEndHandler('MISSED');
        this.disableCallConnected();
    }

    public onCallEndCallCallback() {
        const handler: any = this.getHandler(CallDirection.INCOMING);
        handler.onCallEndHandler('WRAPUP');
        this.disableCallConnected();
    }

    public onCallRejectedCallback() {
        const handler: any = this.getHandler(CallDirection.INCOMING);
        handler.onCallEndHandler('REJECT');
        this.disableCallConnected();
    }

    private getHandler(type: CallDirection) {
        switch (type) {
            case CallDirection.INCOMING:
                return incomingCallHandler;
            case CallDirection.OUTGOING:
                return outgoingCallHandler;
        }
    }
}
