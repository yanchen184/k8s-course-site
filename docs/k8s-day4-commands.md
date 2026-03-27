# 第四堂課指令清單

> 每支影片會用到的所有指令，錄影時可以快速對照

---

## 4-6 K8s 架構

```bash
kubectl create deployment nginx --replicas=3
```

---

## 4-7 動手做

```bash
cat ~/.kube/config
kubectl config current-context
kubectl config use-context dev
kubectl get nodes
kubectl cluster-info
```

---

## 4-8 動手做

```bash
minikube dashboard --url
kubectl proxy --address='0.0.0.0' --disable-filter=true
kubectl api-resources
```

---

## 4-10 第一個 Pod 完整 CRUD

```bash
git clone https://github.com/yanchen184/k8s-course-labs.git
cd k8s-course-labs/lesson4
minikube status
minikube start
kubectl apply -f pod.yaml
kubectl get pods
kubectl get pods -o wide
kubectl describe pod my-nginx
kubectl logs my-nginx
kubectl exec -it my-nginx -- /bin/sh
cat /usr/share/nginx/html/index.html
apt-get update && apt-get install -y curl
curl localhost
exit
kubectl port-forward pod/my-nginx 8080:80
kubectl delete pod my-nginx
cp pod.yaml pod-httpd.yaml
# （編輯 pod-httpd.yaml，把 name 改成 my-httpd，image 改成 httpd:2.4，containerPort 改成 81）
kubectl apply -f pod-httpd.yaml
kubectl exec -it my-httpd -- cat /usr/local/apache2/htdocs/index.html
kubectl port-forward pod/my-httpd 8080:80
kubectl delete pod my-httpd
kubectl apply -f pod.yaml
kubectl exec -it my-nginx -- /bin/sh
echo "Hello Kubernetes" > /usr/share/nginx/html/index.html
exit
kubectl port-forward pod/my-nginx 8080:80
```

---

## 4-11 回頭操作 + 上午總結

```bash
kubectl apply -f pod.yaml
kubectl get pods
kubectl get pods -o wide
kubectl describe pod my-nginx
kubectl logs my-nginx
kubectl exec -it my-nginx -- /bin/sh
cat /usr/share/nginx/html/index.html
exit
kubectl delete pod my-nginx
```

---

## 4-13 故意把 Pod 搞壞 — 排錯實戰

```bash
kubectl apply -f pod-broken.yaml
kubectl get pods
kubectl get pods --watch
kubectl describe pod broken-pod
kubectl delete pod broken-pod
# （編輯 pod-broken.yaml，把 image 從 ngin 改成 nginx:1.27）
kubectl apply -f pod-broken.yaml
kubectl get pods
kubectl delete pod broken-pod
kubectl apply -f pod-crash.yaml
kubectl get pods
kubectl describe pod crash-pod
kubectl logs crash-pod
kubectl logs crash-pod --previous
kubectl get pods --watch
kubectl delete pod crash-pod
```

---

## 4-14 回頭操作 Loop 1 — 排錯練習

```bash
kubectl apply -f pod-crash.yaml
kubectl get pods --watch
kubectl logs crash-pod
kubectl logs crash-pod --previous
kubectl delete pod crash-pod
cp pod.yaml pod-field-broken.yaml
# （編輯 pod-field-broken.yaml，把 kind: Pod 改成 kind: Podd）
kubectl apply -f pod-field-broken.yaml
# （改回 kind: Pod，把 apiVersion: v1 改成 apiVersion: v2）
kubectl apply -f pod-field-broken.yaml
# （改回 apiVersion: v1，apply 確認 Running）
kubectl delete pod my-nginx
rm pod-field-broken.yaml
# （建一個 pod-crash-test.yaml，image busybox:1.36，command 如上）
kubectl apply -f pod-crash-test.yaml
kubectl get pods --watch
kubectl logs crash-test-pod
# （把 exit 1 改成 exit 0，delete 再 apply）
kubectl get pods --watch
kubectl delete pod crash-test-pod
kubectl run one-shot --image=busybox:1.36 --restart=Never -- /bin/sh -c "echo done && sleep 3"
kubectl get pods --watch
kubectl delete pod one-shot
```

---

## 4-16 nginx + busybox Sidecar 實作

```bash
kubectl apply -f pod-sidecar.yaml
kubectl get pods
kubectl exec -it sidecar-pod -c nginx -- /bin/sh
apt-get update && apt-get install -y curl
curl localhost
curl localhost
curl localhost
exit
kubectl logs sidecar-pod -c log-reader
kubectl delete pod sidecar-pod
```

---

## 4-19 port-forward + dry-run + explain 實作

```bash
cd k8s-course-labs/lesson4
kubectl apply -f pod.yaml
kubectl get pods
kubectl port-forward pod/my-nginx 8080:80
curl http://localhost:8080
kubectl get pods -o wide
kubectl get pods -o yaml
kubectl get pods -A
kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml
kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml > test-pod.yaml
cat test-pod.yaml
kubectl explain pod.spec.containers
kubectl explain pod.spec.containers.resources
```

---

## 4-22 MySQL Pod 實作 — 從做錯到修好

```bash
kubectl apply -f pod-mysql-broken.yaml
kubectl get pods --watch
kubectl logs mysql-broken
kubectl delete pod mysql-broken
kubectl apply -f pod-mysql.yaml
kubectl get pods --watch
kubectl exec -it mysql-pod -- mysql -u root -pmy-secret
SHOW DATABASES;
CREATE DATABASE testdb;
SHOW DATABASES;
exit
kubectl delete pod mysql-pod
kubectl get pods
```

---

## 4-23 Loop 4 回頭操作 — MySQL Pod 補做 + 銜接 Deployment

```bash
kubectl run mysql-pod --image=mysql:8.0 --dry-run=client -o yaml > pod-mysql.yaml
kubectl apply -f pod-mysql.yaml
kubectl get pods -w
kubectl exec -it mysql-pod -- mysql -u root -pmy-secret
SHOW DATABASES;
exit
kubectl delete pod mysql-pod
```

---

## 4-24 Deployment 初體驗 — 從一個人到一個團隊

```bash
kubectl run lonely-nginx --image=nginx:1.27
kubectl get pods
kubectl delete pod lonely-nginx
kubectl get pods
kubectl apply -f deployment.yaml
kubectl get deployments
kubectl get replicasets
kubectl get pods
kubectl get deploy,rs,pods
kubectl delete pod <任意一個 pod 名字>
kubectl get pods
kubectl scale deployment nginx-deploy --replicas=5
kubectl get pods
kubectl scale deployment nginx-deploy --replicas=2
kubectl get pods
kubectl delete deployment nginx-deploy
```

---

