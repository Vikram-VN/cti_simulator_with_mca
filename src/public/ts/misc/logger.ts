export class Logger {

    messages: any = ko.observableArray([]);

    public static log(data: any): void {
        console.log(data);
    }

    public static error(error: any): void {
        console.error(error);
    }
    
    addToMessages(title: string, content: any): void {
        if(typeof (content) == 'string') {
            this.messages.push({ title, content });
        } else {
            let stringContent: string;
            try {
                stringContent = JSON.stringify(content, null, 4);
            } catch(e) {
                try {
                    stringContent = content.toString();
                }catch(e) {
                    stringContent = 'NA';
                }
            }
            this.messages.push({ title, content: stringContent });
        }
    }
}
