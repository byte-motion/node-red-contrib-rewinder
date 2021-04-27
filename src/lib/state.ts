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
import { record } from './playback';
import { RewinderInMessage } from './types';


export enum RewinderStateType {
    STARTED = 'STARTED',
    STOPPED = 'STOPPED',
    RECORDING = 'RECORDING'
};

export type RewinderState = {
    type: RewinderStateType;
    handle: (
        filename: string,
        node: Node,
        msg: RewinderInMessage
    ) => NodeMessageInFlow;
    transitionTo: (newState: RewinderState) => RewinderState;
};

export const startedState: RewinderState = {
    type: RewinderStateType.STARTED,
    handle: (
        _filename: string,
        _node: Node,
        _msg: RewinderInMessage
    ): NodeMessageInFlow => {
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
    handle: (
        _filename: string,
        _node: Node,
        _msg: RewinderInMessage
    ): NodeMessageInFlow => {
        // TODO: READ FROM FILE
        return {} as NodeMessageInFlow;
    },
    transitionTo: (newState: RewinderState): RewinderState => {
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
        return {} as NodeMessageInFlow;
    },
    transitionTo: (newState: RewinderState): RewinderState => {
        if (newState.type === RewinderStateType.STARTED) {
            // TODO: Stop recording
        }
        return newState;
    }
};