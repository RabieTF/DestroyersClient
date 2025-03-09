# 🚀 DestroyersClient - Docker Setup Guide

This guide provides instructions for running the **DestroyersClient** React application using the pre-built Docker image from **Docker Hub**.

---

## **🛠 Prerequisites**

Before running the application, ensure you have:
- **Docker** installed on your system ([Download Docker](https://www.docker.com/get-started)).

---

## **📦 Pull and Run the Docker Image**

### **1. Pull the latest image from Docker Hub**
```sh
docker pull rabietf/destroyersclient:latest
```

### **2. Run the container on port 3000 (without conflict on port 80)**
```sh
docker run -d -p 3000:80 --name destroyersclient rabietf/destroyersclient:latest
```
- **`-d`** → Runs the container in detached mode (in the background).
- **`-p 3000:80`** → Maps **port 80 inside the container** to **port 3000 on your host** to avoid conflicts.
- **`--name destroyersclient`** → Assigns a friendly name to the container.

### **3. Access the Application**
Open your browser and go to:
```
http://localhost:3000
```

---

## **🔄 Managing the Container**

### **Stop the Container**
```sh
docker stop destroyersclient
```

### **Restart the Container**
```sh
docker start destroyersclient
```

### **Remove the Container**
```sh
docker rm destroyersclient
```

### **Check Container Logs**
```sh
docker logs destroyersclient
```

---

## **📌 Additional Notes**
- The container serves the React application using **Nginx**.
- Ensure port **3000** is available on your system to avoid conflicts.
- If you want to use a different port, change `3000` in the `-p 3000:80` mapping.