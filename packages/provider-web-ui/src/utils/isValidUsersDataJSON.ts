import { createMultiAccountHash } from './createMultiAccountHash';

export default (users: string, hash: string): boolean => {
    return createMultiAccountHash(users) === hash;
};
