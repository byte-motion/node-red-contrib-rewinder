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
import { play, playbackState, record } from './playback';
import { RewinderInMessage, RewinderStateType } from './types';
import { status } from './data';


export type RewinderState = {
    type: RewinderStateType;
    handle: (
        filename: string,
        node: Node,
        msg: RewinderInMessage
    ) => NodeMessageInFlow | undefined;
    transitionTo: (node: Node, newState: RewinderState) => RewinderState;
};

export const startedState: RewinderState = {
    type: RewinderStateType.STARTED,
    handle: (
        filename: string,
        node: Node,
        msg: RewinderInMessage
    ): undefined => {
        play(filename, node, msg)
            .then(() => {
                currentState.value = recordingState;
                node.status(status.RECORDING);
            })
            .catch(err => node.error(err));
        return undefined;
    },
    transitionTo: (node: Node, newState: RewinderState): RewinderState => {
        if (newState.type === RewinderStateType.RECORDING) {
            playbackState.rs?.close();
            playbackState.rs = undefined;
        }
        node.status(newState.type);
        return newState;
    }
};

export const stoppedState: RewinderState = {
    type: RewinderStateType.STOPPED,
    handle: (
        _filename: string,
        _node: Node,
        _msg: RewinderInMessage
    ): undefined => undefined,
    transitionTo: (node: Node, newState: RewinderState): RewinderState => {
        node.status(newState.type);
        return newState;
    }
};


export const recordingState: RewinderState = {
    type: RewinderStateType.RECORDING,
    handle: (
        filename: string,
        node: Node,
        msg: RewinderInMessage
    ): NodeMessageInFlow => {
        record(filename, node, msg);
        return msg;
    },
    transitionTo: (node: Node, newState: RewinderState): RewinderState => {
        if (newState.type === RewinderStateType.STARTED) {
            playbackState.ws?.close();
            playbackState.ws = undefined;
        }
        node.status(newState.type);
        return newState;
    }
};

let state: RewinderState = recordingState;

export const currentState = {
    get value(): RewinderState {
        return state;
    },
    set value(v: RewinderState) {
        state = v;
    }
};