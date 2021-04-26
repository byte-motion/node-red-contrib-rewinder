import { NodeStatus } from 'node-red';
import { RewinderTopic } from './types';

export const status = {
    [RewinderTopic.START]: {
        fill: 'green',
        shape: 'dot',
        text: 'Started'
    } as NodeStatus,
    [RewinderTopic.STOP]: {
        fill: 'yellow',
        shape: 'ring',
        text: 'Stopped'
    } as NodeStatus,
    recording: {
        fill: 'red',
        shape: 'dot',
        text: 'Recording'
    } as NodeStatus
};