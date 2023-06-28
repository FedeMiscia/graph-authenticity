import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ItemBought,
  ItemCancelled,
  ItemListed,
  TokenGetBack,
  Token_Transfered
} from "../generated/NftMarketplace/NftMarketplace"

export function createItemBoughtEvent(
  buyer: Address,
  nftAddress: Address,
  tokenId: BigInt
): ItemBought {
  let itemBoughtEvent = changetype<ItemBought>(newMockEvent())

  itemBoughtEvent.parameters = new Array()

  itemBoughtEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  itemBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  itemBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return itemBoughtEvent
}

export function createItemCancelledEvent(
  seller: Address,
  nftAddress: Address,
  tokenId: BigInt
): ItemCancelled {
  let itemCancelledEvent = changetype<ItemCancelled>(newMockEvent())

  itemCancelledEvent.parameters = new Array()

  itemCancelledEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  itemCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  itemCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return itemCancelledEvent
}

export function createItemListedEvent(
  seller: Address,
  nftAddress: Address,
  tokenId: BigInt
): ItemListed {
  let itemListedEvent = changetype<ItemListed>(newMockEvent())

  itemListedEvent.parameters = new Array()

  itemListedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return itemListedEvent
}

export function createTokenGetBackEvent(
  nftAddress: Address,
  tokenId: BigInt,
  owner: Address
): TokenGetBack {
  let tokenGetBackEvent = changetype<TokenGetBack>(newMockEvent())

  tokenGetBackEvent.parameters = new Array()

  tokenGetBackEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  tokenGetBackEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  tokenGetBackEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return tokenGetBackEvent
}

export function createToken_TransferedEvent(
  from: Address,
  to: Address,
  nftAddress: Address,
  tokenId: BigInt
): Token_Transfered {
  let tokenTransferedEvent = changetype<Token_Transfered>(newMockEvent())

  tokenTransferedEvent.parameters = new Array()

  tokenTransferedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  tokenTransferedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  tokenTransferedEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  tokenTransferedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return tokenTransferedEvent
}
