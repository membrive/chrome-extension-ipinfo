const IPV4_SEGMENT = /^(0|[1-9]\d{0,2})$/;
const IPV6_HEX_SEGMENT = /^[0-9a-fA-F]{1,4}$/;
const MAX_IPV6_SEGMENTS = 8;

export function normalizeSelectedIpAddress(selectionText) {
  if (typeof selectionText !== "string") {
    return null;
  }

  const candidate = selectionText.trim();

  if (candidate.length === 0 || /\s/.test(candidate)) {
    return null;
  }

  if (isValidIpv4(candidate)) {
    return candidate;
  }

  if (isValidIpv6(candidate)) {
    return candidate.toLowerCase();
  }

  return null;
}

export function buildIpInfoUrl(ipAddress) {
  return `https://ipinfo.io/${ipAddress}`;
}

export function isValidIpv4(value) {
  const segments = value.split(".");

  if (segments.length !== 4) {
    return false;
  }

  return segments.every((segment) => {
    if (!IPV4_SEGMENT.test(segment)) {
      return false;
    }

    return Number(segment) <= 255;
  });
}

export function isValidIpv6(value) {
  if (value.includes(".")) {
    return isValidIpv4EmbeddedIpv6(value);
  }

  return isValidPureIpv6(value);
}

function isValidPureIpv6(value) {
  if (value.length === 0 || value.indexOf(":::") !== -1) {
    return false;
  }

  const compressionParts = value.split("::");

  if (compressionParts.length > 2) {
    return false;
  }

  if (compressionParts.length === 1) {
    const segments = value.split(":");
    return segments.length === MAX_IPV6_SEGMENTS && segments.every(isIpv6HexSegment);
  }

  const [left, right] = compressionParts;
  const leftSegments = left.length === 0 ? [] : left.split(":");
  const rightSegments = right.length === 0 ? [] : right.split(":");
  const populatedSegments = leftSegments.length + rightSegments.length;

  return (
    populatedSegments < MAX_IPV6_SEGMENTS &&
    leftSegments.every(isIpv6HexSegment) &&
    rightSegments.every(isIpv6HexSegment)
  );
}

function isValidIpv4EmbeddedIpv6(value) {
  const lastColonIndex = value.lastIndexOf(":");

  if (lastColonIndex === -1) {
    return false;
  }

  const ipv4Suffix = value.slice(lastColonIndex + 1);
  const ipv6Prefix = value.slice(0, lastColonIndex);

  if (!isValidIpv4(ipv4Suffix)) {
    return false;
  }

  const compressionParts = ipv6Prefix.split("::");

  if (compressionParts.length > 2) {
    return false;
  }

  const prefixSegments = ipv6Prefix
    .split(":")
    .filter((segment) => segment.length > 0);

  if (!prefixSegments.every(isIpv6HexSegment)) {
    return false;
  }

  const ipv4SegmentEquivalent = 2;

  if (compressionParts.length === 2) {
    return prefixSegments.length + ipv4SegmentEquivalent < MAX_IPV6_SEGMENTS;
  }

  return prefixSegments.length + ipv4SegmentEquivalent === MAX_IPV6_SEGMENTS;
}

function isIpv6HexSegment(segment) {
  return IPV6_HEX_SEGMENT.test(segment);
}
