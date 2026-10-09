# Add a Distributed Systems learning lab

## Outcome
Add an in-app lab for the Synchronization and Emerging Distributed Paradigms units, using short interactive demonstrations and case studies that relate back to Smart Food Court.

## Work
- Add an admin navigation entry and a dedicated `/admin/learning` page with route-specific metadata.
- Organize the Synchronization unit into practical demos: clock synchronization and Lamport clocks, vector clocks/global snapshots, leader election, mutual exclusion, and heartbeat/beacon failure detection.
- Add a second unit with concise case studies for distributed object/web systems, distributed file systems, serverless architectures, Megaport, Cloudflare, AWS, Apache Hadoop, and Kubernetes.
- Use local interactive state only; do not change ordering, accounts, persistence, or the existing distributed-systems simulation.
- Validate the route/build and exercise the key demo controls in the running preview.

## Technical notes
- Follow the existing TanStack file-route and `AppLayout` patterns.
- Use existing design tokens and shared Button components; no backend or new dependency is required.
