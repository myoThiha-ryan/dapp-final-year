pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Decentragram {
    string public name;

    struct User {
        string username;
        string biography;
        string profilePictureHash;
        Friend[] friends;
    }

    struct Friend {
        address pubkey;
        string username;
    }

    struct Post {
        uint id;
        address payable author;
        string username;
        string profilePictureHash;
        string imgHash;
        string content;
        uint timestamp;
        uint tipAmount;
        uint likes;
        uint dislikes;
    }

    struct AllUserStruct {
        string username;
        string biography;
        string profilePictureHash;
        address accountAddress;
    }

    AllUserStruct[] getAllUsers; // array to store all the registered users
    Post[] allPosts; // array to store all posts created in the application

    // to map from the user account address to related User struct
    mapping(address => User) public users;

    // to map from the author's account address to the array of related posts created
    mapping(address => Post[]) public posts;

    // events for contract

    event UserCreated(string username, string biography, string profileImgHash);
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

    constructor() public {
        name = "Decentragram";
    }

    function checkUserExists(address _pubkey) public view returns (bool) {
        return bytes(users[_pubkey].username).length > 0;
    }

    function createAccount(
        string memory _username,
        string memory _biography,
        string memory _profilePictureHash
    ) public {
        require(checkUserExists(msg.sender) == false, "User already exists");
        require(bytes(_username).length > 0);

        users[msg.sender].username = _username;
        users[msg.sender].biography = _biography;
        users[msg.sender].profilePictureHash = _profilePictureHash;
        getAllUsers.push(
            AllUserStruct(
                _username,
                _biography,
                _profilePictureHash,
                msg.sender
            )
        );
    }

    function getUsername(address _pubkey) public view returns (string memory) {
        require(checkUserExists(_pubkey), "User is not registered");
        return users[_pubkey].username;
    }

    function getUser(address _pubkey) public view returns (User memory) {
        require(checkUserExists(_pubkey), "User is not registered");
        return users[_pubkey];
    }

    function uploadImage(
        string memory _imgHash,
        string memory _description
    ) public {
        // Make sure the image hash exists
        require(bytes(_imgHash).length > 0);
        // Make sure image description exists
        require(bytes(_description).length > 0);
        // Make sure uploader address exists
        require(msg.sender != address(0));

        // Increment image id
        imageCount++;

        // Add Image to the contract
        images[imageCount] = Image(
            imageCount,
            _imgHash,
            _description,
            0,
            msg.sender
        );
        // Trigger an event
        emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender);
    }

    function createPost(string memory _content, string memory _imgHash) public {
        require(checkUserExists(msg.sender), "Create an account first");

        Post memory newPost = Post({
            id: posts[msg.sender].length,
            author: msg.sender,
            username: users[msg.sender].username,
            profilePictureHash: users[msg.sender].profilePictureHash,
            content: _content,
            imgHash: _imgHash,
            timestamp: block.timestamp,
            likes: 0,
            dislikes: 0,
            tipAmount: 0
        });

        posts[msg.sender].push(newPost);
        allPosts.push(newPost);
    }

    function likePost(address _author, uint _id) external {
        require(checkUserExists(msg.sender), "Create an account first");
        require(posts[_author][_id].id == _id, "Post does not exist");
        posts[_author][_id].likes++;

        // Emit the PostLiked event
    }

    function unlikePost(address _author, uint _id) external {
        require(checkUserExists(msg.sender), "Create an account first");
        require(posts[_author][_id].id == _id, "Post does not exist");
        require(posts[_author][_id].likes > 0, "Post has no likes");
        posts[_author][_id].likes--;

        // Emit the PostUnliked event
    }

    function dislikePost(address _author, uint _id) external {
        require(checkUserExists(msg.sender), "Create an account first");
        require(posts[_author][_id].id == _id, "Post does not exist");
        posts[_author][_id].dislikes++;

        // Emit the PostDisliked event
    }

    function unDislikePost(address _author, uint _id) external {
        require(checkUserExists(msg.sender), "Create an account first");
        require(posts[_author][_id].id == _id, "Post does not exist");
        require(posts[_author][_id].dislikes > 0, "Post has no likes");
        posts[_author][_id].dislikes--;

        // Emit the PostUnDisliked event
    }

    function tipImageOwner(uint _id) public payable {
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
    }

    function addFriend(address friend_key, string memory _username) public {
        require(checkUserExists(msg.sender), "Create an account first");
        require(checkUserExists(friend_key), "User is not registered");
        require(
            msg.sender != friend_key,
            "Users cannot add themselves as friends"
        );
        require(
            checkAlreadyFriends(msg.sender, friend_key) == false,
            "These users are already friends"
        );
        _addFriend(msg.sender, friend_key, _username);
        _addFriend(friend_key, msg.sender, users[msg.sender].username);
    }

    function checkAlreadyFriends(
        address _pubkey1,
        address _pubkey2
    ) internal view returns (bool) {
        if (users[_pubkey1].friends.length > users[_pubkey2].friends.length) {
            address temp = _pubkey1;
            _pubkey1 = _pubkey2;
            _pubkey2 = temp;
        }

        for (uint i = 0; i < users[_pubkey1].friends.length; i++) {
            if (users[_pubkey1].friends[i].pubkey == _pubkey2) return true;
        }

        return false;
    }

    function _addFriend(
        address _me,
        address friend_key,
        string memory _username
    ) internal {
        Friend memory newFriend = Friend(friend_key, _username);
        users[_me].friends.push(newFriend);
    }

    function getMyFriendList() external view returns (Friend[] memory) {
        return users[msg.sender].friends;
    }

    function getAllAppUser() public view returns (AllUserStruct[] memory) {
        return getAllUsers;
    }

    function getPost(uint _id) public view returns (Post memory) {
        return posts[msg.sender][_id];
    }

    function getAllUserPosts(
        address _owner
    ) public view returns (Post[] memory) {
        return posts[_owner];
    }

    function getAllFeedPosts() public view returns (Post[] memory) {
        return allPosts;
    }

    uint public imageCount = 0;

    mapping(address => Image) public statuses;
    mapping(uint => Image) public images;

    struct Image {
        uint id;
        string hash;
        string description;
        uint tipAmount;
        address payable author;
    }
}
