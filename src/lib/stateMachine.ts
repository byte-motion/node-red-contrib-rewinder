/**
 * Copyright 2021 Byte Motion AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import { NodeMessageInFlow, Node } from 'node-red';
import { play, record, stop } from './playback';
import { RewinderInMessage, RewinderStateType } from './types';
import { status } from './data';
import { RewinderNodeState } from './state';


export type RewinderState = {
    type: RewinderStateType;
    handle: (
        filename: string,
        node: Node,
        state: RewinderNodeState,
        msg: RewinderInMessage
    ) => NodeMessageInFlow | undefined;
    transitionTo: (node: Node, state: RewinderNodeState, newState: RewinderState) => RewinderState;
};

export const startedState: RewinderState = {
    type: RewinderStateType.STARTED,
    handle: (
        filename: string,
        node: Node,
        state: RewinderNodeState,
        msg: RewinderInMessage
    ): undefined => {
        play(filename, node, state, msg)
            .then(() => {
                state.rewinderState = startedState.transitionTo(node, state, recordingState);
            })
            .catch(err => node.error(err));
        return undefined;
    },
    transitionTo: (node: Node, state: RewinderNodeState, newState: RewinderState): RewinderState => {
        stop(node, state);
        node.status(status[newState.type]);
        return newState;
    }
};

export const stoppedState: RewinderState = {
    type: RewinderStateType.STOPPED,
    handle: (
        _filename: string,
        _node: Node,
        _state: RewinderNodeState,
        _msg: RewinderInMessage
    ): undefined => undefined,
    transitionTo: (node: Node, _state: RewinderNodeState, newState: RewinderState): RewinderState => {
        node.status(status[newState.type]);
        return newState;
    }
};

export const recordingState: RewinderState = {
    type: RewinderStateType.RECORDING,
    handle: (
        filename: string,
        node: Node,
        state: RewinderNodeState,
        msg: RewinderInMessage
    ): NodeMessageInFlow | undefined => {
        record(filename, node, state, msg);

        return msg;
    },
    transitionTo: (node: Node, state: RewinderNodeState, newState: RewinderState): RewinderState => {
        if (newState.type === RewinderStateType.STARTED) {
            state.playbackState.ws?.close();
            state.playbackState.ws = undefined;
        }
        node.status(status[newState.type]);
        return newState;
    }
};
