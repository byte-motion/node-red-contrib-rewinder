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
