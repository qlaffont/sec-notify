# 🛡 Sec-Notify

## Requirements

- Node (v13)

## Installation

### SSH Notification

To add SSH Notification, you need to add to `~/.bashrc`

```sh
IP="$(echo $SSH_CONNECTION | cut -d " " -f 1)"
HOSTNAME=$(hostname)
cd /tools/sec-notify && NODE_ENV=production IP=${IP} HOSTNAME=${HOSTNAME} node /tools/sec-notify/ssh-signin.js >/dev/null 2>&1
cd ~
```
