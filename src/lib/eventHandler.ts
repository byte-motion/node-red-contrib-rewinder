import { Node, NodeMessage } from 'node-red';
import { RewinderInMessage, RewinderTopic } from './types';
import { status } from '../lib/data';
import { recordingState, startedState, stoppedState } from './state';


let state = recordingState;

export default (node: Node, msg: RewinderInMessage): NodeMessage => {
    node.debug(`Received msg: ${JSON.stringify(msg, null, 2)}`);
    node.status(status[msg.topic] || status.recording);

    switch (msg.topic) {
        case RewinderTopic.START:
            state = state.transitionTo(startedState);
            break;
        case RewinderTopic.STOP:
            state = state.transitionTo(stoppedState);
            break;
    }
    return state.handle(node, msg);
};