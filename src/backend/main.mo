import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Migration "migration";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  module Category {
    public func toText(category : Category) : Text {
      switch (category) {
        case (#music) { "Music" };
        case (#gaming) { "Gaming" };
        case (#sports) { "Sports" };
        case (#horror) { "Horror" };
        case (#adult) { "Adult" };
        case (#radio) { "Radio" };
        case (#djs) { "DJs" };
        case (#irl) { "IRL" };
        case (#audio_video_podcasts) { "Audio & Video Podcasts" };
        case (#ppv_events) { "PPV Events" };
      };
    };

    public func fromText(text : Text) : Category {
      switch (text) {
        case ("music") { #music };
        case ("Music") { #music };
        case ("MUSIC") { #music };
        case ("gaming") { #gaming };
        case ("Gaming") { #gaming };
        case ("GAMING") { #gaming };
        case ("sports") { #sports };
        case ("Sports") { #sports };
        case ("SPORTS") { #sports };
        case ("horror") { #horror };
        case ("Horror") { #horror };
        case ("HORROR") { #horror };
        case ("adult") { #adult };
        case ("Adult") { #adult };
        case ("ADULT") { #adult };
        case ("****") { #adult };
        case ("Radio") { #radio };
        case ("DJs") { #djs };
        case ("IRL") { #irl };
        case ("Audio & Video Podcasts") { #audio_video_podcasts };
        case ("Audio and Video Podcasts") { #audio_video_podcasts };
        case ("PPV Events") { #ppv_events };
        case (_) { #music };
      };
    };
  };

  // Type definitions
  public type Channel = {
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

  public type BaconCashRequest = {
    id : Text;
    user : Principal;
    amount : Nat;
    completed : Bool;
  };

  public type UserProfile = {
    name : Text;
    baconCashBalance : Nat;
    bestScore : Nat;
  };

  // Persistent storage using Text keys
  let channels = Map.empty<Text, Channel>();
  let baconCashBalances = Map.empty<Principal, Nat>();
  let baconCashRequests = Map.empty<Text, BaconCashRequest>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Game Stat Management
  public shared ({ caller }) func updateBestScore(score : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update game stats");
    };
    let currentProfile = switch (userProfiles.get(caller)) {
      case (null) {
        {
          name = "";
          baconCashBalance = 0;
          bestScore = 0;
        };
      };
      case (?profile) {
        profile;
      };
    };
    if (score > currentProfile.bestScore) {
      let updatedProfile : UserProfile = {
        name = currentProfile.name;
        baconCashBalance = currentProfile.baconCashBalance;
        bestScore = score;
      };
      userProfiles.add(caller, updatedProfile);
    };
  };

  public query ({ caller }) func getBestScore() : async Nat {
    // Anyone can query their best score (guests will get 0, users get their saved score)
    switch (userProfiles.get(caller)) {
      case (null) { 0 };
      case (?profile) { profile.bestScore };
    };
  };

  // Channel Management
  public query ({ caller }) func getChannel(id : Text) : async ?Channel {
    // Anyone can view channels (including guests)
    channels.get(id);
  };

  public query ({ caller }) func getAllChannels() : async [Channel] {
    // Anyone can view channels (including guests)
    let values = channels.values();
    values.toArray();
  };

  public query ({ caller }) func getMyChannels() : async [Channel] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their channels");
    };
    let values = channels.values();
    values.filter(func(channel : Channel) : Bool { channel.owner == caller }).toArray();
  };

  public shared ({ caller }) func createChannel(
    id : Text,
    title : Text,
    category : Text,
    description : Text,
    thumbnail : Storage.ExternalBlob,
    streamUrl : Text,
    ingestUrl : Text,
    streamKey : Text,
  ) : async () {
    // Creators (users) can create their own channels
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create channels");
    };

    // Check if channel ID already exists
    switch (channels.get(id)) {
      case (?_) {
        Runtime.trap("Channel ID already exists");
      };
      case (null) {};
    };

    let newChannel : Channel = {
      id;
      owner = caller;
      title;
      category = Category.fromText(category);
      description;
      thumbnail;
      streamUrl;
      ingestUrl;
      streamKey;
    };

    channels.add(id, newChannel);
  };

  public shared ({ caller }) func updateChannel(
    id : Text,
    title : Text,
    category : Text,
    description : Text,
    thumbnail : Storage.ExternalBlob,
    streamUrl : Text,
    ingestUrl : Text,
    streamKey : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update channels");
    };

    switch (channels.get(id)) {
      case (null) {
        Runtime.trap("Channel not found");
      };
      case (?channel) {
        // Only owner or admin can update
        if (channel.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only channel owner or admin can update this channel");
        };

        let updatedChannel : Channel = {
          id;
          owner = channel.owner; // Preserve original owner
          title;
          category = Category.fromText(category);
          description;
          thumbnail;
          streamUrl;
          ingestUrl;
          streamKey;
        };

        channels.add(id, updatedChannel);
      };
    };
  };

  public shared ({ caller }) func deleteChannel(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete channels");
    };

    switch (channels.get(id)) {
      case (null) {
        Runtime.trap("Channel not found");
      };
      case (?channel) {
        // Only owner or admin can delete
        if (channel.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only channel owner or admin can delete this channel");
        };

        channels.remove(id);
      };
    };
  };

  // Bacon Cash Management
  public query ({ caller }) func getBalance() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view balance");
    };
    switch (baconCashBalances.get(caller)) {
      case (null) { 0 };
      case (?balance) { balance };
    };
  };

  public shared ({ caller }) func requestBaconCash(amount : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request Bacon Cash");
    };

    if (amount == 0) {
      Runtime.trap("Amount must be greater than zero");
    };

    let requestId = caller.toText() # "_" # amount.toText() # "_" # baconCashRequests.size().toText();
    let request : BaconCashRequest = {
      id = requestId;
      user = caller;
      amount;
      completed = false;
    };

    baconCashRequests.add(requestId, request);
    requestId;
  };

  public query ({ caller }) func getAllBaconCashRequests() : async [BaconCashRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all requests");
    };
    let values = baconCashRequests.values();
    values.toArray();
  };

  public query ({ caller }) func getMyBaconCashRequests() : async [BaconCashRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their requests");
    };
    let values = baconCashRequests.values();
    values.filter(func(request : BaconCashRequest) : Bool { request.user == caller }).toArray();
  };

  public shared ({ caller }) func fulfillBaconCashRequest(requestId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can fulfill requests");
    };

    switch (baconCashRequests.get(requestId)) {
      case (null) {
        Runtime.trap("Request not found");
      };
      case (?request) {
        if (request.completed) {
          Runtime.trap("Request already fulfilled");
        };
        let user = request.user;
        let currentBalance = switch (baconCashBalances.get(user)) {
          case (null) { 0 };
          case (?balance) { balance };
        };

        let newBalance = currentBalance + request.amount;
        baconCashBalances.add(user, newBalance);
        baconCashRequests.add(requestId, { request with completed = true });
      };
    };
  };
};

