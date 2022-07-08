// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract MockERC20 {
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    function transfer(address to, uint256 amount) public virtual returns (bool) {
        balanceOf[msg.sender] -= amount;

        unchecked {
            balanceOf[to] += amount;
        }

        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual returns (bool) {
        balanceOf[from] -= amount;

        unchecked {
            balanceOf[to] += amount;
        }

        return true;
    }

    function mint(address to, uint256 amount) public virtual {
        totalSupply += amount;

        unchecked {
            balanceOf[to] += amount;
        }
    }

    function burn(address from, uint256 amount) public virtual {
        balanceOf[from] -= amount;

        unchecked {
            totalSupply -= amount;
        }
    }
}