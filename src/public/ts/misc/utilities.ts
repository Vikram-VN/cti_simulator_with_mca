export class Utilities {

    public static randomNumber(length: number): number {
        // Implement it
        return 316;
    }

    public static randomNumberBetween(min: number, max: number): string {
        return Math.floor(Math.random() * (max - min + 1) + min).toString();
    }

    public static generateEventId(): string {

        return `${Utilities.generateRandomString(8)}-${Utilities.generateRandomString(4)}-${Utilities.generateRandomString(4)}-${Utilities.generateRandomString(4)}-${Utilities.generateRandomString(12)}`;
    }

    public static generateRandomString(length: any) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    public static secondsToHMS(d: number) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = h > 0 ? h + (h == 1 ? " : " : " : ") : "0 : ";
        var mDisplay = m > 0 ? m + (m == 1 ? " : " : " : ") : "0 : ";
        var sDisplay = s > 0 ? s : "";
        return hDisplay + mDisplay + sDisplay;
    }

}
