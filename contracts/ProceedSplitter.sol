// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

contract ProceedSplitter {

    address constant internal ADDRESS_1 = address(0x00);
    address constant internal ADDRESS_2 = address(0x00);
    address constant internal ADDRESS_3 = address(0x00);

    uint256 constant internal DIVISOR_1 = uint256(3);
    uint256 constant internal DIVISOR_2 = uint256(3);
    uint256 constant internal DIVISOR_3 = uint256(3);

    function _transferEther(address destination_, uint256 amount_) internal returns (bool success_) {
        ( success_, ) = destination_.call{ value: amount_ }("");
    }

    receive() external payable {
        require(_transferEther(ADDRESS_1, msg.value/DIVISOR_1), "TRANSFER_1_FAILED");
        require(_transferEther(ADDRESS_2, msg.value/DIVISOR_2), "TRANSFER_1_FAILED");
        require(_transferEther(ADDRESS_3, msg.value/DIVISOR_3), "TRANSFER_1_FAILED");
    }

}
