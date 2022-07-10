//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract owned {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}

contract LicenseToken is owned {
    enum LicenseState {
        ACTIVE,
        INACTIVE,
        EXPIRED
    }

    uint256 constant LICENSE_LIFE_TIME = 30 days;

    struct LicenseInfo {
        uint registeredOn;
        uint expiresOn;
        LicenseState state;
    }

    LicenseInfo[] tokens;

    mapping(uint256 => address) tokenIndexToOwner;
    mapping(address => uint256) ownershipTokenCount;
    mapping(uint256 => address) tokenIndexToApproved;

    event LicenseGiven(address account, uint256 tokenId);
    event Transfer(address from, address to, uint256 tokenId);

    constructor() {}

    // ERC-721 functions
    function totalSupply() public view returns (uint256 total) {
        return tokens.length;
    }

    function balanceOf(address _account) public view returns (uint256 balance) {
        return ownershipTokenCount[_account];
    }

    function ownerOf(uint256 _tokenId) public view returns (address owner) {
        owner = tokenIndexToOwner[_tokenId];
        require(owner != address(0));

        return owner;
    }

    // licensing logic
    function giveLicense(address _account) public onlyOwner {
        uint256 tokenId = _mint(_account);
        emit LicenseGiven(_account, tokenId);
    }

    function activate(uint _tokenId) public onlyOwner {
        LicenseInfo storage token = tokens[_tokenId];
        require(token.registeredOn != 0);
        require(token.state == LicenseState.INACTIVE);

        token.state = LicenseState.ACTIVE;
        token.expiresOn = block.timestamp + LICENSE_LIFE_TIME;
    }

    function isLicenseActive(address _account, uint256 _tokenId)
        public
        view
        returns (uint state)
    {
        require(tokenIndexToOwner[_tokenId] == _account);

        LicenseInfo memory token = tokens[_tokenId];
        if (
            token.expiresOn < block.timestamp &&
            token.state == LicenseState.ACTIVE
        ) {
            return uint(LicenseState.EXPIRED);
        }

        return uint(token.state);
    }

    // internal methods
    function _owns(address _claimant, uint256 _tokenId)
        internal
        view
        returns (bool)
    {
        return tokenIndexToOwner[_tokenId] == _claimant;
    }

    function _mint(address _account)
        internal
        onlyOwner
        returns (uint256 tokenId)
    {
        // create new token
        LicenseInfo memory token = LicenseInfo({
            state: LicenseState.INACTIVE,
            registeredOn: block.timestamp,
            expiresOn: 0
        });
        tokens.push(token);
        uint id = tokens.length - 1;
        _transfer(address(0), _account, id);
        return id;
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        ownershipTokenCount[_to]++;
        tokenIndexToOwner[_tokenId] = _to;

        if (_from != address(0)) {
            ownershipTokenCount[_from]--;
            delete tokenIndexToApproved[_tokenId];
        }
        emit Transfer(_from, _to, _tokenId);
    }
}
