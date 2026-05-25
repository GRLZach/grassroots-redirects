const checks = [
  {
    url: "https://impacthealthsharing.grassrootslabs.com/",
    status: 302,
    location: "https://www.grassrootslabs.com/impact-health-members",
  },
  {
    url: "https://impacthealthsharing.grassrootslabs.com/unknown-impact-path",
    status: 302,
    location: "https://www.grassrootslabs.com/impact-health-members",
  },
];

let failures = 0;

for (const check of checks) {
  let response;

  try {
    response = await fetch(check.url, {
      method: "HEAD",
      redirect: "manual",
    });
  } catch (error) {
    failures += 1;
    console.error(
      [
        `FAIL ${check.url}`,
        `  expected: ${check.status} ${check.location}`,
        `  actual:   request failed ${error.cause?.code || error.message}`,
      ].join("\n")
    );
    continue;
  }

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
