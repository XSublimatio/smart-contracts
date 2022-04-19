// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import { XSublimatio } from "../XSublimatio.sol";

contract XSublimatioHarness is XSublimatio {

    constructor (
        string memory baseURI_,
        address owner_,
        uint256 decompositionTime_,
        uint256 pricePerTokenMint_,
        uint256 purchaseBatchSize_,
        uint256 launchTimestamp_,
        uint256 publicTimestamp_
        ) XSublimatio(baseURI_, owner, decompositionTime_, pricePerTokenMint_, purchaseBatchSize_, launchTimestamp_, publicTimestamp_) {}

    function mintDrug(uint256 drugType_, uint256 specialWaterIndex_, uint256 randomNumber_, address destination_) public returns (uint256 tokenId_) {
        COMPACT_STATE_4 = _decrementDrugAvailability(COMPACT_STATE_4, drugType_);
        tokenId_ = (specialWaterIndex_ << 240) | ((drugType_ + 63) << 248) | (randomNumber_ >> 16);
        _mint(destination_, tokenId_);
    }

    function mintDrugs(uint256[] calldata drugType_, uint256[] calldata specialWaterIndex_, uint256[] calldata randomNumber_, address destination_) external returns (uint256[] memory tokenId_) {
        tokenId_ = new uint256[](drugType_.length);

        for (uint256 i; i < drugType_.length; ++i) {
            tokenId_[i] = mintDrug(drugType_[i], specialWaterIndex_[i], randomNumber_[i], destination_);
        }
    }

    function mintMolecule(uint256 moleculeType_, uint256 randomNumber_, address destination_) public returns (uint256 tokenId_) {
        (COMPACT_STATE_1, COMPACT_STATE_2, COMPACT_STATE_3) = _decrementMoleculeAvailability(COMPACT_STATE_1, COMPACT_STATE_2, COMPACT_STATE_3, moleculeType_);
        tokenId_ = (moleculeType_ << 248) | (randomNumber_ >> 16);
        _mint(destination_, tokenId_);
    }

    function mintMolecules(uint256[] calldata moleculeType_, uint256[] calldata randomNumber_, address destination_) external returns (uint256[] memory tokenId_) {
        tokenId_ = new uint256[](moleculeType_.length);

        for (uint256 i; i < moleculeType_.length; ++i) {
            tokenId_[i] = mintMolecule(moleculeType_[i], randomNumber_[i], destination_);
        }
    }

    function decreaseDrugsAvailable(uint256 amount_) external {
        COMPACT_STATE_4 -= amount_ << 152;
    }

    function increaseDrugsAvailable(uint256 amount_) external {
        COMPACT_STATE_4 += amount_ << 152;
    }

    function decreaseDrugAvailability(uint256 drugType_, uint256 amount_) external {
        COMPACT_STATE_4 = COMPACT_STATE_4 + (amount_ << (19 * 8 + 11)) - (amount_ << (19 * 8)) - (1 << (drugType_ * 8));
    }

    function increaseDrugAvailability(uint256 drugType_, uint256 amount_) external {
        COMPACT_STATE_4 = COMPACT_STATE_4 + (amount_ << (19 * 8)) + (amount_ << (drugType_ * 8));
    }

    function decreaseMoleculesAvailable(uint256 amount_) external {
        COMPACT_STATE_3 -= amount_ << 187;
    }

    function increaseMoleculesAvailable(uint256 amount_) external {
        COMPACT_STATE_3 += amount_ << 187;
    }

    function decreaseMoleculeAvailability(uint256 moleculeType_, uint256 amount_) external {
        COMPACT_STATE_3 = COMPACT_STATE_3 + (amount_ << (17 * 11 + 12)) - (amount_ << (17 * 11));

        if (moleculeType_ <= 22) {
            COMPACT_STATE_1 = COMPACT_STATE_1 - (amount_ << ((moleculeType_ % 23) * 11));
        } else if (moleculeType_ <= 45) {
            COMPACT_STATE_2 = COMPACT_STATE_2 - (amount_ << ((moleculeType_ % 23) * 11));
        } else {
            COMPACT_STATE_3 = COMPACT_STATE_3 - (amount_ << ((moleculeType_ % 23) * 11));
        }
    }

    function increaseMoleculeAvailability(uint256 moleculeType_, uint256 amount_) external {
        COMPACT_STATE_3 = COMPACT_STATE_3 + (amount_ << (17 * 11));

        if (moleculeType_ <= 22) {
            COMPACT_STATE_1 = COMPACT_STATE_1 + (amount_ << ((moleculeType_ % 23) * 11));
        } else if (moleculeType_ <= 45) {
            COMPACT_STATE_2 = COMPACT_STATE_2 + (amount_ << ((moleculeType_ % 23) * 11));
        } else {
            COMPACT_STATE_3 = COMPACT_STATE_3 + (amount_ << ((moleculeType_ % 23) * 11));
        }
    }

}
