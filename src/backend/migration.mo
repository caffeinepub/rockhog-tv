import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldActor = {
    channels : Map.Map<Text, OldChannel>;
    baconCashBalances : Map.Map<Principal, Nat>;
    baconCashRequests : Map.Map<Text, BaconCashRequest>;
    userProfiles : Map.Map<Principal, UserProfile>;
    conversations : Map.Map<Text, Conversation>;
    chatRooms : Map.Map<Text, ChatRoom>;
  };

  // Type definitions
  type OldChannel = {
    id : Text;
    owner : Principal;
    title : Text;
    category : Category;
    description : Text;
    thumbnail : Storage.ExternalBlob;
    streamUrl : Text;
    ingestUrl : Text;
    streamKey : Text;
  };

  type Category = {
    #music;
    #gaming;
    #sports;
    #horror;
    #adult;
    #radio;
    #djs;
    #irl;
    #audio_video_podcasts;
    #ppv_events;
  };

  type BaconCashRequest = {
    id : Text;
    user : Principal;
    amount : Nat;
    completed : Bool;
  };

  type UserProfile = {
    name : Text;
    baconCashBalance : Nat;
    bestScore : Nat;
  };

  type AIMessage = {
    isAI : Bool;
    text : Text;
  };

  type Conversation = {
    id : Text;
    owner : Principal;
    messages : [AIMessage];
  };

  type StreamerPayment = {
    id : Text;
    sender : Principal;
    recipient : Principal;
    amount : Nat;
    timestamp : Int;
    message : ?Text;
  };

  type ChatMessage = {
    id : Nat;
    sender : Principal;
    senderName : Text;
    message : Text;
    timestamp : Int;
  };

  type ChatRoom = {
    id : Text;
    name : Text;
    createdAt : Int;
    messages : List.List<ChatMessage>;
  };

  type NewActor = {
    channels : Map.Map<Text, NewChannel>;
    baconCashBalances : Map.Map<Principal, Nat>;
    baconCashRequests : Map.Map<Text, BaconCashRequest>;
    userProfiles : Map.Map<Principal, UserProfile>;
    conversations : Map.Map<Text, Conversation>;
    chatRooms : Map.Map<Text, ChatRoom>;
  };

  type NewChannel = {
    id : Text;
    owner : Principal;
    title : Text;
    category : Category;
    description : Text;
    thumbnail : Storage.ExternalBlob;
    streamUrl : Text;
    ingestUrl : Text;
    streamKey : Text;
    chatRoomId : ?Text;
  };

  public func run(old : OldActor) : NewActor {
    let channels = old.channels.map<Text, OldChannel, NewChannel>(
      func(_id, oldChannel) {
        { oldChannel with chatRoomId = ?oldChannel.id };
      }
    );
    { old with channels };
  };
};
