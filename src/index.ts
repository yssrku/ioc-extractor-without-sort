import {
  extractASN,
  extractASNs,
  extractBTC,
  extractBTCs,
  extractCVE,
  extractCVEs,
  extractDomain,
  extractDomains,
  extractEmail,
  extractEmails,
  extractETH,
  extractETHs,
  extractGAPubID,
  extractGAPubIDs,
  extractGATrackID,
  extractGATrackIDs,
  extractIPv4,
  extractIPv4s,
  extractIPv6,
  extractIPv6s,
  extractMacAddress,
  extractMacAddresses,
  extractMD5,
  extractMD5s,
  extractSHA1,
  extractSHA1s,
  extractSHA256,
  extractSHA256s,
  extractSHA512,
  extractSHA512s,
  extractSSDEEP,
  extractSSDEEPs,
  extractURL,
  extractURLs,
  extractXMR,
  extractXMRs,
} from "./aux/extractors";
import { refang, unicodeToASCII } from "./aux/utils";
import {
  isASN,
  isBTC,
  isCVE,
  isDomain,
  isEmail,
  isETH,
  isGAPubID,
  isGATrackID,
  isIPv4,
  isIPv6,
  isMacAddress,
  isMD5,
  isSHA1,
  isSHA256,
  isSHA512,
  isSSDEEP,
  isURL,
  isXMR,
} from "./aux/validators";
import type { IOC, Options } from "./types";

const funcByType = {
  asns: extractASNs,
  btcs: extractBTCs,
  cves: extractCVEs,
  domains: extractDomains,
  emails: extractEmails,
  eths: extractETHs,
  gaPubIDs: extractGAPubIDs,
  gaTrackIDs: extractGATrackIDs,
  ipv4s: extractIPv4s,
  ipv6s: extractIPv6s,
  macAddresses: extractMacAddresses,
  md5s: extractMD5s,
  sha1s: extractSHA1s,
  sha256s: extractSHA256s,
  sha512s: extractSHA512s,
  ssdeeps: extractSSDEEPs,
  urls: extractURLs,
  xmrs: extractXMRs,
};

export {
  extractASN,
  extractASNs,
  extractBTC,
  extractBTCs,
  extractCVE,
  extractCVEs,
  extractDomain,
  extractDomains,
  extractEmail,
  extractEmails,
  extractETH,
  extractETHs,
  extractGAPubID,
  extractGAPubIDs,
  extractGATrackID,
  extractGATrackIDs,
  extractIPv4,
  extractIPv4s,
  extractIPv6,
  extractIPv6s,
  extractMacAddress,
  extractMacAddresses,
  extractMD5,
  extractMD5s,
  extractSHA1,
  extractSHA1s,
  extractSHA256,
  extractSHA256s,
  extractSHA512,
  extractSHA512s,
  extractSSDEEP,
  extractSSDEEPs,
  extractURL,
  extractURLs,
  extractXMR,
  extractXMRs,
  isASN,
  isBTC,
  isCVE,
  isDomain,
  isEmail,
  isETH,
  isGAPubID,
  isGATrackID,
  isIPv4,
  isIPv6,
  isMacAddress,
  isMD5,
  isSHA1,
  isSHA256,
  isSHA512,
  isSSDEEP,
  isURL,
  isXMR,
  refang,
  unicodeToASCII,
};

export type { IOC, Options };

export class IOCExtractor {
  /**
   * Returns an IoC in data
   *
   * @static
   * @param {string} data A string
   * @param {Options} options
   * @returns {IOC}
   * @memberof IOCExtractor
   */
  public static extractIOC(
    data: string,
    options: Options = { strict: true, refang: true, punycode: false, optionalMask: true },
  ): IOC {
    const extractor = new IOCExtractor(data);
    return extractor.extractIOC(options);
  }

  private data: string;

  public constructor(data: string) {
    this.data = data;
  }

  /**
   * Returns an IOC of the data
   *
   * @returns {IOC}
   * @param {Options} options
   * @memberof IOCExtractor
   */
  public extractIOC(
    options: Options = { strict: true, refang: true, punycode: false },
  ): IOC {
    // Apply refang
    let normalized = options.refang ? refang(this.data) : this.data;
    // Apply punycode conversion
    normalized = options.punycode
      ? unicodeToASCII(normalized, {
          ignoreInvalidPunycode: true,
          transitionalProcessing: true,
        })
      : normalized;

      // Fuck TypeScript
      let only = (options as any).only;
      return Object.keys(funcByType).reduce(
        (results, type)=>{
          if(!only || only.includes(type))
            results[type] = funcByType[type](normalized, options);
          return results;
        }, {}
      ) as IOC;
  }
}

/**
 * Returns an IoC of data
 *
 * @export
 * @param {string} data A string
 * @param {Options} options
 * @returns {IOC}
 */
export function extractIOC(
  data: string,
  options: Options = { strict: true, refang: true, optionalMask: true },
): IOC {
  return IOCExtractor.extractIOC(data, options);
}
