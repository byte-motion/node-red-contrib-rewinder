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
import path from 'path';
import { Node, NodeAPI, NodeAPISettingsWithData } from 'node-red';


export const getDataDir = (api: NodeAPI<NodeAPISettingsWithData>): string =>
    path.join(
        (api.settings.userDir || process.env.HOME) as string,
        'rewinder'
    );

export const getDailyLogFile = (api: NodeAPI<NodeAPISettingsWithData>, node: Node, dataDir: string): string => {
    const prefix = node['wires']
        .map(([w]) => api.nodes.getNode(w))
        .map((n: Node) => `${n.name || n.type}(${n.id})`)
        .join('-');
    const [day] = new Date().toISOString().split('T');

    return path.join(
        dataDir,
        `${prefix}-${day}.log`
    );
};
