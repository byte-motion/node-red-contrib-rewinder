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
import fs, { ReadStream, WriteStream } from 'fs';
import os from 'os';
import readline from 'readline';
import { NodeMessageInFlow } from 'node-red';
import { RewinderInMessage, RewinderNode } from './types';
import { parse, stringify } from 'flatted';

const LOG_SEPARATOR = '#';

export type PlaybackState = {
    filename?: string;
    ws?: WriteStream;
    rs?: ReadStream;
};

export const record = (
    filename: string,
    node: RewinderNode,
    msg: NodeMessageInFlow
): void => {
    node.trace(`Writing msg to ${filename}`);
    if (filename !== node.state.playbackState.filename) {
        node.state.playbackState.ws?.close();
        node.state.playbackState.ws = fs.createWriteStream(filename, { flags: 'a' });
    }
    delete (msg as any)._msgid;
    node.state.playbackState.ws?.write(
        `${Date.now()}${LOG_SEPARATOR}${stringify(msg)}${os.EOL}`,
        err => err && node.error(err)
    );
};

export const play = async (
    filename: string,
    node: RewinderNode,
    inMsg: RewinderInMessage
): Promise<void> => {
    node.debug(`Starting playback from ${filename}`);

    if (node.state.playbackState.rs) {
        throw new Error(`Playback already started from ${filename}`);
    }

    node.state.playbackState.rs = fs.createReadStream(filename);
    node.state.playbackState.filename = filename;

    const reader = readline.createInterface({
        input: node.state.playbackState.rs,
        crlfDelay: Infinity
    });

    let prevTs = inMsg.payload?.startTime || 0;

    for await (const line of reader) {
        const pos = line.indexOf(LOG_SEPARATOR);
        const ts = parseInt(line.slice(0, pos), 10);

        if (inMsg.payload?.startTime && ts < inMsg.payload.startTime) {
            continue;
        }
        else if (inMsg.payload?.endTime && ts >= inMsg.payload.endTime) {
            break;
        }

        const data = line.slice(pos + 1);

        if (!data) {
            continue;
        }

        const outMsg = parse(data);

        if (prevTs) {
            reader.pause();
            await new Promise(r =>
                setTimeout(r, ts - prevTs)
            );
            reader.resume();
        }

        prevTs = ts;
        //@ts-ignore
        if (node.state.playbackState.rs === undefined) {
            break;
        }
        node.send(outMsg);
    }

    stop(node);
};

export const stop = (node: RewinderNode) => {
    if (node.state.playbackState.rs) {
        node.debug(`Stopping playback from ${node.state.playbackState.filename}`);
        node.state.playbackState.rs?.close();
        node.state.playbackState.rs = undefined;
    }
};