
FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    openjdk-17-jdk-headless \
    && rm -rf /var/lib/apt/lists/*

RUN useradd --uid 10001 --create-home --shell /usr/sbin/nologin runner

WORKDIR /tmp

USER runner

CMD ["sh"]
