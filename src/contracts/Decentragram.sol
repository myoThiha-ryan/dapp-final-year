pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Decentragram {
    string public contractName;
    address public admin;
    address[] internal addresses;
    mapping(string => address) internal names;
    // to map from the user account address to related profile struct
    mapping(address => Profile) public profiles;
    mapping(address => mapping(address => Profile)) internal followers;
    mapping(address => mapping(address => Profile)) internal following;
    // to map from the author's account address to the array of related posts created
    mapping(address => Post[]) internal posts;
    mapping(address => uint[]) internal likedPosts;
    mapping(address => uint[]) internal dislikedPosts;

    //GREATING DI
    uint256 public _postID;
    uint256 public _userID;

    // Profile
    struct Profile {
        address owner;
        string username;
        string biography;
        string profilePictureURL;
        uint timeCreated;
        uint id;
        uint postCount;
        uint followerCount;
        uint followingCount;
        address[] followers;
        address[] following;
    }

    // struct User {
    //     string username;
    //     string biography;
    //     string profilePictureURL;
    //     Friend[] friends;
    // }

    // struct Friend {
    //     address pubkey;
    //     string username;
    // }

    struct Post {
        uint postId;
        address payable author;
        string username;
        string profilePictureURL;
        string postType;
        string postURL;
        string postDescription;
        uint timeCreated;
        uint tipAmount;
        uint likes;
        uint dislikes;
    }

    struct AllUserStruct {
        address owner;
        string username;
        string biography;
        string profilePictureURL;
        uint timeCreated;
        uint id;
        uint postCount;
        uint followerCount;
        uint followingCount;
    }

    AllUserStruct[] getAllUsers; // array to store all the registered users

    // Check if message sender has a created profile
    modifier senderHasProfile() {
        require(
            profiles[msg.sender].owner != address(0x0),
            "ERROR: <Must create a profile to perform this action>"
        );
        _;
    }

    // Check if a specified address has created a profile
    modifier profileExists(address _address) {
        require(
            profiles[_address].owner != address(0x0),
            "ERROR: <Profile does not exist>"
        );
        _;
    }

    // Check that the message sender is not specifying an address that is itself
    modifier notSelf(address _address) {
        require(
            msg.sender != _address,
            "ERROR <You cannot follow/unfollow yourself"
        );
        _;
    }

    // Check that the input is not empty
    // modifier nonEmptyInput(string memory _input) {
    //     require(
    //         keccak256(abi.encodePacked(_input)) !=
    //             keccak256(abi.encodePacked("")),
    //         "ERROR: <Input cannot be empty>"
    //     );
    //     _;
    // }

    // events for contract

    /*event UserCreated(string username, string biography, string profileImgHash);
    event PostCreated(
        uint id,
        address payable postAuthor,
        string imgHash,
        string content,
        uint timestamp,
        uint tipAmount,
        uint likes,
        uint dislikes
    );
    event PostLiked(
        address liker,
        address postAuthor,
        uint postid,
        uint newLikeCount
    );
    event PostUnLiked(
        address unliker,
        address postAuthor,
        uint postid,
        uint newLikeCount
    );
    event PostDisliked(
        address disliker,
        address postAuthor,
        uint postid,
        uint newDislikeCount
    );
    event PostUnDisliked(
        address unDisliker,
        address postAuthor,
        uint postid,
        uint newDislikeCount
    );

    event ImageCreated(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
    );

    event ImageTipped(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
    );
    */
    constructor() public {
        contractName = "Decentragram";
        admin = msg.sender;
    }

    // Create a new profile from a given username
    function createAccount(
        string memory _username,
        string memory _biography,
        string memory _profilePictureURL
    ) public {
        // Checks that the current account did not already make a profile and did not choose a taken username
        require(
            profiles[msg.sender].owner == address(0x0),
            "ERROR: <You have already created an account>"
        );
        require(names[_username] == address(0x0), "ERROR: <Username taken>");
        //Increment User ID
        _userID++;
        uint256 userID = _userID;

        // Updates username list
        names[_username] = msg.sender;

        // Create the new profile object and add it to "profiles" mapping
        profiles[msg.sender] = Profile({
            owner: msg.sender,
            username: _username,
            biography: _biography,
            profilePictureURL: _profilePictureURL,
            timeCreated: block.timestamp,
            id: userID,
            postCount: 0,
            followerCount: 0,
            followingCount: 0,
            followers: new address[](0x0),
            following: new address[](0x0)
        });

        // Add address to list of global addresses
        addresses.push(msg.sender);

        // users[msg.sender].username = _username;
        // users[msg.sender].biography = _biography;
        // users[msg.sender].profilePictureHash = _profilePictureHash;

        getAllUsers.push(
            AllUserStruct(
                msg.sender,
                _username,
                _biography,
                _profilePictureURL,
                block.timestamp,
                userID,
                0,
                0,
                0
            )
        );
    }

    // Follow a new profile
    function follow(
        address _address
    ) external senderHasProfile profileExists(_address) notSelf(_address) {
        // Add entry to "followers" and "following" mappings
        followers[_address][msg.sender] = profiles[msg.sender];
        following[msg.sender][_address] = profiles[_address];

        // Add element to "followers" and "following" arrays in both Profile objects
        profiles[_address].followers.push(msg.sender);
        profiles[msg.sender].following.push(_address);

        // Increment "followerCount" and "followingCount" in both Profile objects
        profiles[_address].followerCount++;
        profiles[msg.sender].followingCount++;

        // Increment "followerCount" and "followingCount" in both All Users objects
        for (uint256 i = 0; i < getAllUsers.length; i++) {
            if (getAllUsers[i].owner == _address) {
                getAllUsers[i].followerCount++;
            }
            if (getAllUsers[i].owner == msg.sender) {
                getAllUsers[i].followingCount++;
            }
        }
    }

    // Unfollow a profile
    // This deletion operation has a time complexity of O(N), is there a better way to do this?
    function unfollow(
        address _address
    ) external senderHasProfile profileExists(_address) notSelf(_address) {
        // Delete entry from "followers" and "following" mappings
        delete followers[_address][msg.sender];
        delete following[msg.sender][_address];

        // Delete element from "followers" array in Profile object and decrement followerCount
        for (uint i = 0; i < profiles[_address].followerCount; i++) {
            if (profiles[_address].followers[i] == msg.sender) {
                profiles[_address].followers[i] = profiles[_address].followers[
                    profiles[_address].followers.length - 1
                ];
                profiles[_address].followers.pop();
                profiles[_address].followerCount--;
                break;
            }
        }

        // Delete element from "following" array in Profile object and decrement followingCount
        for (uint i = 0; i < profiles[msg.sender].followingCount; i++) {
            if (profiles[msg.sender].following[i] == _address) {
                profiles[msg.sender].following[i] = profiles[msg.sender]
                    .following[profiles[msg.sender].following.length - 1];
                profiles[msg.sender].following.pop();
                profiles[msg.sender].followingCount--;
                break;
            }
        }

        // Decrement "followerCount" and "followingCount" in both All Users objects
        for (uint256 i = 0; i < getAllUsers.length; i++) {
            if (getAllUsers[i].owner == _address) {
                getAllUsers[i].followerCount--;
            }
            if (getAllUsers[i].owner == msg.sender) {
                getAllUsers[i].followingCount--;
            }
        }
    }

    //Create a Post
    function createPost(
        string memory _postDescription,
        string memory _postURL,
        string memory _postType
    ) public senderHasProfile {
        _postID++;
        uint256 postID = _postID;

        Post memory newPost = Post({
            postId: postID,
            author: msg.sender,
            username: profiles[msg.sender].username,
            profilePictureURL: profiles[msg.sender].profilePictureURL,
            postType: _postType,
            postURL: _postURL,
            postDescription: _postDescription,
            timeCreated: block.timestamp,
            tipAmount: 0,
            likes: 0,
            dislikes: 0
        });

        // Add entry to "posts" mappings
        posts[newPost.author].push(newPost);

        // Increment "postCount" in Profile object
        profiles[newPost.author].postCount++;
        // Increment "postCount" in All User object
        for (uint256 i = 0; i < getAllUsers.length; i++) {
            if (getAllUsers[i].owner == newPost.author) {
                getAllUsers[i].postCount++;
            }
        }
    }

    // like post
    function likePost(uint256 _postId) external senderHasProfile {
        for (uint i = 0; i < addresses.length; i++) {
            for (uint j = 0; j < posts[addresses[i]].length; j++) {
                if (posts[addresses[i]][j].postId == _postId) {
                    posts[addresses[i]][j].likes++;
                    likedPosts[msg.sender].push(_postId);
                    break;
                }
            }
        }
    }
    // Unlike post
    function unlikePost(uint256 _postId) external senderHasProfile {
        for (uint i = 0; i < addresses.length; i++) {
            for (uint j = 0; j < posts[addresses[i]].length; j++) {
                if (posts[addresses[i]][j].postId == _postId) {
                    posts[addresses[i]][j].likes--;
                    break;
                }
            }
        }
        for (uint i = 0; i < likedPosts[msg.sender].length; i++) {
            if (_postId == likedPosts[msg.sender][i]) {
                likedPosts[msg.sender][i] = likedPosts[msg.sender][
                    likedPosts[msg.sender].length - 1
                ];
                likedPosts[msg.sender].pop();
                break;
            }
        }
    }

    // dislike post
    function dislikePost(uint256 _postId) external senderHasProfile {
        for (uint i = 0; i < addresses.length; i++) {
            for (uint j = 0; j < posts[addresses[i]].length; j++) {
                if (posts[addresses[i]][j].postId == _postId) {
                    posts[addresses[i]][j].dislikes++;
                    dislikedPosts[msg.sender].push(_postId);
                    break;
                }
            }
        }
    }

    // undislike post
    function undislikePost(uint256 _postId) external senderHasProfile {
        for (uint i = 0; i < addresses.length; i++) {
            for (uint j = 0; j < posts[addresses[i]].length; j++) {
                if (posts[addresses[i]][j].postId == _postId) {
                    posts[addresses[i]][j].dislikes--;
                    break;
                }
            }
        }
        for (uint i = 0; i < dislikedPosts[msg.sender].length; i++) {
            if (_postId == dislikedPosts[msg.sender][i]) {
                dislikedPosts[msg.sender][i] = dislikedPosts[msg.sender][
                    dislikedPosts[msg.sender].length - 1
                ];
                dislikedPosts[msg.sender].pop();
                break;
            }
        }
    }

    // tip post
    function tipPost(uint256 _postId) external payable {
        for (uint i = 0; i < addresses.length; i++) {
            for (uint j = 0; j < posts[addresses[i]].length; j++) {
                if (posts[addresses[i]][j].postId == _postId) {
                    address payable _author = posts[addresses[i]][j].author;
                    address(_author).transfer(msg.value);
                    posts[addresses[i]][j].tipAmount =
                        posts[addresses[i]][j].tipAmount +
                        msg.value;
                    break;
                }
            }
        }
    }

    // tip post
    /*function tipImageOwner(uint256 _postId) external payable {
        for (uint i = 0; i < addresses.length; i++) {
            for (uint j = 0; j < posts[addresses[i]].length; j++) {
                if (posts[addresses[i]][j].postId == _postId) {
                    address payable _author = posts[addresses[i]][j].author;
                    address(_author).transfer(msg.value);
                    posts[addresses[i]][j].tipAmount =
                        posts[addresses[i]][j].tipAmount +
                        msg.value;
                    break;
                }
            }
        }
        // Make sure the id is valid
        require(_id > 0 && _id <= imageCount);
        // Fetch the image
        Image memory _image = images[_id];
        // Fetch the author
        address payable _author = _image.author;
        // Pay the author by sending them Ether
        address(_author).transfer(msg.value);
        // Increment the tip amount
        _image.tipAmount = _image.tipAmount + msg.value;
        // Update the image
        images[_id] = _image;
        // Trigger an event
        emit ImageTipped(
            _id,
            _image.hash,
            _image.description,
            _image.tipAmount,
            _author
        );
    }*/

    // Return all registered users
    function getAllAppUser() public view returns (AllUserStruct[] memory) {
        return getAllUsers;
    }

    // Returns all posts from a given address
    function getPosts(
        address _address
    ) external view profileExists(_address) returns (Post[] memory) {
        return posts[_address];
    }

    function getLikedPostIDs(
        address _address
    ) external view returns (uint[] memory) {
        return likedPosts[_address];
    }

    function getDislikedPostIDs(
        address _address
    ) external view returns (uint[] memory) {
        return dislikedPosts[_address];
    }

    // Returns total user count
    function getUserCount() external view returns (uint) {
        return addresses.length;
    }

    // Returns all registered addresses
    function getAddresses() external view returns (address[] memory) {
        return addresses;
    }

    // Get all followers of a specific address
    function getFollowers(
        address _address
    ) external view profileExists(_address) returns (address[] memory) {
        return profiles[_address].followers;
    }

    // Get all followed accounts of a specific address
    function getFollowing(
        address _address
    ) external view returns (address[] memory) {
        return profiles[_address].following;
    }

    function getAllPosts() public view returns (Post[] memory) {
        uint256 itemCount = 0;
        for (uint256 i = 0; i < addresses.length; i++) {
            itemCount += posts[addresses[i]].length;
        }

        Post[] memory items = new Post[](itemCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < addresses.length; i++) {
            for (uint j = 0; j < posts[addresses[i]].length; j++) {
                items[currentIndex] = posts[addresses[i]][j];
                currentIndex += 1;
            }
        }
        return items;
    }

    // GET SINGLE POST
    // function getSinglePost(
    //     uint256 _postId
    // )
    //     external
    //     view
    //     returns (
    //         address,
    //         string memory,
    //         string memory,
    //         string memory,
    //         string memory,
    //         string memory,
    //         uint,
    //         uint,
    //         uint,
    //         uint
    //     )
    // {
    //     for (uint i = 0; i < addresses.length; i++) {
    //         for (uint j = 0; j < posts[addresses[i]].length; j++) {
    //             if (posts[addresses[i]][j].postId == _postId) {
    //                 return (
    //                     posts[addresses[i]][j].author,
    //                     posts[addresses[i]][j].username,
    //                     posts[addresses[i]][j].profilePictureURL,
    //                     posts[addresses[i]][j].postType,
    //                     posts[addresses[i]][j].postURL,
    //                     posts[addresses[i]][j].postDescription,
    //                     posts[addresses[i]][j].timeCreated,
    //                     posts[addresses[i]][j].tipAmount,
    //                     posts[addresses[i]][j].likes,
    //                     posts[addresses[i]][j].dislikes
    //                 );
    //             }
    //         }
    //     }
    // }

    /*uint public imageCount = 0;

    mapping(address => Image) public statuses;
    mapping(uint => Image) public images;

    struct Image {
        uint id;
        string hash;
        string description;
        uint tipAmount;
        address payable author;
    }*/
}
