import {RtmStatusCode} from "agora-rtm-sdk";

export class RTMClient {
    constructor(rtmClient, clientIndex) {
        this.rtmClient = rtmClient;
        this.clientIndex = clientIndex;
        this.rtmChannels = new Map();
    }
}

export function configureClientEventHandler(client, clientIndex) {
    //TODO: Implement invitations handlers

    client.on('ConnectionStateChanged', function (newState, reason) {
        let eventAsMap = new Map()

        let stateCode = 0
        if (newState === RtmStatusCode.ConnectionState.DISCONNECTED) {
            stateCode = 1
        } else if (newState === RtmStatusCode.ConnectionState.CONNECTING) {
            stateCode = 2
        } else if (newState === RtmStatusCode.ConnectionState.CONNECTED) {
            stateCode = 3
        } else if (newState === RtmStatusCode.ConnectionState.RECONNECTING) {
            stateCode = 4
        } else if (newState === RtmStatusCode.ConnectionState.ABORTED) {
            stateCode = 5
        }

        let reasonCode = 0
        if (reason === RtmStatusCode.ConnectionChangeReason.LOGIN) {
            reasonCode = 1
        } else if (reason === RtmStatusCode.ConnectionChangeReason.LOGIN_SUCCESS) {
            reasonCode = 2
        } else if (reason === RtmStatusCode.ConnectionChangeReason.LOGIN_FAILURE) {
            reasonCode = 3
        } else if (reason === RtmStatusCode.ConnectionChangeReason.LOGIN_TIMEOUT) {
            reasonCode = 4
        } else if (reason === RtmStatusCode.ConnectionChangeReason.INTERRUPTED) {
            reasonCode = 5
        } else if (reason === RtmStatusCode.ConnectionChangeReason.LOGOUT) {
            reasonCode = 6
        } else if (reason === RtmStatusCode.ConnectionChangeReason.BANNED_BY_SERVER) {
            reasonCode = 7
        } else if (reason === RtmStatusCode.ConnectionChangeReason.REMOTE_LOGIN) {
            reasonCode = 8
        }

        eventAsMap.set('clientIndex', clientIndex)
        eventAsMap.set('event', 'onConnectionStateChanged')
        eventAsMap.set('state', stateCode)
        eventAsMap.set('reason', reasonCode)

        let nestedObject = mapToObjectRec(eventAsMap)
        window.agoraRtmOnClientEvent(JSON.stringify(nestedObject))
    })

    client.on('MessageFromPeer', function (message, peerId, messageProperties) {
        let eventAsMap = new Map()

        eventAsMap.set('clientIndex', clientIndex)
        eventAsMap.set('event', 'onMessageReceived')
        eventAsMap.set('peerId', peerId)
        eventAsMap.set('message', new Map([
            ['text', message.text],
            ['offline', messageProperties.isOfflineMessage],
            ['ts', messageProperties.serverReceivedTs],
        ]))

        let nestedObject = mapToObjectRec(eventAsMap)
        window.agoraRtmOnClientEvent(JSON.stringify(nestedObject))
    })

    client.on('TokenExpired', function () {
        let eventAsMap = new Map()

        eventAsMap.set('clientIndex', clientIndex)
        eventAsMap.set('event', 'onTokenExpired')

        let nestedObject = mapToObjectRec(eventAsMap)
        window.agoraRtmOnClientEvent(JSON.stringify(nestedObject))
    })
}
