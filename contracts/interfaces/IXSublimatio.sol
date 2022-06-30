// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import { IERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface IXSublimatio is IERC721Enumerable {

    /// @notice Emitted when the base URI is set (or re-set).
    event AirdropSet(address indexed account);

    /// @notice Emitted when the base URI is set (or re-set).
    event BaseURISet(string baseURI);

    /// @notice Emitted when an account has decomposed of their drugs into its molecules.
    event DrugDecomposed(uint256 indexed drug, uint256[] molecules);

    /// @notice Emitted when an account has accepted ownership.
    event OwnershipAccepted(address indexed previousOwner, address indexed owner);

    /// @notice Emitted when owner proposed an account that can accept ownership.
    event OwnershipProposed(address indexed owner, address indexed pendingOwner);

    /// @notice Emitted when proceeds have been withdrawn to proceeds destination.
    event ProceedsWithdrawn(uint256 amount);

    /// @notice Emitted when an account is given the right to claim a free water molecule as a promotion.
    event PromotionAccountSet(address indexed account);

    /// @notice Emitted when an account is loses the right to claim a free water molecule as a promotion.
    event PromotionAccountUnset(address indexed account);

    /*************/
    /*** State ***/
    /*************/

    function PRICE_PER_TOKEN_MINT() external returns (uint256 pricePerTokenMint_);

    function PROCEEDS_DESTINATION() external returns (address proceedsDestination_);

    function LAUNCH_TIMESTAMP() external returns (uint256 launchTimestamp_);

    function baseURI() external returns (string memory baseURI_);

    function canClaimFreeWater(address account_) external returns (bool canClaimFreeWater_);

    function owner() external returns (address owner_);

    function pendingOwner() external returns (address pendingOwner_);

    /***********************/
    /*** Admin Functions ***/
    /***********************/

    function acceptOwnership() external;

    function proposeOwnership(address newOwner_) external;

    function setBaseURI(string calldata baseURI_) external;

    function setPromotionAccounts(address[] memory accounts_) external;

    function unsetPromotionAccounts(address[] memory accounts_) external;

    function withdrawProceeds() external;

    /**************************/
    /*** External Functions ***/
    /**************************/

    function brew(uint256[] calldata molecules_, uint256 drugType_, address destination_) external returns (uint256 drug_);

    function claimWater(address destination_) external returns (uint256 molecule_);

    function decompose(uint256 drug_) external;

    function giveWaters(address[] memory destinations_, uint256[] memory amounts_) external returns (uint256[][] memory molecules_);

    function giveMolecules(address[] memory destinations_, uint256[] memory amounts_) external returns (uint256[][] memory molecules_);

    function purchase(address destination_, uint256 quantity_, uint256 minQuantity_) external payable returns (uint256[] memory molecules_);

    /***************/
    /*** Getters ***/
    /***************/

    function availabilities() external view returns (uint256[63] memory moleculesAvailabilities_, uint256[19] memory drugAvailabilities_);

    function contractURI() external view returns (string memory contractURI_);

    function drugAvailabilities() external view returns (uint256[19] memory availabilities_);

    function drugsAvailable() external view returns (uint256 drugsAvailable_);

    function getAvailabilityOfDrug(uint256 drugType_) external view returns (uint256 availability_);

    function getAvailabilityOfMolecule(uint256 moleculeType_) external view returns (uint256 availability_);

    function getDrugContainingMolecule(uint256 molecule_) external view returns (uint256 drug_);

    function getMoleculesWithinDrug(uint256 drug_) external view returns (uint256[] memory molecules_);

    function getRecipeOfDrug(uint256 drugType_) external pure returns (uint8[] memory recipe_);

    function moleculesAvailable() external view returns (uint256 moleculesAvailable_);

    function moleculeAvailabilities() external view returns (uint256[63] memory availabilities_);

    function tokensOfOwner(address owner_) external view returns (uint256[] memory tokenIds_);

}
