import {Subscription} from './subscription';
import {User} from './user';

export interface Transaction {
    _id : string,
    date: string,
    date_end: string,
    type: string,
    reference: string,
    path: string,
    name_subscription: string,
    price_subscription: number,
    user: User | string,
    subscription : Subscription | string,
}

