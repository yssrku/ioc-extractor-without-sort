import arrayUnique from "array-unique";

import type { Options } from "../types";

export function normalizeOptions(options: Options): Options {
  return Object.fromEntries(
    ["strictTLD", "enableIDN", "enableRefang", "enableOptionalMask"].map(
      (option)=> [option, options[option] ?? true]
    )
  )
}

/**
 * Reject duplications from an array
 *
 * @export
 * @param {string[]} array An array of strings
 * @returns {string[]} A uniquified array of string
 */
export function dedup(array: string[]): string[] {
  return arrayUnique(array);
}

function orRegExp(regexps: RegExp[]): RegExp {
  return new RegExp(regexps.map((r) => r.source).join("|"), "gi");
}

/**
 * Remove defanged symbols from a string
 *
 * @export
 * @param {string} s A string
 * @returns {string} A cleaned (aka refanged) string
 */
export function refang(s: string): string {
  const dot = orRegExp([
    /\s\.\s/,
    /(\[|\(|\{)\.(\]|\)|\})/,
    /(\[|\(|\{)\./,
    /\.(\]|\)|\})/,
    /\\\./,
    /(\[|\(|\{)dot(\]|\)|\})/,
  ]);
  const colon = /\[:\]/gi;
  const slash = /\[\/\]/gi;
  const colonSlash = /\[:\/\/\]/gi;
  const at = /(\[|\(|\{)(at|@)(\]|\)|\})/gi;
  const http = /h(xx|\*\*)p(s?):\/\//gi;

  return s
    .replace(dot, ".")
    .replace(colon, ":")
    .replace(slash, "/")
    .replace(colonSlash, "://")
    .replace(http, "http$2://")
    .replace(at, "@");
}
