/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface SplitterInterface extends utils.Interface {
  contractName: "Splitter";
  functions: {
    "accounts(uint256)": FunctionFragment;
    "banked(address,uint256)": FunctionFragment;
    "changeAccount(uint256,address)": FunctionFragment;
    "splitETH()": FunctionFragment;
    "splitToken(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "accounts",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "banked",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "changeAccount",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(functionFragment: "splitETH", values?: undefined): string;
  encodeFunctionData(functionFragment: "splitToken", values: [string]): string;

  decodeFunctionResult(functionFragment: "accounts", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "banked", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "changeAccount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "splitETH", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "splitToken", data: BytesLike): Result;

  events: {};
}

export interface Splitter extends BaseContract {
  contractName: "Splitter";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SplitterInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    accounts(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    banked(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    changeAccount(
      index_: BigNumberish,
      account_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    splitETH(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    splitToken(
      token_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  accounts(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  banked(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  changeAccount(
    index_: BigNumberish,
    account_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  splitETH(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  splitToken(
    token_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    accounts(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    banked(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    changeAccount(
      index_: BigNumberish,
      account_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    splitETH(overrides?: CallOverrides): Promise<void>;

    splitToken(token_: string, overrides?: CallOverrides): Promise<void>;
  };

  filters: {};

  estimateGas: {
    accounts(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    banked(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    changeAccount(
      index_: BigNumberish,
      account_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    splitETH(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    splitToken(
      token_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    accounts(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    banked(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    changeAccount(
      index_: BigNumberish,
      account_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    splitETH(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    splitToken(
      token_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
