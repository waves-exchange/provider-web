import React = require('react');
import { Text } from '@waves.exchange/react-uikit';


export const Recipient = ({ recipient }: { recipient: string }): React.ReactElement => (<Text color="#fff">{recipient.replace(/alias:.:/, '')}</Text>)
