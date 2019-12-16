import craeteMultiAccountHash from './craeteMultiAccountHash';

export default (users: string, hash: string): boolean => {
    return craeteMultiAccountHash(users) === hash;
};
