import { uefChannel } from "../uef/uefChannel";
import {GenericUefApis} from "../uef/genericUefApis";

export class OutgoingCallHandler {

    private contactDetails: { contactId: string, contactEmail: string, contactName: string, phoneNumber: string };

    public async onConnectReceivedHandler(outGoingEventData: any) {
        GenericUefApis.setEventId(outGoingEventData.responseDetails.uuid);
        const customerInData = {
            ...outGoingEventData.responseDetails.outData,
            'callData': {
                "phoneLineId": "1",
                "eventId": GenericUefApis.getEventId(),
            },
            'SVCMCA_COMMUNICATION_DIRECTION': 'ORA_SVC_OUTBOUND',
            'SVCMCA_WRAPUP_TIMEOUT': '',
            'appClassification': ''
        };

        this.contactDetails = { contactId: '', contactEmail: '', contactName: '', phoneNumber: '' };
        const mcaOutData: IMcaOutData = await GenericUefApis.newCommEvent(customerInData);
        this.contactDetails.contactName = (mcaOutData as any).SVCMCA_CONTACT_NAME ? (mcaOutData as any).SVCMCA_CONTACT_NAME : 'Unknown';
        this.contactDetails.phoneNumber = (mcaOutData as any).SVCMCA_CONTACT_PRIMARY_PHONE;
        this.contactDetails.contactEmail = (mcaOutData as any).SVCMCA_EMAIL;
        this.contactDetails.contactId = '';
        return this.contactDetails;
    }

}

export const outgoingCallHandler = new OutgoingCallHandler();


