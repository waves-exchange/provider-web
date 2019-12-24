import { TPrivateMultiaccountData } from '../interface';

const serializeUsers = JSON.stringify.bind(JSON);

export default (users: TPrivateMultiaccountData | string): string =>
    typeof users === 'string' ? users : serializeUsers(users);
