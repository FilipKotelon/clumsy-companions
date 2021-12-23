export interface DbSet {
  name: string;
  imgUrl: string;
  dateAdded: Date;
  editable: boolean;
}

export interface Set extends DbSet {
  id: string;
}

export interface SetUpdateData {
  name: string;
  imgUrl: string;
}