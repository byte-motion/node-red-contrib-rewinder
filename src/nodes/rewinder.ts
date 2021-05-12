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
import fs from 'fs';
import { NodeAPI, NodeAPISettingsWithData, Node, NodeMessageInFlow, NodeMessage } from 'node-red';
import eventHandler from '../lib/eventHandler';
import { RewinderConfig, RewinderInMessage } from '../lib/types';
import { status } from '../lib/data';
import { getDataDir, getDailyLogFile } from '../lib/utils';
import { playbackState } from '../lib/playback';
import { currentState, recordingState } from '../lib/state';


export = (api: NodeAPI<NodeAPISettingsWithData>): void =>
    api.nodes.registerType('rewinder', function (this: Node, config: RewinderConfig) {
        const node: Node = this;
        api.nodes.createNode(this, config);
        // Restart in recording
        currentState.value = recordingState;
        node.status(status[currentState.value.type]);
        const dataDir = getDataDir(api);
        if (fs.existsSync(dataDir) === false) {
            fs.mkdirSync(dataDir);
        }
        node.on('input', (
            msg: RewinderInMessage | NodeMessageInFlow,
            send: (msg: NodeMessage | Array<NodeMessage | null>) => void,
            done: (err?: Error) => void,
        ) => {
            try {
                const filename = getDailyLogFile(
                    api,
                    node,
                    dataDir,
                    msg as RewinderInMessage,
                    config.filenamePrefixOverride
                );
                const outMessage = eventHandler(node, filename, msg as RewinderInMessage);
                if (outMessage) {
                    (send || node.send)(outMessage);
                }
                (done || (() => { }))();
            }
            catch (err) {
                (e => done ? done(e) : node.error(e, msg))(err);
            }
        });
        node.on('close', () => {
            playbackState.ws?.close();
            playbackState.rs?.close();
            playbackState.ws = undefined;
            playbackState.rs = undefined;
        });
    });
