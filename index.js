import AgoraRTM from 'agora-rtm-sdk'
import {configureClientEventHandler, RTMClient} from './rtm_client';
import {configureChannelEventHandler, RTMChannel} from './rtm_channel';
import {mapToJsonString, jsonStringToObject} from "./utils";

let nextClientIndex = 0
let clients = new Map()

window.agoraRtmInvokeStaticMethod = async (method, callArguments) => await invokeStaticMethod(method, callArguments)

window.agoraRtmInvokeClientMethod = async (method, callArguments) => await invokeClientMethod(method, callArguments)

window.agoraRtmInvokeChannelMethod = async (method, callArguments) => await invokeChannelMethod(method, callArguments)

async function invokeStaticMethod(method, callArguments) {
    let response = new Map()

    let mappedCallArguments = jsonStringToObject(callArguments)
    let params = mappedCallArguments['params']

    if (method === 'createInstance') {
        let appId = params['appId']
        if (typeof appId !== 'string') {
            response.set('errorCode', -1)
        } else {
            let client = AgoraRTM.createInstance(appId)

            response.set('errorCode', 0)
            response.set('index', nextClientIndex)

            clients.set(nextClientIndex, new RTMClient(client, nextClientIndex))
            configureClientEventHandler(client, nextClientIndex)

            nextClientIndex++
        }
        return mapToJsonString(response)
    } else if (method === 'getSdkVersion') {
        response.set('errorCode', 0)
        response.set('version', AgoraRTM.VERSION)
        return mapToJsonString(response)
    }

    return mapToJsonString(new Map([
        ['errorCode', -1],
        ['errorMessage', 'Not implemented']
    ]))
}

async function invokeClientMethod(method, callArguments) {
    let response = new Map()

    let mappedCallArguments = jsonStringToObject(callArguments)
    let params = mappedCallArguments['params']
    let args = params['args']

    let clientIndex = params['clientIndex']
    let clientInstance = clients.get(clientIndex)
    if (clientInstance === undefined) {
        return mapToJsonString(new Map([
            ['errorCode', -1],
            ['errorMessage', 'Client not exist']
        ]))
    }

    let client = clientInstance.rtmClient
    if (client === undefined) {
        return mapToJsonString(new Map([
            ['errorCode', -1],
            ['errorMessage', 'Client not exist']
        ]))
    }


    if (method === 'destroy') {
        //TODO: release all client channels, delete client
    } else if (method === 'setLog') {
        //TODO: make web logs
    } else if (method === 'login') {
        let userId = args['userId']
        let token = args['token']

        try {
            await client.login({uid: userId, token: token})
            response.set('errorCode', 0)
        } catch (e) {
            response.set('errorCode', e.code)
        } finally {
            return mapToJsonString(response)
        }
    } else if (method === 'logout') {
        try {
            await client.logout()
            response.set('errorCode', 0)
        } catch (e) {
            response.set('errorCode', e.code)
        } finally {
            return mapToJsonString(response)
        }
    } else if (method === 'renewToken') {
        let token = args['token']

        try {
            await client.renewToken(token)
            response.set('errorCode', 0)
        } catch (e) {
            response.set('errorCode', e.code)
        } finally {
            return mapToJsonString(response)
        }
    } else if (method === 'queryPeersOnlineStatus') {
        let peerIds = args['peerIds']

        try {
            if (Array.isArray(peerIds) !== true) {
                response.set('errorCode', -1)
                response.set('errorMessage', 'peer Ids Array should be past')
            } else {
                let res = await client.queryPeersOnlineStatus(peerIds)

                let peerIdsStatus = new Map()
                for (let id of peerIds) {
                    peerIdsStatus.set(id, res[id])
                }

                response.set('errorCode', 0)
                response.set('results', peerIdsStatus)
            }
        } catch (e) {
            response.set('errorCode', e.code)
        } finally {
            return mapToJsonString(response)
        }
    } else if (method === 'sendMessageToPeer') {
        let peerId = args['peerId']
        let message = args['message']
        let offline = args['offline']
        let historical = args['historical']

        try {
            await client.sendMessageToPeer(
                {text: message},
                peerId,
                {enableOfflineMessaging: offline ?? false, enableHistoricalMessaging: historical ?? false}
            )
            response.set('errorCode', 0)
        } catch (e) {
            response.set('errorCode', e.code)
        } finally {
            return mapToJsonString(response)
        }
    } else if (method === 'setLocalUserAttributes') {
        //TODO: implement
    } else if (method === 'addOrUpdateLocalUserAttributes') {
        //TODO: implement
    } else if (method === 'deleteLocalUserAttributesByKeys') {
        //TODO: implement
    } else if (method === 'clearLocalUserAttributes') {
        //TODO: implement
    } else if (method === 'getUserAttributes') {
        //TODO: implement
    } else if (method === 'getUserAttributesByKeys') {
        //TODO: implement
    } else if (method === 'setChannelAttributes') {
        //TODO: implement
    } else if (method === 'addOrUpdateChannelAttributes') {
        //TODO: implement
    } else if (method === 'deleteChannelAttributesByKeys') {
        //TODO: implement
    } else if (method === 'clearChannelAttributes') {
        //TODO: implement
    } else if (method === 'getChannelAttributes') {
        //TODO: implement
    } else if (method === 'getChannelAttributesByKeys') {
        //TODO: implement
    } else if (method === 'sendLocalInvitation') {
        //TODO: implement
    } else if (method === 'cancelLocalInvitation') {
        //TODO: implement
    } else if (method === 'acceptRemoteInvitation') {
        //TODO: implement
    } else if (method === 'refuseRemoteInvitation') {
        //TODO: implement
    } else if (method === 'createChannel') {
        let channelId = args['channelId']

        try {
            let channel = client.createChannel(channelId)
            clientInstance.rtmChannels.set(channelId, new RTMChannel(channel, clientIndex, channelId))
            configureChannelEventHandler(channel, clientIndex, channelId)

            response.set('errorCode', 0)
        } catch (e) {
            response.set('errorCode', e.code)
        } finally {
            return mapToJsonString(response)
        }
    } else if (method === 'releaseChannel') {
        let channelId = args['channelId']

        try {
            let channelExist = clientInstance.rtmChannels.has(channelId)

            if (channelExist) {
                clientInstance.rtmChannels.delete(channelId)
                response.set('errorCode', 0)
            } else {
                response.set('errorCode', -1)
            }
        } catch (e) {
            response.set('errorCode', e.code)
        } finally {
            return mapToJsonString(response)
        }
    }


    return mapToJsonString(new Map([
        ['errorCode', -1],
        ['errorMessage', 'Not implemented']
    ]))
}

