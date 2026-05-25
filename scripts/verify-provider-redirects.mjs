const checks = [
  {
    url: "https://providers.grassrootslabs.com/sq2",
    status: 301,
    location: "https://www.grassrootslabs.com/sq2-members",
  },
  {
    url: "https://providers.grassrootslabs.com/birthingwaymidwifery",
    status: 301,
    location: "https://www.grassrootslabs.com/birthing-way-midwifery",
  },
  {
    url: "https://providers.grassrootslabs.com/seacoastwholehealth",
    status: 301,
    location: "https://www.grassrootslabs.com/seacoast-members",
  },
  {
    url: "https://providers.grassrootslabs.com/tnawc",
    status: 301,
    location: "https://www.grassrootslabs.com/tnawc",
  },
  {
    url: "https://providers.grassrootslabs.com/",
    status: 302,
    location: "https://www.grassrootslabs.com/providers",
  },
  {
    url: "https://providers.grassrootslabs.com/unknown-provider-path",
    status: 302,
    location: "https://www.grassrootslabs.com/providers",
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
  process.exit(1);
}
