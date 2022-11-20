// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface IMyToken {
    function getPastVotes(address, uint256) external view returns (uint256);

    function grantRole(bytes32 role, address account) external;
}

contract TokenizedBallot {
    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    IMyToken public tokenContract;
    Proposal[] public proposals;
    string[] public proposalNames;
    bytes32[] public proposalNames32;
    uint256 public targetBlockNumber;

    mapping(address => uint256) public votePowerSpent;

    constructor(
        string[] memory _proposalNames,
        address _tokenContract,
        uint256 _targetBlockNumber
    ) {
        tokenContract = IMyToken(_tokenContract);
        targetBlockNumber = _targetBlockNumber;
        for (uint i = 0; i < _proposalNames.length; i++) {
            proposalNames.push(_proposalNames[i]);
        }
        for (uint i=0; i < proposalNames.length; i++) {
            proposalNames[i]
        }


    }
            proposals.push(Proposal({name: _proposalNames[i], voteCount: 0}));

    function getBytes32ArrayForInput() pure public returns (bytes32[3] b32Arr) {

    }


    function vote(uint256 proposal, uint256 amount) external {
        require(
            votingPower(msg.sender) >= amount,
            "Insufficient amount of votes"
        );
        proposals[proposal].voteCount += amount;
        votePowerSpent[msg.sender] += amount;
    }

    function votingPower(address account) public view returns (uint256) {
        uint256 pastVotes = tokenContract.getPastVotes(
            account,
            targetBlockNumber
        );
        return pastVotes - votePowerSpent[account];
    }

    /// @dev Computes the winning proposal taking all
    /// previous votes into account.
    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // Calls winningProposal() function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
