import { AppProps } from 'next/app';
import { NextComponentType } from 'next';
import { ReactNode } from 'react';

export interface AppPropsWithComponentWithLayout
  extends Omit<AppProps, 'Component'> {
  Component: ComponentWithLayout;
}

export type ComponentWithLayout = NextComponentType<any, any, any> & {
  getLayout: (page: ReactNode) => JSX.Element;
  pageTitle?: string;
};
