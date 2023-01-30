import { MathfieldElement } from "mathlive";
import katex from "katex";
import "./index.css";

/**
 * Class for MathFieldElement
 *
 */
import MathField from "./math";

export default class InlineMath {


  static get isInline() {
    return true;
  }

  /**
   * MathEditor's styles
   *
   * @returns {Object}
   */
  get CSS() {
    return {
      settingsButton: this.api.styles.inlineToolButton,
      settingsButtonActive: this.api.styles.inlineToolButtonActive,
      wrapper: "cdx-inline-math-info",
      wrapperForType: (type) => `cdx-inline-math-${type}`,
    };
  }

  static get DEFAULT_TYPE() {
    return "cdx-inline-math-success";
  }

  /**
   * MathEditor's style list
   * @returns {Array}
   */
  static get MATH_TYPES() {
    return [
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "danger",
      "light",
      "dark",
      "pink",
      "choco",
    ];
  }

  constructor({ api}) {
    this.button = null;
    this.state = false;
    this.api = api;
    this.tag='CODE';

  }

  render() {
    this.button = this.make("button", this.api.styles.inlineToolButton, {
      type: "button",
      textContent: "+/-",
    });

    return this.button;
  }

  /**
   * Helper for making Elements with attributes
   * @param {string} tagName - new Element tag name
   * @param {array|string} classNames - list or name of CSS classname(s)
   * @param {Object} attributes - any attributes
   * @returns {Element}
   */

  make(tagName, classNames = null, attributes = {}) {
    let el = document.createElement(tagName);
    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (let attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

   /**
   * Create instance of MathfieldElement
   * @returns {MathfieldElement}
   */

  //  createMfe(){
  //   return new MathField(this.data,this.api,true);
  // }

  /**
   * Wrap / Unwrap selected fragment
   * @param {Range} range - selected fragment
   */

  surround(range) {
    if (!range) {
      // If inline math is already applied, do nothing for now
      return;
    }
  
    let mathWrapper = this.api.selection.findParentTag(this.tag,this.CSS.wrapper);

    console.log(mathWrapper);
    /**
     * If start or end of selection is in the highlighted block
     * 
     */
    if(mathWrapper){
      this.unwrap(mathWrapper);
    } else {
      this.wrap(range)
    }
  }
  /**
   * Wrap selection with term-tag
   * 
   * @param {Range} range - selected fragment
   *    */
  wrap(range){
    /**
     * Create a wrapper for math element
     */
    let span=this.make(this.tag,this.CSS.wrapper);
    /**
     * Surround Content throws an error if the Range splits a non-Text node with
     */
  //   katex.render(range.extractContents().textContent.toString(), span, {
  //     throwOnError: false
  // });

  // let mfe=new MathfieldElement();
  // mfe.setValue(range.extractContents().textContent.toString());
  // mfe.setOptions({
  //   defaultMode:'inline-math',
  //   virtualKeyboardMode:'off',
  //   readOnly:true
  // });
  // mfe.classList.add(this.CSS.wrapper);


    span.appendChild(range.extractContents());

    range.insertNode(span);

  /**
   * Expand (add) selection to highlighted block
   */
  this.api.selection.expandToTag(span);
  }
  /**
   * Unwrap term-tag
   * @param {HTMLElement} mathWrapper - math wrapper tag
   */
  unwrap(mathWrapper){
    /**
     * Expand selection to all term-tag
     */
    this.api.selection.expandToTag(mathWrapper);
    let sel = window.getSelection();
    let range= sel.getRangeAt(0);

    let unwrappedContent = range.extractContents();
    /**
     * Remove empty term-tg
     */
    mathWrapper.parentNode.removeChild(mathWrapper);
    /**
     * Insert extracted content
     */
    range.insertNode(unwrappedContent);
    /**
     * Restore selection
     */
    sel.removeAllRanges();
    sel.addRange(range);
  }
  /**
   * 
   * @param {Range} selection 
   */

  checkState(selection) {}
}
