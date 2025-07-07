import type { PropsWithChildren } from "react";

export interface CommonComponentProps extends PropsWithChildren {
  id: number;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
