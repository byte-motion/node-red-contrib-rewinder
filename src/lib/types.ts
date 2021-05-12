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
import { Node, NodeDef, NodeMessageInFlow } from 'node-red';
import { RewinderNodeState } from './state';

export type RewinderInMessagePayload = {
    startTime?: number;
    endTime?: number;
};

export type RewinderInMessage = {
    topic: RewinderTopic;
    payload?: RewinderInMessagePayload;
} & NodeMessageInFlow;

export enum RewinderTopic {
    START = 'REWINDER_START',
    STOP = 'REWINDER_STOP'
};

export enum RewinderStateType {
    STARTED = 'STARTED',
    STOPPED = 'STOPPED',
    RECORDING = 'RECORDING'
};

export type RewinderNode = { 
    state: RewinderNodeState;
} & Node;

export type RewinderConfig = {
    filenamePrefixOverride: string;
} & NodeDef;