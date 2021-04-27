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
import path from 'path';
import { NodeAPI, NodeAPISettingsWithData, NodeDef, Node, NodeMessageInFlow, NodeMessage } from 'node-red';
import eventHandler from '../lib/eventHandler';
import { RewinderInMessage } from '../lib/types';
import { status } from '../lib/data';

const getDataDir = (api: NodeAPI<NodeAPISettingsWithData>): string =>
    path.join(
        (api.settings.userDir || process.env.HOME) as string,
        'rewinder'
    );

const getDailyLogFile = (api: NodeAPI<NodeAPISettingsWithData>, node: Node, dataDir: string): string => {
    const prefix = node['wires']
        .map(([w]) => api.nodes.getNode(w))
        .map((n: Node) => `${n.name || n.type}[${n.id}]`)
        .join('-');
    const [day] = new Date().toISOString().split('T');

    return path.join(
        dataDir,
        `${prefix}-${day}.log`
    );
};

export = (api: NodeAPI<NodeAPISettingsWithData>): void =>
    api.nodes.registerType('rewinder', function (this: Node, config: NodeDef) {
        const node: Node = this;
        api.nodes.createNode(this, config);
        node.status(status.recording);
        const dataDir = getDataDir(api);
        if (fs.existsSync(dataDir) === false) {
            fs.mkdirSync(dataDir);
        }
        node.on('input', (
            msg: NodeMessageInFlow,
            send: (msg: NodeMessage | Array<NodeMessage | null>) => void,
            done: (err?: Error) => void,
        ) => {
            try {
                const filename = getDailyLogFile(api, node, dataDir);
                const outMessage = eventHandler(node, filename, msg as RewinderInMessage);
                (send || node.send)(outMessage);
                (done || (() => { }))();
            }
            catch (err) {
                (e => done ? done(e) : node.error(e, msg))(err);
            }
        });
    });
