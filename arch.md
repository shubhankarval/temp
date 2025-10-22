Based on your architecture, here's where you'll need to make changes to add another service with host header routing:

## Required Changes

**1. Route53**
- Create a new A record (alias) for your new service domain pointing to your **public NLB**
- Both domains will resolve to the same public NLB endpoint

**2. API Gateway**
- Add the new domain to your **custom domain mappings** with appropriate certificate
- Update your **API spec** to handle the new host header (if you're doing routing logic here)
- The base path mappings should route both domains appropriately

**3. Private NLB**
- This is where it gets tricky - NLBs don't do host-based routing themselves
- If your cert is specific to the old domain, you'll need to either:
  - Replace with a multi-domain cert (SAN cert covering both domains), OR
  - Use a wildcard cert if both services share a parent domain

**4. ALB (This is your main routing point)**
- Add a new **listener rule** for the new host header
- Configure target group routing based on `Host` header matching your new domain
- Your existing service likely has a rule with the old domain; you'll add a parallel rule for the new one
- Both target groups point to different ECS services

**5. ECS Cluster**
- Create/configure your new **ECS service**
- Ensure it registers with the new ALB target group
- Update task definitions as needed

## Key Point
The actual **host-based routing happens at the ALB level**, not the NLBs. The NLBs are just load balancing layers. Your ALB listener rules will inspect the `Host` header and route to the appropriate ECS service's target group.

Does your private NLB currently terminate TLS, or is it passing through to the ALB?
