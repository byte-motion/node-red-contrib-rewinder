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
import { NodeMessageInFlow } from 'node-red';
import { play, record, stop } from './playback';
import { RewinderInMessage, RewinderNode, RewinderStateType } from './types';
import { status } from './data';


export type RewinderState = {
    type: RewinderStateType;
    handle: (
        filename: string,
        node: RewinderNode,
        msg: RewinderInMessage
    ) => NodeMessageInFlow | undefined;
    transitionTo: (node: RewinderNode, newState: RewinderState) => RewinderState;
};

export const startedState: RewinderState = {
    type: RewinderStateType.STARTED,
    handle: (
        filename: string,
        node: RewinderNode,
        msg: RewinderInMessage
    ): undefined => {
        play(filename, node, msg)
            .then(() => {
                node.state.rewinderState = startedState.transitionTo(node, recordingState);
            })
            .catch(err => node.error(err));
        return undefined;
    },
    transitionTo: (node: RewinderNode, newState: RewinderState): RewinderState => {
        stop(node);
        node.status(status[newState.type]);
        return newState;
    }
};

export const stoppedState: RewinderState = {
    type: RewinderStateType.STOPPED,
    handle: (
        _filename: string,
        _node: RewinderNode,
        _msg: RewinderInMessage
    ): undefined => undefined,
    transitionTo: (node: RewinderNode, newState: RewinderState): RewinderState => {
        node.status(status[newState.type]);
        return newState;
    }
};

export const recordingState: RewinderState = {
    type: RewinderStateType.RECORDING,
    handle: (
        filename: string,
        node: RewinderNode,
        msg: RewinderInMessage
    ): NodeMessageInFlow | undefined => {
        record(filename, node, msg);

        return msg;
    },
    transitionTo: (node: RewinderNode, newState: RewinderState): RewinderState => {
        if (newState.type === RewinderStateType.STARTED) {
            node.state.playbackState.ws?.close();
            node.state.playbackState.ws = undefined;
        }
        node.status(status[newState.type]);
        return newState;
    }
};
