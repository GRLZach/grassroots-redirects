const checks = [
  {
    url: "https://altrua.grassrootslabs.com/members",
    status: 301,
    location: "https://www.grassrootslabs.com/ahs-members",
  },
  {
    url: "https://altrua.grassrootslabs.com/enrollment",
    status: 301,
    location: "https://www.grassrootslabs.com/ahs-enrollment",
  },
  {
    url: "https://altrua.grassrootslabs.com/providers",
    status: 301,
    location: "https://www.grassrootslabs.com/altrua-providers",
  },
  {
    url: "https://altrua.grassrootslabs.com/",
    status: 302,
    location: "https://www.grassrootslabs.com/ahs-members",
  },
  {
    url: "https://altrua.grassrootslabs.com/unknown-altrua-path",
    status: 302,
    location: "https://www.grassrootslabs.com/ahs-members",
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
