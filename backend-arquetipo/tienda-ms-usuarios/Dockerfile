# Usar imagen base de JDK para construir la aplicación
FROM eclipse-temurin:22-jdk AS buildstage 

# Actualizar paquetes e instalar maven
RUN apt-get update && apt-get install -y maven

# Define directorio de trabajo
WORKDIR /app

# Copiar arhivo pom.xml al directorio de trabajo
COPY pom.xml .

# Copiar archivos fuentes al directorio de trabajo
COPY src /app/src

# Copia el wallet de oracle al contenedor
# IMPORTANTE MODIFICAR: Wallet_? con wallet de base de datos del proyecto
COPY Wallet_VOCGYI3VV1P3NVR8 /app/wallet

# Definir variable de ambiente con ruta de TNS ORACLE
ENV TNS_ADMIN=/app/wallet

# Ejecuta maven para generar paquete sin ejecucion de pruebas unitarias
RUN mvn clean package -DskipTests

# Usar imagen base de JDK para ejecutar la aplicación
FROM eclipse-temurin:22-jdk 

# Copia el archivo jar al contenedor desde imagen de compilación
# IMPORTANTE MODIFICAR: nombre del JAR ?-0.0.1-SNAPSHOT.jar y ?.jar
COPY --from=buildstage /app/target/tienda-ms-usuarios-1.0-SNAPSHOT.jar /app/tienda-ms-usuarios.jar

# Copia el wallet de oracle al contenedor
# IMPORTANTE MODIFICAR: Wallet_? CON WALLET DE BD DEL PROYECTO
COPY Wallet_VOCGYI3VV1P3NVR8 /app/wallet

# Definir variable de ambiente con ruta de TNS ORACLE
ENV TNS_ADMIN=/app/wallet

# Exponer el puerto del servicio
# IMPORTANTE MODIFICAR: cambiar puerto de acuerdo a la configuracion del proyecto
EXPOSE 8092

# Ejecutar el servicio
# IMPORTANTE MODIFICAR: nombre del JAR ?.jar
ENTRYPOINT [ "java", "-jar","/app/tienda-ms-usuarios.jar" ]
