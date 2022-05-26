import {mapToObjectRec} from "./utils";

export class RTMChannel {
    constructor(rtmChannel, clientIndex, channelId) {
        this.rtmChannel = rtmChannel;
        this.clientIndex = clientIndex;
        this.channelId = channelId;
    }
}

export function configureChannelEventHandler(channel, clientIndex, channelId) {
    //TODO: Implement onAttributesUpdated

    channel.on('ChannelMessage', function (message, peerId, messageProperties) {
        let eventAsMap = new Map()

        eventAsMap.set('clientIndex', clientIndex)
        eventAsMap.set('channelId', channelId)
        eventAsMap.set('event', 'onMessageReceived')
        eventAsMap.set('peerId', peerId)
        eventAsMap.set('message', new Map([
            ['text', message.text],
            ['offline', messageProperties.isOfflineMessage],
            ['ts', messageProperties.serverReceivedTs],
        ]))

        let nestedObject = mapToObjectRec(eventAsMap)
        window.agoraRtmOnChannelEvent(JSON.stringify(nestedObject))
    })

    channel.on('MemberJoined', function (memberId) {
        let eventAsMap = new Map()

        eventAsMap.set('clientIndex', clientIndex)
        eventAsMap.set('channelId', channelId)
        eventAsMap.set('event', 'onMemberJoined')
        eventAsMap.set('userId', memberId)

        let nestedObject = mapToObjectRec(eventAsMap)
        window.agoraRtmOnChannelEvent(JSON.stringify(nestedObject))
    })

    channel.on('MemberLeft', function (memberId) {
        let eventAsMap = new Map()

        eventAsMap.set('clientIndex', clientIndex)
        eventAsMap.set('channelId', channelId)
        eventAsMap.set('event', 'onMemberLeft')
        eventAsMap.set('userId', memberId)

        let nestedObject = mapToObjectRec(eventAsMap)
        window.agoraRtmOnChannelEvent(JSON.stringify(nestedObject))
    })

    channel.on('MemberCountUpdated', function (memberCount) {
        let eventAsMap = new Map()

        eventAsMap.set('clientIndex', clientIndex)
        eventAsMap.set('channelId', channelId)
        eventAsMap.set('event', 'onMemberCountUpdated')
        eventAsMap.set('count', memberCount)

        let nestedObject = mapToObjectRec(eventAsMap)
        window.agoraRtmOnChannelEvent(JSON.stringify(nestedObject))
    })
}