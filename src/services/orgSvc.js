import * as fb from "@/firebase";
import * as utils from "@/utils";
import * as dbMethods from "@/services/dbMethods";
import * as campaignSvc from "@/services/campaignSvc";
import * as userSvc from "@/services/userSvc";

export async function createNewOrg(newOrgData) {
  let u = await userSvc.currentUser();

  let newOrgRef = await fb.organizationsCollection.doc();
  await newOrgRef.set({
    name: newOrgData.name,
    id: newOrgRef.id,
    owner: u.id,
    createdOn: new Date(),
  });

  let newPermObjRef = await fb.permissionsCollection.doc();
  newPermObjRef.set({
    id: newPermObjRef.id,
    resource: `org_${newOrgRef.id}`,
    holder: u.id,
    holderType: "user",
    permissions: { admin: true },
  });

  let updatedOrg = await getFullOrg({ orgId: newOrgRef.id });
  return updatedOrg;
}

export async function addUserToOrg(opts) {
  let { email, orgId, permissions } = opts;
  let userObj = await dbMethods.getUser({ email: email });

  let newPermObjRef = fb.permissionsCollection.doc();
  await newPermObjRef.set({
    id: newPermObjRef.id,
    resource: `org_${orgId}`,
    holder: userObj.id,
    holderType: "user",
    permissions: permissions,
  });

  let updatedOrg = await getFullOrg({ orgId });
  return updatedOrg;
}

export async function remUserFmOrg(opts) {
  let { orgId, permObj } = opts;

  let newPermObjRef = await fb.permissionsCollection.doc(permObj.id);
  await newPermObjRef.delete();

  let updatedOrg = await getFullOrg({ orgId });
  return updatedOrg;
}

export async function updUserFmOrg(opts) {
  let { orgId, permObj } = opts;

  let newPermObjRef = await fb.permissionsCollection.doc(permObj.id);
  permObj.holder = permObj.holder.id;
  await newPermObjRef.set(permObj);

  let updatedOrg = await getFullOrg({ orgId });
  return updatedOrg;
}

export async function getOrgsUserCanAccess(opts) {
  let { userId } = opts;
  let perms = await dbMethods.getPerms({ holderId: userId });
  let orgs = [];
  for (let p of perms) {
    let o = await getFullOrg({ orgId: p.resource.replace("org_", "") });
    orgs.push(o);
  }
  return orgs;
}

export async function getFullOrg(opts) {
  let { orgId } = opts;

  let u = await userSvc.currentUser();

  let org = await dbMethods.getOrg({ orgId });
  let owner = await dbMethods.getUser({ userId: org.owner });
  let perms = await dbMethods.getPerms({ rsrcId: `org_${orgId}` });
  let campaigns = await campaignSvc.getCampaignsOfOrg({ orgId: orgId });

  let campaignsData = {
    memberJoins: [],
    totalHitsGoal: 0,
    totalBudgetOnLine: 0,
  };

  for (let c of campaigns) {
    campaignsData.memberJoins = utils.arrayUnion(
      campaignsData.memberJoins,
      c.campaign.campaignJoins,
      (a, b) => a.user.id === b.user.id
    );
    campaignsData.totalHitsGoal += parseFloat(c.campaign.hitsGoal);
    campaignsData.totalBudgetOnLine += parseFloat(c.campaign.totalBudget);
  }

  org.currUserPerm = perms.find((p) => p.holder.id === u.id);

  org.owner = owner;
  org.perms = perms;
  org.campaigns = campaigns;
  org.campaignsData = campaignsData;
  return org;
}

export async function saveOrgSenderAcct(opts) {
  let orgId = opts.orgId;
  let senderAcctInfo = opts.senderAcctInfo;
  await fb.organizationsCollection.doc(orgId).update({ senderAcctInfo });
  let o = await getFullOrg({ orgId });
  return o;
}
