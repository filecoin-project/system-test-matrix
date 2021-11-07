/**
 * Returns type of props of React component T.
 */
export type ReactProps<
  T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>,
> = JSX.LibraryManagedAttributes<T, React.ComponentPropsWithRef<T>>

/**
 * Type of a component with T props, with forwarding ref to E.
 */
export type RefForwardingComponent<
  T,
  E extends Element,
> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<T> & React.RefAttributes<E>
>

/**
 * Maps HTML tag names to corresponding HTMLElement types.
 *
 * @private
 */
interface HTMLElementTypeMap {
  a: HTMLAnchorElement
  button: HTMLButtonElement
  canvas: HTMLCanvasElement
  div: HTMLDivElement
  section: HTMLDivElement
  aside: HTMLDivElement
  header: HTMLDivElement
  footer: HTMLDivElement
  nav: HTMLDivElement
  body: HTMLBodyElement
  dl: HTMLDListElement
  form: HTMLFormElement
  h1: HTMLHeadingElement
  h2: HTMLHeadingElement
  h3: HTMLHeadingElement
  h4: HTMLHeadingElement
  h5: HTMLHeadingElement
  h6: HTMLHeadingElement
  hr: HTMLHRElement
  img: HTMLImageElement
  input: HTMLInputElement
  label: HTMLLabelElement
  legend: HTMLLegendElement
  li: HTMLLIElement
  ol: HTMLOListElement
  p: HTMLParagraphElement
  pre: HTMLPreElement
  span: HTMLSpanElement
  table: HTMLTableElement
  td: HTMLTableDataCellElement
  tr: HTMLTableRowElement
  th: HTMLTableHeaderCellElement
  textarea: HTMLTextAreaElement
  ul: HTMLUListElement
  svg: SVGElement
  heading: HTMLHeadingElement
  col: HTMLTableColElement
  colgroup: HTMLTableColElement
}

export type HTMLElementType = keyof HTMLElementTypeMap

/**
 * HTMLElement type reference.
 */
export type ElementRef = Element | HTMLElementType

/**
 * Maps to the correct set of React attributes for a given element type T.
 * @private
 */
type ReactAttributes<T> = T extends HTMLAnchorElement
  ? React.AnchorHTMLAttributes<T>
  : T extends HTMLInputElement
  ? React.InputHTMLAttributes<T>
  : T extends HTMLButtonElement
  ? React.ButtonHTMLAttributes<T>
  : T extends HTMLFormElement
  ? React.FormHTMLAttributes<T>
  : T extends HTMLImageElement
  ? React.ImgHTMLAttributes<T>
  : T extends HTMLLabelElement
  ? React.LabelHTMLAttributes<T>
  : T extends HTMLTextAreaElement
  ? React.TextareaHTMLAttributes<T>
  : React.HTMLAttributes<T>

/**
 * Detailed props for a DOM component.
 *
 * @example
 * type DivProps = ElementProps<HTMLDivElement>;
 * type DivProps = ElementProps<'div'>; // same type as previous
 */
export type ElementProps<T extends ElementRef> = T extends HTMLElementType
  ? ReactAttributes<HTMLElementTypeMap[T]>
  : ReactAttributes<T>
