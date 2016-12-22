#!/bin/bash

. scripts/version.sh

function waitForServer {
  C=50
  while [ $C -gt 0 ]
  do
    grep "LeadsAuth ${VERSION} (WildFly Core 2.0.10.Final) started" leadsauth.log
    if [ $? -eq 0 ]; then
      echo "Server started."
      C=0
    else
      echo -n "."
      C=$(( $C - 1 ))
    fi
    sleep 1
  done
}

ARCHIVE="${LEADSAUTH}.tar.gz"
URL="http://repo.lxpt.cn/artifactory/leadsauth/${VERSION}/${ARCHIVE}"

if [ ! -e $ARCHIVE ]
then
  wget $URL
fi

rm -Rf $LEADSAUTH
tar xzf $ARCHIVE
sleep 1
$LEADSAUTH/bin/standalone.sh -Djava.net.preferIPv4Stack=true \
                            -Dleadsauth.migration.action=import \
                            -Dleadsauth.migration.provider=singleFile \
                            -Dleadsauth.migration.file=test/leadsauth-fixture.json \
                            -Dleadsauth.migration.strategy=OVERWRITE_EXISTING > leadsauth.log 2>&1 &
sleep 1
waitForServer
$LEADSAUTH/bin/add-user-leadsauth.sh -r master -u admin -p admin
$LEADSAUTH/bin/jboss-cli.sh --connect command=:reload
waitForServer