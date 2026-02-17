import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldCategory = {
    #music;
    #gaming;
    #sports;
    #horror;
    #adult;
  };

  type OldChannel = {
    id : Text;
    owner : Principal.Principal;
    title : Text;
    category : OldCategory;
    description : Text;
    thumbnail : Storage.ExternalBlob;
    streamUrl : Text;
    ingestUrl : Text;
    streamKey : Text;
  };

  type OldActor = {
    channels : Map.Map<Text, OldChannel>;
  };

  type NewCategory = {
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

  type NewChannel = {
    id : Text;
    owner : Principal.Principal;
    title : Text;
    category : NewCategory;
    description : Text;
    thumbnail : Storage.ExternalBlob;
    streamUrl : Text;
    ingestUrl : Text;
    streamKey : Text;
  };

  type NewActor = {
    channels : Map.Map<Text, NewChannel>;
  };

  public func run(old : OldActor) : NewActor {
    let newChannels = old.channels.map<Text, OldChannel, NewChannel>(
      func(_id, oldChannel) {
        { oldChannel with category = upgradeCategory(oldChannel.category) };
      }
    );
    { channels = newChannels };
  };

  func upgradeCategory(oldCategory : OldCategory) : NewCategory {
    switch (oldCategory) {
      case (#music) { #music };
      case (#gaming) { #gaming };
      case (#sports) { #sports };
      case (#horror) { #horror };
      case (#adult) { #adult };
    };
  };
};
