import {mapToJsonString} from "./utils";

export class RTMChannel {
    constructor(rtmChannel, clientIndex, channelId) {
        this.rtmChannel = rtmChannel;
        this.clientIndex = clientIndex;
        this.channelId = channelId;
    }
}

export function configureChannelEventHandler(channel, clientIndex, channelId) {
    channel.on('ChannelMessage', function (message, memberId, messageProperties) {
        let eventAsMap = new Map()

        eventAsMap.set('clientIndex', clientIndex)
        eventAsMap.set('channelId', channelId)
        eventAsMap.set('event', 'onMessageReceived')
        eventAsMap.set('userId', memberId)
        eventAsMap.set('message', new Map([
            ['text', message.text],
            ['offline', messageProperties.isOfflineMessage],
            ['ts', messageProperties.serverReceivedTs],
        ]))

        window.agoraRtmOnChannelEvent(mapToJsonString(eventAsMap))
    })

    channel.on('MemberJoined', function (memberId) {
        let eventAsMap = new Map()

        eventAsMap.set('clientIndex', clientIndex)
        eventAsMap.set('channelId', channelId)
        eventAsMap.set('event', 'onMemberJoined')
        eventAsMap.set('userId', memberId)

        window.agoraRtmOnChannelEvent(mapToJsonString(eventAsMap))
    })

    channel.on('MemberLeft', function (memberId) {
        let eventAsMap = new Map()

        eventAsMap.set('clientIndex', clientIndex)
        eventAsMap.set('channelId', channelId)
        eventAsMap.set('event', 'onMemberLeft')
        eventAsMap.set('userId', memberId)

        window.agoraRtmOnChannelEvent(mapToJsonString(eventAsMap))
    })

    channel.on('MemberCountUpdated', function (memberCount) {
        let eventAsMap = new Map()

        eventAsMap.set('clientIndex', clientIndex)
        eventAsMap.set('channelId', channelId)
        eventAsMap.set('event', 'onMemberCountUpdated')
        eventAsMap.set('count', memberCount)

        window.agoraRtmOnChannelEvent(mapToJsonString(eventAsMap))
    })
}