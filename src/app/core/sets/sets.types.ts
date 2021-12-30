export interface SetMainData {
  readonly name: string;
  readonly imgUrl: string;
}

export interface DbSet extends SetMainData {
  readonly dateAdded: Date;
  readonly editable: boolean;
}

export interface Set extends DbSet {
  readonly id: string;
}