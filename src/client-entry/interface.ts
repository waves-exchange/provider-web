import { IUser } from '../interface';

export interface IState<USER = IUser | null> {
    user: USER;
    needConfirm: boolean;
    networkByte: number;
    nodeUrl: string;
    matcherUrl: string;
}

export type TPrivateMultiaccountData = Record<string, TPrivateUserData>;
export type TPrivateUserData =
    | IPrivateSeedUserData
    | IPrivateKeeperUserData
    | IPrivateLedgerUserData;

export interface IPrivateUserDataBase {
    networkByte: number;
    publicKey: string;
}

export interface IPrivateSeedUserData extends IPrivateUserDataBase {
    seed: string;
    userType: 'seed';
}

export interface IPrivateKeeperUserData extends IPrivateUserDataBase {
    userType: 'keeper';
}

export interface IPrivateLedgerUserData extends IPrivateUserDataBase {
    userType: 'ledger';
}

export interface IUserStorageInfo {
    lastLogin: number;
    name: string;
    settings?: Record<string, Partial<IUserSettings>>;
    matcherSign?: any;
}

export interface IUserSettings {
    hasBackup: boolean;
    pinnedAssetIdList: Array<string>;
}
