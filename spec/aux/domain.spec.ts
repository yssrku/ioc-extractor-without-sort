import { domainRegex } from "@/aux/domain";

describe("network RegExps", () => {
  it("should match with all domain values", () => {
    const input =
      "test.co.jp\ngitlab.com\ntest.exe\ndev.test.co.jp www.ne-foo.com";
    const matches = input.match(domainRegex());
    expect(matches).toEqual([
      "test.co.jp",
      "gitlab.com",
      "dev.test.co.jp",
      "www.ne-foo.com",
    ]);
  });

  it("should not match with invalid domain values", () => {
    const domains = [
      "error.invalid",
      "-error-.invalid",
      "a.b-.de",
      "a.b--c.jp",
      "ab--cd.com",
      "--.jp",
      "a--.jp",
      "-.co",
      "_.co",
      "a.b-.co",
      "a.b_.co",
      ".www.foo.bar",
      "www.foo.bar.",
      ".www.foo.bar.",
    ];
    const input = domains.join(" ");
    const matches = input.match(domainRegex());
    expect(matches).toEqual([
      "a.b--c.jp",
      "b--cd.com", // FIXME: ideally, this should be cd.com
      "www.foo.bar",
      "www.foo.bar",
      "www.foo.bar",
    ]);
  });

  it("should not treat U+2028 / U+2029 as label characters", () => {
    const lineSep = "\u2028";
    const paraSep = "\u2029";

    expect(`foo${lineSep}bar.com`.match(domainRegex())).toEqual(["bar.com"]);
    expect(`foo${paraSep}bar.com`.match(domainRegex())).toEqual(["bar.com"]);
    expect(`evil.com${lineSep}foo.com`.match(domainRegex())).toEqual([
      "evil.com",
      "foo.com",
    ]);
    expect(`evil.com${paraSep}foo.com`.match(domainRegex())).toEqual([
      "evil.com",
      "foo.com",
    ]);
  });
});
