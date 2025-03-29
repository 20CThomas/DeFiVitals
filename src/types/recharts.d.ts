declare module 'recharts' {
  import { ComponentType, ReactNode } from 'react';

  export interface CommonProps {
    width?: number | string;
    height?: number | string;
    data?: any[];
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  }

  export interface ChartProps extends CommonProps {
    children?: ReactNode;
  }

  export interface AxisProps {
    dataKey?: string;
    stroke?: string;
    tick?: {
      fill?: string;
    };
    tickFormatter?: (value: any) => string;
    interval?: number;
    angle?: number;
    textAnchor?: string;
    height?: number;
  }

  export interface TooltipProps {
    formatter?: (value: any, name?: string) => [string, string];
  }

  export interface PieProps {
    data?: any[];
    cx?: string | number;
    cy?: string | number;
    labelLine?: boolean;
    outerRadius?: number;
    fill?: string;
    dataKey?: string;
    children?: ReactNode;
  }

  export interface CellProps {
    key?: string;
    fill?: string;
  }

  export interface LineProps {
    type?: string;
    dataKey?: string;
    stroke?: string;
    strokeWidth?: number;
    dot?: boolean;
    name?: string;
  }

  export interface BarProps {
    dataKey?: string;
    fill?: string;
    name?: string;
  }

  export const ResponsiveContainer: ComponentType<CommonProps>;
  export const PieChart: ComponentType<ChartProps>;
  export const Pie: ComponentType<PieProps>;
  export const Cell: ComponentType<CellProps>;
  export const Tooltip: ComponentType<TooltipProps>;
  export const Legend: ComponentType<any>;
  export const LineChart: ComponentType<ChartProps>;
  export const Line: ComponentType<LineProps>;
  export const XAxis: ComponentType<AxisProps>;
  export const YAxis: ComponentType<AxisProps>;
  export const CartesianGrid: ComponentType<any>;
  export const BarChart: ComponentType<ChartProps>;
  export const Bar: ComponentType<BarProps>;
} 