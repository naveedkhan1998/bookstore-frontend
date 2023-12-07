export interface RefreshTokenResult {
  data?: {
    access?: string;
    refresh?: string;
  };
}
export type Credentials = {
  email: string;
  password: string;
};

export type Elixirs = {
  id: string;
  name: string;
  effect: string;
  sideEffects: string;
  characteristics: null | string;
  time: null | string;
  difficulty: string;
  ingredients: Ingredient[];
  inventors: any[];
  manufacturer: null | string;
};

export type Ingredient = {
  id: string;
  name: string;
};

export type BookVolume = {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: {
      type: string;
      identifier: string;
    }[];
    readingModes?: {
      text: boolean;
      image: boolean;
    };
    pageCount?: number;
    printType?: string;
    categories?: string[];
    maturityRating?: string;
    allowAnonLogging?: boolean;
    contentVersion?: string;
    panelizationSummary?: {
      containsEpubBubbles: boolean;
      containsImageBubbles: boolean;
    };
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
    };
    language?: string;
    previewLink?: string;
    infoLink?: string;
    canonicalVolumeLink?: string;
  };
  saleInfo: {
    country: string;
    saleability: string;
    isEbook: boolean;
    listPrice?: {
      amount: number;
      currencyCode: string;
    };
    retailPrice?: {
      amount: number;
      currencyCode: string;
    };
  };
  accessInfo: {
    country: string;
    viewability: string;
    embeddable: boolean;
    publicDomain: boolean;
    textToSpeechPermission: string;
    epub?: {
      isAvailable: boolean;
    };
    pdf?: {
      isAvailable: boolean;
      acsTokenLink: string;
    };
    webReaderLink?: string;
    accessViewStatus: string;
    quoteSharingAllowed: boolean;
  };
  searchInfo?: {
    textSnippet: string;
  };
};

export interface BookList {
  _id: string;
  name: string;
  isPrivate: boolean;
  books: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BookListContainer {
  _id?: string;
  bookLists?: BookList[];
  createdAt?: string;
  updatedAt?: string;
  reviews?: Reviews[];
  __v?: number;
}

export type Reviews = {
  reviewId:string;
  reviewText: string;
  reviewerName: string;
  isHidden: boolean;
};

export type BookCategory = {
  _id: string;
  name?: string;
  books: string[];
  authorName?: string;
  reviews?: Reviews[];
};

export type PublicBooklist = BookCategory[];

export type BooksInCart = Record<string, number>;

export interface UserCart {
  _id?: string;
  books: BooksInCart;
  __v?: number;
}


type TransactionItem = Record<string, number>;

type Transaction = {
  price: number;
  items: TransactionItem;
};

export type Transactions = Record<string, Transaction>;

export type TransactionObject = {
  transactions: Transactions;
};
