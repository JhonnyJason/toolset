#!/bin/bash
mkdir testing/certificates
pushd testing/certificates
mkcert -key-file key.pem -cert-file cert.pem localhost
popd

echo 0