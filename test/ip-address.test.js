import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildIpInfoUrl,
  isValidIpv4,
  isValidIpv6,
  normalizeSelectedIpAddress
} from "../src/ip-address.js";

describe("IPv4 validation", () => {
  it("accepts valid IPv4 addresses", () => {
    assert.equal(isValidIpv4("8.8.8.8"), true);
    assert.equal(isValidIpv4("0.0.0.0"), true);
    assert.equal(isValidIpv4("255.255.255.255"), true);
  });

  it("rejects invalid IPv4 addresses", () => {
    assert.equal(isValidIpv4("256.1.1.1"), false);
    assert.equal(isValidIpv4("1.2.3"), false);
    assert.equal(isValidIpv4("1.2.3.4.5"), false);
    assert.equal(isValidIpv4("01.2.3.4"), false);
    assert.equal(isValidIpv4("1.2.3.a"), false);
  });
});

describe("IPv6 validation", () => {
  it("accepts valid IPv6 addresses", () => {
    assert.equal(isValidIpv6("2001:4860:4860::8888"), true);
    assert.equal(isValidIpv6("::1"), true);
    assert.equal(isValidIpv6("fe80::"), true);
    assert.equal(isValidIpv6("2001:db8:85a3:0:0:8a2e:370:7334"), true);
    assert.equal(isValidIpv6("::ffff:192.0.2.128"), true);
  });

  it("rejects invalid IPv6 addresses", () => {
    assert.equal(isValidIpv6("2001:::8888"), false);
    assert.equal(isValidIpv6("2001:db8::1::1"), false);
    assert.equal(isValidIpv6("2001:db8:85a3:0:0:8a2e:370:7334:1234"), false);
    assert.equal(isValidIpv6("2001:db8:85a3:0:0:8a2e:370:zzzz"), false);
    assert.equal(isValidIpv6("::ffff:999.0.2.128"), false);
  });
});

describe("selection normalization", () => {
  it("normalizes valid selections", () => {
    assert.equal(normalizeSelectedIpAddress(" 8.8.8.8 "), "8.8.8.8");
    assert.equal(normalizeSelectedIpAddress(" 2001:DB8::1 "), "2001:db8::1");
  });

  it("rejects empty, partial, or multi-token selections", () => {
    assert.equal(normalizeSelectedIpAddress(""), null);
    assert.equal(normalizeSelectedIpAddress("8.8.8.8 example"), null);
    assert.equal(normalizeSelectedIpAddress("https://ipinfo.io/8.8.8.8"), null);
  });
});

describe("ipinfo URLs", () => {
  it("builds a safe ipinfo.io URL", () => {
    assert.equal(buildIpInfoUrl("8.8.8.8"), "https://ipinfo.io/8.8.8.8");
    assert.equal(
      buildIpInfoUrl("2001:4860:4860::8888"),
      "https://ipinfo.io/2001:4860:4860::8888"
    );
  });
});
