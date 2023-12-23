#!/bin/sh
docker run -v /home/avm/avorus/frontend:/app --rm -it \
	node:21.5.0-bookworm-slim \
	sh -c 'cd /app && yarn && yarn build'
