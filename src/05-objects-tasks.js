/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  const obj = {
    getArea() {
      return this.width * this.height;
    },
  };
  obj.width = width;
  obj.height = height;
  return obj;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const json1 = JSON.parse(json);
  return Object.setPrototypeOf(json1, proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */


class ElementBuilder {
  constructor(element1 = '', id1 = '', pseudoElement1 = '') {
    this.element1 = element1;
    this.id1 = `${id1}`;
    this.pseudoElement1 = `${pseudoElement1}`;
    this.string = `${this.element1}${this.id1}${this.pseudoElement1}`;
  }

  element(value) {
    if (this.element1 === '') {
      this.element1 = value;
      this.string += value;
    } else {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.string.indexOf('#') !== -1 || this.string.indexOf('.') !== -1 || this.string.indexOf('[') !== -1
    || this.string.indexOf(':') !== -1) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    return this;
  }

  id(value) {
    if (this.id1 === '') {
      this.id1 = `#${value}`;
      this.string += this.id1;
    } else {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.string.indexOf('.') !== -1 || this.string.indexOf('[') !== -1
    || this.string.indexOf(':') !== -1) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    return this;
  }

  class(value) {
    this.string += `.${value}`;
    if (this.string.indexOf('[') !== -1 || this.string.indexOf(':') !== -1) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    return this;
  }

  attr(value) {
    this.attr1 = `[${value}]`;
    this.string += this.attr1;
    if (this.string.indexOf(':') !== -1) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    return this;
  }

  pseudoClass(value) {
    this.string += `:${value}`;
    if (this.string.includes('::')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    return this;
  }

  pseudoElement(value) {
    if (this.pseudoElement1 === '') {
      this.pseudoElement1 = `::${value}`;
      this.string += this.pseudoElement1;
    } else {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    return this;
  }

  combine() {
    return this;
  }

  stringify() {
    return `${this.string}`;
  }
}
const cssSelectorBuilder = {

  element(value) {
    const val = value;
    return new ElementBuilder(val);
  },

  id(value) {
    const val = `#${value}`;
    return new ElementBuilder('', val, '');
  },

  class(value) {
    const val = `.${value}`;
    return new ElementBuilder(val);
  },

  attr(value) {
    const val = `[${value}]`;
    return new ElementBuilder(val);
  },

  pseudoClass(value) {
    const val = `:${value}`;
    return new ElementBuilder(val);
  },

  pseudoElement(value) {
    const val = `::${value}`;
    return new ElementBuilder('', '', val);
  },

  combine(selector1, combinator, selector2) {
    this.str = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  },
  stringify() {
    return this.str;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
