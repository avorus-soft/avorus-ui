#!/bin/sh
docker run -v .:/app --rm -it \
	node:21.5.0-bookworm-slim \
	sh -c 'cd /app && yarn && yarn build'
