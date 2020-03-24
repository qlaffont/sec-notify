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

### FAIL2BAN Notification

- To add fail2ban notification, you need to copy config files in fail2ban

```sh
sudo cp config_files/slack-notify.conf /etc/fail2ban/action.d/slack-notify.conf
```

- Edit `/etc/fail2ban/action.d/slack-notify.conf` to precise your path at the end of the file

```sh
pathscripts="/myscripts"
```

- Copy jail conf

```sh
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

- Edit Jail conf

Remove action by a comment

```sh
#action = %(action_)s
```

and replace by

```sh
action_slack = %(banaction)s[name=%(__name__)s, port="%(port)s", protocol="%(protocol)s", chain="%(chain)s"]
              slack-notify[name=%(__name__)s, dest="%(destemail)s", protocol="%(protocol)s", chain="%(chain)s"]


action = %(action_slack)s
```
