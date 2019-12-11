import Loader from '../components/loader';
import { Modal } from '../components/Modal';
import React from 'react';

export default function(): React.ReactElement {
    return (
        <Modal>
            <Loader />
        </Modal>
    );
}
