import { NodeAPI, NodeAPISettingsWithData, NodeDef, Node, NodeMessageInFlow, NodeMessage } from "node-red";

export = (RED: NodeAPI<NodeAPISettingsWithData>): void =>
    RED.nodes.registerType('rewinder', function (this: Node, config: NodeDef) {
        const node: Node = this;
        RED.nodes.createNode(this, config);
        node.on('input', (
            msg: NodeMessageInFlow,
            send: (msg: NodeMessage | Array<NodeMessage | null>) => void,
            done: (err?: Error) => void,
        ) => {
            try {
                node.trace(`Received msg: ${JSON.stringify(msg, null, 2)}`);

                (send || node.send)(msg);

                (done || (() => { }))();
            }
            catch (err) {
                (e => done ? done(e) : node.error(e, msg))(err);
            }
        });
    });
