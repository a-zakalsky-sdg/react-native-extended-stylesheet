/**
 * This file contains rather loose declarations for Extended StyleSheets.
 *
 * Writing strict declarations is a tricky (impossible?) task,
 * because EStyleSheet actively operates with dynamic keys:
 * - variables (started with "$...")
 * - media queries (started with "@media...")
 * - underscored output keys (started with "_...")
 *
 * Adding key augmention is tracked here: https://github.com/Microsoft/TypeScript/issues/12754
 */

import { StyleSheet, ImageStyle, TextStyle, ViewStyle } from 'react-native';

type KeyStringWithPrefix = `$${string}` | `@${string}`;
type ValueStringWithPrefix = `$${string}` | `${string}rem`;


type Value<T> = T | ((...args: any[]) => T) | ((string | boolean | null) & {});
type Variable<T> = Value<T>;
type Extended<T> = { [K in keyof T]: T[K] | ValueStringWithPrefix | ((...args: any[]) => T[K]); } & { [key: string]: any }

type AnyStyle = ImageStyle & TextStyle & ViewStyle;

export type EStyleSet<T = any> = {
    [K in keyof T]:
    T[K] extends KeyStringWithPrefix ? any :
    T[K] extends Variable<number> ? T[K] :
    T[K] extends MediaQuery ? T[K] :
    Extended<AnyStyle>
}
type StyleSet<T = any> = {
    [K in keyof T]:
    T[K] extends KeyStringWithPrefix ? any :
    T[K] extends MediaQuery ? any :
    T[K] extends number ? T[K] :
    T[K] extends boolean ? T[K] :
    T[K] extends string ? T[K] :
    T[K] extends AnyStyle ? AnyStyle :
    any
}

export type StyleConst = Extended<AnyStyle>;

type MediaQuery = { [key: string]: Extended<AnyStyle> };

export default EStyleSheet;

declare namespace EStyleSheet {
    type AnyObject = { [key: string]: any };
    type Event = 'build';
    export function create<T = EStyleSet>(styles: EStyleSet<T>): StyleSet<T>;
    export function build(rawGlobalVars?: AnyObject): void;
    export function value(expr: any, prop?: string): any;
    export function child(styles: AnyObject, styleName: string, index: number, count: number): AnyObject;
    export function subscribe(event: Event, listener: () => any): void;
    export function clearCache(): void;

    // inherited from StyleSheet
    export const flatten: typeof StyleSheet.flatten;
    export const setStyleAttributePreprocessor: typeof StyleSheet.setStyleAttributePreprocessor;
    export const hairlineWidth: typeof StyleSheet.hairlineWidth;
    export const absoluteFillObject: typeof StyleSheet.absoluteFillObject;
    export const absoluteFill: typeof StyleSheet.absoluteFill;
}


