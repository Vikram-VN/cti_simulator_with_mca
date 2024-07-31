import { Logger } from "../misc/logger";

class UefChannel {
    private _uefClient: any;
    private _frameworkProvider: IUiEventsFrameworkProvider;
    private _mcaContext: IMultiChannelAdaptorContext;
    private _phoneContext: ICommunicationChannelContext;
    constructor() {

    }
    public async initialize(): Promise<any> {
        try {
            this._uefClient = await this.initUefClient();
            Logger.log('Initialized UEF client');
        } catch (error) {
            console.error('Failed to initialize UEF client:', error);
            return Promise.reject('Initialization of UEF client failed');
        }
    
        try {
            this._frameworkProvider = await this._uefClient.uiEventsFramework.initialize('test');
            Logger.log('Initialized frameworkProvider');
        } catch (error) {
            console.error('Failed to initialize frameworkProvider:', error);
            return Promise.reject('Initialization of frameworkProvider failed');
        }
    
        try {
            this._mcaContext = await this._frameworkProvider.getMultiChannelAdaptorContext();
            Logger.log('Got mcaContext');
        } catch (error) {
            console.error('Failed to get mcaContext:', error);
            return Promise.reject('Retrieval of mcaContext failed');
        }
    
        try {
            this._phoneContext = await this._mcaContext.getCommunicationChannelContext('PHONE');
            Logger.log('Got phoneContext');
        } catch (error) {
            console.error('Failed to get phoneContext:', error);
            return Promise.reject('Retrieval of phoneContext failed');
        }
    
        return Promise.resolve();
    }
    
    public get phoneContext(): ICommunicationChannelContext {
        return this._phoneContext;
    }

    public get frameworkProvider(): IUiEventsFrameworkProvider {
        return this._frameworkProvider;
    }

    public get globalContext(): Promise<IGlobalContext> {
        return this._frameworkProvider.getGlobalContext();
    }

    private initUefClient(): Promise<any> {
        return new Promise((resolve: Function, reject: Function) => {
            const script = document.createElement('script');
            script.src = 'https://static.oracle.com/cdn/ui-events-framework/libs/ui-events-framework-client.js'
            script.async = true;
            document.body.appendChild(script);
            script.onload = () => {
                console.log('UEF Client script is injected and available as CX_SVC_UI_EVENTS_FRAMEWORK.');
                resolve((window as any).CX_SVC_UI_EVENTS_FRAMEWORK);
            };
            script.onerror = (error) => {
                console.log('UEF Client script load error');
                reject('UEF Client script load error');
            };
        });
    }

}
export const uefChannel: UefChannel = new UefChannel();
