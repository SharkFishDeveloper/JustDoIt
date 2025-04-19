export interface PurchasedPack {
    id: string; // e.g., "premium-1", "premium-2"
    dailyMoodLevel?: string;
    notificationTopic?: string;
    notificationMood?: string;
}

export  interface UserInterface{
    name:string,
    email:string,
    imageUrl:string,
    purchasePack:PurchasedPack
}
