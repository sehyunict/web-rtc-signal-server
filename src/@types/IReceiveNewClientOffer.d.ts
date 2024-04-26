interface IReceiveNewClientOffer {
    newClientId: string;
    offer: RTCSessionDescription;
}