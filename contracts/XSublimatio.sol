// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import { ERC721, ERC721Enumerable, Strings } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import { IXSublimatio } from "./interfaces/IXSublimatio.sol";

// TODO: Some checks are done implicitly by array out-of-bound errors.
// TODO: Don't use ERC721Enumerable if no additional UX is desired (and implement totalSupply manually)

contract XSublimatio is IXSublimatio, ERC721Enumerable {

    uint256 public constant DECOMPOSITION_TIME = 10 days;
    uint256 public constant MOLECULES_PER_PURCHASE = 5;
    uint256 public constant PRICE_PER_MOLECULE = 0.2 ether;

    uint256 internal constant IS_NOT_LOCKED = uint256(1);
    uint256 internal constant IS_LOCKED = uint256(2);

    uint256 internal _lockedStatus = IS_NOT_LOCKED;

    address public owner;
    address public pendingOwner;

    string public baseURI;

    mapping(uint256 => uint256) public burnDateFor;

    bool public brewingEnabled;

    mapping(address => bool) public consumingEnabledFor;

    // Contains first 23 molecule availabilities (11 bits each).
    uint256 internal COMPACT_STATE_1 = uint256(226273811297403348448206775794466307537893312132982461222617777606987601006);

    // Contains second 23 molecule availabilities (11 bits each).
    uint256 internal COMPACT_STATE_2 = uint256(14158944431179587954315785150066846781080893273451554704200278596944724000);

    // Contains (left to right) last 17 molecule availabilities (11 bits each), total molecules available (12 bits), and molecule nonce (remaining 57 bits).
    uint256 internal COMPACT_STATE_3 = uint256(682634909551063736698687712801884272452926746664400702148610);

    // Contains (left to right) 19 drug availabilities (8 bits each), total drugs available (11 bits), and drug nonce (remaining 93 bits).
    uint256 internal COMPACT_STATE_4 = uint256(6474154468114041304457969074349321919403682697978);

    constructor (string memory baseURI_, address owner_) ERC721("XSublimatio", "XSUB") {
        baseURI = baseURI_;
        owner = owner_;
    }

    modifier noReenter() {
        require(_lockedStatus == IS_NOT_LOCKED, "NO_REENTER");

        _lockedStatus = IS_LOCKED;
        _;
        _lockedStatus = IS_NOT_LOCKED;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "UNAUTHORIZED");

        _;
    }

    /***********************/
    /*** Admin Functions ***/
    /***********************/

    function acceptOwnership() external {
        require(pendingOwner == msg.sender, "UNAUTHORIZED");

        emit OwnershipAccepted(owner, msg.sender);
        owner = msg.sender;
        pendingOwner = address(0);
    }

    function enableBrewing() external onlyOwner {
        require(!brewingEnabled, "BREWING_ENABLED");
        brewingEnabled = true;
        emit BrewingEnabled();
    }

    function enableConsumingFor(address consumer_) external onlyOwner {
        require(!consumingEnabledFor[consumer_], "CONSUMING_ENABLED");
        consumingEnabledFor[consumer_] = true;
        emit ConsumingEnabled(consumer_);
    }

    function proposeOwnership(address newOwner_) external onlyOwner {
        emit OwnershipProposed(owner, pendingOwner = newOwner_);
    }

    function setBaseURI(string calldata baseURI_) external onlyOwner {
        emit BaseURISet(baseURI = baseURI_);
    }

    function withdrawProceeds(uint256 amount_, address destination_) external onlyOwner {
        require(_transferEther(destination_, amount_), "ETHER_TRANSFER_FAILED");
        emit ProceedsWithdrawn(destination_, amount_);
    }

    /**************************/
    /*** External Functions ***/
    /**************************/

    function brew(uint256[] calldata tokenIds_, uint256 drugType_, address destination_) external returns (uint256 tokenId_) {
        // Check that brewing is enabled.
        require(brewingEnabled, "BREWING_NOT_YET_ENABLED");

        // Check that drugType_ is valid.
        require(drugType_ < 19, "INVALID_DRUG_TYPE");

        // Cache relevant compact state from storage.
        uint256 compactState4 = COMPACT_STATE_4;

        // Get a random number as the token ID, but shift out space for the drug type (8 bits) and special index (8 bits).
        tokenId_ = _generatePseudoRandomNumber(_getDrugNonce(compactState4)) >> 16;

        // Check that drug is available.
        require(_getDrugAvailability(compactState4, drugType_) != 0, "DRUG_NOT_AVAILABLE");

        // Decrement it's availability, decrement the total amount of drugs available, and increment the drug nonce, and set storage.
        COMPACT_STATE_4 = _decrementDrugAvailability(compactState4, drugType_);

        uint256 specialWater;

        unchecked {
            // The specific special water moleculeType for this drug is 44 more than the drugType.
            specialWater = drugType_ + 44;
        }

        // Fetch the recipe from the pure function.
        uint8[] memory recipe = getRecipe(drugType_);

        uint256 index;

        // For each moleculeType defined by the recipe, check that the provided moleculeType at that index is as expected, or the special water.
        while (index < recipe.length) {
            uint256 tokenId = tokenIds_[index];

            // Check that the caller owns the token.
            require(ownerOf(tokenId) == msg.sender, "NOT_OWNER");

            // Extract molecule type from token id.
            uint256 moleculeType = tokenId >> 248;

            // Check that the molecule type matches what the recipe calls for, or the molecule is the special water.
            if (moleculeType == specialWater) {
                // There is only 1 of molecule of a special water for a specific drug, so no need to worry about overlap here.
                unchecked {
                    // Put recipe index where a special water was used (1-based index, since a zero in this space would mean "none used").
                    tokenId_ |= (index + 1) << 240;
                }
            } else {
                require(recipe[index] == moleculeType, "INVALID_MOLECULE");
            }

            // Burn the molecule.
            _burn(tokenId);

            unchecked {
                ++index;
            }
        }

        // Put token type as the leftmost 8 bits in the token id and mint the drug NFT (drugType + 63).
        _mint(destination_, tokenId_ |= (drugType_ + 63) << 248);
    }

    function decompose(uint256 tokenId_) external {
        // Extract drug type from token id.
        uint256 drugType = (tokenId_ >> 248) - 63;

        // Extract index of the special water used in the recipe, if any. If is the second set of leftmost 8 bits in the tokenId.
        uint256 specialWaterIndex = (tokenId_ >> 240) & type(uint8).max;

        // Check the token is marked for burning and that the burn date has been reached/passed.
        require(block.timestamp >= burnDateFor[tokenId_], "CANNOT_BURN_YET");

        // Delete the burnDate for this token.
        delete burnDateFor[tokenId_];

        // Cache relevant compact states from storage.
        uint256 compactState1 = COMPACT_STATE_1;
        uint256 compactState2 = COMPACT_STATE_2;
        uint256 compactState3 = COMPACT_STATE_3;

        uint256 specialWater;

        unchecked {
            // The specific special water moleculeType for this drug is 44 more than the drugType.
            specialWater = drugType + 44;
        }

        // Fetch the recipe from the pure function.
        uint8[] memory recipe = getRecipe(drugType);

        uint256 index;

        // For each moleculeType defined by the recipe, make the moleculeType at that index, or the special water if used, available again to be purchased.
        while (index < recipe.length) {
            uint256 moleculeType;

            unchecked {
                // Molecule type used in this drug, at this index in the recipe, was either a special water or whatever the recipe called for.
                moleculeType = specialWaterIndex == (index + 1) ? specialWater : recipe[index];

                ++index;
            }

            // Increment the availability of this molecule and increment the total amount of available molecules.
            // Give this pure function the relevant cached compact states and get back updated compact states.
            ( compactState1, compactState2, compactState3 ) = _incrementMoleculeAvailability(compactState1, compactState2, compactState3, moleculeType);
        }

        // Set relevant storage state fromm the cache ones.
        COMPACT_STATE_1 = compactState1;
        COMPACT_STATE_2 = compactState2;
        COMPACT_STATE_3 = compactState3;

        unchecked {
            // Increment the drugs' availability, increment the total amount of drugs available, and set storage.
            COMPACT_STATE_4 = _incrementDrugAvailability(COMPACT_STATE_4, drugType);
        }

        // Burn the drug.
        _burn(tokenId_);
    }

    function purchase(address destination_, uint256 minQuantity_) external payable returns (uint256[] memory tokenIds_) {
        // Cache relevant compact states from storage.
        uint256 compactState1 = COMPACT_STATE_1;
        uint256 compactState2 = COMPACT_STATE_2;
        uint256 compactState3 = COMPACT_STATE_3;

        // Get the number of molecules available from compactState3 and determine how many molecules will be purchased in this call.
        uint256 availableMoleculeCount = _getMoleculesAvailable(compactState3);
        uint256 count = availableMoleculeCount >= MOLECULES_PER_PURCHASE ? MOLECULES_PER_PURCHASE : availableMoleculeCount;

        // Prevent a purchase fo 0 nfts, as well as a purchase of less nfts than the user expected.
        require(count != 0, "NO_MOLECULES_AVAILABLE");
        require(count >= minQuantity_, "CANNOT_FULLFIL_REQUEST");

        // Compute the price this purchase will cost, since it will be needed later, and count will be decremented in a while-loop.
        uint256 totalCost;
        unchecked {
            totalCost = PRICE_PER_MOLECULE * count;
        }

        // Revert if insufficient ether was provided.
        require(msg.value >= totalCost, "INCORRECT_VALUE");

        // Initialize the array of token IDs to a length of the nfts to be purchased.
        tokenIds_ = new uint256[](count);

        while (count > 0) {
            // Get a random number as the token ID, but shift out space for the molecule type (8 bits) and special index (8 bits).
            uint256 tokenId = _generatePseudoRandomNumber(_getMoleculeNonce(compactState3)) >> 16;
            uint256 moleculeType;

            unchecked {
                // Provide _drawMolecule with the 3 relevant cached compact states, and a random number (derived from tokenId) between 0 and availableMoleculeCount - 1, inclusively.
                // The result is newly updated cached compact states. Also, availableMoleculeCount is pre-decremented so that each random number is within correct bounds.
                ( compactState1, compactState2, compactState3, moleculeType ) = _drawMolecule(compactState1, compactState2, compactState3, _limitTo(tokenId, --availableMoleculeCount));

                // Put molecule type as the leftmost 8 bits in the token id (saving it in the array of token IDs) and mint the molecule NFT.
                _mint(destination_, tokenIds_[--count] = (tokenId | (moleculeType << 248)));
            }
        }

        // Set relevant storage state fromm the cache ones.
        COMPACT_STATE_1 = compactState1;
        COMPACT_STATE_2 = compactState2;
        COMPACT_STATE_3 = compactState3;

        // Require that exact ether was provided, or that extra ether is successfully returned to the caller,
        require(msg.value == totalCost || _transferEther(msg.sender, msg.value - totalCost), "ETHER_TRANSFER_FAILED");
    }

    function startDecomposition(uint256 tokenId_) external {
        // Check that consuming is enabled at the caller.
        require(consumingEnabledFor[msg.sender], "CONSUMER_NOT_ENABLED");

        // Check that the caller owns the token.
        require(ownerOf(tokenId_) == msg.sender, "NOT_OWNER");

        // Extract drug type from token id and check that it is in fact a drug.
        require((tokenId_ >> 248) >= 63, "NOT_DRUG");

        unchecked {
            // Add the token to `burnDateFor` so it can be burned after DECOMPOSITION_TIME, and emit the event.
            emit DecompositionStarted(
                msg.sender,
                tokenId_,
                burnDateFor[tokenId_] = block.timestamp + DECOMPOSITION_TIME
            );
        }

        // Take possession of the token.
        _transfer(msg.sender, address(this), tokenId_);
    }

    /***************/
    /*** Getters ***/
    /***************/

    function availabilities() external view returns (uint256[63] memory moleculesAvailabilities_, uint256[19] memory drugAvailabilities_) {
        moleculesAvailabilities_ = moleculeAvailabilities();
        drugAvailabilities_ = drugAvailabilities();
    }

    function contractURI() external view returns (string memory contractURI_) {
        contractURI_ = string(abi.encodePacked(baseURI, "info"));
    }

    function drugsAvailable() external view returns (uint256 drugsAvailable_) {
        drugsAvailable_ = _getDrugsAvailable(COMPACT_STATE_4);
    }

    function drugAvailabilities() public view returns (uint256[19] memory availabilities_) {
        for (uint256 i; i < 19; ++i) {
            availabilities_[i] = _getMoleculeAvailability(COMPACT_STATE_1, COMPACT_STATE_2, COMPACT_STATE_3, i);
        }
    }

    function getDrugAvailability(uint256 drugType_) external view returns (uint256 availability_) {
        availability_ = _getDrugAvailability(COMPACT_STATE_4, drugType_);
    }

    function getMoleculeAvailability(uint256 moleculeType_) external view returns (uint256 availability_) {
        availability_ = _getMoleculeAvailability(COMPACT_STATE_1, COMPACT_STATE_2, COMPACT_STATE_3, moleculeType_);
    }

    function getRecipe(uint256 drugType_) public pure returns(uint8[] memory recipe_) {
        if (drugType_ <= 7) {
            recipe_ = new uint8[](2);

            recipe_[1] =
                drugType_ == 0 ? 1 :  // Alcohol (Isolated)
                drugType_ == 1 ? 33 : // Chloroquine (Isolated)
                drugType_ == 2 ? 8 :  // Cocaine (Isolated)
                drugType_ == 3 ? 31 : // GHB (Isolated)
                drugType_ == 4 ? 15 : // Ketamine (Isolated)
                drugType_ == 5 ? 32 : // LSD (Isolated)
                drugType_ == 6 ? 2 :  // Methamphetamine (Isolated)
                14;                   // Morphine (Isolated)
        } else if (drugType_ == 16) {
            recipe_ = new uint8[](3);

            // Mate
            recipe_[1] = 3;
            recipe_[2] = 4;
        } else if (drugType_ == 11 || drugType_ == 12) {
            recipe_ = new uint8[](4);

            if (drugType_ == 11) { // Khat
                recipe_[1] = 5;
                recipe_[2] = 6;
                recipe_[3] = 7;
            } else {               // Lactuca Virosa
                recipe_[1] = 19;
                recipe_[2] = 20;
                recipe_[3] = 21;
            }
        } else if (drugType_ == 14 || drugType_ == 15 || drugType_ == 17) {
            recipe_ = new uint8[](5);

            if (drugType_ == 14) {        // Magic Truffle
                recipe_[1] = 25;
                recipe_[2] = 26;
                recipe_[3] = 27;
                recipe_[4] = 28;
            } else if (drugType_ == 15) { // Mandrake
                recipe_[1] = 16;
                recipe_[2] = 17;
                recipe_[3] = 18;
                recipe_[4] = 34;
            } else {                      // Opium
                recipe_[1] = 14;
                recipe_[2] = 22;
                recipe_[3] = 23;
                recipe_[4] = 24;
            }
        } else if (drugType_ == 9 || drugType_ == 10 || drugType_ == 18) {
            recipe_ = new uint8[](6);

            if (drugType_ == 9) {         // Belladonna
                recipe_[1] = 16;
                recipe_[2] = 17;
                recipe_[3] = 18;
                recipe_[4] = 29;
                recipe_[5] = 30;
            } else if (drugType_ == 10) { // Cannabis
                recipe_[1] = 9;
                recipe_[2] = 10;
                recipe_[3] = 11;
                recipe_[4] = 12;
                recipe_[5] = 13;
            } else {                      // Salvia Divinorum
                recipe_[1] = 35;
                recipe_[2] = 36;
                recipe_[3] = 40;
                recipe_[4] = 41;
                recipe_[5] = 42;
            }
        } else if (drugType_ == 8) {
            recipe_ = new uint8[](7);

            // Ayahuasca
            recipe_[1] = 8;
            recipe_[2] = 37;
            recipe_[3] = 38;
            recipe_[4] = 39;
            recipe_[5] = 43;
            recipe_[6] = 44;
        } else if (drugType_ == 13) {
            recipe_ = new uint8[](9);

            // Love Elixir
            recipe_[1] = 9;
            recipe_[2] = 45;
            recipe_[3] = 46;
            recipe_[4] = 47;
            recipe_[5] = 48;
            recipe_[6] = 49;
            recipe_[7] = 50;
            recipe_[8] = 51;
        } else {
            revert("INVALID_RECIPE");
        }

        // All recipes require Water, so recipe_[0] remains 0.
    }

    function moleculesAvailable() external view returns (uint256 moleculesAvailable_) {
        moleculesAvailable_ = _getMoleculesAvailable(COMPACT_STATE_3);
    }

    function moleculeAvailabilities() public view returns (uint256[63] memory availabilities_) {
        for (uint256 i; i < 63; ++i) {
            availabilities_[i] = _getDrugAvailability(COMPACT_STATE_4, i);
        }
    }

    /**************************/
    /*** Internal Functions ***/
    /**************************/

    function _decrementDrugAvailability(uint256 compactState4_, uint256 drugType_) internal pure returns (uint256 newCompactState4_) {
        unchecked {
            // Increment the drug nonce, which is located left of 19 8-bit individual drug availabilities and an 11-bit total drug availability.
            // Decrement the total drug availability, which is located left of 19 8-bit individual drug availabilities.
            // Decrement the corresponding availability of a specific drug.
            // Clearer: newCompactState4_ = compactState4_ + (1 << (19 * 8 + 11)) - (1 << (19 * 8)) - (1 << (drugType_ * 8));
            newCompactState4_ = compactState4_ + 11686304107876399506105245517852466176701929357312 - (1 << (drugType_ * 8));
        }
    }

    function _decrementMoleculeAvailability(
        uint256 compactState1_,
        uint256 compactState2_,
        uint256 compactState3_,
        uint256 moleculeType_
    ) internal pure returns (uint256 newCompactState1_, uint256 newCompactState2_, uint256 newCompactState3_) {
        unchecked {
            // Increment the molecule nonce, which is located left of 17 11-bit individual molecule availabilities and a 12-bit total molecule availability.
            // Decrement the total molecule availability, which is located left of 17 11-bit individual molecule availabilities.
            // Clearer: compactState3_ = compactState3_ + (1 << (17 * 11 + 12)) - (1 << (17 * 11));
            compactState3_ = compactState3_ + 803272862700264303997111177751106061685598298283756916572160;

            // Decrement the corresponding availability of a specific molecule, in a compact state given the molecule type.
            if (moleculeType_ <= 22) return (compactState1_ - (1 << ((moleculeType_ % 23) * 11)), compactState2_, compactState3_);

            if (moleculeType_ <= 45) return (compactState1_, compactState2_ - (1 << ((moleculeType_ % 23) * 11)), compactState3_);

            return (compactState1_, compactState2_, compactState3_ - (1 << ((moleculeType_ % 23) * 11)));
        }
    }

    function _drawMolecule(
        uint256 compactState1_,
        uint256 compactState2_,
        uint256 compactState3_,
        uint256 randomNumber_
    ) internal pure returns (uint256 newCompactState1_, uint256 newCompactState2_, uint256 newCompactState3_, uint256 moleculeType_) {
        uint256 offset;

        while (moleculeType_ < 63) {
            unchecked {
                // Increment the offset by the availability of the molecule defined by moleculeType, and break if randomNumber is less than it.
                if (randomNumber_ < (offset += _getMoleculeAvailability(compactState1_, compactState2_, compactState3_, moleculeType_))) break;

                // If not (i.e. randomNumber does not corresponding to picking moleculeType), increment the moleculeType and try again.
                ++moleculeType_;
            }
        }

        // Decrement the availability of this molecule, decrement the total amount of available molecules, and increment some molecule nonce.
        // Give this pure function the relevant cached compact states and get back updated compact states.
        ( newCompactState1_, newCompactState2_, newCompactState3_ ) = _decrementMoleculeAvailability(compactState1_, compactState2_, compactState3_, moleculeType_);
    }

    function _generatePseudoRandomNumber(uint256 randomNonce_) internal view returns (uint256 pseudoRandomNumber_) {
        unchecked {
            pseudoRandomNumber_ = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender, randomNonce_)));
        }
    }

    function _getDrugAvailability(uint256 compactState4_, uint256 drugType_) internal pure returns (uint256 availability_) {
        unchecked {
            availability_ = (compactState4_ >> (drugType_ * 8)) & 255;
        }
    }

    function _getDrugNonce(uint256 compactState4_) internal pure returns (uint256 drugNonce_) {
        // Shift out 19 8-bit values (19 molecule availabilities) and an 11-bit value (total drugs available).
        drugNonce_ = compactState4_ >> 163;
    }

    function _getDrugsAvailable(uint256 compactState4_) internal pure returns (uint256 drugsAvailable_) {
        // Shift out 19 8-bit values (19 drug availabilities) from the right of the compact state, and mask as 11 bits.
        drugsAvailable_ = (compactState4_ >> 152) & 2047;
    }

    function _getMoleculeAvailability(
        uint256 compactState1_,
        uint256 compactState2_,
        uint256 compactState3_,
        uint256 moleculeType_
    ) internal pure returns (uint256 availability_) {
        unchecked {
            availability_ =
                (
                    (
                        moleculeType_ <= 22 ? compactState1_ : moleculeType_ <= 45 ? compactState2_ : compactState3_
                    ) >> (
                        (moleculeType_ % 23) * 11
                    )
                ) & 2047;
        }
    }

    function _getMoleculeNonce(uint256 compactState3_) internal pure returns (uint256 moleculeNonce_) {
        // Shift out 17 11-bit values (17 molecule availabilities) and a 12-bit value (total molecules available).
        moleculeNonce_ = compactState3_ >> 199;
    }

    function _getMoleculesAvailable(uint256 compactState3_) internal pure returns (uint256 moleculesAvailable_) {
        // Shift out 17 11-bit values (17 molecule availabilities) from the right of the compact state, and mask as 12 bits.
        moleculesAvailable_ = (compactState3_ >> 187) & 4095;
    }

    function _incrementDrugAvailability(uint256 compactState4_, uint256 drugType_) internal pure returns (uint256 newCompactState4_) {
        unchecked {
            // Increment the total drug availability, which is located left of 19 8-bit individual drug availabilities.
            // Increment the corresponding availability of a specific drug.
            // Clearer: newCompactState4_ = compactState4_ + (1 << (19 * 8)) + (1 << (drugType_ * 8));
            newCompactState4_ = compactState4_ + 5708990770823839524233143877797980545530986496 + (1 << (drugType_ * 8));
        }
    }

    function _incrementMoleculeAvailability(
        uint256 compactState1_,
        uint256 compactState2_,
        uint256 compactState3_,
        uint256 moleculeType_
    ) internal pure returns (uint256 newCompactState1_, uint256 newCompactState2_, uint256 newCompactState3_) {
        unchecked {
            // Increment the total molecule availability, which is located left of 17 11-bit individual molecule availabilities.
            // Clearer: compactState3_ = compactState3_ + (1 << (17 * 11));
            compactState3_ = compactState3_ + 196159429230833773869868419475239575503198607639501078528;

            // Increment the corresponding availability of a specific molecule, in a compact state given the molecule type.
            if (moleculeType_ <= 22) return (compactState1_ + (1 << ((moleculeType_ % 23) * 11)), compactState2_, compactState3_);

            if (moleculeType_ <= 45) return (compactState1_, compactState2_ + (1 << ((moleculeType_ % 23) * 11)), compactState3_);

            return (compactState1_, compactState2_, compactState3_ + (1 << ((moleculeType_ % 23) * 11)));
        }
    }

    function _limitTo(uint256 input_, uint256 max_) internal pure returns (uint256 output_) {
        output_ = 0 == max_ ? 0 : input_ % (max_ + 1);
    }

    function _transferEther(address destination_, uint256 amount_) internal returns (bool success_) {
        ( success_, ) = destination_.call{ value: amount_ }("");
    }

}
