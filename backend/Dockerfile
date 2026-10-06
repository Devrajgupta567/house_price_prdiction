# Stage 1: Build JAR with Maven (Java 21)
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal runtime image (Java 21 JRE)
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /build/target/backend-1.0.0.jar app.jar

ENV SPRING_PROFILES_ACTIVE=prod
ENV PORT=10000
ENV SERVER_PORT=10000

EXPOSE 10000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:${PORT:-10000}/api/v1/health || exit 1

ENTRYPOINT ["sh", "-c", "java -XX:+UseSerialGC -Xss512k -Xmx350m -Dserver.port=${PORT:-10000} -jar app.jar --server.port=${PORT:-10000}"]
