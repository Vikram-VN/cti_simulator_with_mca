import { uefChannel } from "../uef/uefChannel";
import {GenericUefApis} from "../uef/genericUefApis";

export class IncomingCallHandler {

    private contactDetails: { contactId: string, contactEmail: string, contactName: string, phoneNumber: string };
    private childTabsInitiatorPromiseResolve: Function | null;
    private popFlowPath: string;

    public async onRingReceivedHandler(ivrData: any, updateUserDetailsCalBack: Function, contactEmail?: string,) {
        // const mobileNumber = ivrData.SVCMCA_ANI;
        // await this.getContactDetails(mobileNumber, contactEmail);
        // await this.showNotification(this.contactDetails.contactName);
        this.contactDetails = { contactId: '', contactEmail: '', contactName: '', phoneNumber: '' };
        const mcaOutData: IMcaOutData = await GenericUefApis.newCommEvent(ivrData);
        this.contactDetails.contactName = (mcaOutData as any).SVCMCA_CONTACT_NAME ? (mcaOutData as any).SVCMCA_CONTACT_NAME : 'Unknown';
        this.contactDetails.phoneNumber = (mcaOutData as any).SVCMCA_CONTACT_PRIMARY_PHONE;
        this.contactDetails.contactEmail = (mcaOutData as any).SVCMCA_EMAIL;
        this.contactDetails.contactId = '';
        return this.contactDetails;
    }

    public async onCallConnectHandler() {
        // this.closeNotification();
        // this.handlePopFlow();
        // The above functionalities are used in Native UEF api
        const mcaOutData: IMcaOutData = await GenericUefApis.startCommEvent();
    }

    public async onCallEndHandler(reason: string) {
        // this.closeChildTabs(); // used with Native UEF api
        const mcaOutData: IMcaCloseCommEventOutData = await GenericUefApis.closeCommEvent(reason);
    }

    private async getContactDetails(mobileNumber: string, contactEmail?: string) {
        const restCallRequest: IServiceConnectionRequest = uefChannel.frameworkProvider.requestHelper.createPublishRequest('InvokeServiceConnection') as IServiceConnectionRequest;
        restCallRequest.setServiceConnectionId('contacts/getall_contacts');
        restCallRequest.setParameters({ 'fields': 'ContactName,MobileNumber,PartyNumber,EmailAddress', 'q': `MobileNumber=${mobileNumber}` });
        // restCallRequest.setParameters({ 'fields': 'ContactName,MobileNumber,PartyNumber,EmailAddress', 'q': 'EmailAddress=\'' + contactEmail + '\'' + 'and' + `MobileNumber=${mobileNumber}` });
        const globalContext = await uefChannel.globalContext;
        const restResponse: any = await globalContext.publish(restCallRequest) as IServiceConnectionResponse;
        const responseBody = restResponse.getResponseData().getBody();
        if (responseBody.status !== '200') {
            if (responseBody.count == 0) {
                this.popFlowPath = 'NO_MATCH';
                this.contactDetails = { contactId: '', contactEmail: '', contactName: 'Unknown Caller', phoneNumber: mobileNumber };
            } else if (responseBody.count == 1) {
                this.popFlowPath = 'SINGLE_MATCH';
                const contactId: string = responseBody.items[0].PartyNumber;
                const contactName: string = responseBody.items[0]['ContactName'];
                const phoneNumber: string = responseBody.items[0]['MobileNumber'];
                this.contactDetails = { contactId, contactEmail: '', contactName, phoneNumber };
            } else {
                console.log("MULTI MATCH");
                this.popFlowPath = 'MULTI_MATCH';
            }
        } else {
            this.contactDetails = { contactId: '', contactEmail: '', contactName: 'Unknown Caller', phoneNumber: mobileNumber };
        }

    }

    private async showNotification(contactName: string) {
        const notificationContext: INotificationContext = await uefChannel.frameworkProvider.getNotificationContext('notifId') as INotificationContext;
        const payload: IShowNotificationRequest = uefChannel.frameworkProvider.requestHelper.createPublishRequest('ShowNotification') as IShowNotificationRequest;
        payload.setPropagateToTabs(true);
        payload.setType('info');
        payload.setTitle('Incoming call');
        payload.setClosable(true);
        payload.setSummary(`${contactName} calling...`);
        payload.setActions([{ id: 'accept', name: 'Answer' }, { id: 'decline', name: 'Decline' }]);
        await notificationContext.publish(payload);
    }

    private async handlePopFlowForNoMatch() {
        const globalContext = await uefChannel.frameworkProvider.getCurrentBrowserTabContext();
        const payload: IPopFlowAppUIRequest = uefChannel.frameworkProvider.requestHelper.createPublishRequest('PopOperation') as IPopFlowAppUIRequest;
        payload.setFlow('sr');
        payload.setPage('svc-contact');
        payload.setApplicationUIName('service');
        payload.setOpenPageInNewBrowserTab(true);
        payload.setInputParameters({ 'selectedView': 'createContact' });
        const popResponse: IPopFlowResponse = await globalContext.publish(payload) as IPopFlowResponse;
        const tabContext: ITabContext = popResponse.getResponseData() as ITabContext;
        const contactRecord: IRecordContext = await tabContext.getActiveRecord() as IRecordContext;
        var sfvPayload: ISetFieldValueOperationRequest = uefChannel.frameworkProvider.requestHelper.createPublishRequest('cxEventBusSetFieldValueOperation') as ISetFieldValueOperationRequest;
        sfvPayload.field().setValue("Contact.MobileNumber", this.contactDetails.phoneNumber);
        await contactRecord.publish(sfvPayload);
        const oasPayload = uefChannel.frameworkProvider.requestHelper.createSubscriptionRequest('cxEventBusOnAfterSaveEvent');
        contactRecord.subscribe(oasPayload, () => {
            const getfieldValuePayloadd: IGetFieldValueOperationRequest = uefChannel.frameworkProvider.requestHelper.createPublishRequest('cxEventBusGetFieldValueOperation') as IGetFieldValueOperationRequest;
            getfieldValuePayloadd.setFields(["Contact.PrimaryContactPartyName", "Contact.PartyId"]);
            contactRecord.publish(getfieldValuePayloadd).then((message) => {
                const response = message as IGetFieldValueResponse
                const contactPartyId: any = response.getResponseData().getField("Contact.PartyId");
                this.popCreateSrAndLinkContact(contactPartyId.value);
            });
        });
    }

