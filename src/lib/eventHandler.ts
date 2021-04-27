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
import { RewinderInMessage, RewinderTopic } from './types';
import { status } from '../lib/data';
import { recordingState, startedState, stoppedState } from './state';


let state = recordingState;

export default (node: Node, filename: string, msg: RewinderInMessage): NodeMessage => {
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
        
        return state.handle(filename, node, msg);
    };