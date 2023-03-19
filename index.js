/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast-util-toc').Options} Options
 */

import {toc} from 'mdast-util-toc'

/**
 * Plugin to generate a Table of Contents (TOC).
 *
 * @type {import('unified').Plugin<[Options?]|void[], Root>}
 */
export default function remarkTocCollapse(options = {}) {
  return (node) => {
    const result = toc(
      node,
      Object.assign({}, options, {
        heading: options.heading || 'toc|table[ -]of[ -]contents?'
      })
    )

    if (
      result.endIndex === null ||
      result.index === null ||
      result.index === -1 ||
      !result.map
    ) {
      return
    }

    // Get the table of content's headings.
    const summary = node.children[result.index - 1]

    /*
    * Remove the retrieved heading mdast elements from
    * their current location and place them inside the summary element.
    */
    node.children.splice(result.index - 1, 1)

    node.children = [
      ...node.children.slice(0, result.index - 1),
      {
        type: 'html',
        value: '<details>'
      },
      {
        type: 'html',
        value: '<summary>'
      },
      summary,
      {
        type: 'html',
        value: '</summary>'
      },
      result.map,
      {
        type: 'html',
        value: '</details>'
      },
      ...node.children.slice(result.endIndex)
    ]
  }
}
