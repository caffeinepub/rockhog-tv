import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

module {
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

  type Channel = {
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

  type AIRequest = {
    prompt : Text;
    previousConversation : ?Text;
  };

  type AIResponse = {
    botReply : Text;
    conversation : ?Conversation;
  };

  // Chat Room Types
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

  type OldActor = {
    channels : Map.Map<Text, Channel>;
    baconCashBalances : Map.Map<Principal, Nat>;
    baconCashRequests : Map.Map<Text, BaconCashRequest>;
    userProfiles : Map.Map<Principal, UserProfile>;
    conversations : Map.Map<Text, Conversation>;
  };

  type NewActor = {
    channels : Map.Map<Text, Channel>;
    baconCashBalances : Map.Map<Principal, Nat>;
    baconCashRequests : Map.Map<Text, BaconCashRequest>;
    userProfiles : Map.Map<Principal, UserProfile>;
    conversations : Map.Map<Text, Conversation>;
    chatRooms : Map.Map<Text, ChatRoom>;
  };

  public func run(old : OldActor) : NewActor {
    let chatRooms = Map.empty<Text, ChatRoom>();

    let defaultRoom : ChatRoom = {
      id = "default-rockhog-lounge";
      name = "RockHog Lounge";
      createdAt = Time.now();
      messages = List.empty<ChatMessage>();
    };

    chatRooms.add(defaultRoom.id, defaultRoom);

    {
      old with
      chatRooms
    };
  };
};
