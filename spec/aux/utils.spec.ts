import { dedup, refang, unicodeToASCII } from "@/aux/utils";

describe("refang", () => {
  it("should replace ' . '  by .", () => {
    const input = "example . com";
    expect(refang(input)).toBe("example.com");
  });

  it("should replace [.] by .", () => {
    const input = "example[.]com";
    expect(refang(input)).toBe("example.com");
  });

  it("should replace (.) by .", () => {
    const input = "example(.)com";
    expect(refang(input)).toBe("example.com");
  });

  it("should replace {.} by .", () => {
    const input = "example{.}com";
    expect(refang(input)).toBe("example.com");
  });

  it("should replace mixed brackets by .", () => {
    const input = "test(.}test{.)example[.)com";
    expect(refang(input)).toBe("test.test.example.com");
  });

  it("should replace mixed partial brackets by .", () => {
    const input = "1.)1[.1.)1";
    expect(refang(input)).toBe("1.1.1.1");
  });

  it("should replace (dot) by .", () => {
    const input = "1.1.1(dot)1";
    expect(refang(input)).toBe("1.1.1.1");
  });

  it("should replace [dot] by .", () => {
    const input = "example[dot]com";
    expect(refang(input)).toBe("example.com");
  });

  it("should replace {dot} by .", () => {
    const input = "example{dot}com";
    expect(refang(input)).toBe("example.com");
  });

  it("should can handle IDN", () => {
    const input = "はじめよう.みんな";
    expect(refang(input)).toBe("はじめよう.みんな");
  });

  it.each([
    ["hxxps://google.com", "https://google.com"],
    ["hxxp://neverssl.com", "http://neverssl.com"],
    ["hxxps://google[.)com", "https://google.com"],
    ["hxxpfoo", "hxxpfoo"],
  ])("should replace hxxp:// by http://", (string, expected) => {
    expect(refang(string)).toBe(expected);
  });

  it.each([
    ["h**ps://google.com", "https://google.com"],
    ["h**p://neverssl.com", "http://neverssl.com"],
    ["h**ps://google[.)com", "https://google.com"],
    ["h**pfoo", "h**pfoo"],
  ])("should replace h**p:// by http://", (string, expected) => {
    expect(refang(string)).toBe(expected);
  });

  it("should replace [:] by :", () => {
    const input = "http[:]//example.com";
    expect(refang(input)).toBe("http://example.com");
  });

  it("should replace [://] by ://", () => {
    const input = "http[://]example.com";
    expect(refang(input)).toBe("http://example.com");
  });

  it("should replace . by .", () => {
    const input = "http://example.com";
    expect(refang(input)).toBe("http://example.com");
  });

  it("should replace [/] by /", () => {
    const input = "http://example.com[/]test";
    expect(refang(input)).toBe("http://example.com/test");
  });

  it("should replace [at] by @", () => {
    const input = "test[at]example.com";
    expect(refang(input)).toBe("test@example.com");
  });

  it("should replace [@] by @", () => {
    const input = "test[@]example.com";
    expect(refang(input)).toBe("test@example.com");
  });

  it("should replace (@) by @", () => {
    const input = "test(@)example.com";
    expect(refang(input)).toBe("test@example.com");
  });

  it("should replace {@} by @", () => {
    const input = "test{@}example.com";
    expect(refang(input)).toBe("test@example.com");
  });

  it.each([
    ["hxxps[:]//test.example[.)com[/]path", "https://test.example.com/path"],
    [
      "hxxps[://]test.example[.)com[/]path[:]80",
      "https://test.example.com/path:80",
    ],
  ])("can deal with a mixed cases", (string, expected) => {
    expect(refang(string)).toBe(expected);
  });

  it.each([
    ["[at](at)[at]", "@@@"],
    ["[/][/]", "//"],
    ["[:][:]", "::"],
  ])("should replace all occurrences", (string, expected) => {
    expect(refang(string)).toBe(expected);
  });
});

describe("dedup", () => {
  it("should filter to unique ones", () => {
    const input = ["1.1.1.1", "1.1.1.1", "github.com", "github.com"];
    expect(dedup(input)).toEqual(["1.1.1.1", "github.com"]);
  });
});

describe("unicodeToASCII", () => {
  it.each([["はじめよう.みんな", "xn--p8j9a0d9c9a.xn--q9jyb4c"]])(
    "should convert Unicode to Punycode (ASCII)",
    (string, expected) => {
      expect(unicodeToASCII(string)).toBe(expected);
    },
  );
});
