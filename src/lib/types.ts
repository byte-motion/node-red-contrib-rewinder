import { NodeMessageInFlow } from 'node-red';


export type RewinderInMessage = {
    topic: RewinderTopic
} & NodeMessageInFlow;

export enum RewinderTopic {
    START = 'START',
    STOP = 'STOP'
}