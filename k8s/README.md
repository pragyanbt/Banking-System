# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying the Banking Management System.

## Prerequisites

- Kubernetes cluster (1.20+)
- kubectl CLI configured
- Ingress controller (nginx-ingress recommended)
- cert-manager for TLS certificates (optional)

## Quick Start

### 1. Create Namespaces

```bash
kubectl apply -f namespace.yaml
```

### 2. Create Secrets

**IMPORTANT:** Never commit real secrets to Git!

```bash
# Create MySQL secret
kubectl create secret generic mysql-secret \
  --from-literal=root-password='YourSecurePassword123!' \
  -n banking-prod

# Create JWT secret
kubectl create secret generic jwt-secret \
  --from-literal=secret-key='YourSuperSecretJWTKey256Bits' \
  -n banking-prod
```

### 3. Deploy MySQL

```bash
kubectl apply -f mysql-deployment.yaml
```

Wait for MySQL to be ready:

```bash
kubectl wait --for=condition=ready pod -l app=mysql -n banking-prod --timeout=300s
```

### 4. Deploy Backend Services

```bash
kubectl apply -f auth-service-deployment.yaml
kubectl apply -f transaction-service-deployment.yaml
kubectl apply -f credit-card-service-deployment.yaml
kubectl apply -f gift-card-service-deployment.yaml
kubectl apply -f loan-service-deployment.yaml
kubectl apply -f locker-service-deployment.yaml
kubectl apply -f api-gateway-deployment.yaml
```

### 5. Deploy Frontend

```bash
kubectl apply -f frontend-deployment.yaml
```

### 6. Configure Ingress (Optional)

If you want to use custom domain names:

```bash
# Update ingress.yaml with your domain names
kubectl apply -f ingress.yaml
```

## Deployment Files

- `namespace.yaml` - Creates banking-prod and banking-staging namespaces
- `mysql-deployment.yaml` - MySQL database with persistent storage
- `auth-service-deployment.yaml` - Authentication service with HPA
- `transaction-service-deployment.yaml` - Transaction service with HPA
- `credit-card-service-deployment.yaml` - Credit card service
- `gift-card-service-deployment.yaml` - Gift card service
- `loan-service-deployment.yaml` - Loan service
- `locker-service-deployment.yaml` - Locker service
- `api-gateway-deployment.yaml` - API Gateway with HPA
- `frontend-deployment.yaml` - React frontend
- `ingress.yaml` - Ingress configuration for external access
- `secrets.yaml` - Template for secrets (DO NOT use in production)

## Accessing Services

### Via LoadBalancer

If your cluster supports LoadBalancer:

```bash
# Get API Gateway URL
kubectl get svc api-gateway -n banking-prod

# Get Frontend URL
kubectl get svc frontend -n banking-prod
```

### Via Port Forwarding (Development)

```bash
# Forward API Gateway
kubectl port-forward svc/api-gateway 8080:8080 -n banking-prod

# Forward Frontend
kubectl port-forward svc/frontend 3000:80 -n banking-prod
```

Then access:

- Frontend: http://localhost:3000
- API: http://localhost:8080

## Monitoring

### Check Pod Status

```bash
kubectl get pods -n banking-prod
```

### View Logs

```bash
# View logs for a specific service
kubectl logs -f deployment/auth-service -n banking-prod

# View logs for all pods of a service
kubectl logs -f -l app=auth-service -n banking-prod
```

### Check HPA Status

```bash
kubectl get hpa -n banking-prod
```

## Scaling

### Manual Scaling

```bash
kubectl scale deployment auth-service --replicas=5 -n banking-prod
```

### Auto-scaling

HPA (Horizontal Pod Autoscaler) is configured for:

- auth-service: 2-10 replicas
- transaction-service: 2-10 replicas
- api-gateway: 2-15 replicas

## Updating Deployments

### Rolling Update

```bash
# Update image for a service
kubectl set image deployment/auth-service \
  auth-service=banking/auth-service:v2.0 \
  -n banking-prod

# Monitor rollout
kubectl rollout status deployment/auth-service -n banking-prod
```

### Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/auth-service -n banking-prod

# Rollback to specific revision
kubectl rollout undo deployment/auth-service --to-revision=2 -n banking-prod
```

## Resource Requirements

Minimum cluster requirements:

- **CPU:** 8 cores
- **Memory:** 16 GB
- **Storage:** 20 GB

Recommended for production:

- **CPU:** 16+ cores
- **Memory:** 32+ GB
- **Storage:** 100+ GB

## High Availability

For production deployment:

1. **Multi-node cluster:** At least 3 worker nodes
2. **Database replication:** Consider MySQL master-slave or cluster
3. **Persistent storage:** Use network-attached storage (NFS, Ceph, etc.)
4. **Load balancing:** Use external load balancer or ingress
5. **Monitoring:** Set up Prometheus and Grafana
6. **Logging:** Use EFK (Elasticsearch, Fluentd, Kibana) stack

## Security Best Practices

1. **Network Policies:** Restrict pod-to-pod communication
2. **RBAC:** Set up proper role-based access control
3. **Pod Security Policies:** Enforce security standards
4. **Secrets Management:** Use external secret managers (Vault, AWS Secrets Manager)
5. **TLS/SSL:** Enable TLS for all external communication
6. **Image Scanning:** Scan images for vulnerabilities before deployment

## Troubleshooting

### Pods not starting

```bash
kubectl describe pod <pod-name> -n banking-prod
kubectl logs <pod-name> -n banking-prod
```

### Service not accessible

```bash
kubectl get svc -n banking-prod
kubectl describe svc <service-name> -n banking-prod
```

### Database connection issues

```bash
# Check MySQL pod
kubectl logs -f deployment/mysql -n banking-prod

# Test database connection
kubectl run -it --rm debug --image=mysql:8.0 --restart=Never -n banking-prod -- \
  mysql -h mysql -uroot -p
```

## Cleanup

To remove all resources:

```bash
kubectl delete namespace banking-prod
kubectl delete namespace banking-staging
```

## Production Checklist

Before deploying to production:

- [ ] Change all default passwords and secrets
- [ ] Configure TLS/SSL certificates
- [ ] Set up monitoring and alerting
- [ ] Configure backup and disaster recovery
- [ ] Implement network policies
- [ ] Set up logging aggregation
- [ ] Configure resource limits appropriately
- [ ] Test disaster recovery procedures
- [ ] Document runbooks for common issues
- [ ] Set up CI/CD pipeline
- [ ] Perform security audit
- [ ] Load test the system
