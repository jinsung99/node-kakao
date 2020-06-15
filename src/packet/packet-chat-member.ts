import { LocoBsonRequestPacket, LocoBsonResponsePacket } from "./loco-bson-packet";
import { MemberStruct } from "../talk/struct/member-struct";
import { JsonUtil } from "../util/json-util";
import { Long } from "bson";
import { Serializer } from "json-proxy-mapper";
import { OpenLinkMemberStruct } from "../talk/struct/open/open-link-struct";

/*
 * Created on Sat Nov 02 2019
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

export class PacketChatMemberReq extends LocoBsonRequestPacket {

    constructor(
        public ChannelId: Long = Long.ZERO,
        public UserIdLIst: Long[] = []
    ) {
        super();
    }

    get PacketName() {
        return 'MEMBER';
    }

    toBodyJson() {
        return {
            'chatId': this.ChannelId,
            'memberIds': this.UserIdLIst
        };
    }

}

export class PacketChatMemberRes extends LocoBsonResponsePacket {

    constructor(
        status: number,
        public ChannelId: Long = Long.ZERO,
        public MemberList: (MemberStruct | OpenLinkMemberStruct)[] = []
    ) {
        super(status);
    }

    get PacketName() {
        return 'MEMBER';
    }

    readBodyJson(rawData: any) {
        this.ChannelId = JsonUtil.readLong(rawData['chatId']);

        this.MemberList = [];
        if (rawData['members']) {
            let memberList: any[] = rawData['members'];

            for (let rawMem of memberList) {
                if (rawMem[OpenLinkMemberStruct.Mappings.linkId]) this.MemberList.push(Serializer.deserialize<OpenLinkMemberStruct>(rawMem, OpenLinkMemberStruct.MAPPER));
                else this.MemberList.push(Serializer.deserialize<MemberStruct>(rawMem, MemberStruct.MAPPER));
            }
        }
    }

}