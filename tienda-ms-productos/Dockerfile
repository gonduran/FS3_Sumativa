FROM eclipse-temurin:22-jdk AS buildstage 

RUN apt-get update && apt-get install -y maven

WORKDIR /app

COPY pom.xml .
COPY src /app/src
# Copia el wallet de oracle al contenedor
COPY Wallet_VOCGYI3VV1P3NVR8 /app/wallet

ENV TNS_ADMIN=/app/wallet

RUN mvn clean package -DskipTests

FROM eclipse-temurin:22-jdk 

# Copia el archivo jar al contenedor
COPY --from=buildstage /app/target/tienda-ms-productos-0.0.1-SNAPSHOT.jar /app/tienda-ms-productos.jar

# Copia el wallet de oracle al contenedor
COPY Wallet_VOCGYI3VV1P3NVR8 /app/wallet

ENV TNS_ADMIN=/app/wallet
# Exponer el puerto del servicio
EXPOSE 8093

# Ejecutar el servicio
ENTRYPOINT [ "java", "-jar","/app/tienda-ms-productos.jar" ]
