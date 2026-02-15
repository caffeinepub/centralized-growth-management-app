import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Debug "mo:core/Debug";
import Time "mo:core/Time";
import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Float "mo:core/Float";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextCampaignId = 0;
  var nextTaskId = 0;

  // Data Types
  public type UserProfile = {
    name : Text;
    email : ?Text;
    role : Text;
  };

  public type BrandProfile = {
    name : Text;
    products : [Product];
    pricing : [ProductPricing];
    margin : Float;
    suppliers : [SupplierInfo];
    adBudget : Float;
    weeklyGoals : KPISet;
    monthlyGoals : KPISet;
  };

  public type Campaign = {
    id : Nat;
    name : Text;
    platform : Platform;
    spend : Float;
    revenue : Float;
    roas : Float;
    startDate : Time.Time;
    endDate : ?Time.Time;
    creativeLinks : [Text];
  };

  public type Task = {
    id : Nat;
    description : Text;
    priority : Priority;
    dueDate : ?Time.Time;
    brand : ?Text;
    status : TaskStatus;
  };

  public type KPISet = {
    revenue : Float;
    profit : Float;
    roas : Float;
    cac : Float;
    conversionRate : Float;
    aov : Float;
    returnRate : Float;
    shippingCost : Float;
  };

  public type ProductPricing = {
    productId : Text;
    price : Float;
    cost : Float;
  };

  public type Product = {
    sku : Text;
    name : Text;
    category : Text;
    price : Float;
    cost : Float;
    margin : Float;
  };

  public type SupplierInfo = {
    name : Text;
    contact : Text;
  };

  public type Platform = {
    #meta;
    #google;
    #other;
  };

  public type TaskStatus = {
    #pending;
    #inProgress;
    #completed;
  };

  public type Priority = {
    #high;
    #medium;
    #low;
  };

  // Data Storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let brands = Map.empty<Text, BrandProfile>();
  let campaigns = Map.empty<Nat, Campaign>();
  let tasks = Map.empty<Nat, Task>();

  module Campaign {
    public func compareByROAS(a : Campaign, b : Campaign) : Order.Order {
      Float.compare(a.roas, b.roas);
    };

    public func compareBySpend(a : Campaign, b : Campaign) : Order.Order {
      Float.compare(a.spend, b.spend);
    };

    public func compareByRevenue(a : Campaign, b : Campaign) : Order.Order {
      Float.compare(a.revenue, b.revenue);
    };
  };

  module Task {
    public func compareByDueDate(a : Task, b : Task) : Order.Order {
      switch (a.dueDate, b.dueDate) {
        case (?dateA, ?dateB) {
          Int.compare(dateA, dateB);
        };
        case (null, ?_) {
          #greater;
        };
        case (?_, null) {
          #less;
        };
        case (null, null) {
          #equal;
        };
      };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Role Management
  public shared ({ caller }) func assignRole(user : Principal, role : AccessControl.UserRole) : async () {
    // AccessControl.assignRole already includes admin-only guard
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  // Brand Management
  public shared ({ caller }) func addBrand(name : Text, profile : BrandProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add brands");
    };
    brands.add(name, profile);
  };

  public shared ({ caller }) func updateBrand(name : Text, profile : BrandProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update brands");
    };
    if (not brands.containsKey(name)) {
      Runtime.trap("Brand does not exist");
    };
    brands.add(name, profile);
  };

  public shared ({ caller }) func deleteBrand(name : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete brands");
    };
    if (not brands.containsKey(name)) {
      Runtime.trap("Brand does not exist");
    };
    brands.remove(name);
  };

  public query ({ caller }) func getBrand(name : Text) : async ?BrandProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view brands");
    };
    brands.get(name);
  };

  public query ({ caller }) func listBrands() : async [Text] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view brands");
    };
    brands.keys().toArray();
  };

  public query ({ caller }) func getBrandsByMargin(minMargin : Float) : async [BrandProfile] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view brands");
    };
    brands.values().toArray().filter(
      func(brand) {
        brand.margin >= minMargin;
      }
    );
  };

  // Campaign Management
  public shared ({ caller }) func addCampaign(campaign : Campaign) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add campaigns");
    };
    let id = nextCampaignId;
    campaigns.add(id, { campaign with id });
    nextCampaignId += 1;
    id;
  };

  public shared ({ caller }) func updateCampaign(id : Nat, campaign : Campaign) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update campaigns");
    };
    if (not campaigns.containsKey(id)) {
      Runtime.trap("Campaign does not exist");
    };
    campaigns.add(id, { campaign with id });
  };

  public shared ({ caller }) func deleteCampaign(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete campaigns");
    };
    if (not campaigns.containsKey(id)) {
      Runtime.trap("Campaign does not exist");
    };
    campaigns.remove(id);
  };

  public query ({ caller }) func getCampaign(id : Nat) : async ?Campaign {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view campaigns");
    };
    campaigns.get(id);
  };

  public query ({ caller }) func listCampaigns() : async [Campaign] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view campaigns");
    };
    campaigns.values().toArray();
  };

  public query ({ caller }) func getCampaignsByPlatform(platform : Platform) : async [Campaign] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view campaigns");
    };

    campaigns.values().toArray().filter(
      func(campaign) {
        campaign.platform == platform;
      }
    );
  };

  public query ({ caller }) func getCampaignsSortedByROAS() : async [Campaign] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view campaigns");
    };
    campaigns.toArray().map(
      func((_, campaign)) { campaign }
    ).sort(Campaign.compareByROAS);
  };

  // Task Management
  public shared ({ caller }) func addTask(task : Task) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add tasks");
    };
    let id = nextTaskId;
    tasks.add(id, { task with id });
    nextTaskId += 1;
    id;
  };

  public shared ({ caller }) func updateTask(id : Nat, task : Task) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update tasks");
    };
    if (not tasks.containsKey(id)) {
      Runtime.trap("Task does not exist");
    };
    tasks.add(id, { task with id });
  };

  public shared ({ caller }) func deleteTask(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete tasks");
    };
    if (not tasks.containsKey(id)) {
      Runtime.trap("Task does not exist");
    };
    tasks.remove(id);
  };

  public query ({ caller }) func getTask(id : Nat) : async ?Task {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    tasks.get(id);
  };

  public query ({ caller }) func listTasks() : async [Task] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    tasks.values().toArray();
  };

  public query ({ caller }) func getTasksByBrand(brand : Text) : async [Task] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    tasks.values().toArray().filter(
      func(task) {
        switch (task.brand) {
          case (?b) { b == brand };
          case (null) { false };
        };
      }
    );
  };

  public query ({ caller }) func getUpcomingTasks() : async [Task] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    tasks.toArray().map(
      func((_, task)) { task }
    ).sort(Task.compareByDueDate);
  };

  // Weekly Summary
  public query ({ caller }) func generateWeeklySummary() : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view summary");
    };

    let allCampaigns = campaigns.values().toArray();
    let metaSpend = allCampaigns.filter(
      func(campaign) {
        switch (campaign.platform) {
          case (#meta) { true };
          case (_) { false };
        };
      }
    ).map(
      func(campaign) { campaign.spend }
    );
    let googleSpend = allCampaigns.filter(
      func(campaign) {
        switch (campaign.platform) {
          case (#google) { true };
          case (_) { false };
        };
      }
    ).map(
      func(campaign) { campaign.spend }
    );

    let totalMetaSpend = metaSpend.foldLeft(
      0.0,
      func(acc, spend) { acc + spend },
    );
    let totalGoogleSpend = googleSpend.foldLeft(
      0.0,
      func(acc, spend) { acc + spend },
    );

    "Weekly Ad Spend - Meta: " # totalMetaSpend.toText() # ", Google: " # totalGoogleSpend.toText();
  };
};
