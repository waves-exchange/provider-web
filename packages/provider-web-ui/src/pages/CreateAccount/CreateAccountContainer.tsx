import React, { FC, MouseEventHandler, useCallback } from 'react';
import { CreateAccountComponent } from './CreateAccountComponent';
import { analytics } from '../../utils/analytics';

type CreateAccountProps = {
    onCancel(): void;
    isIncognito: boolean;
};

export const CreateAccount: FC<CreateAccountProps> = ({ onCancel, isIncognito }) => {
    const handleClose = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        analytics.send({ name: 'Create_Account_Page_Close' });

        onCancel();
    }, [onCancel]);

    return (
        <CreateAccountComponent onClose={handleClose} isIncognito={isIncognito} />
    );
};
