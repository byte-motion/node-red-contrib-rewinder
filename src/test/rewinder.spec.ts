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
import sinon from 'sinon';
import helper from 'node-red-node-test-helper'
import { RewinderNode, RewinderStateType } from '../lib/types';
import rewinder from '../nodes/rewinder';
import * as playback from '../lib/playback';
import * as utils from '../lib/utils';
import { expect } from 'chai';

describe('Rewinder', () => {
    afterEach(() => {
        sinon.restore();
        return helper.unload();
    });

    it('should be loaded', async () => {
        const flow = [{ id: 'rewinder-1', type: 'rewinder', name: 'test name' }];
        await helper.load(rewinder, flow, {});
        const rewinderNode = helper.getNode('rewinder-1');
        rewinderNode.should.have.property('name', 'test name');
    });


    it('should be started in recording state', async () => {
        const flow = [{ id: 'rewinder-1', type: 'rewinder' }];
        await helper.load(rewinder, flow, {});
        const rewinderNode: RewinderNode = helper.getNode('rewinder-1');
        rewinderNode.state.rewinderState.type.should.equal(RewinderStateType.RECORDING);
    });

    it('should record a message', async () => {
        const recordStub = sinon
            .stub(playback, 'record')
            .returns(undefined);
        const getDailyLogFileStub = sinon
            .stub(utils, 'getDailyLogFile')
            .returns('/tmp/dailyLogFile.log');
        const flow = [
            { id: 'rewinder-1', type: 'rewinder', wires: [['helper-1']] },
            { id: 'helper-1', type: 'helper' }
        ];

        await helper.load(rewinder, flow, {});

        const rewinderNode: RewinderNode = helper.getNode('rewinder-1');
        const helperNode = helper.getNode('helper-1');

        const receiver = new Promise(r => 
            helperNode.on('input',r)
        );

        rewinderNode.receive({ payload: 'a payload' });

        const msg = await receiver;

        recordStub.should.have.been.calledOnce();
        getDailyLogFileStub.should.have.been.calledOnce();
        expect(msg).to.have.property('payload', 'a payload')
    });
});