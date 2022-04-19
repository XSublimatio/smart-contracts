// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import { IERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface IXSublimatio is IERC721Enumerable {

    /// @notice Emitted when the base URI is set (or re-set).
    event BaseURISet(string baseURI);

    /// @notice Emitted when owner has enabled brewing.
    event BrewingEnabled();

    /// @notice Emitted when owner has enabled consuming at an address.
    event ConsumingEnabled(address consumer);

    /// @notice Emitted when owner has withdrawn proceeds.
    event DecompositionStarted(address indexed owner, uint256 indexed tokenId, uint256 burnDate);

    /// @notice Emitted when an account has accepted ownership.
    event OwnershipAccepted(address indexed previousOwner, address indexed owner);

    /// @notice Emitted when an account is given the privilege to buy before the public.
    event PrivilegedAccountSet(address indexed account);

    /// @notice Emitted when an account loses the privilege to buy before the public.
    event PrivilegedAccountUnset(address indexed account);

    /// @notice Emitted when owner proposed an account that can accept ownership.
    event OwnershipProposed(address indexed owner, address indexed pendingOwner);

    /// @notice Emitted when owner has withdrawn proceeds.
    event ProceedsWithdrawn(address indexed destination, uint256 amount);

    /*************/
    /*** State ***/
    /*************/

    function DECOMPOSITION_TIME() external returns (uint256 decompositionTime_);

    function PRICE_PER_TOKEN_MINT() external returns (uint256 pricePerTokenMint_);

    function PURCHASE_BATCH_SIZE() external returns (uint256 purchaseBatchSize_);

    function LAUNCH_TIMESTAMP() external returns (uint256 launchTimestamp_);

    function PUBLIC_TIMESTAMP() external returns (uint256 publicTimestamp_);

    function baseURI() external returns (string memory baseURI_);

    function brewingEnabled() external returns (bool brewingEnabled_);

    function burnDateFor(uint256 tokenId_) external returns (uint256 burnDate_);

    function consumingEnabledFor(address consumer_) external returns (bool consumingEnabled_);

    function owner() external returns (address owner_);

    function pendingOwner() external returns (address pendingOwner_);

    /***********************/
    /*** Admin Functions ***/
    /***********************/

    function acceptOwnership() external;

    function enableBrewing() external;

    function enableConsumingFor(address consumer_) external;

    function proposeOwnership(address newOwner_) external;

    function setBaseURI(string calldata baseURI_) external;

    function withdrawProceeds(uint256 amount_, address destination_) external;

    /**************************/
    /*** External Functions ***/
    /**************************/

    function brew(uint256[] calldata tokenIds_, uint256 drugType_, address destination_) external returns (uint256 tokenId_);

    function decompose(uint256 tokenId_) external;

    function purchase(address destination_, uint256 minQuantity_) external payable returns (uint256[] memory tokenIds_);

    function startDecomposition(uint256 tokenId_) external;

    /***************/
    /*** Getters ***/
    /***************/

    function availabilities() external view returns (uint256[63] memory moleculesAvailabilities_, uint256[19] memory drugAvailabilities_);

    function contractURI() external view returns (string memory contractURI_);

    function drugsAvailable() external view returns (uint256 drugsAvailable_);

    function drugAvailabilities() external view returns (uint256[19] memory availabilities_);

    function getDrugAvailability(uint256 drugType_) external view returns (uint256 availability_);

    function getMoleculeAvailability(uint256 moleculeType_) external view returns (uint256 availability_);

    function getRecipe(uint256 drugType_) external pure returns(uint8[] memory recipe_);

    function moleculesAvailable() external view returns (uint256 moleculesAvailable_);

    function moleculeAvailabilities() external view returns (uint256[63] memory availabilities_);

}
