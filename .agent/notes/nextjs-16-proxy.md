# Next.js 16 Middleware/Proxy Note

In Next.js 16, the recommended approach for middleware-like functionality (such as intercepting requests, rewriting paths, or handling authentication redirects globally) is to use `proxy` instead of the traditional `middleware.ts` file.

**Rule:**
When asked to implement middleware or request interception/redirection in this project (Next.js 16), valid usage involves configuring a proxy mechanism rather than creating a root `middleware.ts` file.

This file serves as a persistent reminder for the agent.
