#!/bin/bash
rm -r testing/output
cp -r output testing/output
sudo docker build testing -t testing-container
sudo docker run -it testing-container
#sudo docker run -it testing-container --entrypoint=/usr/lib/systemd/systemd --env container=docker --mount type=bind,source=/sys/fs/cgroup,target=/sys/fs/cgroup --mount type=tmpfs,destination=/tmp --mount type=tmpfs,destination=/run --mount type=tmpfs,destination=/run/lock --unit=sysinit.target
