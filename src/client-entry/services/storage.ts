import identity from 'ramda/es/identity';
import pipe from 'ramda/es/pipe';
import defaultTo from 'ramda/es/defaultTo';

interface TStorage {
    termsAccepted: boolean;
    multiAccountUsers: Record<string, TUserStorageInfo>;
    multiAccountHash: string;
    multiAccountData: string;
}

interface TUserStorageInfo {
    lastLogin: number;
    name: string;
    settings?: Record<string, Partial<TUserSettings>>;
    matcherSign?: any;
}

interface TUserSettings {
    hasBackup: boolean;
    pinnedAssetIdList: Array<string>;
}

type TSerializer = {
    [Key in keyof TStorage]: (
        data: TStorage[Key]
    ) => TStorage[Key] extends undefined ? string | undefined : string;
};

type TParser = {
    [Key in keyof TStorage]: (data: string | null) => TStorage[Key];
};

class StorageService {
    public update(storage: Partial<TStorage>): void {
        Object.entries(storage).forEach(([key, value]) => {
            if (value != null) {
                this.set(key as keyof TStorage, value);
            }
        });
    }

    public set<Key extends keyof TStorage>(
        key: Key,
        value: TStorage[Key]
    ): void {
        localStorage.setItem(
            key,
            (StorageService.serializer[key] as any)(value)
        ); // TODO
    }

    public get<Key extends keyof TStorage>(key: Key): TStorage[Key] {
        return StorageService.parser[key](localStorage.getItem(key)) as any; // TODO
    }

    private static readonly serializer: TSerializer = {
        termsAccepted: (accepted) => String(accepted),
        multiAccountUsers: (data) => JSON.stringify(data),
        multiAccountHash: identity,
        multiAccountData: identity,
    };

    private static readonly parser: TParser = {
        termsAccepted: (accepted) => accepted === 'true',
        multiAccountUsers: (data) => JSON.parse(data ?? '{}'),
        multiAccountHash: pipe(identity, defaultTo('')),
        multiAccountData: pipe(identity, defaultTo('')),
    };
}

export const storage = new StorageService();
