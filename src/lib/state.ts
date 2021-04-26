import { NodeMessageInFlow, Node } from 'node-red';
import { RewinderInMessage } from './types';


export enum RewinderStateType {
    STARTED = 'STARTED',
    STOPPED = 'STOPPED',
    RECORDING = 'RECORDING'
};

export type RewinderState = {
    type: RewinderStateType;
    handle: (node: Node, msg: RewinderInMessage) => NodeMessageInFlow;
    transitionTo: (newState: RewinderState) => RewinderState;
};

export const startedState: RewinderState = {
    type: RewinderStateType.STARTED,
    handle: (_node: Node, _msg: RewinderInMessage): NodeMessageInFlow => {
        // TODO: READ FROM FILE
        return {} as NodeMessageInFlow;
    },
    transitionTo: (newState: RewinderState): RewinderState => {
        if (newState.type === RewinderStateType.STOPPED) {
            // TODO: Stop reading
        }
        return newState;
    }
};

export const stoppedState: RewinderState = {
    type: RewinderStateType.STOPPED,
    handle: (_node: Node, _msg: RewinderInMessage): NodeMessageInFlow => {
        // TODO: READ FROM FILE
        return {} as NodeMessageInFlow;
    },
    transitionTo: (newState: RewinderState): RewinderState => {
        return newState;
    }
};

export const recordingState: RewinderState = {
    type: RewinderStateType.RECORDING,
    handle: (_node: Node, _msg: RewinderInMessage): NodeMessageInFlow => {
        // TODO: WRITE TO FILE
        return {} as NodeMessageInFlow;
    },
    transitionTo: (newState: RewinderState): RewinderState => {
        if (newState.type === RewinderStateType.STARTED) {
            // TODO: Stop recording
        }
        return newState;
    }
};