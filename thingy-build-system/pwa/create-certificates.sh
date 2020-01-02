#!/bin/bash
mkdir testing/certificates
cd testing/certificates
mkcert -key-file key.pem -cert-file cert.pem localhost
cd ../..

echo 0