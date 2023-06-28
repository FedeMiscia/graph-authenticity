import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts"; // Import di alcuni tipi di dato utilizzati nelle funzioni

import {
  ItemBought as ItemBoughtEvent,
  ItemCancelled as ItemCancelledEvent,
  ItemListed as ItemListedEvent,
  TokenGetBack as TokenGetBackEvent,
  Token_Transfered as Token_TransferedEvent,
} from "../generated/NftMarketplace/NftMarketplace";
import {
  ItemBought,
  ItemCancelled,
  ItemListed,
  TokenGetBack,
  Token_Transfered,
  ActiveItem,
} from "../generated/schema";

export function handleItemBought(event: ItemBoughtEvent): void {
  // In questo handler dobbiamo fare due cose:
  // 1) Salvare l'evento nel nostro graph
  // 2) Aggiornare gli active items
  // A tal proposito dobbiamo anche:
  // Prendere o creare un oggetto relativo ad un listed item
  // Ciascun item ha bisogno di un Id unico (lo andiamo a generare tramite una funzione creata ad hoc)
  // Dobbiamo creare un ItemBoughtObject, cioè cosa andremo a salvare a partire dal semplice evento

  // Preleviamo un elemento con uno specifico id dalla "tabella" ItemBought
  let itemBought = ItemBought.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  ); // Carichiamo l'oggetto di tipo ItemBought con un certo id ottenuto dai parametri dell'evento che stiamo ascoltando
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemBought) {
    // Se l'oggetto di tipo ItemBought con l'id specificato non esiste allora lo creiamo al momento (assegnandogli proprio quell'id)
    itemBought = new ItemBought(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  // A questo punto aggiorniamo i parametri dell'oggetto itemBought con quanto leggiamo dai parametri dell'evento (i parametri di itemBought sono quelli che abbiamo definito in schema.graphql relativamnete all'entità ItemBought)
  // Quando qualcuno acquista un prodotto, andiamo ad aggiornare l'oggetto itemBought con i dati letti dall'evento e l'oggetto activeItem solamente per quanto riguarda il buyer
  itemBought.buyer = event.params.buyer;
  itemBought.nftAddress = event.params.nftAddress;
  itemBought.tokenId = event.params.tokenId;
  itemBought.inStaking = true;
  itemBought.timestamp = event.block.timestamp;

  activeItem!.buyer = event.params.buyer; // Se activeItem ha un buyer vuol dire che è stato acquistato, altrimenti vuol dire che è ancora disponibile
  itemBought.save(); // Salvataggio delle modifiche
  activeItem!.save(); // NOTA: il ! in questo caso significa che ci aspettiamo di avere un oggetto activeItem
}

export function handleItemCancelled(event: ItemCancelledEvent): void {
  let itemCanceled = ItemCancelled.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemCanceled) {
    itemCanceled = new ItemCancelled(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }

  itemCanceled.seller = event.params.seller;
  itemCanceled.nftAddress = event.params.nftAddress;
  itemCanceled.tokenId = event.params.tokenId;

  activeItem!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD"
  ); // Se troviamo un dead address come buyer allora vorrà dire che quell'elemento è stato cancellato dal marketplace

  itemCanceled.save();
  activeItem!.save();
}

export function handleItemListed(event: ItemListedEvent): void {
  // Ogni volta che avviene un nuovo list di un item, faremo anche il list di un active item
  // Partiamo prelevando l'itemLIsted e l'activeItem, nel caso questi già esistano in quanto stiamo facendo semplicemente un aggiornamento anziché un nuovo listing
  let itemListed = ItemListed.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  // Verifichiamo l'esistenza degli oggetti che abbiamo tentato di estrarre. Se non esistono li creiamo perché vuol dire che stiamo facendo un nuovo listing
  if (!itemListed) {
    itemListed = new ItemListed(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }

  // Se stiamo facendo un aggiornamento allora l'activeItem esisterà già, se invece stiamo facendo un nuovo listing dovremo crearlo
  if (!activeItem) {
    activeItem = new ActiveItem(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  } else {
    activeItem.buyer = null;
  }

  // Aggiorniamo gli oggetti con i parametri letti dall'evento
  itemListed.seller = event.params.seller;
  activeItem.seller = event.params.seller;

  itemListed.nftAddress = event.params.nftAddress;
  activeItem.nftAddress = event.params.nftAddress;

  itemListed.tokenId = event.params.tokenId;
  activeItem.tokenId = event.params.tokenId;

  itemListed.save();
  activeItem.save();
}

export function handleToken_Transfered(event: Token_TransferedEvent): void {
  let tokenTransfered = Token_Transfered.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );

  // Se il trasferimento per quel token è già presente allora aggiorniamo solamente altrimenti creiamo da zero il record
  if (!tokenTransfered) {
    tokenTransfered = new Token_Transfered(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }

  let itemBought = ItemBought.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );

  itemBought!.inStaking = false; // Quando un token viene trasferito una volta aver superato il tempo di garanzia esso viene rimosso dallo staking

  tokenTransfered.from = event.params.from;
  tokenTransfered.to = event.params.to;
  tokenTransfered.nftAddress = event.params.nftAddress;
  tokenTransfered.tokenId = event.params.tokenId;

  tokenTransfered.save();
  itemBought!.save();
}

export function handleTokenGetBack(event: TokenGetBackEvent): void {
  let tokenGetBack = new TokenGetBack(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );

  let itemBought = ItemBought.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );

  itemBought!.inStaking = false; // Quando viene restituito un token esso viene tolto dallo staking

  tokenGetBack.nftAddress = event.params.nftAddress;
  tokenGetBack.tokenId = event.params.tokenId;
  tokenGetBack.owner = event.params.owner;

  tokenGetBack.save();
  itemBought!.save();
}

// Funzione per creare un Id per ciascun item a partire dal tokenId e dall'indirizzo dell'NFT
function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString(); // Concatenazione dei due parametri convertiti in esadecimale e poi in stringa
}
