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
import { NodeMessage } from 'node-red';
import { RewinderInMessage, RewinderNode, RewinderTopic } from './types';;
import { recordingState, startedState, stoppedState } from './stateMachine';


export default (
    node: RewinderNode,
    filename: string,
    msg: RewinderInMessage
): NodeMessage | undefined => {
    switch (msg.topic) {
        case RewinderTopic.START:
            node.state.rewinderState = node.state.rewinderState.transitionTo(node, startedState);
            return node.state.rewinderState.handle(filename, node, msg);
        case RewinderTopic.STOP:
            node.state.rewinderState = node.state.rewinderState.transitionTo(node, stoppedState);
            const result = node.state.rewinderState.handle(filename, node, msg);
            // Do not record stop message
            node.state.rewinderState = node.state.rewinderState.transitionTo(node, recordingState);
            return result;
        default:
            return node.state.rewinderState.handle(filename, node, msg);
    }

};