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
import { Node, NodeMessage } from 'node-red';
import { RewinderInMessage, RewinderTopic } from './types';;
import { recordingState, startedState, stoppedState } from './stateMachine';
import { RewinderNodeState } from './state';


export default (
    node: Node,
    state: RewinderNodeState,
    filename: string,
    msg: RewinderInMessage
): NodeMessage | undefined => {
    switch (msg.topic) {
        case RewinderTopic.START:
            state.rewinderState = state.rewinderState.transitionTo(node, state, startedState);
            return state.rewinderState.handle(filename, node, state, msg);
        case RewinderTopic.STOP:
            state.rewinderState = state.rewinderState.transitionTo(node, state, stoppedState);
            const result = state.rewinderState.handle(filename, node, state, msg);
            // Do not record stop message
            state.rewinderState = state.rewinderState.transitionTo(node, state, recordingState);
            return result;
        default:
            return state.rewinderState.handle(filename, node, state, msg);
    }

};