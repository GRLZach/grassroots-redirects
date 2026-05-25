const checks = [
  {
    url: "https://medi-share.grassrootslabs.com/members",
    status: 301,
    location: "https://www.grassrootslabs.com/medi-share-members",
  },
  {
    url: "https://medi-share.grassrootslabs.com/hpp",
    status: 301,
    location: "https://www.grassrootslabs.com/medi-share-health-partnership",
  },
  {
    url: "https://medi-share.grassrootslabs.com/",
    status: 302,
    location: "https://www.grassrootslabs.com/medi-share-members",
  },
  {
    url: "https://medi-share.grassrootslabs.com/unknown-medi-share-path",
    status: 302,
    location: "https://www.grassrootslabs.com/medi-share-members",
  },
];

let failures = 0;

for (const check of checks) {
  const response = await fetch(check.url, {
    method: "HEAD",
    redirect: "manual",
  });

  const actualLocation = response.headers.get("location") || "";
  const passed =
    response.status === check.status && actualLocation === check.location;

  if (!passed) {
    failures += 1;
    console.error(
      [
        `FAIL ${check.url}`,
        `  expected: ${check.status} ${check.location}`,
        `  actual:   ${response.status} ${actualLocation}`,
      ].join("\n")
    );
  } else {
    console.log(`PASS ${check.url}`);
  }
}

if (failures > 0) {
  process.exitCode = 1;
}
