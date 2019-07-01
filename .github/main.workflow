workflow "Build and Deploy to S3" {
  on = "push"
  resolves = ["Deploy to S3"]
}

action "NPM Build" {
  uses = "actions/npm@master"
  secrets = ["REACT_APP_CLIENT_ID"]
  env = {
    REACT_APP_REDIRECT_URL = "https://access.datastage.io/login"
  }
  args = "ci && npm run build"
}

action "Master branch only" {
  needs = "NPM Build"
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Deploy to S3" {
  needs = "Master branch only"
  uses = "actions/aws/cli@master"
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
  env = {
    BUCKET = "access.datastage.io"
  }
  runs = "sh -l -c"
  args = ["ls -al; cd build; ls -al; mkdir ../access-art && mv * ../access-art/. && mv ../access-art/* .; aws s3 sync . s3://$BUCKET --delete --acl public-read"]
}
