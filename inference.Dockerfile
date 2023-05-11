FROM lubien/tired-proxy:2 as proxy
FROM python:3.10.6-slim-bullseye as base


# ==== Config ====

ENV PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PYTHONDONTWRITEBYTECODE=1 \
    # pip:
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    # poetry:
    POETRY_VERSION=1.2.1 \
    POETRY_NO_INTERACTION=1 \
    POETRY_CACHE_DIR='/var/cache/pypoetry' \
    PATH="$PATH:/root/.local/bin"

ENV PORT 9090
ENV PROD true

# 30 minutes
ENV TIME_TO_SHUTDOWN 1800

WORKDIR /app


# ==== Dependencies ====

# Poetry
RUN pip install "poetry==$POETRY_VERSION"

# Tired Proxy
COPY --from=proxy /tired-proxy /tired-proxy

# Python Deps
COPY ./apps/inference/poetry.toml ./apps/inference/poetry.lock ./apps/inference/pyproject.toml ./
RUN poetry config virtualenvs.create false && \
    poetry install --only main --no-root --no-interaction --no-ansi && \
    rm -rf $POETRY_CACHE_DIR


# ==== Download Model ====

ARG HUGGINGFACE_REPO_SLUG
ENV HUGGINGFACE_REPO_SLUG $HUGGINGFACE_REPO_SLUG

COPY ./apps/inference .
RUN poetry run prepare && \
    rm -rf /root/.cache


# ==== Main ====

ENTRYPOINT ["/app/entrypoint.sh"]
