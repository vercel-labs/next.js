import { HTMLAttributes, ReactNode } from "react";

export interface ITileProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}
