import { StrictOptions } from "@/types";

import {
  idnPrefix,
  labelLetters,
  nonStrictTld,
  oneOrMoreLabel,
  relaxedOneOrMoreLabel,
  strictTld,
  zeroOrMoreLabel,
  zeroOrMoreLabelWithHyphen,
  relaxedZeroOrMoreLabelWithHyphen,
  relaxedLabelLettersWithHyphen,
} from "./regexes";

export function domainRegex(
  options: StrictOptions = {
    strict: true,
  },
): RegExp {
  const tld = options.strict ? strictTld : nonStrictTld;
  const regex =
    `(?=[${relaxedLabelLettersWithHyphen}.]{1,252}\\.(${tld})\\b)` +
    `((?![^x][^n]--)(${idnPrefix}${zeroOrMoreLabel}|${relaxedOneOrMoreLabel})(${relaxedZeroOrMoreLabelWithHyphen}[${labelLetters}])?\\.){0,126}` +
    `((?![^x][^n]--)(${idnPrefix}${zeroOrMoreLabel}|${oneOrMoreLabel})(${zeroOrMoreLabelWithHyphen}[${labelLetters}])?\\.)` +
    `(${tld})\\b`;
  return new RegExp(regex, "gi");
}
