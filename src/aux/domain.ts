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
  relaxedZeroOrMoreLabelWithHyphen
} from "./regexes";

export function domainRegex(
  options: StrictOptions = {
    strict: true,
  },
): RegExp {
  const tld = options.strict ? strictTld : nonStrictTld;
  const regex =
    `((?![^x][^n]--)(${idnPrefix}${zeroOrMoreLabel}|${relaxedOneOrMoreLabel})(${relaxedZeroOrMoreLabelWithHyphen}[${labelLetters}])?\\.)*` +
    `((?![^x][^n]--)(${idnPrefix}${zeroOrMoreLabel}|${oneOrMoreLabel})(${zeroOrMoreLabelWithHyphen}[${labelLetters}])?\\.)` +
    `(${tld})\\b`;
  return new RegExp(regex, "gi");
}
