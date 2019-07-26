#!/bin/bash
cd output/

echo '#!/usr/bin/env node' > tmpShebang
cat index.js >> tmpShebang
mv -f tmpShebang index.js

echo 0