import { Behavior } from "./Behavior";
import { System } from "./System";
import { Test } from "./Test";

export interface IModel {
  getAllSystems(): System[];
  findSystemByName(name: string): System;
  getAllTests(): Test[];
  getAllBehaviors(): Behavior[];
}
