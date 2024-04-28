const { assert } = require("chai");

const Decentragram = artifacts.require("./Decentragram.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Decentragram", ([deployer, owner, tipper]) => {
  let decentragram;

  before(async () => {
    decentragram = await Decentragram.deployed();
  });

  // describe("deployment", async () => {
  //   it("deploys successfully", async () => {
  //     const address = await decentragram.address;
  //     assert.notEqual(address, 0x0);
  //     assert.notEqual(address, "");
  //     assert.notEqual(address, null);
  //     assert.notEqual(address, undefined);
  //   });

  //   it("has a name", async () => {
  //     const name = await decentragram.contractName();
  //     assert.equal(name, "Decentragram");
  //   });
  // });

  describe("createAccount", () => {
    let result, userID, profile;
    let username = "test_username";
    let biography = "This is a test biography";
    let profilePictureURL =
      "https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/QmRSZrGXfsu7dsboestCcf1mFy7FS3owbSoxZn81HCNiw8";
    before(async () => {
      result = await decentragram.createAccount(
        username,
        biography,
        profilePictureURL,
        { from: owner }
      );
      userID = await decentragram._userID();
      profile = await decentragram.profiles(owner).owner;
    });
    it("creates a new account", async () => {
      // Success
      assert.equal(userID, 1);
      assert.equal(profile, null, "profile not exists yet");
      const event = result.logs[0].args;
      assert.equal(event.owner, owner, "owner is correct");
      assert.equal(event.username, username, "username is correct");
      assert.equal(event.biography, biography, "biography is correct");
      assert.equal(
        event.profilePictureURL,
        profilePictureURL,
        "profilePictureURL is correct"
      );
      // Test it should not allow to create an account without username
      await decentragram.createAccount("", biography, profilePictureURL, {
        from: owner,
      }).should.be.rejected;
    });
  });

  // describe("updateProfile", () => {
  //   let result, profile;
  //   let updatedUsername = "updated_username";
  //   let updatedBiography = "This is an updated biography";
  //   let updatedProfilePictureURL =
  //     "https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/QmRSZrGXfsu7dsboestCcf1mFy7FS3owbSoxZn81HCNiw8";
  //   before(async () => {
  //     result = await decentragram.editProfile(
  //       owner,
  //       updatedUsername,
  //       updatedBiography,
  //       updatedProfilePictureURL,
  //       { from: owner }
  //     );
  //     profile = await decentragram.profiles(owner);
  //   });
  //   it("updates a user profile", async () => {
  //     // Success
  //     assert.notEqual(profile, null, "user profile exists");
  //     const event = result.logs[0].args;
  //     assert.equal(event.owner, owner, "owner is correct");
  //     assert.equal(
  //       event.username,
  //       updatedUsername,
  //       "updated username is correct"
  //     );
  //     assert.equal(
  //       event.biography,
  //       updatedBiography,
  //       "updated biography is correct"
  //     );
  //     assert.equal(
  //       event.profilePictureURL,
  //       updatedProfilePictureURL,
  //       "updated profilePictureURL is correct"
  //     );
  //     // Test it should not allow to update an account without username
  //     await decentragram.createAccount(
  //       owner,
  //       "",
  //       updatedBiography,
  //       updatedProfilePictureURL,
  //       {
  //         from: owner,
  //       }
  //     ).should.be.rejected;
  //   });
  // });

  // describe("createPost", () => {
  //   let result, postID, profile;
  //   let postDescription = "test_post_description";
  //   let postType = "Image";
  //   let postURL =
  //     "https://fuchsia-recent-squirrel-434.mypinata.cloud/ipfs/QmRSZrGXfsu7dsboestCcf1mFy7FS3owbSoxZn81HCNiw8";
  //   before(async () => {
  //     result = await decentragram.createPost(
  //       postDescription,
  //       postURL,
  //       postType,
  //       {
  //         from: owner,
  //       }
  //     );
  //     postID = await decentragram._postID();
  //     profile = await decentragram.profiles(owner);
  //   });
  //   it("user has a profile", async () => {
  //     assert.notEqual(profile, null, "user profile exists");
  //   });
  //   it("creates a new post", async () => {
  //     // Success
  //     assert.equal(postID, 1);
  //     const event = result.logs[0].args;
  //     assert.equal(event.author, owner, "owner is correct");
  //     assert.equal(
  //       event.postDescription,
  //       postDescription,
  //       "post description is correct"
  //     );
  //     assert.equal(event.postURL, postURL, "post URL is correct");
  //     assert.equal(event.postType, postType, "post type is correct");

  //     // Test it should not allow to create a post without post description
  //     // await decentragram.createPost("", postURL, postType, {
  //     //   from: owner,
  //     // }).should.be.rejected;
  //   });
  // });

  // describe("likePost", () => {
  //   let result, postID, profile;
  //   before(async () => {
  //     postID = await decentragram._postID();
  //     result = await decentragram.likePost(postID, {
  //       from: owner,
  //     });
  //     profile = await decentragram.profiles(owner);
  //   });
  //   it("user has a profile", async () => {
  //     assert.notEqual(profile, null, "user profile exists");
  //   });
  //   it("likes a post", async () => {
  //     const event = result.logs[0].args;
  //     assert.equal(
  //       event.userWhoLike,
  //       owner,
  //       "user address who likes the post is correct"
  //     );
  //     assert.equal(
  //       event.postID,
  //       1,
  //       "id of post that has been liked is correct"
  //     );
  //     assert.equal(event.likeCount, 1, "like count increment is correct");
  //   });
  // });

  // describe("unlikePost", () => {
  //   let result, postID, profile;
  //   before(async () => {
  //     postID = await decentragram._postID();
  //     result = await decentragram.unlikePost(postID, {
  //       from: owner,
  //     });
  //     profile = await decentragram.profiles(owner);
  //   });
  //   it("user has a profile", async () => {
  //     assert.notEqual(profile, null, "user profile exists");
  //   });
  //   it("post that the user removes a like has been previously liked", async () => {
  //     assert.equal(postID, 2, "post has been previously liked");
  //   });
  //   it("unlikes a post", async () => {
  //     const event = result.logs[0].args;
  //     assert.equal(
  //       event.userWhoLike,
  //       owner,
  //       "user address who unlikes the post is correct"
  //     );
  //     assert.equal(
  //       event.postID,
  //       1,
  //       "id of post that has been removed a like is correct"
  //     );
  //     assert.equal(event.likeCount, 0, "like count decrement is correct");
  //   });
  // });

  // describe("dislikePost", () => {
  //   let result, postID, profile;
  //   before(async () => {
  //     postID = await decentragram._postID();
  //     result = await decentragram.dislikePost(postID, {
  //       from: owner,
  //     });
  //     profile = await decentragram.profiles(owner);
  //   });
  //   it("user has a profile", async () => {
  //     assert.notEqual(profile, null, "user profile exists");
  //   });
  //   it("dislikes a post", async () => {
  //     const event = result.logs[0].args;
  //     assert.equal(
  //       event.userWhoDislike,
  //       owner,
  //       "user address who dislikes the post is correct"
  //     );
  //     assert.equal(
  //       event.postID,
  //       1,
  //       "id of post that has been disliked is correct"
  //     );
  //     assert.equal(event.dislikeCount, 1, "dislike count increment is correct");
  //   });
  // });

  // describe("undislikePost", () => {
  //   let result, postID, profile;
  //   before(async () => {
  //     postID = await decentragram._postID();
  //     result = await decentragram.undislikePost(postID, {
  //       from: owner,
  //     });
  //     profile = await decentragram.profiles(owner);
  //   });
  //   it("user has a profile", async () => {
  //     assert.notEqual(profile, null, "user profile exists");
  //   });
  //   it("post that the user removes a dislike has been previously disliked", async () => {
  //     assert.equal(postID, 1, "post has been previously disliked");
  //   });
  //   it("undislikes a post", async () => {
  //     const event = result.logs[0].args;
  //     assert.equal(
  //       event.userWhoDislike,
  //       owner,
  //       "user address who undislikes the post is correct"
  //     );
  //     assert.equal(
  //       event.postID,
  //       1,
  //       "id of post that has been removed a dislike is correct"
  //     );
  //     assert.equal(event.dislikeCount, 0, "dislike count decrement is correct");
  //   });
  // });

  // describe("tipPost", () => {
  //   let result, postID, profile;
  //   before(async () => {
  //     postID = await decentragram._postID();
  //     profile = await decentragram.profiles(tipper);
  //   });
  //   it("user has a profile", async () => {
  //     assert.notEqual(profile, null, "user profile exists");
  //   });
  //   it("tipper has enough balance to tip", async () => {
  //     let tipperBalance, isEnough;
  //     const balanceInWei = await web3.eth.getBalance(tipper);
  //     tipperBalance = web3.utils.fromWei(balanceInWei);
  //     isEnough = tipperBalance > 0.1;
  //     assert.equal(isEnough, true, "tipper balance is enough");
  //   });
  //   it("allows users to tip images", async () => {
  //     // Track the author balance before tipping
  //     let oldAuthorBalance;
  //     oldAuthorBalance = await web3.eth.getBalance(owner);
  //     oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);

  //     result = await decentragram.tipPost(postID, {
  //       from: tipper,
  //       value: web3.utils.toWei("0.1", "Ether"),
  //     });

  //     // SUCCESS
  //     const event = result.logs[0].args;
  //     assert.equal(event.postId, 1, "id is correct");
  //     assert.equal(
  //       event.tipAmount,
  //       "100000000000000000",
  //       "tip amount is correct"
  //     );
  //     assert.equal(event.author, owner, "author is correct");

  //     // Check that author received funds
  //     let newAuthorBalance;
  //     newAuthorBalance = await web3.eth.getBalance(owner);
  //     newAuthorBalance = new web3.utils.BN(newAuthorBalance);

  //     let tipImageOwner;
  //     tipImageOwner = web3.utils.toWei("0.1", "Ether");
  //     tipImageOwner = new web3.utils.BN(tipImageOwner);

  //     const expectedBalance = oldAuthorBalance.add(tipImageOwner);

  //     assert.equal(newAuthorBalance.toString(), expectedBalance.toString());
  //   });
  // });

  describe("followUser", () => {
    let result, postID, profile, userAddressToFollow;
    before(async () => {
      userAddressToFollow = "0x03718334CF0D1bb3B2beE1510b46d9acD4c6D4F7";
      postID = await decentragram._postID();
      result = await decentragram.follow(userAddressToFollow, {
        from: owner,
      });
      profile = await decentragram.profiles(owner);
    });
    it("user has a profile", async () => {
      assert.notEqual(profile, null, "user profile exists");
    });
    it("follows a user", async () => {
      const event = result.logs[0].args;
      assert.equal(
        event.accountAddress,
        userAddressToFollow,
        "user address who get followed is correct"
      );
      assert.equal(
        event.followerCount,
        1,
        "follower count increment is correct"
      );
    });
  });

  // describe("images", async () => {
  //   let result, imageCount;
  //   const hash = "QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb";

  //   before(async () => {
  //     result = await decentragram.uploadImage(hash, "Image description", {
  //       from: author,
  //     });
  //     imageCount = await decentragram.imageCount();
  //   });

  //   //check event
  //   it("creates images", async () => {
  //     // SUCESS
  //     assert.equal(imageCount, 1);
  //     const event = result.logs[0].args;
  //     assert.equal(event.id.toNumber(), imageCount.toNumber(), "id is correct");
  //     assert.equal(event.hash, hash, "Hash is correct");
  //     assert.equal(
  //       event.description,
  //       "Image description",
  //       "description is correct"
  //     );
  //     assert.equal(event.tipAmount, "0", "tip amount is correct");
  //     assert.equal(event.author, author, "author is correct");

  //     // FAILURE: Image must have hash
  //     await decentragram.uploadImage("", "Image description", { from: author })
  //       .should.be.rejected;

  //     // FAILURE: Image must have description
  //     await decentragram.uploadImage("Image hash", "", { from: author }).should
  //       .be.rejected;
  //   });

  //   //check from Struct
  //   it("lists images", async () => {
  //     const image = await decentragram.images(imageCount);
  //     assert.equal(image.id.toNumber(), imageCount.toNumber(), "id is correct");
  //     assert.equal(image.hash, hash, "Hash is correct");
  //     assert.equal(
  //       image.description,
  //       "Image description",
  //       "description is correct"
  //     );
  //     assert.equal(image.tipAmount, "0", "tip amount is correct");
  //     assert.equal(image.author, author, "author is correct");
  //   });

  //   it("allows users to tip images", async () => {
  //     // Track the author balance before purchase
  //     let oldAuthorBalance;
  //     oldAuthorBalance = await web3.eth.getBalance(author);
  //     oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);

  //     result = await decentragram.tipImageOwner(imageCount, {
  //       from: tipper,
  //       value: web3.utils.toWei("1", "Ether"),
  //     });

  //     // SUCCESS
  //     const event = result.logs[0].args;
  //     assert.equal(event.id.toNumber(), imageCount.toNumber(), "id is correct");
  //     assert.equal(event.hash, hash, "Hash is correct");
  //     assert.equal(
  //       event.description,
  //       "Image description",
  //       "description is correct"
  //     );
  //     assert.equal(
  //       event.tipAmount,
  //       "1000000000000000000",
  //       "tip amount is correct"
  //     );
  //     assert.equal(event.author, author, "author is correct");

  //     // Check that author received funds
  //     let newAuthorBalance;
  //     newAuthorBalance = await web3.eth.getBalance(author);
  //     newAuthorBalance = new web3.utils.BN(newAuthorBalance);

  //     let tipImageOwner;
  //     tipImageOwner = web3.utils.toWei("1", "Ether");
  //     tipImageOwner = new web3.utils.BN(tipImageOwner);

  //     const expectedBalance = oldAuthorBalance.add(tipImageOwner);

  //     assert.equal(newAuthorBalance.toString(), expectedBalance.toString());

  //     // FAILURE: Tries to tip a image that does not exist
  //     await decentragram.tipImageOwner(99, {
  //       from: tipper,
  //       value: web3.utils.toWei("1", "Ether"),
  //     }).should.be.rejected;
  //   });
  // });
});