async function invokeChannelMethod(method, callArguments) {
    let response = new Map()

    let mappedCallArguments = jsonStringToObject(callArguments)
    let params = mappedCallArguments['params']
    let args = params['args']

    let clientIndex = params['clientIndex']
    let clientInstance = clients.get(clientIndex)
    if (clientInstance === undefined) {
        return mapToJsonString(new Map([
            ['errorCode', -1],
            ['errorMessage', 'Client not exist']
        ]))
    }

    let client = clientInstance.rtmClient
    if (client === undefined) {
        return mapToJsonString(new Map([
            ['errorCode', -1],
            ['errorMessage', 'Client not exist']
        ]))
    }

    let channelId = params['channelId']
    let channelInstance = clientInstance.rtmChannels.get(channelId)
    if (channelInstance === undefined) {
        return mapToJsonString(new Map([
            ['errorCode', -1],
            ['errorMessage', 'Channel not exist']
        ]))
    }

    let channel = channelInstance.rtmChannel
    if (channel === undefined) {
        return mapToJsonString(new Map([
            ['errorCode', -1],
            ['errorMessage', 'Channel not exist']
        ]))
    }

    if (method === 'join') {
        try {
            await channel.join()
            response.set('errorCode', 0)
        } catch (e) {
            response.set('errorCode', e.code)
        } finally {
            return mapToJsonString(response)
        }
    } else if (method === 'sendMessage') {
        let text = args['message']
        let offline = args['offline']
        let historical = args['historical']

        try {
            let message = client.createMessage({text: text})

            await channel.sendMessage(message, {
                    enableOfflineMessaging: offline ?? false,
                    enableHistoricalMessaging: historical ?? false
                }
            )
            response.set('errorCode', 0)
        } catch (e) {
            response.set('errorCode', e.code)
        } finally {
            return mapToJsonString(response)
        }
    } else if (method === 'leave') {
        try {
            await channel.leave()
            response.set('errorCode', 0)
        } catch (e) {
            response.set('errorCode', e.code)
        } finally {
            return mapToJsonString(response)
        }
    } else if (method === 'getMembers') {
        try {
            let channelMembers = await channel.getMembers()

            let membersList = []
            for (let i = 0; i < channelMembers.length; i++) {
                membersList.push(new Map([
                    ['userId', channelMembers[i]],
                    ['channelId', channelId]
                ]))
            }

            response.set('errorCode', 0)
            response.set('members', membersList)
        } catch (e) {
            response.set('errorCode', e.code)
        } finally {
            return mapToJsonString(response)
        }
    }

    return mapToJsonString(new Map([
        ['errorCode', -1],
        ['errorMessage', 'Not implemented']
    ]))
}
