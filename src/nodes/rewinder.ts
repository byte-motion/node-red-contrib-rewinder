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
import { NodeAPI, NodeAPISettingsWithData, NodeDef, Node, NodeMessageInFlow, NodeMessage } from 'node-red';
import eventHandler from '../lib/eventHandler';
import { RewinderInMessage } from '../lib/types';
import { status } from '../lib/data';

export = (RED: NodeAPI<NodeAPISettingsWithData>): void =>
    RED.nodes.registerType('rewinder', function (this: Node, config: NodeDef) {
        const node: Node = this;
        RED.nodes.createNode(this, config);
        node.status(status.recording);
        node.on('input', (
            msg: NodeMessageInFlow,
            send: (msg: NodeMessage | Array<NodeMessage | null>) => void,
            done: (err?: Error) => void,
        ) => {
            try {
                const outMessage = eventHandler(node, msg as RewinderInMessage);
                (send || node.send)(outMessage);
                (done || (() => { }))();
            }
            catch (err) {
                (e => done ? done(e) : node.error(e, msg))(err);
            }
        });
    });
