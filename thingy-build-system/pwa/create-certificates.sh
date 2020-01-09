#!/bin/bash
mkdir testing/certificates
pushd testing/certificates
mkcert -key-file key.pem -cert-file cert.pem localhost developermachine
popd

echo 0