const agoraModule = require('./dist/bundle')
const assert = require('assert')

it('create Agora RTM instance', async () => {
    const callArguments = '{\"call\":\"static\",' +
        '\"params\":{\"appId\":\"TEST_ID\"}}';
    const expectedResponse = '{\"errorCode\":0,\"index\":0}';

    let response = await window.agoraRtmInvokeStaticMethod('createInstance', callArguments)

    assert.equal(response, expectedResponse)
})

it('log in the client', async () => {
    const callArguments = '{\"call\":\"AgoraRtmClient\",' +
        '\"params\":{\"clientIndex\":0,' +
        '\"args\":{\"userId\":\"test-1\"}}}';
    const expectedResponse = '{\"errorCode\":0}';

    let response = await window.agoraRtmInvokeClientMethod('login', callArguments)

    assert.equal(response, expectedResponse)
})

it('query peers online status', async () => {
    const callArguments = '{\"call\":\"AgoraRtmClient\",' +
        '\"params\":{\"clientIndex\":0,' +
        '\"args\":{\"peerIds\":[\"test-2\"]}}}';
    const expectedResponse = '{\"errorCode\":0,\"results\":{\"test-2\":false}}';

    let response = await window.agoraRtmInvokeClientMethod('queryPeersOnlineStatus', callArguments)

    assert.equal(response, expectedResponse)
})

it('send peer message', async () => {
    const callArguments = '{\"call\":\"AgoraRtmClient\",' +
        '\"params\":{\"clientIndex\":0,' +
        '\"args\":{\"peerId\":\"test-2\",\"message\":\"Test peer message\"}}}';
    const expectedResponse = '{\"errorCode\":0}';

    let response = await window.agoraRtmInvokeClientMethod('sendMessageToPeer', callArguments)

    assert.equal(response, expectedResponse)
})