    private async handlePopFlow() {
        switch (this.popFlowPath) {
            case 'NO_MATCH':
                await this.handlePopFlowForNoMatch();
                break;
            case 'SINGLE_MATCH':
                await this.handlePopFlowForSingleMatch();
                break;
            case 'MULTI_MATCH':
                break;
        }
    }

    private async handlePopFlowForSingleMatch() {
        const globalContext = await uefChannel.frameworkProvider.getCurrentBrowserTabContext();
        const payload: IPopFlowAppUIRequest = uefChannel.frameworkProvider.requestHelper.createPublishRequest('PopOperation') as IPopFlowAppUIRequest;
        payload.setFlow('sr');
        payload.setPage('svc-interaction');
        payload.setApplicationUIName("service");
        payload.setOpenPageInNewBrowserTab(true);
        payload.setInputParameters({ 'selectedView': 'defaultView', 'SVCMCA_CONTACT_NUMBER': this.contactDetails.contactId, 'SVCMCA_DISPLAY_NAME': this.contactDetails.contactName });
        const popResponse: IPopFlowResponse = await globalContext.publish(payload) as IPopFlowResponse;
        const tabContext: ITabContext = popResponse.getResponseData();
        const contactRecord = await tabContext.getActiveRecord();

        const getfieldValuePayload = uefChannel.frameworkProvider.requestHelper.createPublishRequest('cxEventBusGetFieldValueOperation') as IGetFieldValueOperationRequest;
        getfieldValuePayload.setFields(["Contact.PrimaryContactPartyName", "Contact.PartyId"]);
        const gfvResponse = await contactRecord.publish(getfieldValuePayload) as IGetFieldValueResponse;
        const contactPartyId: any = gfvResponse.getResponseData().getField("Contact.PartyId");
        this.popCreateSrAndLinkContact(contactPartyId.value)
    }

    private async popCreateSrAndLinkContact(contactPartyId: string) {
        const payload: IPopFlowInAppRequest = uefChannel.frameworkProvider.requestHelper.createPublishRequest('PopOperation') as IPopFlowInAppRequest;
        payload.setRecordType("ServiceRequest");
        payload.setOpenPageInNewBrowserTab(true);
        const globalContext = await uefChannel.frameworkProvider.getCurrentBrowserTabContext();
        const popResponse: IPopFlowResponse = await globalContext.publish(payload) as IPopFlowResponse;
        const tabContext = popResponse.getResponseData();
        const srRecord = await tabContext.getActiveRecord();

        if (contactPartyId) {
            var titleSfvPayload: ISetFieldValueOperationRequest = uefChannel.frameworkProvider.requestHelper.createPublishRequest('cxEventBusSetFieldValueOperation') as ISetFieldValueOperationRequest;
            titleSfvPayload.field().setValue("ServiceRequest.Title", "Title Form UEF CTI");
            titleSfvPayload.field().setValue("ServiceRequest.PrimaryContactPartyId", contactPartyId.toString());
            await srRecord.publish(titleSfvPayload);
        }
    }


    private async closeNotification() {
        let notificationContext: INotificationContext = await uefChannel.frameworkProvider.getNotificationContext('notifId');
        const requestObject: IOperationRequest = uefChannel.frameworkProvider.requestHelper.createPublishRequest('CloseNotification') as IOperationRequest;
        requestObject.setPropagateToTabs(true);
        await notificationContext.publish(requestObject);
    }


    private async getChildTabs(selectedTab: any, grandChildren: any) {
        return new Promise(async (resolve, reject) => {
            if (!grandChildren) {
                grandChildren = [];
                this.childTabsInitiatorPromiseResolve = resolve;
            }
            const newChildTabs = await selectedTab.getDependentTabs();
            grandChildren = grandChildren.concat(newChildTabs);
            newChildTabs.forEach(async (child: any) => {
                await this.getChildTabs(child, grandChildren);
            });
            if (newChildTabs.length === 0) {
                (this.childTabsInitiatorPromiseResolve as Function)(grandChildren);
                return;
            }
        })

    }

    private async closeChildTabs() {
        this.childTabsInitiatorPromiseResolve = null;
        const globalContext = await uefChannel.frameworkProvider.getCurrentBrowserTabContext();
        const childTabsList: any[] = [];
        this.getChildTabs(globalContext, null).then((childTabs: any) => {
            if (childTabs) {
                const payload = uefChannel.frameworkProvider.requestHelper.createPublishRequest('cxEventBusCloseTabOperation');
                childTabs.forEach((selectedChildTabContext: any, i: any) => {
                    if (selectedChildTabContext.getTabInfo().tabId !== 'mcatbwin') {
                        selectedChildTabContext.publish(payload).then((message: any) => {
                            childTabsList.push = message.responseDetails.data.payload.tabId;
                        }).catch((error: any) => {
                            console.log(error.message);
                        });
                    }
                })
            }
        })
    }
}

export const incomingCallHandler = new IncomingCallHandler();
