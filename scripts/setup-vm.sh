#!/bin/bash
set -e

echo "=========================================="
echo "Oracle Cloud VM Setup Script"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}Do not run this script as root!${NC}"
    echo "Run as: ./setup-vm.sh"
    exit 1
fi

echo -e "${GREEN}[1/9] Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

echo ""
echo -e "${GREEN}[2/9] Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${YELLOW}Docker installed. You may need to log out and back in.${NC}"
else
    echo -e "${YELLOW}Docker already installed.${NC}"
fi

echo ""
echo -e "${GREEN}[3/9] Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo -e "${YELLOW}Docker Compose already installed.${NC}"
fi

echo ""
echo -e "${GREEN}[4/9] Configuring firewall (ufw)...${NC}"
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw --force enable

echo ""
echo -e "${GREEN}[5/9] Creating swap file (4GB)...${NC}"
if [ ! -f /swapfile ]; then
    sudo fallocate -l 4G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
else
    echo -e "${YELLOW}Swap file already exists.${NC}"
fi

echo ""
echo -e "${GREEN}[6/9] Configuring Docker log rotation...${NC}"
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
sudo systemctl restart docker

echo ""
echo -e "${GREEN}[7/9] Installing Git...${NC}"
sudo apt install git -y

echo ""
echo -e "${GREEN}[8/9] Setting up backup cron job...${NC}"
(crontab -l 2>/dev/null | grep -v "pg_dump"; echo "0 3 * * * docker exec postgres pg_dump -U postgres ecommerce > /home/ubuntu/backup-\$(date +\%Y\%m\%d).sql") | crontab -
(crontab -l 2>/dev/null | grep -v "find /home/ubuntu/backup"; echo "0 4 * * * find /home/ubuntu/backup-*.sql -mtime +7 -delete") | crontab -

echo ""
echo -e "${GREEN}[9/9] Setting up anti-reclaim cron job...${NC}"
(crontab -l 2>/dev/null | grep -v "dd if=/dev/zero"; echo "0 * * * * dd if=/dev/zero of=/dev/null bs=1M count=100 2>/dev/null") | crontab -

echo ""
echo -e "${GREEN}=========================================="
echo "Setup complete!"
echo "==========================================${NC}"
echo ""
echo "Versions installed:"
docker --version
docker-compose --version
git --version
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Clone your repository: git clone <repo-url>"
echo "2. Create .env file with secrets"
echo "3. Run: docker-compose -f docker-compose.prod.yml up -d --build"
echo ""
echo -e "${YELLOW}Note:${NC} You may need to log out and back in for Docker group changes to take effect."
echo "      Run: newgrp docker"