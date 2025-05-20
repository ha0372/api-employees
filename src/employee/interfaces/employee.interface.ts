import { Document } from 'mongodb';

export interface Employee extends Document {
  name: string;
  surnames: string;
  age: number;
  city: string;
  email: string;
  position: string;
  departament: string;
  createAt: Date;
  updateAt: Date;
  isDelete: boolean;
}