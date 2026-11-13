FROM alpine:3.19
RUN apk add --no-cache curl
COPY run.sh /run.sh
RUN chmod +x /run.sh
RUN adduser -D -H appuser
USER appuser
CMD ["/run.sh"]
